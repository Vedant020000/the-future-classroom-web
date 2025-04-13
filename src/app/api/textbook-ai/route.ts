import { NextRequest, NextResponse } from 'next/server';
import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
    GenerateContentRequest,
    Content,
    TaskType
} from '@google/generative-ai';
import pdf from 'pdf-parse';
import PocketBase from 'pocketbase'; // Import PocketBase

// --- Environment Variables & Basic Setup --- 
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const POCKETBASE_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL;

// Initialize PocketBase Admin Client (use cautiously - requires admin creds or token)
// For server-side operations triggered by users, it's often better to
// pass the user's auth token from the client and use that to initialize pb.
// However, for a background-like process initiated here, we might need admin.
// *** Using an admin token is generally preferred over email/password in env vars ***
const POCKETBASE_ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const POCKETBASE_ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;
// Consider adding a POCKETBASE_ADMIN_TOKEN environment variable as a more secure alternative

const pb = new PocketBase(POCKETBASE_URL);

// WARNING: Authenticating with admin email/password directly in code is less secure.
// Prefer using a long-lived admin token stored in environment variables.
// This is a simplified example; manage admin auth securely in production.
let adminAuthPromise: Promise<any> | null = null;
async function ensureAdminAuth() {
    if (pb.authStore.isValid && pb.authStore.isAdmin) {
        return; // Already authenticated as admin
    }
    if (!adminAuthPromise) {
        console.log("Attempting PocketBase admin authentication...");
        adminAuthPromise = pb.admins.authWithPassword(POCKETBASE_ADMIN_EMAIL!, POCKETBASE_ADMIN_PASSWORD!)
            .then(() => {
                console.log("PocketBase admin authenticated.");
                adminAuthPromise = null; // Reset promise on success
            })
            .catch((err) => {
                console.error("PocketBase Admin Authentication Failed:", err);
                adminAuthPromise = null; // Reset promise on failure
                throw new Error("Server configuration error: Could not authenticate PocketBase admin.");
            });
    }
    await adminAuthPromise;
}

if (!GEMINI_API_KEY || !POCKETBASE_URL || !POCKETBASE_ADMIN_EMAIL || !POCKETBASE_ADMIN_PASSWORD) {
    console.error("CRITICAL ERROR: Missing one or more environment variables: GEMINI_API_KEY, NEXT_PUBLIC_POCKETBASE_URL, POCKETBASE_ADMIN_EMAIL, POCKETBASE_ADMIN_PASSWORD");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || 'MISSING_API_KEY');

// --- Models --- 
const generativeModel = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-latest",
    // safetySettings: [...] // Add if needed
});
const embeddingModel = genAI.getGenerativeModel({ model: "models/text-embedding-004" });

// --- Interfaces & In-Memory Storage --- 
interface TextChunk {
    text: string;
    embedding: number[];
}

interface TextbookAnalysis {
    title: string;
    estimatedTime: string;
    estimatedClasses: string;
    error?: string; // Add error field for analysis issues
}

interface TextbookData {
    fileName: string;
    analysis: TextbookAnalysis[];
    chunks: TextChunk[];
}

// WARNING: In-memory store - Data lost on server restart. Not suitable for production.
const textbookStore: Record<string, TextbookData> = {};

// --- Helper Functions --- 

/**
 * Basic text chunking function.
 * Splits text into chunks of roughly `chunkSize` characters, trying to respect paragraph breaks.
 */
function chunkText(text: string, chunkSize: number = 1500, overlap: number = 200): string[] {
    const paragraphs = text.split(/\n\s*\n/); // Split by double newlines (paragraphs)
    const chunks: string[] = [];
    let currentChunk = "";

    for (const paragraph of paragraphs) {
        if (paragraph.trim().length === 0) continue;

        if (currentChunk.length + paragraph.length <= chunkSize) {
            currentChunk += (currentChunk.length > 0 ? "\n\n" : "") + paragraph;
        } else {
            // If the paragraph itself is larger than chunk size, split it forcefully
            if (paragraph.length > chunkSize) {
                if (currentChunk.length > 0) {
                    chunks.push(currentChunk);
                }
                currentChunk = ""; // Reset before adding large paragraph chunks
                for (let i = 0; i < paragraph.length; i += (chunkSize - overlap)) {
                    chunks.push(paragraph.substring(i, i + chunkSize));
                }
            } else {
                // Add the current chunk and start a new one with overlap
                if (currentChunk.length > 0) {
                    chunks.push(currentChunk);
                }
                // Basic overlap: Start new chunk with the current paragraph
                currentChunk = paragraph; // Or potentially grab last sentence(s) of previous chunk
            }
        }
    }
    if (currentChunk.length > 0) {
        chunks.push(currentChunk);
    }
    return chunks;
}

/**
 * Calculates the dot product of two vectors.
 */
function dotProduct(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) {
        return -Infinity; // Vectors must be the same length
    }
    let product = 0;
    for (let i = 0; i < vecA.length; i++) {
        product += vecA[i] * vecB[i];
    }
    return product;
}

// Helper to get authenticated PocketBase instance for the current user
async function getUserPb(request: NextRequest): Promise<{ pb: PocketBase, userId: string } | null> {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.warn('Missing or invalid Authorization header');
        return null;
    }
    const token = authHeader.split(' ')[1];

    try {
        const userPb = new PocketBase(POCKETBASE_URL);
        userPb.authStore.save(token, null); // Load token without validating (validation happens on first request)
        await userPb.authStore.isValid; // Explicitly check validity

        if (!userPb.authStore.model?.id) {
            console.warn('Auth token loaded but no user model ID found');
            return null;
        }
        return { pb: userPb, userId: userPb.authStore.model.id };
    } catch (e) {
        console.error('Error validating user token:', e);
        return null;
    }
}

// --- API Route Handler --- 

export async function POST(req: NextRequest) {
    if (!GEMINI_API_KEY || !POCKETBASE_URL || !POCKETBASE_ADMIN_EMAIL || !POCKETBASE_ADMIN_PASSWORD) {
        return NextResponse.json({ error: 'Server configuration error: Missing environment variables.' }, { status: 500 });
    }

    // Authenticate User for most actions
    const userAuth = await getUserPb(req);
    if (!userAuth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { pb: userPb, userId } = userAuth;

    let textbookRecordId: string | null = null; // Use PocketBase record ID
    let requestType: string | null = null; // Declare type here to be accessible in final catch

    try {
        const formData = await req.formData();
        const typeValue = formData.get('type'); // Read type
        if (typeof typeValue !== 'string') {
            return NextResponse.json({ error: 'Invalid request type.', details: 'Missing or non-string type field in form data.' }, { status: 400 });
        }
        requestType = typeValue; // Assign to the higher-scoped variable

        // ==========================
        // === ANALYZE Endpoint ===
        // ==========================
        if (requestType === 'analyze') {
            const file = formData.get('file') as File;
            if (!file || file.type !== 'application/pdf') {
                return NextResponse.json({ error: 'Invalid file type.', details: 'Please upload a PDF file.' }, { status: 400 });
            }
            console.log(`Analyze request: ${file.name} (${Math.round(file.size / 1024)} KB) by user ${userId}`);

            // 0. Create Initial PocketBase Record
            const initialData = new FormData();
            initialData.append('user', userId);
            initialData.append('filename', file.name);
            initialData.append('status', 'uploaded');
            initialData.append('original_file', file);

            let textbookRecord;
            try {
                console.log("Creating initial textbook record in PocketBase...");
                textbookRecord = await userPb.collection('textbooks').create(initialData);
                textbookRecordId = textbookRecord.id;
                console.log(`Created textbook record ID: ${textbookRecordId}`);
            } catch (dbError: any) {
                console.error("PocketBase record creation error:", dbError?.data || dbError);
                return NextResponse.json({ error: 'Failed to initialize textbook record.', details: dbError.message }, { status: 500 });
            }

            // Update status to processing (async - don't block response)
            userPb.collection('textbooks').update(textbookRecordId, { status: 'processing' }).catch(err => {
                console.error(`Failed to update status to processing for ${textbookRecordId}:`, err);
            });

            // --- Start Background Processing --- 
            // We don't await this block; it runs in the background.
            // The client will need to poll or use realtime subscriptions to get the final status.
            (async () => {
                let extractedText: string;
                let analysisResultJson: TextbookAnalysis[] = [];
                let processingError: string | null = null;
                let finalStatus: 'completed' | 'error' = 'error'; // Default to error unless explicitly set to completed

                try {
                    // 1. Parse PDF
                    console.log(`[${textbookRecordId}] Parsing PDF...`);
                    const fileBuffer = Buffer.from(await file.arrayBuffer());
                    const pdfData = await pdf(fileBuffer);
                    extractedText = pdfData.text;
                    if (!extractedText || extractedText.trim().length < 100) {
                        throw new Error('Extracted text is too short or empty.');
                    }
                    console.log(`[${textbookRecordId}] Extracted text length: ${extractedText.length}`);

                    // 2. Generate Analysis (Outline & Estimates)
                    const analysisPrompt = `Analyze the following textbook content. 1. Identify main chapters/sections. 2. For each, provide: 'title' (string), 'estimatedTime' (string, e.g., "2-3 hours"), 'estimatedClasses' (string, e.g., "1-2 classes"). 3. Format as a JSON array of objects (only the array). Textbook (first 100k chars):\n---\n${extractedText.substring(0, 100000)}\n---`;

                    let analysisText: string | null = null;
                    try {
                        console.log(`[${textbookRecordId}] Sending analysis prompt to Gemini...`);
                        const result = await generativeModel.generateContent(analysisPrompt);
                        // Check response structure before accessing text()
                        if (result && result.response) {
                            analysisText = result.response.text();
                            console.log(`[${textbookRecordId}] Raw analysis response received.`);
                        } else {
                            throw new Error('Invalid response structure received from Gemini API.');
                        }
                    } catch (apiError: any) {
                        // Catch errors *during* the Gemini API call
                        console.error(`[${textbookRecordId}] Gemini API call failed:`, apiError);
                        processingError = `Gemini API call failed: ${apiError.message || 'Unknown API error'}`;
                        throw apiError; // Re-throw to be caught by the outer try-catch for DB update
                    }

                    // Only proceed if API call succeeded and we have text
                    if (analysisText !== null) {
                        try {
                            const cleanedJsonString = analysisText.replace(/^```json\n?|\n?```$/g, '').trim();
                            if (!cleanedJsonString.startsWith('[') || !cleanedJsonString.endsWith(']')) {
                                console.warn(`[${textbookRecordId}] Cleaned response doesn't look like JSON array:`, cleanedJsonString.substring(0, 200));
                                throw new Error("Cleaned response doesn't look like a JSON array.");
                            }
                            analysisResultJson = JSON.parse(cleanedJsonString);
                            if (!Array.isArray(analysisResultJson) || analysisResultJson.some(item => !item.title || !item.estimatedTime || !item.estimatedClasses)) {
                                throw new Error("Parsed JSON structure is not as expected.");
                            }
                            console.log(`[${textbookRecordId}] Parsed analysis result: ${analysisResultJson.length} items`);
                            finalStatus = 'completed'; // Mark as completed only if parsing is successful
                        } catch (parseError: any) {
                            // Catch errors *parsing* the response
                            console.error(`[${textbookRecordId}] Error parsing Gemini analysis response:`, parseError);
                            console.error(`[${textbookRecordId}] Raw text that failed parsing:`, analysisText.substring(0, 500)); // Log snippet
                            const errorDetail = parseError.message?.includes("JSON") ? "AI response was not valid JSON." : parseError.message;
                            // Store the error within the analysis results, but still mark overall status as error
                            analysisResultJson = [{ title: "Analysis Failed", estimatedTime: "N/A", estimatedClasses: "N/A", error: `Could not parse AI response. ${errorDetail}` }];
                            processingError = `Failed to parse AI analysis response: ${errorDetail}`;
                            finalStatus = 'error'; // Ensure status is error if parsing fails
                        }
                    } else {
                        // Should not happen if API call succeeded, but handle defensively
                        console.error(`[${textbookRecordId}] Gemini API call succeeded but response text was null/empty.`);
                        analysisResultJson = [{ title: "Analysis Failed", estimatedTime: "N/A", estimatedClasses: "N/A", error: "Received empty response from AI." }];
                        processingError = "Received empty response from AI analysis API.";
                        finalStatus = 'error';
                    }

                    // Embeddings moved to CHAT endpoint

                } catch (error: any) {
                    // Catch errors from PDF parsing or the re-thrown API error
                    console.error(`[${textbookRecordId}] Error during background processing:`, error);
                    processingError = processingError || error.message || 'Unknown processing error'; // Use specific API error if available
                    finalStatus = 'error';
                }

                // 5. Update PocketBase Record with Final Status and Results/Error
                console.log(`[${textbookRecordId}] Updating final record status to '${finalStatus}'...`);
                try {
                    await userPb.collection('textbooks').update(textbookRecordId, {
                        status: finalStatus,
                        analysis_results: analysisResultJson, // Store results even if parsing failed (contains error info)
                        error_message: processingError, // Store specific processing error message
                    });
                    console.log(`[${textbookRecordId}] Final update complete.`);
                } catch (updateError) {
                    console.error(`[${textbookRecordId}] CRITICAL: Failed to update final status in DB:`, updateError);
                }

            })();

            // --- End Background Processing --- 

            // Return immediate success response with the ID
            return NextResponse.json({
                message: 'File uploaded and processing started.',
                textbookId: textbookRecordId
            });

            // ======================
            // === CHAT Endpoint ===
            // ======================
        } else if (requestType === 'chat') {
            const message = formData.get('message') as string;
            textbookRecordId = formData.get('textbookId') as string;

            if (!message || !textbookRecordId) {
                return NextResponse.json({ error: 'Bad Request: Missing message or textbookId.' }, { status: 400 });
            }

            // 1. Fetch Textbook Record and Check Status
            let textbookRecord;
            let extractedText: string | null = null;
            try {
                console.log(`[Chat] Fetching textbook record: ${textbookRecordId}`);
                // Need ADMIN rights potentially to read the file content if rules are strict
                // OR fetch the record with userPb and make a separate admin call for the file URL
                await ensureAdminAuth(); // Ensure admin is authenticated for file access
                textbookRecord = await pb.collection('textbooks').getOne(textbookRecordId);

                if (textbookRecord.status !== 'completed') {
                    const statusMsg = textbookRecord.status === 'error' ? `Processing failed: ${textbookRecord.error_message}` : `Textbook is still ${textbookRecord.status}.`;
                    return NextResponse.json({ error: 'Textbook not ready.', details: statusMsg, status: textbookRecord.status }, { status: textbookRecord.status }); // 400 might be better than 503
                }

                // Fetch the actual text content - requires file URL and fetch
                if (textbookRecord.original_file) {
                    const fileUrl = pb.files.getUrl(textbookRecord, textbookRecord.original_file);
                    console.log(`[Chat] Fetching PDF content from: ${fileUrl}`);
                    const fileRes = await fetch(fileUrl);
                    if (!fileRes.ok) throw new Error(`Failed to fetch PDF file: ${fileRes.statusText}`);
                    const fileBuffer = Buffer.from(await fileRes.arrayBuffer());
                    const pdfData = await pdf(fileBuffer);
                    extractedText = pdfData.text;
                    if (!extractedText) throw new Error('Failed to extract text from stored PDF.');
                    console.log(`[Chat] Extracted text length: ${extractedText.length}`);
                } else {
                    throw new Error('Original file not found in textbook record.');
                }

            } catch (fetchError: any) {
                console.error(`[Chat] Error fetching textbook record or content ${textbookRecordId}:`, fetchError);
                const status = (fetchError.originalError?.status === 404 || fetchError?.status === 404) ? 404 : 500;
                const details = status === 404 ? `Textbook session not found.` : `Failed to retrieve textbook data: ${fetchError.message}`;
                return NextResponse.json({ error: 'Failed to load textbook data.', details }, { status });
            }

            console.log(`[Chat] Request for textbook ID: ${textbookRecordId}, File: ${textbookRecord.filename}`);

            // 2. Embed User Message
            let messageEmbedding: number[];
            try {
                console.log("[Chat] Embedding user message...");
                const embedResult = await embeddingModel.embedContent(message);
                messageEmbedding = embedResult.embedding.values;
            } catch (embedError: any) {
                console.error("[Chat] User message embedding error:", embedError);
                return NextResponse.json({ error: 'Failed to process your message.', details: `Embedding error: ${embedError.message}` }, { status: 500 });
            }

            // --- RAG Implementation (On-Demand Chunking/Embedding/Retrieval) ---
            let contextText = '';
            const MAX_CONTEXT_CHUNKS = 5;
            try {
                console.log("[Chat] Performing RAG...");
                // a. Chunk the full text
                const allChunks = chunkText(extractedText);
                if (allChunks.length === 0) {
                    throw new Error("Textbook content resulted in zero chunks.");
                }
                console.log(`[Chat] Generated ${allChunks.length} chunks for RAG.`);

                // b. Embed all chunks (can be slow for large books! Consider optimizations)
                // Optimization: Could pre-calculate & store embeddings, or use a vector DB.
                // For simplicity here, we embed on-the-fly.
                console.log(`[Chat] Embedding ${allChunks.length} text chunks...`);
                const chunkEmbeddings: number[][] = [];
                // Batching if possible
                const batchSize = 100; // Gemini API limit
                for (let i = 0; i < allChunks.length; i += batchSize) {
                    const batch = allChunks.slice(i, i + batchSize);
                    const requests = batch.map(chunk => ({
                        content: { role: 'user', parts: [{ text: chunk }] },
                        taskType: TaskType.RETRIEVAL_DOCUMENT
                    }));
                    const batchResult = await embeddingModel.batchEmbedContents({ requests });
                    chunkEmbeddings.push(...batchResult.embeddings.map(e => e.values));
                    console.log(`[Chat] Embedded batch ${i / batchSize + 1}/${Math.ceil(allChunks.length / batchSize)}`);
                }
                if (chunkEmbeddings.length !== allChunks.length) {
                    throw new Error(`Embedding count mismatch: ${chunkEmbeddings.length} vs ${allChunks.length}`);
                }
                console.log(`[Chat] Embeddings generated for all chunks.`);

                // c. Calculate similarity
                const similarities = chunkEmbeddings.map((emb, index) => ({
                    index,
                    similarity: dotProduct(messageEmbedding, emb)
                }));

                // d. Sort and get top N chunks
                similarities.sort((a, b) => b.similarity - a.similarity);
                const topChunks = similarities.slice(0, MAX_CONTEXT_CHUNKS).map(sim => allChunks[sim.index]);
                console.log(`[Chat] Retrieved ${topChunks.length} relevant chunks.`);

                // e. Combine chunks into context
                contextText = topChunks.join("\n\n---\n\n");

            } catch (ragError: any) {
                console.error("[Chat] RAG process failed:", ragError);
                // Proceed without specific context if RAG fails?
                contextText = "Error retrieving specific context. Answering generally based on the query.";
                // Or return an error:
                // return NextResponse.json({ error: 'Failed to find relevant context.', details: ragError.message }, { status: 500 });
            }
            // --- End RAG --- 

            // 3. Prepare Prompt for LLM
            const chatPrompt = `You are a helpful AI assistant answering questions about a specific textbook.
Use the following context extracted from the textbook to answer the user's question accurately.
If the context doesn't contain the answer, say you couldn't find specific information in the provided text.
Avoid making up information not present in the context.

Context:
---
${contextText}
---

User Question: ${message}

Answer:`;

            // 4. Call Generative Model
            try {
                console.log("[Chat] Sending chat prompt to Gemini...");
                const result = await generativeModel.generateContent(chatPrompt);
                const response = result.response;
                const answer = response.text();
                console.log("[Chat] Received response from Gemini.");

                // 5. Return Response
                return NextResponse.json({ answer });
            } catch (llmError: any) {
                console.error("[Chat] Gemini chat completion error:", llmError);
                let errorDetails = llmError.message || 'Unknown error generating chat response.';
                if (llmError.message?.includes("429") || llmError.status === 429) {
                    errorDetails = 'Rate limit exceeded. Please try again later.';
                    return NextResponse.json({ error: 'Failed to get answer: Rate limit exceeded.', details: errorDetails }, { status: 429 });
                }
                return NextResponse.json({ error: 'Failed to generate chat response.', details: errorDetails }, { status: 500 });
            }

            // ==========================
            // === UNKNOWN Endpoint ===
            // ==========================
        } else {
            return NextResponse.json({ error: 'Invalid request type.' }, { status: 400 });
        }

    } catch (error: any) {
        console.error("Unhandled API Error:", error);
        // Attempt to clean up the record if created and an error occurred *before* background processing started
        // Note: This cleanup is basic and might not always succeed or be necessary.
        if (requestType === 'analyze' && textbookRecordId && !error.message?.includes('background processing')) {
            console.warn(`Attempting to mark record ${textbookRecordId} as error due to initial failure...`);
            try {
                await ensureAdminAuth(); // Need admin to potentially update record created by user
                await pb.collection('textbooks').update(textbookRecordId, { status: 'error', error_message: `API route failure: ${error.message}` });
            } catch (cleanupError) {
                console.error(`Failed to mark record ${textbookRecordId} as error:`, cleanupError);
            }
        }
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}

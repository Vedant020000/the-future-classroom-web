import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { allTools } from '@/lib/aiToolsData'; // To potentially get field info

// --- Environment Variables & Basic Setup ---
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
    console.error("CRITICAL ERROR: GEMINI_API_KEY environment variable is not set.");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || 'MISSING_API_KEY');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

// Find tool data (optional, could be used for prompt engineering)
const toolData = allTools.find(tool => tool.id === 'assistant');

export async function POST(req: NextRequest) {
    if (!GEMINI_API_KEY) {
        return NextResponse.json({ error: 'Server configuration error', details: "Missing API key." }, { status: 500 });
    }

    try {
        const body = await req.json();
        console.log("Assistant API received:", body);

        // --- Simple Input Validation (Adjust based on actual form fields) ---
        const topic = body.topic;
        const context = body.context || ''; // Optional field

        if (!topic || typeof topic !== 'string' || topic.trim() === '') {
            return NextResponse.json({ error: 'Bad Request', details: 'Missing or invalid topic field.' }, { status: 400 });
        }

        // --- Construct Prompt --- 
        // Basic prompt, enhance as needed
        const prompt = `You are an AI Teaching Assistant. Answer the following question or topic, considering the provided context if any.

Question/Topic: ${topic}

${context ? `Additional Context: ${context}\n\n` : ''}Response:`;

        // --- Call Gemini API --- 
        let responseText = "Sorry, I couldn't generate a response.";
        try {
            console.log("Sending prompt to Gemini...");
            const result = await model.generateContent(prompt);
            responseText = result.response.text();
            console.log("Gemini response received.");
        } catch (e: any) {
            console.error("Error calling Gemini:", e);
            if (e.message?.includes("429") || e.status === 429) {
                return NextResponse.json({ error: 'Request failed: Rate limit exceeded.', details: 'Please try again later.' }, { status: 429 });
            } else if (e.response?.candidates?.[0]?.finishReason === 'SAFETY') {
                return NextResponse.json({ error: 'Request failed: Response blocked due to safety settings.' }, { status: 400 });
            }
            // Keep default error for others
        }

        // --- Return Response ---
        return NextResponse.json({ response: responseText });

    } catch (error: any) {
        console.error("API Route General Error:", error);
        if (error instanceof SyntaxError && error.message.includes('JSON')) {
            return NextResponse.json({ error: 'Invalid request format.', details: 'Could not parse request body.' }, { status: 400 });
        }
        return NextResponse.json({ error: 'An internal server error occurred.', details: error.message || 'Unknown error' }, { status: 500 });
    }
} 
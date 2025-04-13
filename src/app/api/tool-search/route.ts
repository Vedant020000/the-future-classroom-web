import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { allTools } from '@/lib/aiToolsData';
import { cookies } from 'next/headers';
import pb from '@/lib/pocketbase';
import { canMakeQuery, incrementDailyQueries } from '@/lib/aiUsage';

// Ensure you have your Gemini API key in your .env.local file
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    throw new Error('Missing GEMINI_API_KEY environment variable');
}

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Helper function to search tools using Gemini
async function searchTools(query: string) {
    // Create a detailed prompt for Gemini to understand the search query
    const searchPrompt = `
You are an AI assistant for teachers, helping them find the perfect educational tools.
Based on the following teacher's query, analyze what they're looking for and match it with the most suitable tools from our collection.

Teacher's Query: "${query}"

Here is the collection of available educational AI tools:
${JSON.stringify(allTools, null, 2)}

Please respond with ONLY a JSON array of the most relevant tool IDs from our collection (maximum 3 tools), ordered by relevance.
The response should be in this format: ["tool-id-1", "tool-id-2", "tool-id-3"] or [] if no matches are found.
Don't include any explanations or other text, just the JSON array.
`;

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(searchPrompt);
        const response = await result.response;
        const text = response.text().trim();

        // Extract the JSON array from the response
        // This handles cases where Gemini might add extra text despite instructions
        const jsonMatch = text.match(/\[.*\]/);
        if (!jsonMatch) {
            console.error('Invalid response format from Gemini:', text);
            return [];
        }

        try {
            const toolIds = JSON.parse(jsonMatch[0]);
            return toolIds.filter((id: string) => allTools.some(tool => tool.id === id));
        } catch (jsonError) {
            console.error('Error parsing JSON from Gemini response:', jsonError);
            return [];
        }
    } catch (error) {
        console.error('Error generating tool recommendations:', error);
        return [];
    }
}

export async function POST(request: Request) {
    try {
        // Authentication check
        const cookieStore = await cookies();
        const authCookie = cookieStore.get('pb_auth');

        if (!authCookie?.value) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
        }

        // Initialize PocketBase with the auth cookie
        pb.authStore.loadFromCookie(`pb_auth=${authCookie.value}`);

        if (!pb.authStore.isValid) {
            return NextResponse.json({ error: 'Invalid or expired authentication' }, { status: 401 });
        }

        const user = pb.authStore.model;

        if (!user?.id) {
            return NextResponse.json({ error: 'User not found' }, { status: 401 });
        }

        // Check if user has reached their daily limit
        const canProceed = await canMakeQuery(user.id);

        if (!canProceed) {
            return NextResponse.json(
                {
                    error: 'Daily limit reached',
                    message: 'You have reached your daily limit of AI queries. Please try again tomorrow.'
                },
                { status: 429 }
            );
        }

        // Get the search query from the request
        const { query } = await request.json();

        if (!query) {
            return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
        }

        // Search for relevant tools using Gemini
        const toolIds = await searchTools(query);

        // Get the full tool details for the matched IDs
        const matchedTools = toolIds.map((id: string) => allTools.find(tool => tool.id === id)).filter(Boolean);

        // Increment the user's daily query count
        await incrementDailyQueries(user.id);

        return NextResponse.json({
            tools: matchedTools,
            query,
            usage: {
                queryRecorded: true
            }
        });

    } catch (error) {
        console.error('Error in /api/tool-search route:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return NextResponse.json({ error: `Failed to search for tools: ${errorMessage}` }, { status: 500 });
    }
} 
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { allTools, FormField } from '@/lib/aiToolsData'; // Import tool data

// Ensure you have your Gemini API key in your .env.local file
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    throw new Error('Missing GEMINI_API_KEY environment variable');
}

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Helper function to build prompts based on tool
function buildPrompt(toolId: string, formData: Record<string, string>): string | null {
    const tool = allTools.find(t => t.id === toolId);
    if (!tool) {
        console.error(`Invalid toolId received: ${toolId}`);
        return null;
    }

    // Start with role-playing instructions using string concatenation
    let promptLines: string[] = [];
    promptLines.push(`You are an expert AI assistant specialized in helping K-12 teachers.`);
    promptLines.push(`You are currently configured as: **${tool.name}**.`);
    promptLines.push(`Your goal is to provide helpful, practical, and relevant content based on the user's request.`);
    promptLines.push(`---`);
    promptLines.push(`User's Request Details:`);

    // Append form field data to the prompt
    tool.formFields.forEach((field: FormField) => {
        const value = formData[field.id]?.trim();
        if (value) { // Only include fields that have a value
            promptLines.push(`**${field.label}:** ${value}`);
        } else if (field.required) {
            // This case should ideally be caught by frontend validation,
            // but good to log if it reaches here.
            console.warn(`Missing required field '${field.label}' (${field.id}) for tool ${toolId}`);
            // We might return null or throw an error here depending on desired strictness
            // For now, we'll continue but the prompt might be incomplete.
        }
    });

    promptLines.push(`---`);
    promptLines.push(`Please generate a response based on the details provided.`);

    // Join the lines with newline characters
    return promptLines.join('\n');
}

export async function POST(request: Request) {
    try {
        // Expect toolId and formData
        const { toolId, formData } = await request.json();

        if (!toolId || !formData) {
            return NextResponse.json({ error: 'toolId and formData are required' }, { status: 400 });
        }

        // Build the tool-specific prompt
        const fullPrompt = buildPrompt(toolId, formData);

        if (!fullPrompt) {
            // Handle cases where the toolId was invalid or required data was missing implicitly
            return NextResponse.json({ error: 'Invalid tool selected or missing required form data' }, { status: 400 });
        }

        // console.log("Generated Prompt:\n", fullPrompt); // Uncomment for debugging

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();

        // TODO: Add PocketBase integration for usage tracking

        return NextResponse.json({ generatedText: text });

    } catch (error) {
        console.error('Error in /api/generate route:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return NextResponse.json({ error: `Failed to generate response from AI: ${errorMessage}` }, { status: 500 });
    }
} 
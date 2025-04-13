import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) console.error("CRITICAL ERROR: GEMINI_API_KEY environment variable is not set.");

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || 'MISSING_API_KEY');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

export async function POST(req: NextRequest) {
    if (!GEMINI_API_KEY) return NextResponse.json({ error: 'Server configuration error', details: "Missing API key." }, { status: 500 });

    try {
        const body = await req.json();
        console.log("Lesson Generator API received:", body);

        // --- Input Validation ---
        const { subject, gradeLevel, topic, objectives, duration, activities } = body;
        if (!subject || !gradeLevel || !topic || !objectives) {
            return NextResponse.json({ error: 'Bad Request', details: 'Missing required fields: subject, gradeLevel, topic, objectives.' }, { status: 400 });
        }

        // --- Construct Prompt ---
        const prompt = `Create a comprehensive lesson plan based on the following details:
Subject: ${subject}
Grade Level: ${gradeLevel}
Lesson Topic: ${topic}
Learning Objectives: ${objectives}
${duration ? `Lesson Duration: ${duration}\n` : ''}${activities ? `Key Activities/Methods: ${activities}\n` : ''}
Please generate a structured lesson plan including sections like materials, procedure/steps, differentiation (optional), and assessment.`;

        // --- Call Gemini API ---
        let responseText = "Sorry, I couldn't generate the lesson plan.";
        try {
            console.log("Sending Lesson Generator prompt to Gemini...");
            const result = await model.generateContent(prompt);
            responseText = result.response.text();
            console.log("Gemini response received for Lesson Generator.");
        } catch (e: any) {
            console.error("Error calling Gemini:", e);
            if (e.message?.includes("429") || e.status === 429) return NextResponse.json({ error: 'Request failed: Rate limit exceeded.', details: 'Please try again later.' }, { status: 429 });
            if (e.response?.candidates?.[0]?.finishReason === 'SAFETY') return NextResponse.json({ error: 'Request failed: Response blocked due to safety settings.' }, { status: 400 });
        }

        // --- Return Response ---
        return NextResponse.json({ response: responseText });

    } catch (error: any) {
        console.error("API Route General Error:", error);
        if (error instanceof SyntaxError) return NextResponse.json({ error: 'Invalid request format.', details: 'Could not parse request body.' }, { status: 400 });
        return NextResponse.json({ error: 'An internal server error occurred.', details: error.message || 'Unknown error' }, { status: 500 });
    }
} 
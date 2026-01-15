 import { streamText, createTextStreamResponse } from "ai";
import { createGroq } from "@ai-sdk/groq";
import { NextResponse } from "next/server";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, context } = await req.json();

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Groq API key missing. Check your .env.local file." },
        { status: 500 }
      );
    }

    const groq = createGroq({ apiKey });

    const systemPrompt = `Tu es Dora, un assistant DevOps expert. Analyse les données suivantes...`;

    const result = await streamText({
      model: groq("llama-3.1-8b-instant"),
      system: systemPrompt,
      messages: messages,
    });

    // ✅ Crée le flux compatible frontend
    return createTextStreamResponse(result);

  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

type IncomingMessage = {
  role: "user" | "assistant";
  content: string;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing GEMINI_API_KEY in .env.local" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const body = await req.json();
    const messages = body.messages as IncomingMessage[] | undefined;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages are required" },
        { status: 400 }
      );
    }

    const prompt = messages
      .slice(-10)
      .map((msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
      .join("\n");

    const systemPrompt = `
You are EcoSmart AI Assistant.
Help users with recycling, waste sorting, eco-friendly disposal, and sustainability tips.
Keep responses clear, practical, and friendly.

${prompt}

Assistant:
`;

    const modelCandidates = [
      "gemini-2.5-flash",
      "gemini-2.5-flash-lite",
      "gemini-2.5-pro",
    ];

    let lastError: unknown = null;

    for (const modelName of modelCandidates) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });

        // Retry this model a couple of times for temporary overload
        for (let attempt = 0; attempt < 3; attempt++) {
          try {
            const result = await model.generateContent(systemPrompt);
            const reply = result.response.text();

            return NextResponse.json({
              reply:
                reply?.trim() ||
                "Sorry, I could not generate a response right now.",
            });
          } catch (error) {
            lastError = error;

            const message =
              error instanceof Error ? error.message : String(error);

            const isTemporaryOverload =
              message.includes("503") ||
              message.includes("Service Unavailable") ||
              message.includes("high demand");

            if (!isTemporaryOverload) {
              break;
            }

            if (attempt < 2) {
              await sleep(1200 * (attempt + 1));
              continue;
            }
          }
        }
      } catch (error) {
        lastError = error;
      }
    }

    return NextResponse.json(
      {
        error: "Failed to get AI response",
        details:
          lastError instanceof Error
            ? lastError.message
            : "Gemini is temporarily unavailable. Please try again shortly.",
      },
      { status: 503 }
    );
  } catch (error) {
    console.error("GEMINI API ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to get AI response",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
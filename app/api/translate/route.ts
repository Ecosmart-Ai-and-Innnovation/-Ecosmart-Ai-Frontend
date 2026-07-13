import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { text, targetLanguage } = await request.json();

    if (!text || !targetLanguage) {
      return NextResponse.json(
        { error: "Missing required fields: text and targetLanguage" },
        { status: 400 }
      );
    }

    const endpoint = process.env.AZURE_TRANSLATOR_ENDPOINT;
    const key = process.env.AZURE_TRANSLATOR_KEY;
    const region = process.env.AZURE_TRANSLATOR_REGION;

    if (!endpoint || !key) {
      return NextResponse.json(
        { error: "Azure Translator API is not configured" },
        { status: 500 }
      );
    }

    const url = `${endpoint.replace(/\/+$/, "")}/translate?api-version=3.0&to=${targetLanguage}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": key,
        "Ocp-Apim-Subscription-Region": region || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify([{ Text: text }]),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Azure Translator error:", response.status, errorBody);
      return NextResponse.json(
        { error: `Azure Translator responded with status ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const translatedText = data[0]?.translations?.[0]?.text;

    if (!translatedText) {
      return NextResponse.json(
        { error: "Unexpected response structure from Azure Translator" },
        { status: 502 }
      );
    }

    return NextResponse.json({ translatedText });
  } catch (error) {
    console.error("Translate API route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

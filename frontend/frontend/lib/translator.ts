/**
 * Translation utility that proxies through the local Next.js API route
 * to keep Azure Translator credentials server-side only.
 */

export async function translateText(
  text: string,
  targetLanguage: string
): Promise<string> {
  if (!text || targetLanguage === "en") return text;

  try {
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, targetLanguage }),
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) return text;

    const data = await res.json();
    return data.translatedText || text;
  } catch {
    return text;
  }
}

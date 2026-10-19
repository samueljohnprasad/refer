// ponytail: safe lazy singleton for GoogleGenAI - prevents module-load crashes when API key is missing
import { GoogleGenAI } from "@google/genai";

let cachedClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI | null {
  if (cachedClient) return cachedClient;

  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  if (!apiKey || typeof apiKey !== "string" || apiKey.trim() === "" || apiKey === "undefined") {
    return null;
  }

  try {
    cachedClient = new GoogleGenAI({ apiKey });
    return cachedClient;
  } catch (error) {
    console.warn("[geminiClient] Failed to initialize GoogleGenAI:", error);
    return null;
  }
}

/**
 * Safe proxy for GoogleGenAI that provides a graceful fallback if the client cannot be initialized.
 * Guarantees that importing modules using `ai` will NEVER throw an uncaught exception on boot.
 */
export const ai = new Proxy({} as GoogleGenAI, {
  get(_target, prop) {
    const client = getGeminiClient();
    if (client) {
      const val = (client as any)[prop];
      return typeof val === "function" ? val.bind(client) : val;
    }

    if (prop === "models") {
      return {
        generateContent: async () => {
          console.warn("[geminiClient] Gemini API key not configured. Returning empty response.");
          return { text: null };
        },
      };
    }

    return undefined;
  },
});

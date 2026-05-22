import { GoogleGenAI } from "@google/genai";
import * as FileSystem from "expo-file-system/legacy";

const ai = new GoogleGenAI({
  apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY_SECONDARY!,
});

/**
 * Extract text from a journal page image using Gemini Vision
 * @param imageUri - Local file URI of the captured image
 * @returns Extracted text from the journal page
 */
export async function extractTextFromImage(imageUri: string): Promise<string> {
  try {
    // Read the image file as base64
    const base64Image = await FileSystem.readAsStringAsync(imageUri, {
      encoding: "base64",
    });

    // Determine mime type from URI
    const mimeType: string = imageUri.toLowerCase().endsWith(".png")
      ? "image/png"
      : "image/jpeg";

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType,
                data: base64Image,
              },
            },
            {
              text: `You are an expert at reading handwritten and printed text from journal pages.

Please extract ALL the text from this journal page image. Follow these guidelines:
1. Transcribe the text exactly as written, preserving the original wording
2. Maintain paragraph breaks where they naturally occur
3. If handwriting is unclear, make your best interpretation
4. Include any dates, headers, or titles visible
5. Preserve emotional expressions, punctuation, and emphasis (like underlines)
6. If there are drawings or doodles, briefly note them in [brackets]

Return ONLY the extracted text, without any additional commentary or formatting labels.`,
            },
          ],
        },
      ],
    });

    const extractedText = response.text?.trim() || "";

    if (!extractedText) {
      throw new Error("No text could be extracted from the image");
    }

    return extractedText;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    throw new Error(
      `Failed to extract text from journal image: ${errorMessage}`
    );
  }
}

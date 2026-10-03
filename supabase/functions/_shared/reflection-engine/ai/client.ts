import { GoogleGenerativeAI, GenerativeModel } from "npm:@google/generative-ai";
import {
  captureGeminiGeneration,
  type AiObservationContext,
} from "../../ai-observability.ts";

export class GeminiClient {
  private ai: GoogleGenerativeAI | null = null;

  private getAI(): GoogleGenerativeAI {
    if (!this.ai) {
      // ponytail: accept either secret name for resilience
      const apiKey =
        Deno.env.get("EXPO_PUBLIC_GEMINI_API_KEY") ||
        Deno.env.get("GEMINI_API_KEY");
      if (!apiKey) {
        throw new Error("Neither EXPO_PUBLIC_GEMINI_API_KEY nor GEMINI_API_KEY is set.");
      }
      this.ai = new GoogleGenerativeAI(apiKey);
    }
    return this.ai;
  }

  public getModel(modelName: string = "gemini-2.5-flash"): GenerativeModel {
    return this.getAI().getGenerativeModel({ model: modelName });
  }

  /**
   * Helper to invoke the model and parse JSON output.
   *
   * @param prompt            The user prompt text.
   * @param systemInstruction Optional system instruction.
   * @param responseSchema    Optional JSON Schema object to constrain the model output.
   * @param modelName         Optional model override.
   */
  public async generateJson(
    prompt: string,
    systemInstruction?: string,
    responseSchema?: object,
    modelName?: string,
    observation?: AiObservationContext,
  ): Promise<unknown> {
    const resolvedModelName = modelName || "gemini-2.5-flash";
    const model = this.getModel(resolvedModelName);
    const startedAt = Date.now();
    const input = [
      ...(systemInstruction
        ? [{ role: "system", content: systemInstruction }]
        : []),
      { role: "user", content: prompt },
    ];

    let text: string;
    try {
      const response = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        systemInstruction: systemInstruction
          ? { role: "system", parts: [{ text: systemInstruction }] }
          : undefined,
        generationConfig: {
          responseMimeType: "application/json",
          // @ts-ignore — responseSchema is supported by the API but not yet in the Deno type definitions
          responseSchema,
        },
      });
      text = response.response.text();
    } catch (error) {
      await captureGeminiGeneration({
        operation: "generate_structured_reflection",
        model: resolvedModelName,
        input,
        startedAt,
        error,
        context: observation,
      });
      throw error;
    }

    await captureGeminiGeneration({
      operation: "generate_structured_reflection",
      model: resolvedModelName,
      input,
      output: text,
      startedAt,
      context: observation,
    });
    try {
      return JSON.parse(text);
    } catch (error) {
      console.error("Failed to parse Gemini output as JSON", text);
      throw new Error("Invalid JSON returned from Gemini.");
    }
  }
}

export const geminiClient = new GeminiClient();

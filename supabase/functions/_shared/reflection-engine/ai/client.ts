import { GoogleGenerativeAI, GenerativeModel } from "npm:@google/generative-ai";

export class GeminiClient {
  private ai: GoogleGenerativeAI | null = null;

  private getAI(): GoogleGenerativeAI {
    if (!this.ai) {
      const apiKey = Deno.env.get("GEMINI_API_KEY");
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is missing.");
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
  ): Promise<unknown> {
    const model = this.getModel(modelName || "gemini-2.5-flash");

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

    const text = response.response.text();
    try {
      return JSON.parse(text);
    } catch (error) {
      console.error("Failed to parse Gemini output as JSON", text);
      throw new Error("Invalid JSON returned from Gemini.");
    }
  }
}

export const geminiClient = new GeminiClient();

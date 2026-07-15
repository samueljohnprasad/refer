import { GoogleGenerativeAI, GenerativeModel } from "npm:@google/generative-ai";

export class GeminiClient {
  private ai: GoogleGenerativeAI;
  private defaultModel: GenerativeModel;

  constructor() {
    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing.");
    }
    
    this.ai = new GoogleGenerativeAI(apiKey);
    // Use gemini-2.5-flash as the default model for general fast text tasks
    this.defaultModel = this.ai.getGenerativeModel({ model: "gemini-2.5-flash" });
  }

  public getModel(modelName: string = "gemini-2.5-flash"): GenerativeModel {
    return this.ai.getGenerativeModel({ model: modelName });
  }

  /**
   * Helper to invoke the model and parse JSON output.
   */
  public async generateJson(
    prompt: string, 
    systemInstruction?: string,
    modelName?: string
  ): Promise<any> {
    const model = modelName ? this.getModel(modelName) : this.defaultModel;
    
    const response = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      systemInstruction: systemInstruction ? { role: "system", parts: [{ text: systemInstruction }] } : undefined,
      generationConfig: {
        responseMimeType: "application/json",
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
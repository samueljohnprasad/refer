import { GoogleGenAI } from "@google/genai";
import { File } from "expo-file-system";
import { getAllMicronutrientNames } from "@/src/config/micronutrients";

const ai = new GoogleGenAI({
  apiKey: "AIzaSyBKfv2gvLQIyHatEFiAjNSm1p1jmXepCSY",
});

/**
 * Micronutrients stored as key-value pairs
 * Key: micronutrient name (e.g., "zinc", "vitaminD3")
 * Value: amount in appropriate unit (mg, mcg, etc.)
 * This allows adding new micronutrients without changing the type
 */
export type Micronutrients = Record<string, number>;

export interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  servingSize: string;
  confidence: number;
  micronutrients?: Micronutrients;
}

export interface CalorieAnalysisResult {
  success: boolean;
  foods: FoodItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  healthScore: number;
  healthScoreReasoning: string; // Justification for the health score
  suggestions: string[];
  totalMicronutrients?: Micronutrients;
  error?: string;
}

/**
 * Analyze a food image and return calorie/nutrition data
 */
export const analyzeCaloriesFromImage = async (
  imageUri: string
): Promise<CalorieAnalysisResult> => {
  try {
    // Read the image file and convert to base64 using new File API
    const file = new File(imageUri);
    const base64Image = await file.base64();

    // Determine MIME type from URI
    const mimeType = imageUri.toLowerCase().endsWith(".png")
      ? "image/png"
      : "image/jpeg";

    // Get dynamic list of micronutrients to track
    const micronutrientNames = getAllMicronutrientNames().join(", ");

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
              text: `Analyze this food image and provide detailed nutritional information including micronutrients.

IMPORTANT INSTRUCTIONS:
1. Identify ALL food items visible in the image
2. For each item, estimate calories, macronutrients, AND micronutrients based on typical serving sizes  
3. Include estimated micronutrients: ${micronutrientNames}
4. Store micronutrients as a key-value object where key is the nutrient ID (e.g., "zinc", "vitaminD3") and value is the amount
5. If you cannot identify the food, still provide your best estimate
6. Determine the most likely meal type based on the foods
7. Provide a health score (1-100) based on nutritional balance
8. Provide detailed reasoning for the health score (2-3 sentences explaining why this score was given, mentioning specific nutritional strengths and weaknesses)
9. Give 2-3 brief health suggestions

Be as accurate as possible with all nutrient estimates. Consider portion sizes visible in the image.`,
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            foods: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  calories: { type: "number" },
                  protein: { type: "number" },
                  carbs: { type: "number" },
                  fat: { type: "number" },
                  fiber: { type: "number" },
                  servingSize: { type: "string" },
                  confidence: {
                    type: "number",
                    minimum: 0,
                    maximum: 100,
                  },
                  micronutrients: {
                    type: "object",
                    additionalProperties: { type: "number" },
                  },
                },
                required: [
                  "name",
                  "calories",
                  "protein",
                  "carbs",
                  "fat",
                  "fiber",
                  "servingSize",
                  "confidence",
                ],
              },
            },
            totalCalories: { type: "number" },
            totalProtein: { type: "number" },
            totalCarbs: { type: "number" },
            totalFat: { type: "number" },
            totalFiber: { type: "number" },
            mealType: {
              type: "string",
              enum: ["breakfast", "lunch", "dinner", "snack"],
            },
            healthScore: {
              type: "number",
              minimum: 1,
              maximum: 100,
            },
            healthScoreReasoning: {
              type: "string",
            },
            suggestions: {
              type: "array",
              items: { type: "string" },
              maxItems: 3,
            },
            totalMicronutrients: {
              type: "object",
              additionalProperties: { type: "number" },
            },
          },
          required: [
            "success",
            "foods",
            "totalCalories",
            "totalProtein",
            "totalCarbs",
            "totalFat",
            "totalFiber",
            "mealType",
            "healthScore",
            "healthScoreReasoning",
            "suggestions",
          ],
        },
      },
    });

    if (!response.text) {
      return {
        success: false,
        foods: [],
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        totalFiber: 0,
        mealType: "snack",
        healthScore: 0,
        healthScoreReasoning: "",
        suggestions: [],
        error: "Failed to analyze image",
      };
    }

    const result = JSON.parse(response.text) as CalorieAnalysisResult;
    return {
      ...result,
      success: true,
    };
  } catch (error) {
    console.error("Error analyzing food image:", error);
    return {
      success: false,
      foods: [],
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
      totalFiber: 0,
      mealType: "snack",
      healthScore: 0,
      healthScoreReasoning: "",
      suggestions: [],
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

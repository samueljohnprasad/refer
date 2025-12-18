import { GoogleGenAI } from "@google/genai";
import { File } from "expo-file-system";
import { getAllMicronutrientNames } from "@/src/config/micronutrients";

const ai = new GoogleGenAI({
  apiKey: "AIzaSyBKfv2gvLQIyHatEFiAjNSm1p1jmXepCSY",
});

/**
 * Individual micronutrient entry
 */
export interface MicronutrientEntry {
  name: string;
  amount: number;
}

/**
 * Micronutrients stored as an array of name-amount pairs
 * This allows adding new micronutrients without changing the type
 */
export type Micronutrients = MicronutrientEntry[];

export interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  servingSize: string;
  confidence: number;
  micronutrients: Micronutrients;
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
  totalMicronutrients: Micronutrients;
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
3. Micronutrients to track: ${micronutrientNames || "none"}
4. If micronutrients are configured, include estimated amounts as an ARRAY of objects, each with:
   - "name": the nutrient ID (e.g., "zinc", "vitaminD3")
   - "amount": the quantity in appropriate units (mg, mcg, etc.)
   Example: [{"name": "zinc", "amount": 5.2}, {"name": "vitaminD3", "amount": 12.0}]
5. If NO micronutrients are configured (empty list), return an empty array [] for both "micronutrients" and "totalMicronutrients"
6. If you cannot identify the food, still provide your best estimate
7. Determine the most likely meal type based on the foods
8. Provide a health score (1-100) based on nutritional balance
9. Provide detailed reasoning for the health score (2-3 sentences explaining why this score was given, mentioning specific nutritional strengths and weaknesses)
10. Give 2-3 brief health suggestions

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
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        amount: { type: "number" },
                      },
                      required: ["name", "amount"],
                    },
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
                  "micronutrients",
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
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  amount: { type: "number" },
                },
                required: ["name", "amount"],
              },
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
            "totalMicronutrients",
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
        totalMicronutrients: [],
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
      totalMicronutrients: [],
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

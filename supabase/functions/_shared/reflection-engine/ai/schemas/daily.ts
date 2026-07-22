import { structuredMemorySchema } from "./structured-memory.ts";

/**
 * JSON Schema for the Daily Reflection response.
 */
export const dailyReflectionSchema = {
  type: "object",
  properties: {
    daily_reflection: {
      type: "string",
      description: "An evidence-based narrative of what happened today, including themes and notable observations.",
    },
    structured_memory: structuredMemorySchema,
  },
  required: ["daily_reflection", "structured_memory"],
};

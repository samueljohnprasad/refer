import { structuredMemorySchema } from "./structured-memory.ts";

/**
 * JSON Schema for the Weekly Reflection response.
 */
export const weeklyReflectionSchema = {
  type: "object",
  properties: {
    weekly_reflection: {
      type: "string",
      description: "A reflective summary of the week, focusing on recurring patterns and thematic evolution.",
    },
    observed_patterns: {
      type: "array",
      items: { type: "string" },
      description: "Patterns observed across multiple days, supported by evidence.",
    },
    insights: {
      type: "array",
      items: { type: "string" },
      description: "Evidence-based observations worth reflecting on.",
    },
    structured_memory: structuredMemorySchema,
  },
  required: [
    "weekly_reflection",
    "observed_patterns",
    "insights",
    "structured_memory",
  ],
};

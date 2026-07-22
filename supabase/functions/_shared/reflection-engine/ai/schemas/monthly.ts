import { structuredMemorySchema } from "./structured-memory.ts";

/**
 * JSON Schema for the Monthly Reflection response.
 */
export const monthlyReflectionSchema = {
  type: "object",
  properties: {
    monthly_reflection: {
      type: "string",
      description: "A narrative arc of the month, describing long-term patterns and thematic evolution.",
    },
    defining_themes: {
      type: "array",
      items: { type: "string" },
      description: "Themes that persisted or evolved across multiple weeks.",
    },
    insights: {
      type: "array",
      items: { type: "string" },
      description: "The most important evidence-based observations from the month.",
    },
    structured_memory: structuredMemorySchema,
  },
  required: [
    "monthly_reflection",
    "defining_themes",
    "insights",
    "structured_memory",
  ],
};

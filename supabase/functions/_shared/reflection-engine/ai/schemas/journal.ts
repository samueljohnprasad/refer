import { structuredMemorySchema } from "./structured-memory.ts";

/**
 * JSON Schema for the Journal Reflection response.
 */
export const journalReflectionSchema = {
  type: "object",
  properties: {
    reflection: {
      type: "string",
      description:
        "A concise, evidence-based summary of the single journal entry.",
    },
    structured_memory: structuredMemorySchema,
    confidence: {
      type: "number",
      description:
        "AI confidence in the reflection, from 0.0 to 1.0, based on available evidence.",
    },
    moodScore: {
      type: "integer",
      description:
        "Overall mood score between 1 (very negative) and 5 (very positive).",
    },
  },
  required: ["reflection", "structured_memory", "confidence", "moodScore"],
};

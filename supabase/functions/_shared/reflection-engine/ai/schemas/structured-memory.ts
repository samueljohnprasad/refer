/**
 * Shared JSON Schema fragment for AIStructuredMemory.
 * Reused across journal, daily, weekly, and monthly reflection schemas.
 */
export const structuredMemorySchema = {
  type: "object",
  properties: {
    themes: {
      type: "array",
      items: { type: "string" },
      nullable: true,
      description: "Recurring discussion topics observed during the reflection period.",
    },
    emotions: {
      type: "array",
      items: { type: "string" },
      nullable: true,
      description: "Emotions explicitly expressed by the user. Do not infer emotions from behavior alone.",
    },
    routines: {
      type: "array",
      items: { type: "string" },
      nullable: true,
      description: "Recurring behaviors or habits mentioned by the user.",
    },
    challenges: {
      type: "array",
      items: { type: "string" },
      nullable: true,
      description: "Situations or difficulties the user explicitly described.",
    },
    positive_experiences: {
      type: "array",
      items: { type: "string" },
      nullable: true,
      description: "Moments the user described as positive or rewarding.",
    },
    life_events: {
      type: "array",
      items: { type: "string" },
      nullable: true,
      description: "Important discrete events that may influence future reflections (e.g. starting a job, moving, travel).",
    },
  },
  nullable: true,
};

// @ts-ignore
import { GoogleGenAI } from "https://esm.sh/@google/genai@1.24.0";

export type FeelingsType = {
  name: string;
  emoji: string;
  colorsGradient: string[];
};

export type InsightsType = {
  moodScore?: number;
  suggestedTags?: string[];
  growthAreas?: string[];
  positiveInsights?: string[];
  summary?: string;
  mainEmoji?: string;
  feelings?: FeelingsType[];
  title?: string;
  enrichedTranscript?: string;
  aiInsights?: string;
  created_at?: string;
  energyLevel?: number; // 1-5: Physical energy/fatigue level
  stressLevel?: number; // 1-5: Stress intensity
  socialConnection?: number; // 1-5: Quality of social interactions
  triggers?: string[]; // Identified mood triggers (positive or negative)
  copingStrategies?: string[]; // Coping mechanisms used
  physicalSymptoms?: string[]; // Physical health mentions
  sleepQuality?: number; // 1-5: Sleep quality if mentioned
  goals?: string[]; // Goals or intentions mentioned
  worries?: string[]; // Recurring worries or anxieties
  achievements?: string[]; // Wins and accomplishments
};

const genai = new GoogleGenAI({
  apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY_SECONDARY!,
});

export const getInsights = async (
  transcript: string
): Promise<{ insights: InsightsType | null; error?: string }> => {
  try {
    const response = await genai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Analyze this journal entry comprehensively:\n\n${transcript}\n\n
      Extract ALL relevant insights including mood, emotions, patterns, context, and health indicators. 
      Be thorough in identifying gratitude, achievements, worries, triggers, coping strategies, and any mentions of sleep, energy, productivity, relationships, or self-care.
      Infer time context (morning/afternoon/evening/night) from content clues. Detect location context (home/work/travel/outdoor) if mentioned.
      Rate energy, stress, productivity, social connection, sleep quality`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            moodScore: {
              type: "integer",
              description:
                "Overall mood score between 1 (very negative) and 5 (very positive).",
            },
            suggestedTags: {
              type: "array",
              items: { type: "string" },
              description: "Keywords/tags that categorize this entry.",
            },
            growthAreas: {
              type: "array",
              items: { type: "string" },
              description:
                "Challenges, areas for self-reflection, or improvement.",
            },
            positiveInsights: {
              type: "array",
              items: { type: "string" },
              description:
                "Positive takeaways, gratitude points, or strengths.",
            },
            summary: {
              type: "string",
              description:
                "A short empathetic summary written directly to the user (e.g., 'You are feeling overwhelmed but also hopeful...').",
            },
            mainEmoji: {
              type: "string",
              enum: ["terrible", "bad", "fine", "good", "great"],
            },
            feelings: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  emoji: {
                    type: "string",
                    description: "Emoji representing the feeling.",
                  },
                  colorsGradient: {
                    type: "array",
                    items: {
                      type: "string",
                      description:
                        "Colors for the gradient background that represents the feeling of the tag chip. The first color is the top color and the second color is the bottom color.",
                    },
                  },
                  intensity: {
                    type: "integer",
                    description:
                      "Intensity % of the feeling between 1 (very weak) and 100 (very strong).",
                    minimum: 1,
                    maximum: 100,
                  },
                },
                required: ["name", "emoji", "colorsGradient", "intensity"],
              },
              description: "Different feelings expressed in the journal.",
            },
            title: {
              type: "string",
              description: "Add a short 'title' in a few words.",
            },
            enrichedTranscript: {
              type: "string",
              description:
                "The journal entry returned as a single string, but formatted with line breaks (\\n) between sentences or logical sections for readability, with emojis added where appropriate.",
            },
            aiInsights: {
              type: "string",
              description:
                "Deeper reflection generated by AI that highlights patterns, connections, or broader meaning behind the entry.",
            },
            energyLevel: {
              type: "integer",
              description:
                "Physical energy level 1-5 based on mentions of tiredness, vitality, exhaustion, or energy.",
              minimum: 1,
              maximum: 5,
            },
            stressLevel: {
              type: "integer",
              description:
                "Stress intensity 1-5 based on mentions of pressure, overwhelm, calm, or relaxation.",
              minimum: 1,
              maximum: 5,
            },
            socialConnection: {
              type: "integer",
              description:
                "Quality of social interactions 1-5 based on mentions of loneliness, connection, or social activities.",
              minimum: 1,
              maximum: 5,
            },
            triggers: {
              type: "array",
              items: { type: "string" },
              description:
                "Identified mood triggers - both positive (what improved mood) and negative (what worsened mood).",
            },
            copingStrategies: {
              type: "array",
              items: { type: "string" },
              description:
                "Coping mechanisms or strategies they used to manage emotions or challenges.",
            },
            physicalSymptoms: {
              type: "array",
              items: { type: "string" },
              description:
                "Any physical health mentions like headaches, pain, illness, or physical sensations.",
            },
            sleepQuality: {
              type: "integer",
              description:
                "Sleep quality 1-5 if sleep is mentioned. If not mentioned, use 3 as neutral.",
              minimum: 1,
              maximum: 5,
            },
            goals: {
              type: "array",
              items: { type: "string" },
              description:
                "Goals, intentions, or plans mentioned for the future.",
            },
            worries: {
              type: "array",
              items: { type: "string" },
              description:
                "Recurring worries, anxieties, or concerns expressed.",
            },
            achievements: {
              type: "array",
              items: { type: "string" },
              description:
                "Wins, accomplishments, or successes mentioned (big or small).",
            },
          },
          required: [
            "moodScore",
            "suggestedTags",
            "growthAreas",
            "positiveInsights",
            "summary",
            "mainEmoji",
            "feelings",
            "enrichedTranscript",
            "aiInsights",
            "energyLevel",
            "stressLevel",
            "socialConnection",
            "triggers",
            "copingStrategies",
            "physicalSymptoms",
            "sleepQuality",
            "goals",
            "worries",
            "achievements",
          ],
        },
      },
    });

    if (!response.text) {
      console.error("No response text from AI");
      return { insights: null, error: "No response from AI" };
    }

    const insights: InsightsType = JSON.parse(response.text);
    return { insights };
  } catch (error) {
    console.error("Error getting insights:", error);
    return { insights: null, error: "Error getting insights" };
  }
};

// @ts-ignore
import { GoogleGenAI } from "https://esm.sh/@google/genai@1.24.0";

// whole file is deprecated , dont use anywhere

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
  sleepQuality?: number | null; // 1-5: Sleep quality — null if not mentioned
  goals?: string[]; // Goals or intentions mentioned
  worries?: string[]; // Recurring worries or anxieties
  achievements?: string[]; // Wins and accomplishments
  // New CBT-informed insight fields
  cognitivePattern?: string | null; // Gentle identification of a CBT thinking pattern
  suggestedExerciseName?: string | null; // Name of the most relevant CBT exercise
  suggestedExercise?: string | null; // One sentence on why this exercise fits
  nextJournalPrompt?: string | null; // Open question to explore in the next entry
  strengthSpotlight?: string | null; // Specific strength demonstrated in the entry
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
      contents: `You are a compassionate, CBT-informed journal companion. Your role is to help the user understand themselves more clearly — not to praise them, but to reflect back what they actually wrote with precision and care.

Here is the journal entry to analyse:\n\n${transcript}\n\n
Rules you must follow:
1. NEVER make generic statements that could apply to any person or any entry. Every observation must reference something SPECIFIC the user wrote — a situation, a word they used, a feeling they named.
2. For aiInsights: write 1-2 sentences that name the emotional core accurately, not just the surface topic. Use their own words where possible. Start with "I noticed..." or "It sounds like...". Do NOT end with generic advice, affirmations, or platitudes.
3. For cognitivePattern: ONLY include if a clear CBT cognitive distortion is unmistakably present (all-or-nothing thinking, catastrophising, mind reading, overgeneralisation, personalisation, should statements). Name it gently using the user's own words. If no clear pattern exists, return null. Do not force it.
4. For suggestedExerciseName and suggestedExercise: choose the single most relevant CBT exercise from: Thought Record, Behavioural Experiment, Worry Time, Activity Scheduling, Graded Exposure, Mindful Breathing, Self-Compassion Letter, Values Clarification, Problem Solving, Progressive Muscle Relaxation. Connect the exercise directly to what they wrote.
5. For strengthSpotlight: identify ONE specific strength demonstrated — must reference something they actually did or noticed. Not generic praise. Return null if no clear strength is present.
6. For nextJournalPrompt: write one open question that arises naturally from what they wrote. Something that invites deeper exploration in the next entry.
7. Extract all structured fields accurately based only on what is actually present in the entry. Do not invent or assume details not mentioned.
8. For sleepQuality: return null if sleep is not explicitly mentioned. Do NOT default to any value.`,
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
                "A single resonant observation written directly to the user, in 1-2 sentences. MUST: (1) reference something SPECIFIC from what they wrote — a situation, phrase, or feeling they actually named, (2) name the emotional core accurately, not just the surface topic, (3) use their own words where possible, (4) NOT end with generic advice, affirmations, or platitudes. Start with 'I noticed...' or 'It sounds like...'. Example of BAD output: 'You are developing resilience and emotional maturity.' Example of GOOD output: 'I noticed that even as you described the win at work, you immediately pivoted to what still felt unfinished — it sounds like achievement alone isn\'t quite landing the way you hoped it would.'",
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
                "Sleep quality 1-5 ONLY if sleep is explicitly mentioned. Return null if sleep is not mentioned at all — do NOT default to 3.",
              minimum: 1,
              maximum: 5,
            },
            cognitivePattern: {
              type: "string",
              description:
                "ONLY if a clear CBT cognitive distortion is unmistakably present, name it gently in 1 sentence using the user's own language. Return null if no clear pattern exists — do not force it.",
            },
            suggestedExerciseName: {
              type: "string",
              description:
                "Name of the single most relevant CBT exercise: Thought Record, Behavioural Experiment, Worry Time, Activity Scheduling, Graded Exposure, Mindful Breathing, Self-Compassion Letter, Values Clarification, Problem Solving, or Progressive Muscle Relaxation.",
            },
            suggestedExercise: {
              type: "string",
              description:
                "One sentence explaining why this specific exercise fits what the user wrote — reference something specific from their entry.",
            },
            nextJournalPrompt: {
              type: "string",
              description:
                "A single open question that arises naturally from what they wrote, to explore in their next journal entry. Should feel personal to this entry, not generic.",
            },
            strengthSpotlight: {
              type: "string",
              description:
                "ONE specific strength demonstrated in this entry — must reference something the user actually did or noticed. Not generic praise. Return null if no clear specific strength is present.",
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

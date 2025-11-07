import { Enums } from "@/types/types";
import { GoogleGenAI } from "@google/genai";

export type FeelingsType = {
  name: string;
  emoji: string;
  colorsGradient: string[];
  intensity: number;
};

export type InsightsType = {
  moodScore?: number;
  suggestedTags?: string[];
  growthAreas?: string[];
  positiveInsights?: string[];
  summary?: string;
  mainEmoji?: Enums<"mood">;
  feelings?: FeelingsType[];
  title?: string;
  enrichedTranscript?: string;
  aiInsights?: string;
  created_at?: string;
  // Enhanced insights for analytics
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
  relationshipQuality?: number; // 1-5: Overall relationship satisfaction
};

export const defaultInsights: InsightsType = {
  moodScore: 0,
  suggestedTags: [],
  growthAreas: [],
  positiveInsights: [],
  summary: "",
  mainEmoji: undefined,
  feelings: [],
  title: "",
  enrichedTranscript: "",
  aiInsights: "",
};
const ai = new GoogleGenAI({
  apiKey: "AIzaSyAx2xyv9nnK2-smi3YElqL48kQZQ8_EKBc",
});

export const getInsights = async (transcript: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Analyze this journal entry comprehensively:\n\n${transcript}\n\n
      Extract ALL relevant insights including mood, emotions, patterns, context, and health indicators. 
      Be thorough in identifying gratitude, achievements, worries, triggers, coping strategies, and any mentions of sleep, energy, productivity, relationships, or self-care.
      Infer time context (morning/afternoon/evening/night) from content clues. Detect location context (home/work/travel/outdoor) if mentioned.
      Rate energy, stress, productivity, social connection, sleep quality, relationship quality, and values alignment on 1-5 scales based on the entry tone and content.`,
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
            relationshipQuality: {
              type: "integer",
              description:
                "Overall relationship satisfaction 1-5 based on mentions of relationships, connection, conflict, or support.",
              minimum: 1,
              maximum: 5,
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
            "relationshipQuality",
          ],
        },
      },
    });

    if (!response.text) return defaultInsights;
    const insights: InsightsType = JSON.parse(response.text);
    return insights;
  } catch (error) {
    console.error("Error getting insights:", error);
    return defaultInsights;
  }
};

export type AIRecommendation = {
  title: string;
  description: string;
  category:
    | "mental_health"
    | "productivity"
    | "relationships"
    | "self_care"
    | "growth";
  actionSteps: string[];
  icon: string;
  priority: "high" | "medium" | "low";
};

export type EmotionRadarData = {
  emotion: string;
  score: number; // 0-100
  count: number;
};

// New types for advanced charts
export type EmotionalVolatilityData = {
  date: string;
  volatilityScore: number; // 0-100 (0 = very stable, 100 = very volatile)
  moodSwings: number; // Number of mood swings that day
  emotionalRange: number; // Difference between highest and lowest mood
  stability: "stable" | "moderate" | "volatile" | "highly_volatile";
  triggers: string[]; // What triggered volatility
};

export type CognitivePatternLink = {
  source: string; // Source thought/emotion
  target: string; // Target thought/emotion
  value: number; // Strength of connection (0-100)
  frequency: number; // How often this pattern occurs
  type: "positive" | "negative" | "neutral";
};

export type LifeDomainScore = {
  domain: string; // e.g., 'Work', 'Relationships', 'Health', etc.
  score: number; // 0-100
  trend: "improving" | "stable" | "declining";
  attention_needed: boolean;
  insights: string;
};

export type WeeklySummary = {
  weekStart: string;
  weekEnd: string;
  overallMood: number;
  moodTrend: "improving" | "stable" | "declining";
  topEmotions: string[];
  keyHighlights: string[];
  growthAchievements: string[];
  areasOfConcern: string[];
  motivationalMessage: string;
  nextWeekFocus: string[];
  entriesCount: number;
  streakDays: number;
  emotionRadarData: EmotionRadarData[];
  emotionInsight: string;
  // New advanced insights
  emotionalVolatility: EmotionalVolatilityData[];
  volatilityInsight: string;
  cognitivePatterns: CognitivePatternLink[];
  cognitiveInsight: string;
  lifeDomainBalance: LifeDomainScore[];
  lifeDomainInsight: string;
};

export type GrowthInsight = {
  insight: string;
  category: string;
  supportingEvidence: string[];
  suggestion: string;
  impactLevel: "high" | "medium" | "low";
};

/**
 * Generate personalized growth recommendations based on recent journal entries
 */
export const generateAIRecommendations = async (
  entries: Array<{
    enrichedTranscript: string;
    moodScore: number;
    feelings: any;
    created_at: string;
  }>
): Promise<AIRecommendation[]> => {
  try {
    if (!entries || entries.length === 0) {
      return [];
    }

    const entriesText = entries
      .map(
        (e, i) =>
          `Entry ${i + 1} (${e.created_at}):\nMood: ${e.moodScore}/5\n${
            e.enrichedTranscript
          }\n`
      )
      .join("\n---\n");

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Analyze these recent journal entries and provide personalized growth recommendations:\n\n${entriesText}\n\nGenerate 3-5 actionable recommendations.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              description: { type: "string" },
              category: {
                type: "string",
                enum: [
                  "mental_health",
                  "productivity",
                  "relationships",
                  "self_care",
                  "growth",
                ],
              },
              actionSteps: {
                type: "array",
                items: { type: "string" },
              },
              icon: { type: "string" },
              priority: {
                type: "string",
                enum: ["high", "medium", "low"],
              },
            },
            required: [
              "title",
              "description",
              "category",
              "actionSteps",
              "icon",
              "priority",
            ],
          },
        },
      },
    });

    if (!response.text) return [];
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error generating recommendations:", error);
    return [];
  }
};

/**
 * Generate weekly summary from journal entries
 */
export const generateWeeklySummary = async (
  entries: Array<{
    enrichedTranscript: string;
    moodScore: number;
    feelings: any;
    created_at: string;
  }>,
  weekStart: string,
  weekEnd: string,
  streakDays: number
): Promise<WeeklySummary | null> => {
  try {
    if (!entries || entries.length === 0) {
      return null;
    }

    const entriesText = entries
      .map(
        (e, i) =>
          `Entry ${i + 1} (${e.created_at}):\nMood: ${e.moodScore}/5\n${
            e.enrichedTranscript
          }\n`
      )
      .join("\n---\n");

    const avgMood =
      entries.reduce((sum, e) => sum + (e.moodScore || 0), 0) / entries.length;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Generate a comprehensive weekly summary for the week of ${weekStart} to ${weekEnd}. The user made ${
        entries.length
      } entries with an average mood of ${avgMood.toFixed(
        1
      )}/5 and maintained a ${streakDays} day streak.\n\nEntries:\n${entriesText}\n\nIMPORTANT: Perform these advanced analyses:\n\n1. EMOTIONAL DIMENSIONS (8 emotions, 0-100 scale):\n- Joy, Gratitude, Confidence, Peace (positive)\n- Anxiety, Sadness, Anger, Fear (challenging)\nScore each based on presence in entries.\n\n2. EMOTIONAL VOLATILITY ANALYSIS:\nFor each day with entries, calculate:\n- Volatility score (0-100): how much emotions fluctuated\n- Number of mood swings\n- Emotional range (difference between highest/lowest)\n- Stability level and triggers\n\n3. COGNITIVE PATTERN FLOW:\nIdentify thought patterns and their connections:\n- How one emotion/thought leads to another\n- Pattern strength and frequency\n- Whether patterns are positive/negative\n\n4. LIFE DOMAIN BALANCE (score 0-100 each):\n- Work/Career\n- Relationships/Family\n- Health/Wellness\n- Personal Growth\n- Recreation/Hobbies\n- Spirituality/Purpose\nIdentify which domains need attention.\n\nProvide specific, actionable insights for each analysis.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            weekStart: { type: "string" },
            weekEnd: { type: "string" },
            overallMood: { type: "number" },
            moodTrend: {
              type: "string",
              enum: ["improving", "stable", "declining"],
            },
            topEmotions: {
              type: "array",
              items: { type: "string" },
            },
            keyHighlights: {
              type: "array",
              items: { type: "string" },
            },
            growthAchievements: {
              type: "array",
              items: { type: "string" },
            },
            areasOfConcern: {
              type: "array",
              items: { type: "string" },
            },
            motivationalMessage: { type: "string" },
            nextWeekFocus: {
              type: "array",
              items: { type: "string" },
            },
            entriesCount: { type: "integer" },
            streakDays: { type: "integer" },
            emotionRadarData: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  emotion: {
                    type: "string",
                    enum: [
                      "Joy",
                      "Gratitude",
                      "Confidence",
                      "Peace",
                      "Anxiety",
                      "Sadness",
                      "Anger",
                      "Fear",
                    ],
                  },
                  score: {
                    type: "number",
                    minimum: 0,
                    maximum: 100,
                  },
                  count: { type: "integer" },
                },
                required: ["emotion", "score", "count"],
              },
              minItems: 8,
              maxItems: 8,
            },
            emotionInsight: {
              type: "string",
              description:
                "A personalized 1-2 sentence insight about the user's emotional balance based on the emotion scores. Be specific and actionable.",
            },
            emotionalVolatility: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  date: { type: "string" },
                  volatilityScore: {
                    type: "number",
                    minimum: 0,
                    maximum: 100,
                  },
                  moodSwings: { type: "integer" },
                  emotionalRange: { type: "number" },
                  stability: {
                    type: "string",
                    enum: ["stable", "moderate", "volatile", "highly_volatile"],
                  },
                  triggers: {
                    type: "array",
                    items: { type: "string" },
                  },
                },
                required: [
                  "date",
                  "volatilityScore",
                  "moodSwings",
                  "emotionalRange",
                  "stability",
                  "triggers",
                ],
              },
            },
            volatilityInsight: {
              type: "string",
              description:
                "Insight about emotional stability patterns and recommendations for managing volatility",
            },
            cognitivePatterns: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  source: { type: "string" },
                  target: { type: "string" },
                  value: {
                    type: "number",
                    minimum: 0,
                    maximum: 100,
                  },
                  frequency: { type: "integer" },
                  type: {
                    type: "string",
                    enum: ["positive", "negative", "neutral"],
                  },
                },
                required: ["source", "target", "value", "frequency", "type"],
              },
            },
            cognitiveInsight: {
              type: "string",
              description:
                "Insight about thought patterns and how to break negative cycles or reinforce positive ones",
            },
            lifeDomainBalance: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  domain: {
                    type: "string",
                    enum: [
                      "Work/Career",
                      "Relationships",
                      "Health",
                      "Personal Growth",
                      "Recreation",
                      "Spirituality",
                    ],
                  },
                  score: {
                    type: "number",
                    minimum: 0,
                    maximum: 100,
                  },
                  trend: {
                    type: "string",
                    enum: ["improving", "stable", "declining"],
                  },
                  attention_needed: { type: "boolean" },
                  insights: { type: "string" },
                },
                required: [
                  "domain",
                  "score",
                  "trend",
                  "attention_needed",
                  "insights",
                ],
              },
              minItems: 6,
              maxItems: 6,
            },
            lifeDomainInsight: {
              type: "string",
              description:
                "Overall insight about life balance and which areas need more attention",
            },
          },
          required: [
            "weekStart",
            "weekEnd",
            "overallMood",
            "moodTrend",
            "topEmotions",
            "keyHighlights",
            "motivationalMessage",
            "emotionRadarData",
            "emotionInsight",
            "emotionalVolatility",
            "volatilityInsight",
            "cognitivePatterns",
            "cognitiveInsight",
            "lifeDomainBalance",
            "lifeDomainInsight",
          ],
        },
      },
    });

    if (!response.text) return null;
    const summary = JSON.parse(response.text);
    return {
      ...summary,
      entriesCount: entries.length,
      streakDays,
    };
  } catch (error) {
    console.error("Error generating weekly summary:", error);
    return null;
  }
};

/**
 * Detect patterns and generate deep growth insights
 */
export const generateGrowthInsights = async (
  entries: Array<{
    enrichedTranscript: string;
    moodScore: number;
    feelings: any;
    created_at: string;
  }>
): Promise<GrowthInsight[]> => {
  try {
    if (!entries || entries.length < 5) {
      return [];
    }

    const entriesText = entries
      .slice(0, 20)
      .map(
        (e, i) =>
          `Entry ${i + 1} (${e.created_at}):\nMood: ${
            e.moodScore
          }/5\n${e.enrichedTranscript?.substring(0, 300)}...\n`
      )
      .join("\n---\n");

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Analyze these journal entries and identify deep patterns, recurring themes, and growth opportunities. Provide 3-5 actionable insights.\n\nEntries:\n${entriesText}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "array",
          items: {
            type: "object",
            properties: {
              insight: { type: "string" },
              category: { type: "string" },
              supportingEvidence: {
                type: "array",
                items: { type: "string" },
              },
              suggestion: { type: "string" },
              impactLevel: {
                type: "string",
                enum: ["high", "medium", "low"],
              },
            },
            required: [
              "insight",
              "category",
              "supportingEvidence",
              "suggestion",
              "impactLevel",
            ],
          },
        },
      },
    });

    if (!response.text) return [];
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error generating growth insights:", error);
    return [];
  }
};

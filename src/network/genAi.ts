import { FetchWeekEntriesType } from "@/hooks/data/useWeeklyAISummaries";
import { Enums } from "@/types/types";
import { GoogleGenAI } from "@google/genai";
import { getMoodScore } from "../utils/mood";

export type FeelingsType = {
  name: string;
  emoji: string;
  colorsGradient: string[];
  intensity: number;
};

export type InsightsType = {
  moodScore: number | null;
  suggestedTags: string[] | null;
  growthAreas: string[] | null;
  positiveInsights: string[] | null;
  summary: string | null;
  mainEmoji: Enums<"mood"> | null;
  feelings: FeelingsType[] | null;
  title: string | null;
  enrichedTranscript: string | null;
  aiInsights: string | null;
  created_at: string | null;
  // Enhanced insights for analytics
  energyLevel: number | null; // 1-5: Physical energy/fatigue level
  stressLevel: number | null; // 1-5: Stress intensity
  socialConnection: number | null; // 1-5: Quality of social interactions
  triggers: string[] | null; // Identified mood triggers (positive or negative)
  copingStrategies: string[] | null; // Coping mechanisms used
  physicalSymptoms: string[] | null; // Physical health mentions
  sleepQuality: number | null; // 1-5: Sleep quality if mentioned
  goals: string[] | null; // Goals or intentions mentioned
  worries: string[] | null; // Recurring worries or anxieties
  achievements: string[] | null; // Wins and accomplishments
};

const ai = new GoogleGenAI({
  apiKey: "AIzaSyBKfv2gvLQIyHatEFiAjNSm1p1jmXepCSY",
});

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
  entries: FetchWeekEntriesType
): Promise<AIRecommendation[]> => {
  try {
    if (!entries || entries.length === 0) {
      return [];
    }

    const entriesText = entries
      .map(
        (e, i) =>
          `Entry ${i + 1} (${e.selected_date}):\nMood: ${
            e.moods?.main_mood
          }/5\n${e.transcripts}\n`
      )
      .join("\n---\n");
      console.log("entriesentries", entriesText);

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

    console.log("response", response);
    if (!response.text) return [];
    return JSON.parse(response.text);
  } catch (error) {
    console.log("error generateAIRecommendations", error);
    return [];
  }
};

/**
 * Generate weekly summary from journal entries
 */
export const generateWeeklySummary = async (
  entries: FetchWeekEntriesType,
  weekStart: string,
  weekEnd: string
): Promise<WeeklySummary | null> => {
  try {
    if (!entries || entries.length === 0) {
      return null;
    }

    const entriesText = entries
      .map(
        (e, i) =>
          `Entry ${i + 1} (${e.selected_date}):\nMood: ${
            e.moods?.main_mood
          }/5\n${e.transcripts}\n`
      )
      .join("\n---\n");

    const avgMood =
      entries.reduce(
        (sum, e) => sum + (getMoodScore(e.moods?.main_mood || "fine") || 0),
        0
      ) / entries.length;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Generate a comprehensive weekly summary for the week of ${weekStart} to ${weekEnd}. The user made ${
        entries.length
      } entries with an average mood of ${avgMood.toFixed(
        1
      )}/5 and \n\nEntries:\n${entriesText}\n\nIMPORTANT: Perform these advanced analyses:\n\n1.
       EMOTIONAL DIMENSIONS (8 emotions, 0-100 scale):\n- Joy, Gratitude, Confidence, Peace (positive)\n- Anxiety, Sadness, Anger, Fear (challenging)\nScore each based on presence in entries.\n\n
       2. EMOTIONAL VOLATILITY ANALYSIS:\nFor each day with entries, calculate:\n- Volatility score (0-100): how much emotions fluctuated\n- Number of mood swings\n- Emotional range (difference between highest/lowest)\n- Stability level and triggers\n\n
       3. COGNITIVE PATTERN FLOW:\nIdentify thought patterns and their connections:\n- How one emotion/thought leads to another\n- Pattern strength and frequency\n- Whether patterns are positive/negative\n\n
       4. LIFE DOMAIN BALANCE (score 0-100 each):\n- Work/Career\n- Relationships/Family\n- Health/Wellness\n- Personal Growth\n- Recreation/Hobbies\n- Spirituality/Purpose\nIdentify which domains need attention.\n\nProvide specific, actionable insights for each analysis.`,
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
    };
  } catch (error) {
    return null;
  }
};

/**
 * Detect patterns and generate deep growth insights
 */
export const generateGrowthInsights = async (
  entries: FetchWeekEntriesType
): Promise<GrowthInsight[]> => {
  try {
    if (!entries || entries.length < 5) {
      return [];
    }

    const entriesText = entries
      .slice(0, 20)
      .map(
        (e, i) =>
          `Entry ${i + 1} (${e.selected_date}):\nMood: ${
            e.moods?.main_mood
          }/5\n${e.transcripts?.substring(0, 300)}...\n`
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
    return [];
  }
};

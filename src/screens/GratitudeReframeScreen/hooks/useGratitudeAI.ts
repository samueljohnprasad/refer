import { useState, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import type { EmotionName } from '../../ThoughtReframingScreen/types';
import {
  getPromptsForMood,
  type GratitudePromptOption,
} from '../data/gratitudePrompts';

// ─── Types ───────────────────────────────────────────────────────────

export interface AIGratitudePrompt {
  text: string;
  category: string;
}

interface UseGratitudeAIReturn {
  /** AI-generated prompts (3 max) */
  aiPrompts: AIGratitudePrompt[];
  /** Whether the AI is currently generating */
  isGenerating: boolean;
  /** Generate prompts based on mood */
  generatePrompts: (mood: EmotionName, intensity: number) => Promise<void>;
  /** Clear AI state */
  clearPrompts: () => void;
}

// ─── Gemini Client ───────────────────────────────────────────────────
const ai = new GoogleGenAI({
  apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY!,
});

// ─── Hook ────────────────────────────────────────────────────────────

export const useGratitudeAI = (): UseGratitudeAIReturn => {
  const [aiPrompts, setAiPrompts] = useState<AIGratitudePrompt[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const generatePrompts = useCallback(
    async (mood: EmotionName, intensity: number): Promise<void> => {
      setIsGenerating(true);
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `You are a warm, empathetic CBT therapist assistant. The user is currently feeling "${mood}" at an intensity of ${intensity}/10.

Generate 3 personalised gratitude prompts that would help this person shift their focus toward things they can appreciate RIGHT NOW. 

Guidelines:
- Each prompt should be a gentle question (not a command)
- Make them specific and easy to answer (not "what are you grateful for" — too broad)
- Tailor prompts to counter the specific emotion (e.g., for "anxious" → focus on safety and stability; for "sad" → focus on warmth and connection)
- Keep each under 20 words
- Assign a category: "moments", "people", "health", "environment", "resilience", or "self"`,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  text: { type: 'string' },
                  category: {
                    type: 'string',
                    enum: ['moments', 'people', 'health', 'environment', 'resilience', 'self'],
                  },
                },
                required: ['text', 'category'],
              },
            },
          },
        });

        if (response.text) {
          const parsed: AIGratitudePrompt[] = JSON.parse(response.text);
          setAiPrompts(parsed.slice(0, 3));
        }
      } catch (error) {
        console.error('AI gratitude prompt generation failed:', error);
        // Fallback to mood-specific static prompts
        const fallbacks: GratitudePromptOption[] = getPromptsForMood(mood);
        setAiPrompts(
          fallbacks.map((p) => ({ text: p.text, category: p.category }))
        );
      } finally {
        setIsGenerating(false);
      }
    },
    []
  );

  const clearPrompts = useCallback((): void => {
    setAiPrompts([]);
  }, []);

  return {
    aiPrompts,
    isGenerating,
    generatePrompts,
    clearPrompts,
  };
};

import { useState, useCallback } from 'react';
import { generateObject, jsonSchema } from 'ai';
import { useActiveModel } from '@/src/hooks/useActiveModel';
import type {
  EmotionName,
  CognitiveDistortionKey,
} from '../types';

// ─── Types ───────────────────────────────────────────────────────────

export interface AIDistortionSuggestion {
  key: CognitiveDistortionKey;
  confidence: number; // 0–1
  explanation: string;
}

export interface AIEmotionSuggestion {
  name: EmotionName;
  suggestedIntensity: number; // 0–10
}

export interface AIBalancedThoughtSuggestion {
  text: string;
  rationale: string;
}

interface ThoughtReframingAIState {
  suggestedDistortions: AIDistortionSuggestion[];
  suggestedEmotions: AIEmotionSuggestion[];
  suggestedBalancedThoughts: AIBalancedThoughtSuggestion[];
  isDetectingDistortions: boolean;
  isDetectingEmotions: boolean;
  isSuggestingBalanced: boolean;
  downloadProgress: number;
}

// ─── Hook ────────────────────────────────────────────────────────────

export function useThoughtReframingAI(): ThoughtReframingAIState & {
  detectDistortions: (automaticThought: string, situation: string) => Promise<void>;
  detectEmotions: (automaticThought: string, situation: string) => Promise<void>;
  suggestBalancedThoughts: (
    automaticThought: string,
    situation: string,
    evidenceFor: string[],
    evidenceAgainst: string[]
  ) => Promise<void>;
  clearSuggestions: () => void;
} {
  const [suggestedDistortions, setSuggestedDistortions] = useState<AIDistortionSuggestion[]>([]);
  const [suggestedEmotions, setSuggestedEmotions] = useState<AIEmotionSuggestion[]>([]);
  const [suggestedBalancedThoughts, setSuggestedBalancedThoughts] = useState<AIBalancedThoughtSuggestion[]>([]);
  const [isDetectingDistortions, setIsDetectingDistortions] = useState<boolean>(false);
  const [isDetectingEmotions, setIsDetectingEmotions] = useState<boolean>(false);
  const [isSuggestingBalanced, setIsSuggestingBalanced] = useState<boolean>(false);

  const { getActiveModel, getStructuredPrompt, downloadProgress } = useActiveModel();

  // ─── Detect Cognitive Distortions ────────────────────────────────

  const detectDistortions = useCallback(
    async (automaticThought: string, situation: string): Promise<void> => {
      if (!automaticThought?.trim()) return;
      setIsDetectingDistortions(true);
      try {
        const model = await getActiveModel();
        const basePrompt = `You are a CBT therapist assistant. Given the situation and automatic thought below, identify which cognitive distortions are present.

Situation: "${situation}"
Automatic thought: "${automaticThought}"

Identify up to 2 cognitive distortions from this list ONLY:
all_or_nothing, catastrophizing, mind_reading, overgeneralizing, personalizing, filtering, should_statements, fortune_telling, emotional_reasoning, labeling

For each, provide the key, a confidence score (0-1), and a brief explanation of why this distortion applies.`;

        const { object } = await generateObject({
          model,
          prompt: getStructuredPrompt(basePrompt),
          schema: jsonSchema({
            type: 'array',
            items: {
              type: 'object',
              properties: {
                key: {
                  type: 'string',
                  enum: [
                    'all_or_nothing',
                    'catastrophizing',
                    'mind_reading',
                    'overgeneralizing',
                    'personalizing',
                    'filtering',
                    'should_statements',
                    'fortune_telling',
                    'emotional_reasoning',
                    'labeling',
                  ],
                },
                confidence: { type: 'number' },
                explanation: { type: 'string' },
              },
              required: ['key', 'confidence', 'explanation'],
            },
          }),
        });

        const parsed = object as AIDistortionSuggestion[];
        setSuggestedDistortions(parsed.slice(0, 2));
      } catch (error) {
        console.error('AI distortion detection failed:', error);
        setSuggestedDistortions([]);
      } finally {
        setIsDetectingDistortions(false);
      }
    },
    [getActiveModel, getStructuredPrompt]
  );

  // ─── Detect Emotions ─────────────────────────────────────────────

  const detectEmotions = useCallback(
    async (automaticThought: string, situation: string): Promise<void> => {
      if (!automaticThought?.trim()) return;
      setIsDetectingEmotions(true);
      try {
        const model = await getActiveModel();
        const basePrompt = `You are a CBT therapist assistant. Given the situation and automatic thought below, identify the likely emotions the person is feeling.

Situation: "${situation}"
Automatic thought: "${automaticThought}"

Pick up to 3 emotions from this list ONLY: anxious, sad, angry, fearful, guilty, ashamed, frustrated, hopeless, overwhelmed, lonely

For each, estimate an intensity from 0-10.`;

        const { object } = await generateObject({
          model,
          prompt: getStructuredPrompt(basePrompt),
          schema: jsonSchema({
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  enum: [
                    'anxious',
                    'sad',
                    'angry',
                    'fearful',
                    'guilty',
                    'ashamed',
                    'frustrated',
                    'hopeless',
                    'overwhelmed',
                    'lonely',
                  ],
                },
                suggestedIntensity: { type: 'number' },
              },
              required: ['name', 'suggestedIntensity'],
            },
          }),
        });

        const parsed = object as AIEmotionSuggestion[];
        setSuggestedEmotions(parsed.slice(0, 3));
      } catch (error) {
        console.error('AI emotion detection failed:', error);
        setSuggestedEmotions([]);
      } finally {
        setIsDetectingEmotions(false);
      }
    },
    [getActiveModel, getStructuredPrompt]
  );

  // ─── Suggest Balanced Thoughts ───────────────────────────────────

  const suggestBalancedThoughts = useCallback(
    async (
      automaticThought: string,
      situation: string,
      evidenceFor: string[],
      evidenceAgainst: string[]
    ): Promise<void> => {
      if (!automaticThought?.trim()) return;
      setIsSuggestingBalanced(true);
      try {
        const model = await getActiveModel();
        const evidenceForText =
          evidenceFor.length > 0
            ? evidenceFor.map((e, i) => `${i + 1}. ${e}`).join('\n')
            : 'None provided';
        const evidenceAgainstText =
          evidenceAgainst.length > 0
            ? evidenceAgainst.map((e, i) => `${i + 1}. ${e}`).join('\n')
            : 'None provided';

        const basePrompt = `You are a CBT therapist assistant. Help the user reframe their automatic thought into a more balanced perspective.

Situation: "${situation}"
Automatic thought: "${automaticThought}"

Evidence supporting the thought:
${evidenceForText}

Evidence against the thought:
${evidenceAgainstText}

Generate 3 alternative balanced thoughts. Each should be:
- Realistic and fair (not overly positive)
- Based on the evidence provided
- Written in first person
- Concise (1-2 sentences)

For each, provide a brief rationale explaining why it's more balanced.`;

        const { object } = await generateObject({
          model,
          prompt: getStructuredPrompt(basePrompt),
          schema: jsonSchema({
            type: 'array',
            items: {
              type: 'object',
              properties: {
                text: { type: 'string' },
                rationale: { type: 'string' },
              },
              required: ['text', 'rationale'],
            },
          }),
        });

        const parsed = object as AIBalancedThoughtSuggestion[];
        setSuggestedBalancedThoughts(parsed.slice(0, 3));
      } catch (error) {
        console.error('AI balanced thought suggestion failed:', error);
        setSuggestedBalancedThoughts([]);
      } finally {
        setIsSuggestingBalanced(false);
      }
    },
    [getActiveModel, getStructuredPrompt]
  );

  // ─── Clear ───────────────────────────────────────────────────────

  const clearSuggestions = useCallback((): void => {
    setSuggestedDistortions([]);
    setSuggestedEmotions([]);
    setSuggestedBalancedThoughts([]);
  }, []);

  return {
    suggestedDistortions,
    suggestedEmotions,
    suggestedBalancedThoughts,
    isDetectingDistortions,
    isDetectingEmotions,
    isSuggestingBalanced,
    downloadProgress,
    detectDistortions,
    detectEmotions,
    suggestBalancedThoughts,
    clearSuggestions,
  };
}

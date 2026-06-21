/**
 * useThoughtReframingAI — AI Suggestions for Thought Reframing Exercise
 *
 * Provides three AI capabilities:
 * 1. Detect cognitive distortions from an automatic thought
 * 2. Detect likely emotions from the situation
 * 3. Suggest balanced alternative thoughts
 *
 * Uses the centralized `useLocalAI` hook for structured generation —
 * automatically selects Apple AI or local LLM based on device capability
 * and handles timeouts and aborts.
 */

import { useState, useCallback } from 'react';
import { useLocalAI } from '@/src/hooks/useAppleIntelligence';
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

// ─── Schemas ─────────────────────────────────────────────────────────

const DISTORTION_SCHEMA: Record<string, unknown> = {
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
};

const EMOTION_SCHEMA: Record<string, unknown> = {
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
};

const BALANCED_THOUGHT_SCHEMA: Record<string, unknown> = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      text: { type: 'string' },
      rationale: { type: 'string' },
    },
    required: ['text', 'rationale'],
  },
};

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

  const ai = useLocalAI();

  // ─── Detect Cognitive Distortions ────────────────────────────────

  const detectDistortions = useCallback(
    async (automaticThought: string, situation: string): Promise<void> => {
      if (!automaticThought?.trim()) return;
      setIsDetectingDistortions(true);
      let prompt = '';
      try {
        prompt = `You are a CBT therapist assistant. Given the situation and automatic thought below, identify which cognitive distortions are present.

Situation: "${situation}"
Automatic thought: "${automaticThought}"

Identify up to 2 cognitive distortions from this list ONLY:
all_or_nothing, catastrophizing, mind_reading, overgeneralizing, personalizing, filtering, should_statements, fortune_telling, emotional_reasoning, labeling

For each, provide the key, a confidence score (0-1), and a brief explanation of why this distortion applies.`;

        const items = await ai.generateStructured<AIDistortionSuggestion>({
          prompt,
          responseSchema: DISTORTION_SCHEMA,
          maxResults: 2,
        });

        if (items.length > 0) {
          setSuggestedDistortions(items);
        }
      } catch (error) {
        console.error('AI distortion detection failed:', error, '\nPrompt:', prompt);
        setSuggestedDistortions([]);
      } finally {
        setIsDetectingDistortions(false);
      }
    },
    [ai]
  );

  // ─── Detect Emotions ─────────────────────────────────────────────

  const detectEmotions = useCallback(
    async (automaticThought: string, situation: string): Promise<void> => {
      if (!automaticThought?.trim()) return;
      setIsDetectingEmotions(true);
      let prompt = '';
      try {
        prompt = `You are a CBT therapist assistant. Given the situation and automatic thought below, identify the likely emotions the person is feeling.

Situation: "${situation}"
Automatic thought: "${automaticThought}"

Pick up to 3 emotions from this list ONLY: anxious, sad, angry, fearful, guilty, ashamed, frustrated, hopeless, overwhelmed, lonely

For each, estimate an intensity from 0-10.`;

        const items = await ai.generateStructured<AIEmotionSuggestion>({
          prompt,
          responseSchema: EMOTION_SCHEMA,
          maxResults: 3,
        });

        if (items.length > 0) {
          setSuggestedEmotions(items);
        }
      } catch (error) {
        console.error('AI emotion detection failed:', error, '\nPrompt:', prompt);
        setSuggestedEmotions([]);
      } finally {
        setIsDetectingEmotions(false);
      }
    },
    [ai]
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
      let prompt = '';
      try {
        const evidenceForText: string =
          evidenceFor.length > 0
            ? evidenceFor.map((e: string, i: number) => `${i + 1}. ${e}`).join('\n')
            : 'None provided';
        const evidenceAgainstText: string =
          evidenceAgainst.length > 0
            ? evidenceAgainst.map((e: string, i: number) => `${i + 1}. ${e}`).join('\n')
            : 'None provided';

        prompt = `You are a CBT therapist assistant. Help the user reframe their automatic thought into a more balanced perspective.

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

        const items = await ai.generateStructured<AIBalancedThoughtSuggestion>({
          prompt,
          responseSchema: BALANCED_THOUGHT_SCHEMA,
          maxResults: 3,
        });

        if (items.length > 0) {
          setSuggestedBalancedThoughts(items);
        }
      } catch (error) {
        console.error('AI balanced thought suggestion failed:', error, '\nPrompt:', prompt);
        setSuggestedBalancedThoughts([]);
      } finally {
        setIsSuggestingBalanced(false);
      }
    },
    [ai]
  );

  // ─── Clear ───────────────────────────────────────────────────────

  const clearSuggestions = useCallback((): void => {
    setSuggestedDistortions([]);
    setSuggestedEmotions([]);
    setSuggestedBalancedThoughts([]);
    ai.reset(); // Clear any pending ai state/requests
  }, [ai]);

  return {
    suggestedDistortions,
    suggestedEmotions,
    suggestedBalancedThoughts,
    isDetectingDistortions,
    isDetectingEmotions,
    isSuggestingBalanced,
    downloadProgress: ai.downloadProgress,
    detectDistortions,
    detectEmotions,
    suggestBalancedThoughts,
    clearSuggestions,
  };
}

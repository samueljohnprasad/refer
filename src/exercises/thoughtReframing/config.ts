import type {
  ExerciseConfig,
  ThoughtReframingResponse,
} from "@/src/types/exerciseFlow";
import { createStep } from "@/src/components/exercise/steps/createStep";
import { createDynamicSummaryStep } from "@/src/components/exercise/steps/createDynamicSummaryStep";
import { IntroStep } from "@/src/components/exercise/steps/IntroStep";
import { SliderStep } from "@/src/components/exercise/steps/SliderStep";
import {
  TRSituationStep,
  TRAutomaticThoughtStep,
  TREmotionsStep,
  TRDistortionsStep,
  TREvidenceForStep,
  TREvidenceAgainstStep,
  TRBalancedThoughtStep,
} from "./customSteps";

export const THOUGHT_REFRAMING_INITIAL: ThoughtReframingResponse = {
  situation: "",
  automaticThought: "",
  selectedEmotions: [],
  selectedDistortions: [],
  evidenceFor: [],
  evidenceAgainst: [],
  balancedThought: "",
  intensity: 50,
  postIntensity: undefined,
};

export const thoughtReframingConfig: ExerciseConfig<ThoughtReframingResponse> =
  {
    type: "thought_reframing",
    category: "cbt_core",
    title: "Thought Reframing",
    subtitle: "Challenge and reframe negative thoughts",
    icon: "thought_reframing",
    duration: "10-15 min",
    xp: 15,
    backgroundColor: "#fff",
    schemaVersion: 2,
    initialResponse: THOUGHT_REFRAMING_INITIAL,
    migrate: (old, fromVersion) => {
      if (fromVersion < 2) {
        return {
          ...THOUGHT_REFRAMING_INITIAL,
          ...old,
          postIntensity: undefined,
        };
      }
      return old;
    },

    steps: [
      {
        id: "intro",
        component: createStep(IntroStep, {
          title: "Thought Reframing",
          subtitle:
            "Challenge negative thinking patterns and build healthier perspectives.",
          exerciseType: "thought_reframing",
          duration: "10-15 min",
          bulletPoints: [
            "Describe the triggering situation",
            "Catch your automatic thought",
            "Identify cognitive distortions",
            "Weigh the evidence for and against",
            "Create a balanced thought",
          ],
        }),
        label: "Welcome",
        validate: () => true,
        excludeFromProgress: true,
        hideHeader: true,
        nextLabel: "Let's Go",
      },
      {
        id: "situation",
        component: TRSituationStep,
        label: "Describe the situation",
        validate: (r) => r.situation.trim().length >= 5,
        ai: {
          promptBuilder: (r, context) =>
            `You are a CBT therapist assistant. Generate 3 common, relatable everyday situations that often trigger negative automatic thoughts or anxiety. Keep them brief (1 sentence), realistic, and in the first person ("I...").\n\nRandom seed: ${context?.seed ?? Math.random()}`,
          responseSchema: {
            type: "array",
            items: {
              type: "object",
              properties: { text: { type: "string" } },
              required: ["text"],
            },
          },
          maxResults: 3,
        },
      },
      {
        id: "automatic_thought",
        component: TRAutomaticThoughtStep,
        label: "What was the automatic thought?",
        validate: (r) => r.automaticThought.trim().length >= 5,
        ai: {
          promptBuilder: (r) =>
            `You are a CBT therapist assistant. Based on this situation:\n"${r.situation}"\n\nGenerate 3 likely automatic negative thoughts the user might have had. Keep them in the first person ("I...", "They..."), brief (1 sentence), and realistic.`,
          responseSchema: {
            type: "array",
            items: {
              type: "object",
              properties: { text: { type: "string" } },
              required: ["text"],
            },
          },
          maxResults: 3,
        },
      },
      {
        id: "intensity",
        component: createStep(SliderStep, {
          title: "Thought Intensity",
          subtitle: "How strongly do you believe this thought right now?",
          fieldKey: "intensity",
          min: 0,
          max: 100,
          minLabel: "Not at all",
          maxLabel: "Completely",
          unit: "%",
        }),
        label: "How strongly do you believe this thought?",
        validate: () => true,
      },
      {
        id: "emotions",
        component: TREmotionsStep,
        label: "Select emotions (max 3)",
        validate: (r) => r.selectedEmotions.length >= 1,
        ai: {
          promptBuilder: (r) =>
            `You are a CBT therapist assistant. Given the situation and automatic thought below, identify the likely emotions the person is feeling.\n\nSituation: "${r.situation}"\nAutomatic thought: "${r.automaticThought}"\n\nPick up to 3 emotions from this list ONLY: anxious, sad, angry, fearful, guilty, ashamed, frustrated, hopeless, overwhelmed, lonely\n\nFor each, estimate an intensity from 0-10.`,
          responseSchema: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  enum: [
                    "anxious",
                    "sad",
                    "angry",
                    "fearful",
                    "guilty",
                    "ashamed",
                    "frustrated",
                    "hopeless",
                    "overwhelmed",
                    "lonely",
                  ],
                },
                suggestedIntensity: { type: "number" },
              },
              required: ["name", "suggestedIntensity"],
            },
          },
          maxResults: 3,
        },
      },
      {
        id: "distortions",
        component: TRDistortionsStep,
        label: "Identify cognitive distortions (max 2)",
        validate: (r) => r.selectedDistortions.length >= 1,
        ai: {
          promptBuilder: (r) =>
            `You are a CBT therapist assistant. Given the situation and automatic thought below, identify which cognitive distortions are present.\n\nSituation: "${r.situation}"\nAutomatic thought: "${r.automaticThought}"\n\nIdentify up to 2 cognitive distortions from this list ONLY:\nall_or_nothing, catastrophizing, mind_reading, overgeneralizing, personalizing, filtering, should_statements, fortune_telling, emotional_reasoning, labeling\n\nFor each, provide the key, a confidence score (0-1), and a brief explanation.`,
          responseSchema: {
            type: "array",
            items: {
              type: "object",
              properties: {
                key: {
                  type: "string",
                  enum: [
                    "all_or_nothing",
                    "catastrophizing",
                    "mind_reading",
                    "overgeneralizing",
                    "personalizing",
                    "filtering",
                    "should_statements",
                    "fortune_telling",
                    "emotional_reasoning",
                    "labeling",
                  ],
                },
                confidence: { type: "number" },
                explanation: { type: "string" },
              },
              required: ["key", "confidence", "explanation"],
            },
          },
          maxResults: 2,
        },
      },
      {
        id: "evidence_for",
        component: TREvidenceForStep,
        label: "Evidence supporting this thought",
        validate: () => true,
        ai: {
          promptBuilder: (r) =>
            `You are a CBT therapist assistant. Given the situation and automatic thought below, identify some likely "evidence" the user might think supports this thought. Even if flawed, what facts might they be pointing to?\n\nSituation: "${r.situation}"\nAutomatic thought: "${r.automaticThought}"\n\nProvide 3 plausible pieces of evidence FOR the thought. Keep them brief.`,
          responseSchema: {
            type: "array",
            items: {
              type: "object",
              properties: { text: { type: "string" } },
              required: ["text"],
            },
          },
          maxResults: 3,
        },
      },
      {
        id: "evidence_against",
        component: TREvidenceAgainstStep,
        label: "Evidence against this thought",
        validate: () => true,
        ai: {
          promptBuilder: (r) =>
            `You are a CBT therapist assistant. Given the situation and automatic thought below, identify objective evidence AGAINST this thought. What facts contradict it?\n\nSituation: "${r.situation}"\nAutomatic thought: "${r.automaticThought}"\n\nProvide 3 plausible pieces of counter-evidence. Keep them objective and brief.`,
          responseSchema: {
            type: "array",
            items: {
              type: "object",
              properties: { text: { type: "string" } },
              required: ["text"],
            },
          },
          maxResults: 3,
        },
      },
      {
        id: "balanced_thought",
        component: TRBalancedThoughtStep,
        label: "Write a balanced thought",
        validate: (r) => r.balancedThought.trim().length >= 5,
        ai: {
          promptBuilder: (r) => {
            const ef =
              r.evidenceFor.length > 0
                ? r.evidenceFor.map((e, i) => `${i + 1}. ${e}`).join("\n")
                : "None provided";
            const ea =
              r.evidenceAgainst.length > 0
                ? r.evidenceAgainst.map((e, i) => `${i + 1}. ${e}`).join("\n")
                : "None provided";
            return `You are a CBT therapist assistant. Help the user reframe their automatic thought into a more balanced perspective.\n\nSituation: "${r.situation}"\nAutomatic thought: "${r.automaticThought}"\n\nEvidence supporting the thought:\n${ef}\n\nEvidence against the thought:\n${ea}\n\nGenerate 3 alternative balanced thoughts. Each should be realistic, based on evidence, written in first person, and concise (1-2 sentences). For each, provide a brief rationale.`;
          },
          responseSchema: {
            type: "array",
            items: {
              type: "object",
              properties: {
                text: { type: "string" },
                rationale: { type: "string" },
              },
              required: ["text", "rationale"],
            },
          },
          maxResults: 3,
        },
      },
      {
        id: "re_evaluate",
        component: createStep(SliderStep, {
          title: "Re-evaluate",
          subtitle:
            "After reframing, how much do you believe the original thought?",
          fieldKey: "postIntensity",
          psychoeducationText:
            "After reframing, your belief score often drops. That shift is real — it means your rational mind just got louder.",
          min: 0,
          max: 100,
          minLabel: "Not at all",
          maxLabel: "Completely",
          unit: "%",
        }),
        label: "Re-evaluate your belief",
        validate: () => true,
      },
      {
        id: "summary",
        component: createDynamicSummaryStep({
          title: "Thought reframed!",
          celebrationEmoji: "✨",
          exerciseType: "thought_reframing",
          preScoreKey: "intensity",
          postScoreKey: "postIntensity",
          scoreLabel: "Belief intensity",
          scoreMax: 100,
          keyTakeawayKey: "balancedThought",
          keyTakeawayLabel: "Your balanced thought",
        }),
        label: "Summary",
        validate: () => true,
        excludeFromProgress: true,
        hideHeader: true,
        nextLabel: "Complete",
        secondaryLabel: "Edit answers",
      },
    ],
  };

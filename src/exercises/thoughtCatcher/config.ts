import type {
  ExerciseConfig,
  ThoughtCatcherResponse,
} from "@/src/types/exerciseFlow";
import { createStep } from "@/src/components/exercise/steps/createStep";
import {
  ThoughtCatcherCheckpointSummary,
  ThoughtCatcherSummary,
} from "./ThoughtCatcherSummary";
import { IntroStep } from "@/src/components/exercise/steps/IntroStep";
import {MultiTextInputStep } from "@/src/components/exercise/steps/MultiTextInputStep";
import { SliderStep } from "@/src/components/exercise/steps/SliderStep";
import { ChoiceStep } from "@/src/components/exercise/steps/ChoiceStep";

export const THOUGHT_CATCHER_INITIAL: ThoughtCatcherResponse = {
  situation: "",
  automaticThought: "",
  intensity: 5,
  postIntensity: undefined,
  isTrue: null,
  balancedThought: "",
};

function normalizeBeliefScore(value: number | undefined): number | undefined {
  if (typeof value !== "number") return undefined;
  if (value > 10) {
    return Math.min(Math.max(Math.round(value / 10), 0), 10);
  }
  return Math.min(Math.max(Math.round(value), 0), 10);
}

export const thoughtCatcherConfig: ExerciseConfig<ThoughtCatcherResponse> = {
  type: "thought_catcher",
  category: "cbt_core",
  title: "Thought Catcher",
  subtitle: "Catch and examine your automatic thoughts",
  icon: "thought_catcher",
  duration: "3-5 min",
  xp: 10,
  backgroundColor: "#fff",
  schemaVersion: 4,
  initialResponse: THOUGHT_CATCHER_INITIAL,
  migrate: (old, fromVersion) => {
    const migrated = {
      ...THOUGHT_CATCHER_INITIAL,
      ...old,
    };

    if (fromVersion < 4) {
      migrated.intensity =
        normalizeBeliefScore(migrated.intensity) ??
        THOUGHT_CATCHER_INITIAL.intensity;
      migrated.postIntensity = normalizeBeliefScore(migrated.postIntensity);
    }

    return migrated;
  },

  steps: [
    {
      id: "intro",
      component: createStep(IntroStep, {
        title: "Thought Catcher",
        subtitle:
          "Notice a stressful thought? Let's catch it and look at it clearly.",
        exerciseType: "thought_catcher",
        duration: "3-5 min",
        bulletPoints: [
          "Describe the situation",
          "Catch your automatic thought",
          "Rate its intensity",
          "Check if it's true",
          "Find a balanced perspective",
        ],
      }),
      label: "Welcome",
      validate: () => true,
      excludeFromProgress: true,
    },
    {
      id: "situation",
      component: createStep(MultiTextInputStep, {
        maxItems: 1,
        title: "What happened?",
        subtitle: "Start with the moment, not what it meant.",
        fieldKey: "situation",
        placeholder: "What happened...",
        composerMinHeight: 100,
        requirementText: "Write a few words to continue.",
        statusText: "This stays with what happened.",
        showVoice: true,
        alwaysShowVoice: true,
        showStepCount: false,
        tipText:
          "Write what a camera could have seen or heard.",
        validationMessage:
          "That sounds like it was a lot. Let's look at this thought together.",
      }),
      label: "Describe the situation",
      validate: (r) => r.situation.trim().length >= 1,
      ai: {
        promptBuilder: (r, context) => {
          const seed = context?.seed ?? Math.random();
          const themes = [
            "work or career",
            "family or relationships",
            "personal goals or mistakes",
            "social situations",
            "health or daily stress",
            "imposter syndrome",
            "feeling overwhelmed",
          ];
          
          // Deterministic shuffle based on seed
          const shuffledThemes = [...themes].sort((a, b) => {
             const hashA = (a.charCodeAt(0) * seed) % 1;
             const hashB = (b.charCodeAt(0) * seed) % 1;
             return hashA - hashB;
          });
          const randomThemes = shuffledThemes.slice(0, 2);
          
          return `You are a CBT therapist assistant helping someone describe a real stressful situation for a CBT thought record. Generate 2 grounded examples. Theme 1: ${randomThemes[0]}. Theme 2: ${randomThemes[1]}. Each example must be plausible, emotionally specific, and observable by a camera or witness. Avoid absurd object-buying/object-seeing scenarios. Keep each example to one concise first-person sentence. Provide a relevant emoji for each.`;
        },
        responseSchema: {
          type: "array",
          items: {
            type: "object",
            properties: {
              text: { type: "string" },
              emoji: { type: "string" },
            },
            required: ["text", "emoji"],
          },
        },
        maxResults: 2,
        aiLoadingMessage: "Finding relatable situations...",
      },
    },
    {
      id: "automatic_thought",
      component: createStep(MultiTextInputStep, {
        maxItems: 1,
        title: "Automatic thought",
        subtitle: "Write the sentence your mind added.",
        fieldKey: "automaticThought",
        placeholder: "The thought that showed up",
        composerMinHeight: 100,
        requirementText: "Write a few words to continue.",
        statusText: "Enough to check.",
        showVoice: true,
        alwaysShowVoice: true,
        showStepCount: false,
        tipText: "Keep the thought raw. You will test it next.",
        validationMessage:
          "It takes courage to write that down. Let's see what's really going on.",
      }),
      label: "What went through your mind?",
      validate: (r) => r.automaticThought.trim().length >= 1,
      ai: {
        promptBuilder: (r, context) => {
          const seed = context?.seed ?? Math.random();
          return `You are a CBT therapist assistant. The user just described a stressful situation: "${r.situation}". Generate 3 highly varied, distinct automatic negative thoughts they might be having right now (Random seed: ${seed}). Make them sound like natural, spontaneous human fears. Each thought should be written in first person and be concise (1 sentence).`;
        },
        responseSchema: {
          type: "array",
          items: {
            type: "object",
            properties: {
              text: { type: "string" },
            },
            required: ["text"],
          },
        },
        maxResults: 3,
        aiLoadingMessage: "Listening to your thoughts...",
      },
    },
    {
      id: "intensity",
      component: createStep(SliderStep, (props) => ({
        title: "How believable does it feel?",
        subtitle: "",
        fieldKey: "intensity",
        contextText: props.response?.automaticThought,
        min: 0,
        max: 10,
        minLabel: "Not true",
        midLabel: "Partly",
        maxLabel: "Completely",
        unit: "/10",
        showStepCount: false,
      })),
      label: "How true does the thought feel?",
      validate: () => true,
      nextLabel: "Use this for now",
    },
    {
      id: "catcher_summary",
      component: ThoughtCatcherCheckpointSummary,
      label: "Checkpoint summary",
      validate: () => true,
      next: (r) => {
        if (r.isTrue !== null && r.isTrue !== undefined) return "is_true";
        return undefined;
      },
    },
    {
      id: "is_true",
      component: createStep(ChoiceStep, {
        title: "Reality Check",
        subtitle: "Is this thought actually true?",
        fieldKey: "isTrue",
        autoAdvance: true,
        showStepCount: false,
        layoutVariant: "cbt_reflection" as const,
        options: [
          { value: "YES", label: "Yes", iconKey: "check" },
          { value: "NOT SURE", label: "Not Sure", iconKey: "question" },
          { value: "NO", label: "No", iconKey: "cross" },
        ],
      }),
      label: "Is this thought true?",
      validate: (r) => r.isTrue !== null && r.isTrue !== undefined,
      optional: true,
    },
    {
      id: "balanced_thought",
      component: createStep(MultiTextInputStep, (props) => ({
        title: "Balanced Thought",
        subtitle: "Rewrite the thought in a more balanced way.",
        fieldKey: "balancedThought",
        placeholder: "Write a fairer version of the thought.",
        composerMinHeight: 100,
        requirementText: "Add or revise your response to continue.",
        statusText: "This is enough to carry forward.",
        showVoice: true,
        alwaysShowVoice: true,
        showStepCount: false,
        referenceQuote: props.response?.automaticThought
          ? {
              label: "Automatic thought you caught",
              text: props.response.automaticThought,
            }
          : undefined,
      })),
      label: "Write a balanced thought",
      validate: (r) => (r.balancedThought ?? "").trim().length >= 1,
      optional: true,
      ai: {
        promptBuilder: (r) =>
          `You are a CBT therapist assistant. Help the user reframe their automatic thought into a more balanced perspective.\n\nSituation: "${r.situation}"\nAutomatic thought: "${r.automaticThought}"\n\nGenerate 3 alternative balanced thoughts. Each should be realistic, based on evidence, written in first person, and concise (1-2 sentences). For each, provide a brief rationale. CRITICAL: Write the rationale addressing the user directly in the second person (e.g., "This reminds you that..."). Do NOT use third-person language.`,
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
        aiLoadingMessage: "Reframing with Sage...",
      },
    },
    {
      id: "post_intensity",
      component: createStep(SliderStep, (props) => ({
        title: "How believable does it feel now?",
        subtitle: "",
        fieldKey: "postIntensity",
        contextText: props.response?.automaticThought,
        min: 0,
        max: 10,
        minLabel: "Not true",
        midLabel: "Partly",
        maxLabel: "Completely",
        unit: "/10",
        showStepCount: false,
      })),
      label: "How true does the thought feel now?",
      validate: () => true,
      optional: true,
      nextLabel: "Use this for now",
    },
    {
      id: "checker_summary",
      component: ThoughtCatcherSummary,
      label: "Final Summary",
      validate: () => true,
      excludeFromProgress: true,
      optional: true,
    },
  ],
};

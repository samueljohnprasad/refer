import type {
  ExerciseConfig,
  ThoughtCatcherResponse,
} from "@/src/types/exerciseFlow";
import { createStep } from "@/src/components/exercise/steps/createStep";
import { createSummaryStep } from "@/src/components/exercise/steps/createSummaryStep";
import { ThoughtCatcherSummary } from "./ThoughtCatcherSummary";
import { IntroStep } from "@/src/components/exercise/steps/IntroStep";
import { TextInputStep } from "@/src/components/exercise/steps/TextInputStep";
import { SliderStep } from "@/src/components/exercise/steps/SliderStep";
import { ChoiceStep } from "@/src/components/exercise/steps/ChoiceStep";

export const THOUGHT_CATCHER_INITIAL: ThoughtCatcherResponse = {
  situation: "",
  automaticThought: "",
  intensity: 50,
  postIntensity: undefined,
  isTrue: null,
  balancedThought: "",
};

const CatcherSummary = createSummaryStep<ThoughtCatcherResponse>(
  [
    { label: "Situation", key: "situation" },
    { label: "Automatic Thought", key: "automaticThought" },
    { label: "Intensity", key: "intensity" },
  ],
  { title: "Thought Caught!", exerciseType: "thought_catcher" },
);



export const thoughtCatcherConfig: ExerciseConfig<ThoughtCatcherResponse> = {
  type: "thought_catcher",
  category: "cbt_core",
  title: "Thought Catcher",
  subtitle: "Catch and examine your automatic thoughts",
  icon: "thought_catcher",
  duration: "3-5 min",
  xp: 10,
  backgroundColor: "#F8FAF7",
  schemaVersion: 2,
  initialResponse: THOUGHT_CATCHER_INITIAL,

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
      component: createStep(TextInputStep, {
        title: "The Situation",
        subtitle: "What was happening when the thought appeared?",
        fieldKey: "situation",
        placeholder: "e.g. I was at work and my boss called a meeting...",
        tipText:
          "Describe the event as factually as possible: who, what, where, when.",
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
          const randomThemes = shuffledThemes.slice(0, 3);
          
          return `You are a CBT therapist assistant. Generate 3 distinct, relatable stressful situations someone might want to analyze using CBT. Theme 1: ${randomThemes[0]}. Theme 2: ${randomThemes[1]}. Theme 3: ${randomThemes[2]}. Make them highly specific, highly varied, and completely different every time (Random seed: ${seed}). Keep each concise (1 short sentence) and written in the first person. Provide a relevant emoji for each.`;
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
        maxResults: 3,
        aiLoadingMessage: "Finding relatable situations...",
      },
    },
    {
      id: "automatic_thought",
      component: createStep(TextInputStep, {
        title: "Automatic Thought",
        subtitle: "What went through your mind?",
        fieldKey: "automaticThought",
        placeholder: "e.g. I'm going to get fired...",
        tipText: "Write the exact thought, even if it sounds irrational.",
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
      component: createStep(SliderStep, {
        title: "Thought Intensity",
        subtitle: "How strongly do you believe this thought right now?",
        fieldKey: "intensity",
        min: 1,
        max: 10,
        minLabel: "Not at all",
        maxLabel: "Completely",
        unit: "",
      }),
      label: "How intense is this thought?",
      validate: () => true,
    },
    {
      id: "catcher_summary",
      component: CatcherSummary,
      label: "Summary",
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
      component: createStep(TextInputStep, (props) => ({
        title: "Balanced Thought",
        subtitle: "Rewrite the thought in a more balanced way.",
        fieldKey: "balancedThought",
        placeholder:
          "e.g. The meeting could be about many things, not just me...",
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
        title: "Thought Intensity Now",
        subtitle: "How strongly do you believe this thought after checking it?",
        fieldKey: "postIntensity",
        min: 1,
        max: 10,
        minLabel: "Not at all",
        maxLabel: "Completely",
        anchorValue: props.response?.intensity,
        anchorLabel: "Initial distress",
      })),
      label: "How intense is the thought now?",
      validate: () => true,
      optional: true,
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

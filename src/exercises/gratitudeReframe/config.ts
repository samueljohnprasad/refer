import type {
  ExerciseConfig,
  GratitudeReframeResponse,
} from "@/src/types/exerciseFlow";
import { createStep } from "@/src/components/exercise/steps/createStep";
import { GratitudeReframeSummary } from "./GratitudeReframeSummary";
import { IntroStep } from "@/src/components/exercise/steps/IntroStep";
import { SliderStep } from "@/src/components/exercise/steps/SliderStep";
import { ChoiceStep } from "@/src/components/exercise/steps/ChoiceStep";
import { MultiTextInputStep } from "@/src/components/exercise/steps/MultiTextInputStep";
import { GRATITUDE_REFRAME_PROMPTS } from "./promptMetadata";

export const GRATITUDE_REFRAME_INITIAL: GratitudeReframeResponse = {
  currentMood: null,
  moodIntensity: 5,
  selectedPrompt: "",
  gratitudeEntries: [],
  finalMoodIntensity: 5,
};

function normalizeMoodScore(value: number | undefined): number | undefined {
  if (typeof value !== "number") return undefined;
  if (value > 10) return Math.min(Math.max(Math.round(value / 10), 0), 10);
  return Math.min(Math.max(Math.round(value), 0), 10);
}

export const gratitudeReframeConfig: ExerciseConfig<GratitudeReframeResponse> =
  {
    type: "gratitude_reframe",
    category: "cbt_core",
    title: "Gratitude Reframe",
    subtitle: "Shift your perspective with gratitude",
    icon: "gratitude_reframe",
    duration: "5-7 min",
    xp: 10,
    backgroundColor: "#fff",
    schemaVersion: 2,
    initialResponse: GRATITUDE_REFRAME_INITIAL,
    migrate: (old, fromVersion) => {
      const migrated = {
        ...GRATITUDE_REFRAME_INITIAL,
        ...old,
      };

      if (fromVersion < 2) {
        migrated.moodIntensity =
          normalizeMoodScore(migrated.moodIntensity) ??
          GRATITUDE_REFRAME_INITIAL.moodIntensity;
        migrated.finalMoodIntensity =
          normalizeMoodScore(migrated.finalMoodIntensity) ??
          GRATITUDE_REFRAME_INITIAL.finalMoodIntensity;
      }

      return migrated;
    },

    steps: [
      {
        id: "intro",
        component: createStep(IntroStep, {
          title: "Gratitude Reframe",
          subtitle: "Shift your focus toward what's good in your life.",
          exerciseType: "gratitude_reframe",
          duration: "5-7 min",
          bulletPoints: [
            "Check in with your current mood",
            "Find a prompt that resonates",
            "Reflect and write your gratitude",
            "See how your mood shifts",
          ],
        }),
        label: "Welcome",
        validate: () => true,
        excludeFromProgress: true,
      },
      {
        id: "mood",
        component: createStep(ChoiceStep, {
          title: "Current Mood",
          subtitle: "How are you feeling right now?",
          fieldKey: "currentMood",
          layoutVariant: "cbt_reflection" as const,
          showStepCount: false,
          options: [
            { value: "happy", label: "Happy", iconKey: "happy" },
            { value: "neutral", label: "Neutral", iconKey: "neutral" },
            { value: "anxious", label: "Anxious", iconKey: "anxious" },
            { value: "sad", label: "Sad", iconKey: "sad" },
            { value: "frustrated", label: "Frustrated", iconKey: "frustrated" },
            { value: "stressed", label: "Stressed", iconKey: "stressed" },
          ],
        }),
        label: "How are you feeling?",
        validate: (r) => r.currentMood !== null,
      },
      {
        id: "mood_intensity",
        component: createStep(SliderStep, {
          title: "How strong is it right now?",
          subtitle: "",
          fieldKey: "moodIntensity",
          min: 0,
          max: 10,
          minLabel: "Low",
          midLabel: "Noticeable",
          maxLabel: "Strong",
          unit: "/10",
          showStepCount: false,
        }),
        label: "Rate your mood intensity",
        validate: () => true,
      },
      {
        id: "prompts",
        component: createStep(ChoiceStep, {
          title: "Gratitude Prompt",
          subtitle: "Pick a prompt to guide your reflection.",
          fieldKey: "selectedPrompt",
          layoutVariant: "cbt_reflection" as const,
          showStepCount: false,
          options: [...GRATITUDE_REFRAME_PROMPTS],
        }),
        label: "Choose a gratitude prompt",
        validate: (r) => r.selectedPrompt.length > 0,
        ai: {
          promptBuilder: (r) =>
            `You are a gratitude journaling assistant. The user is currently feeling "${r.currentMood}" with intensity ${r.moodIntensity}/10.\n\nGenerate 3 short gratitude topics or prompt ideas that are:\n- Relevant to someone experiencing this mood\n- Specific enough to inspire reflection\n- Warm and encouraging\n- Very brief (just the topic name, e.g. "A recent challenge I overcame" or "Someone who helped me today")\n\nReturn as an array of objects with 'text' (the short topic name) and 'category' (e.g., relationships, growth, daily life).`,
          responseSchema: {
            type: "array",
            items: {
              type: "object",
              properties: {
                text: { type: "string" },
                category: { type: "string" },
              },
              required: ["text", "category"],
            },
          },
          maxResults: 3,
          aiLoadingMessage: "Finding inspiring prompts...",
        },
      },
      {
        id: "reflection",
        component: createStep(MultiTextInputStep, {
        
          title: "Gratitude items",
          subtitle: "Write real things that mattered, even if they were small.",
          fieldKey: "gratitudeEntries",
          placeholder: "Type one thing that mattered...",
          minItems: 1,
          maxItems: 5,
          validationMessage:
            "Even small things count. Name what was genuinely there.",
        }),
        label: "Write your gratitude reflections",
        validate: (r) =>
          r.gratitudeEntries.length >= 1 &&
          r.gratitudeEntries.some((e) => e.trim().length >= 3),
      },
      {
        id: "reevaluate",
        component: createStep(SliderStep, {
          title: "How does your mood feel now?",
          subtitle: "",
          fieldKey: "finalMoodIntensity",
          min: 0,
          max: 10,
          minLabel: "Low",
          midLabel: "Noticeable",
          maxLabel: "Strong",
          unit: "/10",
          showStepCount: false,
        }),
        label: "How are you feeling now?",
        validate: () => true, // slider has default
      },
      {
        id: "summary",
        component: GratitudeReframeSummary as any,
        label: "Summary",
        nextLabel: "Complete",
        validate: () => true,
        excludeFromProgress: true,
      },
    ],
  };

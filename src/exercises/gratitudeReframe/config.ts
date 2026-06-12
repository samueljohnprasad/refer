import type {
  ExerciseConfig,
  GratitudeReframeResponse,
} from "@/src/types/exerciseFlow";
import { createStep } from "@/src/components/exercise/steps/createStep";
import { createDynamicSummaryStep } from "@/src/components/exercise/steps/createDynamicSummaryStep";
import { IntroStep } from "@/src/components/exercise/steps/IntroStep";
import { SliderStep } from "@/src/components/exercise/steps/SliderStep";
import { ChoiceStep } from "@/src/components/exercise/steps/ChoiceStep";
import { MultiTextInputStep } from "@/src/components/exercise/steps/MultiTextInputStep";

export const GRATITUDE_REFRAME_INITIAL: GratitudeReframeResponse = {
  currentMood: null,
  moodIntensity: 50,
  selectedPrompt: "",
  gratitudeEntries: [],
  finalMoodIntensity: 50,
};

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
    schemaVersion: 1,
    initialResponse: GRATITUDE_REFRAME_INITIAL,

    steps: [
      {
        id: "intro",
        component: createStep(IntroStep, {
          title: "Gratitude Reframe",
          subtitle: "Shift your focus toward what's good in your life.",
          exerciseType: "gratitude_reframe",
          duration: "5-7 min",
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
        id: "prompts",
        component: createStep(ChoiceStep, {
          title: "Gratitude Prompt",
          subtitle: "Pick a prompt to guide your reflection.",
          fieldKey: "selectedPrompt",
          options: [
            {
              value: "people",
              label: "Someone who helped me recently",
              iconKey: "people",
            },
            {
              value: "growth",
              label: "Something I learned this week",
              iconKey: "growth",
            },
            {
              value: "simple",
              label: "A small thing that made me smile",
              iconKey: "simple_joy",
            },
          ],
        }),
        label: "Choose a gratitude prompt",
        validate: (r) => r.selectedPrompt.length > 0,
        ai: {
          promptBuilder: (r) =>
            `You are a gratitude journaling assistant. The user is currently feeling "${r.currentMood}" with intensity ${r.moodIntensity}/100.\n\nGenerate 3 gratitude prompts that are:\n- Relevant to someone experiencing this mood\n- Specific enough to inspire reflection\n- Warm and encouraging\n\nReturn as an array of objects with 'text' (the prompt) and 'category' (e.g., relationships, growth, daily life).`,
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
        },
      },
      {
        id: "reflection",
        component: createStep(MultiTextInputStep, {
          title: "Gratitude Reflections",
          subtitle: "Write at least one thing you're grateful for.",
          fieldKey: "gratitudeEntries",
          placeholder: "I'm grateful for...",
          minItems: 1,
          maxItems: 5,
          validationMessage:
            "Even small things count. Gratitude doesn't mean ignoring pain — it means noticing what's also there.",
        }),
        label: "Write your gratitude reflections",
        validate: (r) =>
          r.gratitudeEntries.length >= 1 &&
          r.gratitudeEntries.some((e) => e.trim().length >= 3),
      },
      {
        id: "reevaluate",
        component: createStep(SliderStep, {
          title: "How Are You Now?",
          subtitle: "After reflecting on gratitude, how do you feel?",
          fieldKey: "finalMoodIntensity",
          min: 0,
          max: 100,
          minLabel: "Much worse",
          maxLabel: "Much better",
          unit: "%",
        }),
        label: "How are you feeling now?",
        validate: () => true, // slider has default
      },
      {
        id: "summary",
        component: createDynamicSummaryStep({
          title: "Gratitude captured!",
          celebrationEmoji: "🌿",
          exerciseType: "gratitude_reframe",
          preScoreKey: "moodIntensity",
          postScoreKey: "finalMoodIntensity",
          scoreLabel: "Mood shift",
          scoreMax: 100,
          keyTakeawayKey: "gratitudeEntries",
          keyTakeawayLabel: "What you're grateful for",
        }),
        label: "Summary",
        validate: () => true,
        excludeFromProgress: true,
      },
    ],
  };

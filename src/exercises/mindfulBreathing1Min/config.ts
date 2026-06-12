import type {
  ExerciseConfig,
  MindfulBreathing1MinResponse,
} from "@/src/types/exerciseFlow";
import { createStep } from "@/src/components/exercise/steps/createStep";
import { createDynamicSummaryStep } from "@/src/components/exercise/steps/createDynamicSummaryStep";
import { IntroStep } from "@/src/components/exercise/steps/IntroStep";
import { SliderStep } from "@/src/components/exercise/steps/SliderStep";
import { CountdownTimerStep } from "@/src/components/exercise/steps/CountdownTimerStep";
import { TextInputStep } from "@/src/components/exercise/steps/TextInputStep";

const INITIAL: MindfulBreathing1MinResponse = {
  preRating: 5,
  wanderCount: 0,
  reflection: "",
  postRating: 5,
};

export const mindfulBreathing1MinConfig: ExerciseConfig<MindfulBreathing1MinResponse> =
  {
    type: "mindful_breathing_1min",
    category: "mindfulness",
    title: "1-Minute Mindful Breathing",
    subtitle: "A quick mindfulness reset",
    icon: "mindful_breathing_1min",
    duration: "2-3 min",
    xp: 5,
    backgroundColor: "#fff",
    schemaVersion: 1,
    initialResponse: INITIAL,

    steps: [
      {
        id: "intro",
        component: createStep(IntroStep, {
          title: "1-Minute Mindful Breathing",
          subtitle: "Simply focus on your breath for 60 seconds.",
          exerciseType: "mindful_breathing_1min",
          duration: "2-3 min",
          bulletPoints: [
            "Focus on each breath",
            "Tap when your mind wanders",
            "Gently return your attention",
          ],
        }),
        label: "Welcome",
        validate: () => true,
        excludeFromProgress: true,
      },
      {
        id: "pre_rating",
        component: createStep(SliderStep, {
          title: "Before We Start",
          subtitle: "How present do you feel right now?",
          fieldKey: "preRating",
          min: 1,
          max: 10,
          minLabel: "Distracted",
          maxLabel: "Fully present",
        }),
        label: "How present do you feel? (1-10)",
        validate: () => true,
      },
      {
        id: "timer_60s",
        component: createStep(CountdownTimerStep, {
          title: "Mindful Breathing",
          subtitle:
            "Focus on your breath. Tap the button each time your mind wanders.",
          timerConfig: {
            type: "countdown" as const,
            durationMs: 60_000,
            label: "Mind wandered? Tap!",
          },
          completedFieldKey: "timerCompleted",
          tapCountFieldKey: "wanderCount",
        }),
        label: "Focus on your breath",
        validate: () => true,
        timerConfig: {
          type: "countdown" as const,
          durationMs: 60_000,
          label: "Mind wandered? Tap!",
        },
      },
      {
        id: "wander_count_reflection",
        component: createStep(TextInputStep, {
          title: "Reflection",
          subtitle: "What did you notice during the exercise?",
          fieldKey: "reflection",
          placeholder: "I noticed that...",
        }),
        label: "Reflect on mind wandering",
        validate: () => true,
      },
      {
        id: "post_rating",
        component: createStep(SliderStep, {
          title: "After Breathing",
          subtitle: "How present do you feel now?",
          fieldKey: "postRating",
          min: 1,
          max: 10,
          minLabel: "Distracted",
          maxLabel: "Fully present",
        }),
        label: "How present do you feel now? (1-10)",
        validate: () => true,
      },
      {
        id: "summary",
        component: createDynamicSummaryStep({
          title: "Mindful moment complete!",
          celebrationEmoji: "🍃",
          exerciseType: "mindful_breathing_1min",
          preScoreKey: "preRating",
          postScoreKey: "postRating",
          scoreLabel: "Presence level",
          scoreMax: 10,
        }),
        label: "Summary",
        validate: () => true,
        excludeFromProgress: true,
      },
    ],
  };

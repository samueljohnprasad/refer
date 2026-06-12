import type {
  ExerciseConfig,
  RecognizingRuminationResponse,
} from "@/src/types/exerciseFlow";
import { createStep } from "@/src/components/exercise/steps/createStep";
import { createDynamicSummaryStep } from "@/src/components/exercise/steps/createDynamicSummaryStep";
import { IntroStep } from "@/src/components/exercise/steps/IntroStep";
import { TextInputStep } from "@/src/components/exercise/steps/TextInputStep";
import { ChoiceStep } from "@/src/components/exercise/steps/ChoiceStep";
import { CountdownTimerStep } from "@/src/components/exercise/steps/CountdownTimerStep";
import { SliderStep } from "@/src/components/exercise/steps/SliderStep";

const INITIAL: RecognizingRuminationResponse = {
  currentThoughtLoop: "",
  theme: "",
  ruminationTrigger: "",
  timeSpent: "",
  interruptTechnique: "",
  interruptCompleted: false,
  preRating: 5,
  postRating: 5,
};

export const recognizingRuminationConfig: ExerciseConfig<RecognizingRuminationResponse> =
  {
    type: "recognizing_rumination",
    category: "overthinking",
    title: "Recognizing Rumination",
    subtitle: "Spot and interrupt thought loops",
    icon: "recognizing_rumination",
    duration: "5-7 min",
    xp: 10,
    backgroundColor: "#fff",
    schemaVersion: 2,
    initialResponse: INITIAL,

    steps: [
      {
        id: "intro",
        component: createStep(IntroStep, {
          title: "Recognizing Rumination",
          subtitle: "Spot thought loops early and break free from them.",
          exerciseType: "recognizing_rumination",
          duration: "5-7 min",
        }),
        label: "Welcome",
        validate: () => true,
        excludeFromProgress: true,
      },
      {
        id: "pre_rating",
        component: createStep(SliderStep, {
          title: "How Stuck?",
          subtitle: "How stuck in a thought loop do you feel right now?",
          fieldKey: "preRating",
          min: 1,
          max: 10,
          minLabel: "Free",
          maxLabel: "Very stuck",
        }),
        label: "How stuck do you feel? (1-10)",
        validate: () => true,
      },
      {
        id: "current_thought_loop",
        component: createStep(TextInputStep, {
          title: "The Loop",
          subtitle: "What thought keeps repeating in your mind?",
          fieldKey: "currentThoughtLoop",
          placeholder: "The thought that keeps looping is...",
          validationMessage:
            "Getting stuck in loops is exhausting. You noticed it — that's already progress.",
        }),
        label: "What thought keeps repeating?",
        validate: (r) => r.currentThoughtLoop.trim().length >= 1,
      },
      {
        id: "theme_identification",
        component: createStep(ChoiceStep, {
          title: "Theme",
          subtitle: "What category does this rumination fall under?",
          fieldKey: "theme",
          psychoeducationText:
            "Naming the theme of a thought loop creates distance from it. You shift from being inside it to observing it.",
          options: [
            {
              value: "past_regret",
              label: "Past Regret",
              iconKey: "past_regret",
            },
            {
              value: "self_criticism",
              label: "Self-Criticism",
              iconKey: "self_criticism",
            },
            {
              value: "relationship",
              label: "Relationship",
              iconKey: "relationship",
            },
            { value: "work", label: "Work/Performance", iconKey: "work" },
            { value: "health", label: "Health", iconKey: "health" },
            { value: "other", label: "Other", iconKey: "other" },
          ],
        }),
        label: "What theme is it?",
        validate: (r) => r.theme.length > 0,
      },
      {
        id: "rumination_trigger",
        component: createStep(TextInputStep, {
          title: "Trigger",
          subtitle: "What set off this thought loop?",
          fieldKey: "ruminationTrigger",
          placeholder: "It started when...",
        }),
        label: "What triggered it?",
        validate: (r) => r.ruminationTrigger.trim().length >= 1,
      },
      {
        id: "time_check",
        component: createStep(ChoiceStep, {
          title: "Time Check",
          subtitle: "How long have you been stuck in this loop?",
          fieldKey: "timeSpent",
          options: [
            { value: "minutes", label: "A few minutes", iconKey: "minutes" },
            { value: "hour", label: "About an hour", iconKey: "hour" },
            { value: "hours", label: "Several hours", iconKey: "hours" },
            { value: "days", label: "Days or more", iconKey: "days" },
          ],
        }),
        label: "How long have you been stuck?",
        validate: (r) => r.timeSpent.length > 0,
      },
      {
        id: "interrupt_technique",
        component: createStep(ChoiceStep, {
          title: "Interrupt Technique",
          subtitle: "Pick a technique to break the loop.",
          fieldKey: "interruptTechnique",
          options: [
            {
              value: "grounding",
              label: "5-4-3-2-1 Grounding",
              iconKey: "grounding",
            },
            {
              value: "movement",
              label: "Physical movement",
              iconKey: "movement",
            },
            { value: "breath", label: "Deep breaths", iconKey: "breath" },
            { value: "music", label: "Listen to music", iconKey: "music" },
          ],
        }),
        label: "Choose an interrupt technique",
        validate: (r) => r.interruptTechnique.length > 0,
      },
      {
        id: "do_interrupt",
        component: createStep(CountdownTimerStep, {
          title: "Do the Interrupt",
          subtitle: "Focus on your chosen technique for 30 seconds.",
          timerConfig: {
            type: "countdown" as const,
            durationMs: 30_000,
            label: "Interrupt in progress...",
          },
          completedFieldKey: "interruptCompleted",
        }),
        label: "Do the interrupt (30s)",
        validate: (r) => r.interruptCompleted,
        timerConfig: {
          type: "countdown",
          durationMs: 30_000,
          label: "Interrupt in progress...",
        },
      },
      {
        id: "post_rating",
        component: createStep(SliderStep, {
          title: "After the Interrupt",
          subtitle: "How stuck do you feel now?",
          fieldKey: "postRating",
          min: 1,
          max: 10,
          minLabel: "Free",
          maxLabel: "Very stuck",
        }),
        label: "How stuck do you feel now? (1-10)",
        validate: () => true,
      },
      {
        id: "summary",
        component: createDynamicSummaryStep({
          title: "Loop interrupted!",
          celebrationEmoji: "🔓",
          exerciseType: "recognizing_rumination",
          preScoreKey: "preRating",
          postScoreKey: "postRating",
          scoreLabel: "How stuck",
          scoreMax: 10,
        }),
        label: "Summary",
        validate: () => true,
        excludeFromProgress: true,
      },
    ],
  };

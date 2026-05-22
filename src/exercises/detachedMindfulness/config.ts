import type {
  ExerciseConfig,
  DetachedMindfulnessResponse,
} from "@/src/types/exerciseFlow";
import { createStep } from "@/src/components/exercise/steps/createStep";
import { createSummaryStep } from "@/src/components/exercise/steps/createSummaryStep";
import { IntroStep } from "@/src/components/exercise/steps/IntroStep";
import { TextInputStep } from "@/src/components/exercise/steps/TextInputStep";
import { AcknowledgeStep } from "@/src/components/exercise/steps/AcknowledgeStep";
import { CountdownTimerStep } from "@/src/components/exercise/steps/CountdownTimerStep";
import { SliderStep } from "@/src/components/exercise/steps/SliderStep";
import { ChoiceStep } from "@/src/components/exercise/steps/ChoiceStep";

const INITIAL: DetachedMindfulnessResponse = {
  observedThought: "",
  preRating: 5,
  labelConfirmed: false,
  attentionShiftCompleted: false,
  checkInRating: 5,
  repeatOrContinue: null,
};

export const detachedMindfulnessConfig: ExerciseConfig<DetachedMindfulnessResponse> =
  {
    type: "detached_mindfulness",
    category: "overthinking",
    title: "Detached Mindfulness",
    subtitle: "Observe your thoughts without engaging",
    icon: "detached_mindfulness",
    duration: "5-7 min",
    xp: 10,
    backgroundColor: "#fff",
    schemaVersion: 2,
    initialResponse: INITIAL,

    steps: [
      {
        id: "intro",
        component: createStep(IntroStep, {
          title: "Detached Mindfulness",
          subtitle:
            "Learn to observe thoughts without getting caught up in them.",
          exerciseType: "detached_mindfulness",
          duration: "5-7 min",
        }),
        label: "Welcome",
        validate: () => true,
        excludeFromProgress: true,
      },
      {
        id: "pre_rating",
        component: createStep(SliderStep, {
          title: "Before We Start",
          subtitle: "How loud are your thoughts right now?",
          fieldKey: "preRating",
          min: 1,
          max: 10,
          minLabel: "Quiet",
          maxLabel: "Very loud",
        }),
        label: "How loud are your thoughts? (1-10)",
        validate: () => true,
      },
      {
        id: "observe_thought",
        component: createStep(TextInputStep, {
          title: "Notice a Thought",
          subtitle: "Write down a thought that keeps showing up.",
          fieldKey: "observedThought",
          placeholder: "The thought I notice is...",
        }),
        label: "Write the thought you notice",
        validate: (r) => r.observedThought.trim().length >= 1,
      },
      {
        id: "label_it",
        component: createStep(AcknowledgeStep, {
          title: "Label It",
          subtitle: "Say to yourself:",
          fieldKey: "labelConfirmed",
          body: '"I notice I am having the thought that..."',
          buttonLabel: "I've labeled it",
        }),
        label: 'Label it: "I notice I am having the thought that..."',
        validate: (r) => r.labelConfirmed,
      },
      {
        id: "attention_shift",
        component: createStep(CountdownTimerStep, {
          title: "Shift Attention",
          subtitle: "Focus on sounds around you for 30 seconds.",
          timerConfig: {
            type: "countdown" as const,
            durationMs: 30_000,
            label: "Focus on sounds around you",
          },
          completedFieldKey: "attentionShiftCompleted",
        }),
        label: "Shift attention to sounds (30s)",
        validate: (r) => r.attentionShiftCompleted,
        timerConfig: {
          type: "countdown",
          durationMs: 30_000,
          label: "Focus on sounds around you",
        },
      },
      {
        id: "check_in",
        component: createStep(SliderStep, {
          title: "Check In",
          subtitle: "Is the thought still as loud?",
          fieldKey: "checkInRating",
          min: 1,
          max: 10,
          minLabel: "Quiet",
          maxLabel: "Very loud",
        }),
        label: "Is the thought still as loud? (1-10)",
        validate: () => true,
      },
      {
        id: "repeat_or_continue",
        component: createStep(ChoiceStep, {
          title: "What Next?",
          subtitle: "Try the attention shift again or continue?",
          fieldKey: "repeatOrContinue",
          options: [
            { value: "repeat", label: "Try again", iconKey: "refresh" },
            { value: "continue", label: "Continue", iconKey: "check" },
          ],
        }),
        label: "Try again or continue?",
        validate: (r) => r.repeatOrContinue !== null,
        next: (r) =>
          r.repeatOrContinue === "repeat" ? "attention_shift" : undefined,
      },
      {
        id: "summary",
        component: createSummaryStep<DetachedMindfulnessResponse>(
          [
            { label: "Thought", key: "observedThought" },
            { label: "Loudness After", key: "checkInRating" },
          ],
          {
            title: "Observation complete!",
            exerciseType: "detached_mindfulness",
          },
        ),
        label: "Summary",
        validate: () => true,
        excludeFromProgress: true,
      },
    ],
  };

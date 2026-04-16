import type {
  ExerciseConfig,
  AttentionTrainingResponse,
} from "@/src/types/exerciseFlow";
import { createStep } from "@/src/components/exercise/steps/createStep";
import { createSummaryStep } from "@/src/components/exercise/steps/createSummaryStep";
import { IntroStep } from "@/src/components/exercise/steps/IntroStep";
import { SliderStep } from "@/src/components/exercise/steps/SliderStep";
import { CountdownTimerStep } from "@/src/components/exercise/steps/CountdownTimerStep";

const INITIAL: AttentionTrainingResponse = {
  preRating: 5,
  sound1Completed: false,
  sound2Completed: false,
  sound3Completed: false,
  rapidSwitchCompleted: false,
  expandedAttentionCompleted: false,
  postRating: 5,
};

export const attentionTrainingConfig: ExerciseConfig<AttentionTrainingResponse> =
  {
    type: "attention_training",
    category: "overthinking",
    title: "Attention Training",
    subtitle: "Strengthen your attentional control (Wells ATT)",
    icon: "attention_training",
    duration: "7-10 min",
    xp: 12,
    backgroundColor: "#E0F2F1",
    schemaVersion: 1,
    initialResponse: INITIAL,

    steps: [
      {
        id: "intro",
        component: createStep(IntroStep, {
          title: "Attention Training",
          subtitle: "Train your attention to move freely between sounds.",
          exerciseType: "attention_training",
          duration: "7-10 min",
          bulletPoints: [
            "Focus on individual sounds",
            "Switch rapidly between them",
            "Hold all sounds at once",
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
          subtitle: "How stuck in your own head do you feel?",
          fieldKey: "preRating",
          min: 1,
          max: 10,
          minLabel: "Not stuck",
          maxLabel: "Very stuck",
        }),
        label: "How stuck in your head? (1-10)",
        validate: () => true,
      },
      {
        id: "sound_1",
        component: createStep(CountdownTimerStep, {
          title: "Sound 1",
          subtitle: "Focus all your attention on one sound nearby.",
          timerConfig: {
            type: "countdown" as const,
            durationMs: 30_000,
            label: "Focus on sound 1",
          },
          completedFieldKey: "sound1Completed",
        }),
        label: "Focus on sound 1 (30s)",
        validate: (r) => r.sound1Completed,
        timerConfig: { type: "countdown", durationMs: 30_000 },
      },
      {
        id: "sound_2",
        component: createStep(CountdownTimerStep, {
          title: "Sound 2",
          subtitle: "Now shift to a different sound.",
          timerConfig: {
            type: "countdown" as const,
            durationMs: 30_000,
            label: "Focus on sound 2",
          },
          completedFieldKey: "sound2Completed",
        }),
        label: "Focus on sound 2 (30s)",
        validate: (r) => r.sound2Completed,
        timerConfig: { type: "countdown", durationMs: 30_000 },
      },
      {
        id: "sound_3",
        component: createStep(CountdownTimerStep, {
          title: "Sound 3",
          subtitle: "Shift to a third sound.",
          timerConfig: {
            type: "countdown" as const,
            durationMs: 30_000,
            label: "Focus on sound 3",
          },
          completedFieldKey: "sound3Completed",
        }),
        label: "Focus on sound 3 (30s)",
        validate: (r) => r.sound3Completed,
        timerConfig: { type: "countdown", durationMs: 30_000 },
      },
      {
        id: "rapid_switch",
        component: createStep(CountdownTimerStep, {
          title: "Rapid Switching",
          subtitle: "Quickly switch your attention between all three sounds.",
          timerConfig: {
            type: "countdown" as const,
            durationMs: 60_000,
            label: "Switch between sounds",
          },
          completedFieldKey: "rapidSwitchCompleted",
        }),
        label: "Rapid switching (60s)",
        validate: (r) => r.rapidSwitchCompleted,
        timerConfig: { type: "countdown", durationMs: 60_000 },
      },
      {
        id: "expanded_attention",
        component: createStep(CountdownTimerStep, {
          title: "Expanded Attention",
          subtitle: "Try to hold all sounds in awareness simultaneously.",
          timerConfig: {
            type: "countdown" as const,
            durationMs: 30_000,
            label: "Hold all sounds",
          },
          completedFieldKey: "expandedAttentionCompleted",
        }),
        label: "Hold all sounds (30s)",
        validate: (r) => r.expandedAttentionCompleted,
        timerConfig: { type: "countdown", durationMs: 30_000 },
      },
      {
        id: "post_rating",
        component: createStep(SliderStep, {
          title: "After Training",
          subtitle: "How stuck in your head do you feel now?",
          fieldKey: "postRating",
          min: 1,
          max: 10,
          minLabel: "Not stuck",
          maxLabel: "Very stuck",
        }),
        label: "How stuck now? (1-10)",
        validate: () => true,
      },
      {
        id: "summary",
        component: createSummaryStep<AttentionTrainingResponse>(
          [
            { label: "Before", key: "preRating" },
            { label: "After", key: "postRating" },
          ],
          { title: "Attention trained!", exerciseType: "attention_training" },
        ),
        label: "Summary",
        validate: () => true,
        excludeFromProgress: true,
      },
    ],
  };

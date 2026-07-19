import type {
  ExerciseConfig,
  DetachedMindfulnessResponse,
} from "@/src/types/exerciseFlow";
import { createStep } from "@/src/components/exercise/steps/createStep";
import { createDynamicSummaryStep } from "@/src/components/exercise/steps/createDynamicSummaryStep";
import { IntroStep } from "@/src/components/exercise/steps/IntroStep";
import {MultiTextInputStep } from "@/src/components/exercise/steps/MultiTextInputStep";
import { AcknowledgeStep } from "@/src/components/exercise/steps/AcknowledgeStep";
import { CountdownTimerStep } from "@/src/components/exercise/steps/CountdownTimerStep";
import { SliderStep } from "@/src/components/exercise/steps/SliderStep";
import { ChoiceStep } from "@/src/components/exercise/steps/ChoiceStep";

const INITIAL: DetachedMindfulnessResponse = {
  observedThought: "",
  preRating: 5,
  labeledThought: "",
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
          bulletPoints: [
            "Notice a recurring thought",
            "Label it simply as 'a thought'",
            "Shift your attention to sounds",
            "Observe the thought losing its grip",
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
        component: createStep(MultiTextInputStep, {
          maxItems: 1,
          title: "Notice a Thought",
          subtitle: "Write down a thought that keeps showing up.",
          fieldKey: "observedThought",
          placeholder: "The thought I notice is...",
          validationMessage:
            "You don't have to fight this thought or believe it. Just watch it for a moment.",
        }),
        label: "Write the thought you notice",
        validate: (r) => r.observedThought.trim().length >= 1,
        ai: {
          promptBuilder: (r, context) => {
            const seed = context?.seed ?? Math.random();
            return `You are a CBT therapist assistant helping a user practice detached mindfulness. Generate 3 distinct, relatable examples of intrusive or recurring thoughts someone might notice. Make them highly specific, highly varied, and completely different every time (Random seed: ${seed}). Keep each concise (1 short sentence) and written in the first person. Provide a relevant emoji for each.`;
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
          aiLoadingMessage: "Finding common intrusive thoughts...",
        },
      },
      {
        id: "label_it",
        component: createStep(MultiTextInputStep, {
          maxItems: 1,
          title: "Label It",
          subtitle: "Say to yourself:",
          fieldKey: "labeledThought",
          placeholder: '"I notice I am having the thought that..."',
          psychoeducationText:
            "Labelling a thought as 'a thought' weakens its grip. The thought doesn't change — your relationship to it does.",
        }),
        label: 'Label it: "I notice I am having the thought that..."',
        validate: (r) => r.labeledThought.trim().length >= 1,
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
        component: createDynamicSummaryStep({
          title: "Observation complete!",
          celebrationEmoji: "☁️",
          exerciseType: "detached_mindfulness",
          preScoreKey: "preRating",
          postScoreKey: "checkInRating",
          scoreLabel: "Thought loudness",
          scoreMax: 10,
          keyTakeawayKey: "observedThought",
          keyTakeawayLabel: "The thought you observed",
        }),
        label: "Summary",
        validate: () => true,
        excludeFromProgress: true,
      },
    ],
  };

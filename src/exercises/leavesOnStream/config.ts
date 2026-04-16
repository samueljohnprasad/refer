import type {
  ExerciseConfig,
  LeavesOnStreamResponse,
} from "@/src/types/exerciseFlow";
import { createStep } from "@/src/components/exercise/steps/createStep";
import { createSummaryStep } from "@/src/components/exercise/steps/createSummaryStep";
import { IntroStep } from "@/src/components/exercise/steps/IntroStep";
import { SliderStep } from "@/src/components/exercise/steps/SliderStep";
import { MultiTextInputStep } from "@/src/components/exercise/steps/MultiTextInputStep";
import { TextInputStep } from "@/src/components/exercise/steps/TextInputStep";

const INITIAL: LeavesOnStreamResponse = {
  preRating: 5,
  thoughts: [],
  postRating: 5,
  reflection: "",
};

export const leavesOnStreamConfig: ExerciseConfig<LeavesOnStreamResponse> = {
  type: "leaves_on_stream",
  category: "act",
  title: "Leaves on a Stream",
  subtitle: "Watch your thoughts float away",
  icon: "leaves_on_stream",
  duration: "5-7 min",
  xp: 8,
  backgroundColor: "#E8F5E9",
  schemaVersion: 1,
  initialResponse: INITIAL,

  steps: [
    {
      id: "intro",
      component: createStep(IntroStep, {
        title: "Leaves on a Stream",
        subtitle:
          "Imagine placing each thought on a leaf and watching it float downstream.",
        exerciseType: "leaves_on_stream",
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
        subtitle: "How caught up in your thoughts are you?",
        fieldKey: "preRating",
        min: 1,
        max: 10,
        minLabel: "Not at all",
        maxLabel: "Very caught up",
      }),
      label: "How caught up in thoughts? (1-10)",
      validate: () => true,
    },
    {
      id: "place_on_leaves",
      component: createStep(MultiTextInputStep, {
        title: "Place on Leaves",
        subtitle: "Write each thought and imagine placing it on a leaf.",
        fieldKey: "thoughts",
        placeholder: "A thought on a leaf...",
        minItems: 1,
      }),
      label: "Place each thought on a leaf",
      validate: (r) => r.thoughts.length >= 1,
      timerConfig: {
        type: "countdown",
        durationMs: 180_000,
        skippable: true,
        label: "Watch them float away...",
      },
    },
    {
      id: "post_rating",
      component: createStep(SliderStep, {
        title: "After the Exercise",
        subtitle: "How caught up in thoughts are you now?",
        fieldKey: "postRating",
        min: 1,
        max: 10,
        minLabel: "Not at all",
        maxLabel: "Very caught up",
      }),
      label: "How caught up now? (1-10)",
      validate: () => true,
    },
    {
      id: "reflection",
      component: createStep(TextInputStep, {
        title: "Reflection",
        subtitle: "What did you notice during the exercise?",
        fieldKey: "reflection",
        placeholder: "I noticed that...",
      }),
      label: "What did you notice?",
      validate: (r) => r.reflection.trim().length >= 1,
    },
    {
      id: "summary",
      component: createSummaryStep<LeavesOnStreamResponse>(
        [
          { label: "Before", key: "preRating" },
          { label: "After", key: "postRating" },
          { label: "Thoughts Released", key: "thoughts" },
        ],
        { title: "Thoughts released!", exerciseType: "leaves_on_stream" },
      ),
      label: "Summary",
      validate: () => true,
      excludeFromProgress: true,
    },
  ],
};

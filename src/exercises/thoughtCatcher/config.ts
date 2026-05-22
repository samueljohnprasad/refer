import type {
  ExerciseConfig,
  ThoughtCatcherResponse,
} from "@/src/types/exerciseFlow";
import { createStep } from "@/src/components/exercise/steps/createStep";
import { createSummaryStep } from "@/src/components/exercise/steps/createSummaryStep";
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

const CheckerSummary = createSummaryStep<ThoughtCatcherResponse>(
  [
    { label: "Situation", key: "situation" },
    { label: "Automatic Thought", key: "automaticThought" },
    { label: "Is it true?", key: "isTrue" },
    { label: "Balanced Thought", key: "balancedThought" },
  ],
  { title: "Thought Checked!", exerciseType: "thought_catcher" },
);

export const thoughtCatcherConfig: ExerciseConfig<ThoughtCatcherResponse> = {
  type: "thought_catcher",
  category: "cbt_core",
  title: "Thought Catcher",
  subtitle: "Catch and examine your automatic thoughts",
  icon: "thought_catcher",
  duration: "3-5 min",
  xp: 10,
  backgroundColor: "#fff",
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
          "Describe the event as factually as possible — who, what, where, when.",
      }),
      label: "Describe the situation",
      validate: (r) => r.situation.trim().length >= 1,
    },
    {
      id: "automatic_thought",
      component: createStep(TextInputStep, {
        title: "Automatic Thought",
        subtitle: "What went through your mind?",
        fieldKey: "automaticThought",
        placeholder: "e.g. I'm going to get fired...",
        tipText: "Write the exact thought, even if it sounds irrational.",
      }),
      label: "What went through your mind?",
      validate: (r) => r.automaticThought.trim().length >= 1,
    },
    {
      id: "intensity",
      component: createStep(SliderStep, {
        title: "Thought Intensity",
        subtitle: "How strongly do you believe this thought right now?",
        fieldKey: "intensity",
        min: 0,
        max: 100,
        minLabel: "Not at all",
        maxLabel: "Completely",
        unit: "%",
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
      component: createStep(TextInputStep, {
        title: "Balanced Thought",
        subtitle: "Rewrite the thought in a more balanced way.",
        fieldKey: "balancedThought",
        placeholder:
          "e.g. The meeting could be about many things, not just me...",
      }),
      label: "Write a balanced thought",
      validate: (r) => (r.balancedThought ?? "").trim().length >= 1,
      optional: true,
    },
    {
      id: "post_intensity",
      component: createStep(SliderStep, {
        title: "Thought Intensity Now",
        subtitle: "How strongly do you believe this thought after checking it?",
        fieldKey: "postIntensity",
        min: 0,
        max: 100,
        minLabel: "Not at all",
        maxLabel: "Completely",
        unit: "%",
      }),
      label: "How intense is the thought now?",
      validate: () => true,
      optional: true,
    },
    {
      id: "checker_summary",
      component: CheckerSummary,
      label: "Final Summary",
      validate: () => true,
      excludeFromProgress: true,
      optional: true,
    },
  ],
};

import type {
  ExerciseConfig,
  WorryTimeResponse,
} from "@/src/types/exerciseFlow";
import { createStep } from "@/src/components/exercise/steps/createStep";
import { createSummaryStep } from "@/src/components/exercise/steps/createSummaryStep";
import { IntroStep } from "@/src/components/exercise/steps/IntroStep";
import { TextInputStep } from "@/src/components/exercise/steps/TextInputStep";
import { MultiTextInputStep } from "@/src/components/exercise/steps/MultiTextInputStep";
import { ChecklistStep } from "@/src/components/exercise/steps/ChecklistStep";

const INITIAL: WorryTimeResponse = {
  worryTimeSlot: "",
  worries: [],
  resolvedWorries: [],
  actionPlans: {},
  reflection: "",
};

export const worryTimeConfig: ExerciseConfig<WorryTimeResponse> = {
  type: "worry_time",
  category: "anxiety",
  title: "Worry Time",
  subtitle: "Contain your worries to a scheduled time",
  icon: "worry_time",
  duration: "10-15 min",
  xp: 12,
  backgroundColor: "#fff",
  schemaVersion: 1,
  initialResponse: INITIAL,

  steps: [
    {
      id: "intro",
      component: createStep(IntroStep, {
        title: "Worry Time",
        subtitle:
          "Postpone worrying to a set time, so it doesn't consume your day.",
        exerciseType: "worry_time",
        duration: "10-15 min",
      }),
      label: "Welcome",
      validate: () => true,
      excludeFromProgress: true,
    },
    {
      id: "set_worry_time",
      component: createStep(TextInputStep, {
        title: "Set Your Worry Time",
        subtitle: "Pick a 15-minute window for today's worry session.",
        fieldKey: "worryTimeSlot",
        placeholder: "e.g. 6:00 PM – 6:15 PM",
      }),
      label: "Set your worry time",
      validate: (r) => r.worryTimeSlot.length > 0,
    },
    {
      id: "capture_worries",
      component: createStep(MultiTextInputStep, {
        title: "Capture Worries",
        subtitle: "Write down all the worries on your mind.",
        fieldKey: "worries",
        placeholder: "Add a worry...",
        minItems: 1,
      }),
      label: "List your worries",
      validate: (r) => r.worries.length >= 1,
    },
    {
      id: "review",
      component: createStep(ChecklistStep, {
        title: "Review",
        subtitle: "Check off any worries that have already resolved.",
        fieldKey: "resolvedWorries",
      }),
      label: "Review & check off resolved",
      validate: () => true,
    },
    {
      id: "action_or_accept",
      component: createStep(TextInputStep, {
        title: "Action or Accept",
        subtitle:
          "For remaining worries, write an action plan or acceptance statement.",
        fieldKey: "reflection",
        placeholder: "For this worry I will...",
      }),
      label: "Action plan or acceptance",
      validate: () => true,
    },
    {
      id: "reflection",
      component: createStep(TextInputStep, {
        title: "Reflect",
        subtitle: "How did containing your worries feel?",
        fieldKey: "reflection",
        placeholder: "I noticed that...",
      }),
      label: "Reflect",
      validate: (r) => r.reflection.trim().length >= 1,
    },
    {
      id: "summary",
      component: createSummaryStep<WorryTimeResponse>(
        [
          { label: "Worry Time", key: "worryTimeSlot" },
          { label: "Worries Captured", key: "worries" },
          { label: "Reflection", key: "reflection" },
        ],
        { title: "Worry time done!", exerciseType: "worry_time" },
      ),
      label: "Summary",
      validate: () => true,
      excludeFromProgress: true,
    },
  ],
};

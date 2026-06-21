import type {
  ExerciseConfig,
  WorryTimeResponse,
} from "@/src/types/exerciseFlow";
import { createStep } from "@/src/components/exercise/steps/createStep";
import { createDynamicSummaryStep } from "@/src/components/exercise/steps/createDynamicSummaryStep";
import { IntroStep } from "@/src/components/exercise/steps/IntroStep";
import { TextInputStep } from "@/src/components/exercise/steps/TextInputStep";
import { MultiTextInputStep } from "@/src/components/exercise/steps/MultiTextInputStep";
import { ChecklistStep } from "@/src/components/exercise/steps/ChecklistStep";
import { SliderStep } from "@/src/components/exercise/steps/SliderStep";

const INITIAL: WorryTimeResponse = {
  worryTimeSlot: "",
  worries: [],
  resolvedWorries: [],
  actionPlans: {},
  actionOrAcceptStatement: "",
  reflection: "",
  preAnxietyRating: 5,
  postAnxietyRating: 5,
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
  schemaVersion: 3,
  initialResponse: INITIAL,
  migrate: (old, fromVersion) => {
    if (fromVersion < 3) {
      return { ...INITIAL, ...old, actionOrAcceptStatement: "" };
    }
    return old;
  },

  steps: [
    {
      id: "intro",
      component: createStep(IntroStep, {
        title: "Worry Time",
        subtitle:
          "Postpone worrying to a set time, so it doesn't consume your day.",
        exerciseType: "worry_time",
        duration: "10-15 min",
        bulletPoints: [
          "Schedule a 15-minute worry window",
          "Capture worries as they arise",
          "Review them only during worry time",
          "Take action or let them go",
        ],
      }),
      label: "Welcome",
      validate: () => true,
      excludeFromProgress: true,
    },
    {
      id: "pre_anxiety_rating",
      component: createStep(SliderStep, {
        title: "Before We Start",
        subtitle: "How anxious are you feeling right now?",
        fieldKey: "preAnxietyRating",
        min: 1,
        max: 10,
        minLabel: "Calm",
        maxLabel: "Very anxious",
      }),
      label: "How anxious do you feel? (1-10)",
      validate: () => true,
    },
    {
      id: "set_worry_time",
      component: createStep(TextInputStep, {
        title: "Set Your Worry Time",
        subtitle: "Pick a 15-minute window for today's worry session.",
        fieldKey: "worryTimeSlot",
        placeholder: "e.g. 6:00 PM – 6:15 PM",
        psychoeducationText:
          "Postponing worry to a fixed window breaks the habit of constant background worrying that drains energy all day.",
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
        validationMessage:
          "It makes sense these feel heavy. Naming them is already the first step.",
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
        fieldKey: "actionOrAcceptStatement",
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
      id: "post_anxiety_rating",
      component: createStep(SliderStep, {
        title: "After Worry Time",
        subtitle: "How anxious are you feeling now?",
        fieldKey: "postAnxietyRating",
        min: 1,
        max: 10,
        minLabel: "Calm",
        maxLabel: "Very anxious",
      }),
      label: "How anxious do you feel now? (1-10)",
      validate: () => true,
    },
    {
      id: "summary",
      component: createDynamicSummaryStep({
        title: "Worry time done!",
        celebrationEmoji: "📋",
        exerciseType: "worry_time",
        preScoreKey: "preAnxietyRating",
        postScoreKey: "postAnxietyRating",
        scoreLabel: "Anxiety level",
        scoreMax: 10,
        keyTakeawayKey: "actionOrAcceptStatement",
        keyTakeawayLabel: "Your plan",
      }),
      label: "Summary",
      validate: () => true,
      excludeFromProgress: true,
    },
  ],
};

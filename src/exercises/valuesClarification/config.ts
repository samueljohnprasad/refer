import type {
  ExerciseConfig,
  ValuesClarificationResponse,
} from "@/src/types/exerciseFlow";
import { createStep } from "@/src/components/exercise/steps/createStep";
import { createSummaryStep } from "@/src/components/exercise/steps/createSummaryStep";
import { IntroStep } from "@/src/components/exercise/steps/IntroStep";
import { MultiTextInputStep } from "@/src/components/exercise/steps/MultiTextInputStep";
import { ChecklistStep } from "@/src/components/exercise/steps/ChecklistStep";
import { TextInputStep } from "@/src/components/exercise/steps/TextInputStep";

const INITIAL: ValuesClarificationResponse = {
  veryImportant: [],
  somewhatImportant: [],
  notImportant: [],
  top5: [],
  alignmentRatings: {},
  actionSteps: {},
};

export const valuesClarificationConfig: ExerciseConfig<ValuesClarificationResponse> =
  {
    type: "values_clarification",
    category: "act",
    title: "Values Clarification",
    subtitle: "Discover what matters most to you",
    icon: "values_clarification",
    duration: "7-10 min",
    xp: 12,
    backgroundColor: "#fff",
    schemaVersion: 1,
    initialResponse: INITIAL,

    steps: [
      {
        id: "intro",
        component: createStep(IntroStep, {
          title: "Values Clarification",
          subtitle: "Discover what truly matters to you and live in alignment.",
          exerciseType: "values_clarification",
          duration: "7-10 min",
        }),
        label: "Welcome",
        validate: () => true,
        excludeFromProgress: true,
      },
      {
        id: "sort_values",
        component: createStep(MultiTextInputStep, {
          title: "Your Values",
          subtitle: "List values that are very important to you.",
          fieldKey: "veryImportant",
          placeholder: "A value I hold dear...",
          minItems: 1,
        }),
        label: "Sort values by importance",
        validate: (r) => r.veryImportant.length >= 1,
      },
      {
        id: "pick_top5",
        component: createStep(ChecklistStep, {
          title: "Top 5 Values",
          subtitle: "Pick the 3-5 values that matter most.",
          fieldKey: "top5",
          minChecked: 3,
        }),
        label: "Pick your top 5",
        validate: (r) => r.top5.length >= 3,
      },
      {
        id: "alignment_check",
        component: createStep(TextInputStep, {
          title: "Alignment Check",
          subtitle: "For each top value, rate how aligned your life is (1-10).",
          fieldKey: "alignmentRatings",
          placeholder: "Value 1: 7/10, Value 2: 4/10...",
        }),
        label: "Rate alignment for each (1-10)",
        validate: () => true,
      },
      {
        id: "action_steps",
        component: createStep(TextInputStep, {
          title: "Action Steps",
          subtitle: "Write one action per value you can do this week.",
          fieldKey: "actionSteps",
          placeholder: "For [value], I will...",
        }),
        label: "One action per value this week",
        validate: () => true,
      },
      {
        id: "summary",
        component: createSummaryStep<ValuesClarificationResponse>(
          [
            { label: "Top Values", key: "top5" },
            { label: "Very Important", key: "veryImportant" },
          ],
          { title: "Values clarified!", exerciseType: "values_clarification" },
        ),
        label: "Summary",
        validate: () => true,
        excludeFromProgress: true,
      },
    ],
  };

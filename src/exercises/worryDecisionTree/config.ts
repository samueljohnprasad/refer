import type {
  ExerciseConfig,
  WorryDecisionTreeResponse,
} from "@/src/types/exerciseFlow";
import { createStep } from "@/src/components/exercise/steps/createStep";
import { createSummaryStep } from "@/src/components/exercise/steps/createSummaryStep";
import { IntroStep } from "@/src/components/exercise/steps/IntroStep";
import { TextInputStep } from "@/src/components/exercise/steps/TextInputStep";
import { BooleanStep } from "@/src/components/exercise/steps/BooleanStep";

const INITIAL: WorryDecisionTreeResponse = {
  worry: "",
  canAct: null,
  actionPlan: "",
  scheduledAction: "",
  acceptanceExercise: "",
};

export const worryDecisionTreeConfig: ExerciseConfig<WorryDecisionTreeResponse> =
  {
    type: "worry_decision_tree",
    category: "anxiety",
    title: "Worry Decision Tree",
    subtitle: "Act on it or accept it — decide and move on",
    icon: "worry_decision_tree",
    duration: "5-7 min",
    xp: 10,
    backgroundColor: "#E8F5E9",
    schemaVersion: 1,
    initialResponse: INITIAL,

    steps: [
      {
        id: "intro",
        component: createStep(IntroStep, {
          title: "Worry Decision Tree",
          subtitle: "Is this worry something you can act on? Let's find out.",
          exerciseType: "worry_decision_tree",
          duration: "5-7 min",
        }),
        label: "Welcome",
        validate: () => true,
        excludeFromProgress: true,
      },
      {
        id: "write_worry",
        component: createStep(TextInputStep, {
          title: "Your Worry",
          subtitle: "Describe the worry that's on your mind.",
          fieldKey: "worry",
          placeholder: "I'm worried about...",
        }),
        label: "Describe your worry",
        validate: (r) => r.worry.trim().length >= 1,
      },
      {
        id: "can_I_act",
        component: createStep(BooleanStep, {
          title: "Can You Act?",
          subtitle: "Is there something you can actually do about this worry?",
          fieldKey: "canAct",
          yesLabel: "Yes, I can act",
          noLabel: "No, I can't control this",
          yesIconKey: "check",
          noIconKey: "no",
        }),
        label: "Can you do something about it?",
        validate: (r) => r.canAct !== null,
        next: (r) =>
          r.canAct === "yes" ? "action_plan" : "acceptance_exercise",
      },
      {
        id: "action_plan",
        component: createStep(TextInputStep, {
          title: "Action Plan",
          subtitle: "What can you do about this?",
          fieldKey: "actionPlan",
          placeholder: "I will...",
        }),
        label: "Write your action plan",
        validate: (r) => r.actionPlan.trim().length >= 1,
        optional: true,
      },
      {
        id: "schedule_action",
        component: createStep(TextInputStep, {
          title: "Schedule It",
          subtitle: "When will you take this action?",
          fieldKey: "scheduledAction",
          placeholder: "I'll do this on...",
        }),
        label: "Schedule it",
        validate: (r) => r.scheduledAction.length > 0,
        optional: true,
      },
      {
        id: "acceptance_exercise",
        component: createStep(TextInputStep, {
          title: "Acceptance",
          subtitle: "Write an acceptance statement for this worry.",
          fieldKey: "acceptanceExercise",
          placeholder: "I accept that...",
        }),
        label: "Acceptance exercise",
        validate: (r) => r.acceptanceExercise.trim().length >= 1,
        optional: true,
      },
      {
        id: "summary",
        component: createSummaryStep<WorryDecisionTreeResponse>(
          [
            { label: "Worry", key: "worry" },
            { label: "Can Act?", key: "canAct" },
            { label: "Plan", key: "actionPlan" },
          ],
          { title: "Worry processed!", exerciseType: "worry_decision_tree" },
        ),
        label: "Summary",
        validate: () => true,
        excludeFromProgress: true,
      },
    ],
  };

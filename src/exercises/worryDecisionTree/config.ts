import type {
  ExerciseConfig,
  WorryDecisionTreeResponse,
} from "@/src/types/exerciseFlow";
import { createStep } from "@/src/components/exercise/steps/createStep";
import { createDynamicSummaryStep } from "@/src/components/exercise/steps/createDynamicSummaryStep";
import { IntroStep } from "@/src/components/exercise/steps/IntroStep";
import {MultiTextInputStep } from "@/src/components/exercise/steps/MultiTextInputStep";
import { SliderStep } from "@/src/components/exercise/steps/SliderStep";
import { ChoiceStep } from "@/src/components/exercise/steps/ChoiceStep";
import { WorryTreeSummaryStep } from "./components/WorryTreeSummaryStep";

const INITIAL: WorryDecisionTreeResponse = {
  worry: "",
  canAct: null,
  actionPlan: "",
  scheduledAction: "",
  acceptanceExercise: "",
  preAnxietyRating: 5,
  postAnxietyRating: 5,
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
    backgroundColor: "#fff",
    schemaVersion: 2,
    initialResponse: INITIAL,

    steps: [
      {
        id: "intro",
        component: createStep(IntroStep, {
          title: "Worry Decision Tree",
          subtitle: "Is this worry something you can act on? Let's find out.",
          exerciseType: "worry_decision_tree",
          duration: "5-7 min",
          bulletPoints: [
            "Describe the worry on your mind",
            "Decide if it's within your control",
            "Create an action plan if you can act",
            "Practice acceptance if you can't",
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
        id: "write_worry",
        component: createStep(MultiTextInputStep, {
        maxItems: 1,
          title: "Your Worry",
          subtitle: "Describe the worry that's on your mind.",
          fieldKey: "worry",
          placeholder: "I'm worried about...",
          validationMessage:
            "It's okay that this is on your mind. Let's figure out what, if anything, you can do.",
        }),
        label: "Describe your worry",
        validate: (r) => r.worry.trim().length >= 1,
      },
      {
        id: "can_I_act",
        component: createStep(ChoiceStep, {
          title: "Can You Act?",
          subtitle: "Is there something you can actually do about this worry?",
          fieldKey: "canAct",
          options: [
            {
              value: "yes",
              label: "I can act on this",
              description: "This is within my control",
              emoji: "🌱",
            },
            {
              value: "no",
              label: "I cannot control this",
              description: "It's out of my hands",
              emoji: "🍃",
            }
          ],
          layoutVariant: "cbt_reflection" as const,
          psychoeducationText:
            "Around 80% of worries are about things outside our control. Sorting them is the first step to letting them go.",
        }),
        label: "Can you do something about it?",
        validate: (r) => r.canAct !== null,
        next: (r) =>
          r.canAct === "yes" ? "action_plan" : "acceptance_exercise",
      },
      {
        id: "action_plan",
        component: createStep(MultiTextInputStep, {
        maxItems: 1,
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
        component: createStep(MultiTextInputStep, {
        maxItems: 1,
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
        component: createStep(MultiTextInputStep, {
        maxItems: 1,
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
        id: "post_anxiety_rating",
        component: createStep(SliderStep, {
          title: "After Processing",
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
        component: createStep(WorryTreeSummaryStep, {
          title: "Worry Processed",
          subtitle: "Here is the path you took.",
        }),
        label: "Summary",
        validate: () => true,
        excludeFromProgress: true,
      },
    ],
  };

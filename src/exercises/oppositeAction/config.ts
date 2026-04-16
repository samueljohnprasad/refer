import type {
  ExerciseConfig,
  OppositeActionResponse,
} from "@/src/types/exerciseFlow";
import { createStep } from "@/src/components/exercise/steps/createStep";
import { createSummaryStep } from "@/src/components/exercise/steps/createSummaryStep";
import { IntroStep } from "@/src/components/exercise/steps/IntroStep";
import { ChoiceStep } from "@/src/components/exercise/steps/ChoiceStep";
import { TextInputStep } from "@/src/components/exercise/steps/TextInputStep";
import { BooleanStep } from "@/src/components/exercise/steps/BooleanStep";

const INITIAL: OppositeActionResponse = {
  emotion: null,
  urge: "",
  isHelpful: null,
  oppositeAction: "",
  commitment: "",
};

export const oppositeActionConfig: ExerciseConfig<OppositeActionResponse> = {
  type: "opposite_action",
  category: "dbt",
  title: "Opposite Action",
  subtitle: "Act opposite to unhelpful emotional urges",
  icon: "opposite_action",
  duration: "5-7 min",
  xp: 10,
  backgroundColor: "#fff",
  schemaVersion: 1,
  initialResponse: INITIAL,

  steps: [
    {
      id: "intro",
      component: createStep(IntroStep, {
        title: "Opposite Action",
        subtitle:
          "When emotions push you in an unhelpful direction, do the opposite.",
        exerciseType: "opposite_action",
        duration: "5-7 min",
      }),
      label: "Welcome",
      validate: () => true,
      excludeFromProgress: true,
    },
    {
      id: "emotion_pick",
      component: createStep(ChoiceStep, {
        title: "Your Emotion",
        subtitle: "What emotion are you feeling right now?",
        fieldKey: "emotion",
        options: [
          { value: "anger", label: "Anger", iconKey: "angry" },
          { value: "sadness", label: "Sadness", iconKey: "sad" },
          { value: "fear", label: "Fear", iconKey: "fearful" },
          { value: "shame", label: "Shame", iconKey: "shame" },
          { value: "guilt", label: "Guilt", iconKey: "guilty" },
        ],
      }),
      label: "What emotion are you feeling?",
      validate: (r) => r.emotion !== null,
    },
    {
      id: "urge",
      component: createStep(TextInputStep, {
        title: "The Urge",
        subtitle: "What does this emotion want you to do?",
        fieldKey: "urge",
        placeholder: "The emotion is pushing me to...",
      }),
      label: "What does the emotion want you to do?",
      validate: (r) => r.urge.trim().length >= 1,
    },
    {
      id: "evaluate",
      component: createStep(BooleanStep, {
        title: "Evaluate",
        subtitle: "Is following this urge helpful or harmful?",
        fieldKey: "isHelpful",
        yesLabel: "Helpful",
        noLabel: "Harmful",
        yesIconKey: "check",
        noIconKey: "warning",
      }),
      label: "Is that action helpful or harmful?",
      validate: (r) => r.isHelpful !== null,
    },
    {
      id: "opposite",
      component: createStep(TextInputStep, {
        title: "Opposite Action",
        subtitle: "What is the opposite of what the emotion wants?",
        fieldKey: "oppositeAction",
        placeholder: "Instead, I will...",
      }),
      label: "What's the opposite action?",
      validate: (r) => r.oppositeAction.trim().length >= 1,
    },
    {
      id: "commit",
      component: createStep(TextInputStep, {
        title: "Commit",
        subtitle: "Write a commitment to the opposite action.",
        fieldKey: "commitment",
        placeholder: "I commit to...",
      }),
      label: "Commit to the opposite action",
      validate: (r) => r.commitment.trim().length >= 1,
    },
    {
      id: "summary",
      component: createSummaryStep<OppositeActionResponse>(
        [
          { label: "Emotion", key: "emotion" },
          { label: "Urge", key: "urge" },
          { label: "Opposite", key: "oppositeAction" },
          { label: "Commitment", key: "commitment" },
        ],
        { title: "Opposite action planned!", exerciseType: "opposite_action" },
      ),
      label: "Summary",
      validate: () => true,
      excludeFromProgress: true,
    },
  ],
};

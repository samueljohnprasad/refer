import type {
  ExerciseConfig,
  BehavioralActivationResponse,
} from "@/src/types/exerciseFlow";
import { createStep } from "@/src/components/exercise/steps/createStep";
import { createSummaryStep } from "@/src/components/exercise/steps/createSummaryStep";
import { IntroStep } from "@/src/components/exercise/steps/IntroStep";
import { SliderStep } from "@/src/components/exercise/steps/SliderStep";
import { ChoiceStep } from "@/src/components/exercise/steps/ChoiceStep";
import { TextInputStep } from "@/src/components/exercise/steps/TextInputStep";

const INITIAL: BehavioralActivationResponse = {
  currentMood: 5,
  selectedActivity: "",
  customActivity: "",
  scheduledDate: "",
  scheduledTime: "",
  commitment: "",
};

export const behavioralActivationConfig: ExerciseConfig<BehavioralActivationResponse> =
  {
    type: "behavioral_activation",
    category: "cbt_core",
    title: "Behavioral Activation",
    subtitle: "Plan enjoyable activities to lift your mood",
    icon: "behavioral_activation",
    duration: "5-7 min",
    xp: 12,
    backgroundColor: "#E3F2FD",
    schemaVersion: 1,
    initialResponse: INITIAL,

    steps: [
      {
        id: "intro",
        component: createStep(IntroStep, {
          title: "Behavioral Activation",
          subtitle:
            "When we feel low, we stop doing things we enjoy. Let's change that.",
          exerciseType: "behavioral_activation",
          duration: "5-7 min",
        }),
        label: "Welcome",
        validate: () => true,
        excludeFromProgress: true,
      },
      {
        id: "current_mood",
        component: createStep(SliderStep, {
          title: "Current Mood",
          subtitle: "How is your mood right now?",
          fieldKey: "currentMood",
          min: 1,
          max: 10,
          minLabel: "Very low",
          maxLabel: "Great",
        }),
        label: "Rate your current mood (1-10)",
        validate: () => true,
      },
      {
        id: "activity_picker",
        component: createStep(ChoiceStep, {
          title: "Pick an Activity",
          subtitle: "Choose something you used to enjoy or want to try.",
          fieldKey: "selectedActivity",
          options: [
            { value: "walk", label: "Go for a walk", iconKey: "walk" },
            {
              value: "call_friend",
              label: "Call a friend",
              iconKey: "call_friend",
            },
            { value: "cook", label: "Cook a meal", iconKey: "cook" },
            { value: "exercise", label: "Light exercise", iconKey: "exercise" },
          ],
        }),
        label: "Choose an activity",
        validate: (r) =>
          r.selectedActivity.length > 0 || r.customActivity.length > 0,
      },
      {
        id: "schedule",
        component: createStep(TextInputStep, {
          title: "Schedule It",
          subtitle: "When will you do this activity?",
          fieldKey: "scheduledDate",
          placeholder: "e.g. Tomorrow at 3pm",
        }),
        label: "Schedule it",
        validate: (r) => r.scheduledDate.length > 0,
      },
      {
        id: "commitment",
        component: createStep(TextInputStep, {
          title: "Commit",
          subtitle: "Write a commitment statement to yourself.",
          fieldKey: "commitment",
          placeholder: "I will...",
        }),
        label: "Make a commitment",
        validate: (r) => r.commitment.trim().length >= 1,
      },
      {
        id: "summary",
        component: createSummaryStep<BehavioralActivationResponse>(
          [
            { label: "Mood", key: "currentMood" },
            { label: "Activity", key: "selectedActivity" },
            { label: "When", key: "scheduledDate" },
            { label: "Commitment", key: "commitment" },
          ],
          { title: "Activity planned!", exerciseType: "behavioral_activation" },
        ),
        label: "Summary",
        validate: () => true,
        excludeFromProgress: true,
      },
    ],
  };

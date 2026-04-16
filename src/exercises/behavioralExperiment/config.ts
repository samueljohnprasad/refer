import type {
  ExerciseConfig,
  BehavioralExperimentResponse,
} from "@/src/types/exerciseFlow";
import { createStep } from "@/src/components/exercise/steps/createStep";
import { createSummaryStep } from "@/src/components/exercise/steps/createSummaryStep";
import { IntroStep } from "@/src/components/exercise/steps/IntroStep";
import { TextInputStep } from "@/src/components/exercise/steps/TextInputStep";
import { SliderStep } from "@/src/components/exercise/steps/SliderStep";

const INITIAL: BehavioralExperimentResponse = {
  prediction: "",
  beliefRating: 50,
  experimentPlan: "",
  whatHappened: "",
  reratedBelief: 50,
  learning: "",
};

export const behavioralExperimentConfig: ExerciseConfig<BehavioralExperimentResponse> =
  {
    type: "behavioral_experiment",
    category: "cbt_core",
    title: "Behavioral Experiment",
    subtitle: "Test your predictions with real-world evidence",
    icon: "behavioral_experiment",
    duration: "5-7 min",
    xp: 15,
    backgroundColor: "#E8EAF6",
    schemaVersion: 1,
    initialResponse: INITIAL,

    steps: [
      {
        id: "intro",
        component: createStep(IntroStep, {
          title: "Behavioral Experiment",
          subtitle:
            "Test your beliefs by running a small real-world experiment.",
          exerciseType: "behavioral_experiment",
          duration: "5-7 min",
        }),
        label: "Welcome",
        validate: () => true,
        excludeFromProgress: true,
      },
      {
        id: "prediction",
        component: createStep(TextInputStep, {
          title: "Your Prediction",
          subtitle: "What do you predict will happen?",
          fieldKey: "prediction",
          placeholder: "I predict that...",
        }),
        label: "What do you predict will happen?",
        validate: (r) => r.prediction.trim().length >= 1,
      },
      {
        id: "belief_rating",
        component: createStep(SliderStep, {
          title: "Belief Strength",
          subtitle: "How strongly do you believe this prediction?",
          fieldKey: "beliefRating",
          min: 0,
          max: 100,
          minLabel: "Not at all",
          maxLabel: "Completely",
          unit: "%",
        }),
        label: "How strongly do you believe this? (0-100%)",
        validate: () => true,
      },
      {
        id: "design_experiment",
        component: createStep(TextInputStep, {
          title: "Plan the Experiment",
          subtitle: "Design a small, safe test you can do.",
          fieldKey: "experimentPlan",
          placeholder: "My experiment: I will...",
        }),
        label: "Plan a small test",
        validate: (r) => r.experimentPlan.trim().length >= 1,
      },
      {
        id: "post_experiment",
        component: createStep(TextInputStep, {
          title: "What Happened?",
          subtitle: "After the experiment, what actually occurred?",
          fieldKey: "whatHappened",
          placeholder: "What actually happened was...",
        }),
        label: "What actually happened?",
        validate: (r) => r.whatHappened.trim().length >= 1,
      },
      {
        id: "rerate_belief",
        component: createStep(SliderStep, {
          title: "Re-rate Belief",
          subtitle: "How strongly do you believe the prediction now?",
          fieldKey: "reratedBelief",
          min: 0,
          max: 100,
          minLabel: "Not at all",
          maxLabel: "Completely",
          unit: "%",
        }),
        label: "Re-rate your belief (0-100%)",
        validate: () => true,
      },
      {
        id: "learning",
        component: createStep(TextInputStep, {
          title: "What Did You Learn?",
          subtitle: "What insight did this experiment give you?",
          fieldKey: "learning",
          placeholder: "I learned that...",
        }),
        label: "What did you learn?",
        validate: (r) => r.learning.trim().length >= 1,
      },
      {
        id: "summary",
        component: createSummaryStep<BehavioralExperimentResponse>(
          [
            { label: "Prediction", key: "prediction" },
            { label: "Belief Before", key: "beliefRating" },
            { label: "What Happened", key: "whatHappened" },
            { label: "Belief After", key: "reratedBelief" },
            { label: "Learning", key: "learning" },
          ],
          {
            title: "Experiment complete!",
            exerciseType: "behavioral_experiment",
          },
        ),
        label: "Summary",
        validate: () => true,
        excludeFromProgress: true,
      },
    ],
  };

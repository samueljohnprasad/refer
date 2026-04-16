import type {
  ExerciseConfig,
  RadicalAcceptanceResponse,
} from "@/src/types/exerciseFlow";
import { createStep } from "@/src/components/exercise/steps/createStep";
import { createSummaryStep } from "@/src/components/exercise/steps/createSummaryStep";
import { IntroStep } from "@/src/components/exercise/steps/IntroStep";
import { TextInputStep } from "@/src/components/exercise/steps/TextInputStep";
import { SliderStep } from "@/src/components/exercise/steps/SliderStep";

const INITIAL: RadicalAcceptanceResponse = {
  struggle: "",
  realityStatement: "",
  acceptanceReason: "",
  forwardAction: "",
  peaceRating: 5,
};

export const radicalAcceptanceConfig: ExerciseConfig<RadicalAcceptanceResponse> =
  {
    type: "radical_acceptance",
    category: "dbt",
    title: "Radical Acceptance",
    subtitle: "Accept reality to reduce suffering",
    icon: "radical_acceptance",
    duration: "5-7 min",
    xp: 10,
    backgroundColor: "#fff",
    schemaVersion: 1,
    initialResponse: INITIAL,

    steps: [
      {
        id: "intro",
        component: createStep(IntroStep, {
          title: "Radical Acceptance",
          subtitle:
            "Fighting reality creates suffering. Accepting it opens the door to peace.",
          exerciseType: "radical_acceptance",
          duration: "5-7 min",
        }),
        label: "Welcome",
        validate: () => true,
        excludeFromProgress: true,
      },
      {
        id: "struggle",
        component: createStep(TextInputStep, {
          title: "The Struggle",
          subtitle: "What situation can you not change right now?",
          fieldKey: "struggle",
          placeholder: "I can't change that...",
        }),
        label: "What can't you change?",
        validate: (r) => r.struggle.trim().length >= 1,
      },
      {
        id: "reality_statement",
        component: createStep(TextInputStep, {
          title: "State the Reality",
          subtitle: "Write it as a simple fact, without judgment.",
          fieldKey: "realityStatement",
          placeholder: "The reality is...",
        }),
        label: "State the reality",
        validate: (r) => r.realityStatement.trim().length >= 1,
      },
      {
        id: "acceptance_reason",
        component: createStep(TextInputStep, {
          title: "Why Accept?",
          subtitle: "What benefit comes from accepting rather than fighting?",
          fieldKey: "acceptanceReason",
          placeholder: "Accepting this helps because...",
        }),
        label: "Why accept this?",
        validate: (r) => r.acceptanceReason.trim().length >= 1,
      },
      {
        id: "forward_action",
        component: createStep(TextInputStep, {
          title: "One Forward Action",
          subtitle:
            "What is one small step you can take from this place of acceptance?",
          fieldKey: "forwardAction",
          placeholder: "I can move forward by...",
        }),
        label: "One forward action",
        validate: (r) => r.forwardAction.trim().length >= 1,
      },
      {
        id: "peace_rating",
        component: createStep(SliderStep, {
          title: "Peace Level",
          subtitle: "How at peace do you feel with this reality?",
          fieldKey: "peaceRating",
          min: 1,
          max: 10,
          minLabel: "Struggling",
          maxLabel: "At peace",
        }),
        label: "Peace level (1-10)",
        validate: () => true,
      },
      {
        id: "summary",
        component: createSummaryStep<RadicalAcceptanceResponse>(
          [
            { label: "Reality", key: "realityStatement" },
            { label: "Why Accept", key: "acceptanceReason" },
            { label: "Forward Action", key: "forwardAction" },
            { label: "Peace", key: "peaceRating" },
          ],
          {
            title: "Acceptance practiced!",
            exerciseType: "radical_acceptance",
          },
        ),
        label: "Summary",
        validate: () => true,
        excludeFromProgress: true,
      },
    ],
  };

import type {
  ExerciseConfig,
  SelfCriticismToCoachResponse,
} from "@/src/types/exerciseFlow";
import { createStep } from "@/src/components/exercise/steps/createStep";
import { createSummaryStep } from "@/src/components/exercise/steps/createSummaryStep";
import { IntroStep } from "@/src/components/exercise/steps/IntroStep";
import { TextInputStep } from "@/src/components/exercise/steps/TextInputStep";
import { AITextInputStep } from "@/src/components/exercise/steps/AITextInputStep";
import { SliderStep } from "@/src/components/exercise/steps/SliderStep";

const INITIAL: SelfCriticismToCoachResponse = {
  selfCriticalThought: "",
  coachRewrite: "",
  evidenceAgainstLabel: "",
  compassionateDescription: "",
  feelingCheck: 5,
};

export const selfCriticismToCoachConfig: ExerciseConfig<SelfCriticismToCoachResponse> =
  {
    type: "self_criticism_to_coach",
    category: "self_compassion",
    title: "Inner Critic → Inner Coach",
    subtitle: "Transform self-criticism into encouragement",
    icon: "self_criticism_to_coach",
    duration: "5-7 min",
    xp: 12,
    backgroundColor: "#fff",
    schemaVersion: 1,
    initialResponse: INITIAL,

    steps: [
      {
        id: "intro",
        component: createStep(IntroStep, {
          title: "Inner Critic → Inner Coach",
          subtitle: "Transform harsh self-talk into supportive coaching.",
          exerciseType: "self_criticism_to_coach",
          duration: "5-7 min",
        }),
        label: "Welcome",
        validate: () => true,
        excludeFromProgress: true,
      },
      {
        id: "self_critical",
        component: createStep(TextInputStep, {
          title: "The Inner Critic",
          subtitle: "Write the critical thought as it sounds in your head.",
          fieldKey: "selfCriticalThought",
          placeholder: "My inner critic says...",
        }),
        label: "Write the critical thought",
        validate: (r) => r.selfCriticalThought.trim().length >= 1,
      },
      {
        id: "coach_rewrite",
        component: createStep(AITextInputStep, {
          title: "The Inner Coach",
          subtitle: "Rewrite it as a supportive coach would say it.",
          fieldKey: "coachRewrite",
          placeholder: "A good coach would say...",
        }),
        label: "Rewrite as a coach would say it",
        validate: (r) => r.coachRewrite.trim().length >= 1,
        ai: {
          promptBuilder: (r) =>
            `The user's inner critic says: "${r.selfCriticalThought}"\n\nRewrite this as a supportive inner coach would phrase it. Generate 2 alternatives that are encouraging but honest.`,
          responseSchema: {
            type: "array",
            items: {
              type: "object",
              properties: { text: { type: "string" } },
              required: ["text"],
            },
          },
          maxResults: 2,
        },
      },
      {
        id: "evidence_against",
        component: createStep(TextInputStep, {
          title: "Evidence Against",
          subtitle: "What evidence contradicts the critical label?",
          fieldKey: "evidenceAgainstLabel",
          placeholder: "Actually, I have...",
        }),
        label: "Evidence against the critical label",
        validate: (r) => r.evidenceAgainstLabel.trim().length >= 1,
      },
      {
        id: "compassionate",
        component: createStep(TextInputStep, {
          title: "Compassionate Description",
          subtitle: "Describe yourself the way a loving friend would.",
          fieldKey: "compassionateDescription",
          placeholder: "I am someone who...",
        }),
        label: "Describe yourself compassionately",
        validate: (r) => r.compassionateDescription.trim().length >= 1,
      },
      {
        id: "feeling_check",
        component: createStep(SliderStep, {
          title: "Feeling Check",
          subtitle: "How do you feel now?",
          fieldKey: "feelingCheck",
          min: 1,
          max: 10,
          minLabel: "Still critical",
          maxLabel: "Kind to myself",
        }),
        label: "How do you feel now? (1-10)",
        validate: () => true,
      },
      {
        id: "summary",
        component: createSummaryStep<SelfCriticismToCoachResponse>(
          [
            { label: "Critic Said", key: "selfCriticalThought" },
            { label: "Coach Says", key: "coachRewrite" },
            { label: "Feeling", key: "feelingCheck" },
          ],
          {
            title: "Inner coach activated!",
            exerciseType: "self_criticism_to_coach",
          },
        ),
        label: "Summary",
        validate: () => true,
        excludeFromProgress: true,
      },
    ],
  };

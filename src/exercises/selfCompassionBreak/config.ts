import type {
  ExerciseConfig,
  SelfCompassionBreakResponse,
} from "@/src/types/exerciseFlow";
import { createStep } from "@/src/components/exercise/steps/createStep";
import { createSummaryStep } from "@/src/components/exercise/steps/createSummaryStep";
import { IntroStep } from "@/src/components/exercise/steps/IntroStep";
import { TextInputStep } from "@/src/components/exercise/steps/TextInputStep";
import { AcknowledgeStep } from "@/src/components/exercise/steps/AcknowledgeStep";

const INITIAL: SelfCompassionBreakResponse = {
  struggle: "",
  mindfulnessAcknowledged: false,
  commonHumanityAcknowledged: false,
  friendAdvice: "",
  selfDirectedKindness: false,
};

export const selfCompassionBreakConfig: ExerciseConfig<SelfCompassionBreakResponse> =
  {
    type: "self_compassion_break",
    category: "self_compassion",
    title: "Self-Compassion Break",
    subtitle: "Treat yourself with the kindness you give friends",
    icon: "self_compassion_break",
    duration: "5-7 min",
    xp: 10,
    backgroundColor: "#fff",
    schemaVersion: 1,
    initialResponse: INITIAL,

    steps: [
      {
        id: "intro",
        component: createStep(IntroStep, {
          title: "Self-Compassion Break",
          subtitle: "Three steps to treat yourself with kindness.",
          exerciseType: "self_compassion_break",
          duration: "5-7 min",
          bulletPoints: [
            "Mindfulness — acknowledge suffering",
            "Common humanity — you're not alone",
            "Self-kindness — be gentle with yourself",
          ],
        }),
        label: "Welcome",
        validate: () => true,
        excludeFromProgress: true,
      },
      {
        id: "struggle",
        component: createStep(TextInputStep, {
          title: "Your Struggle",
          subtitle: "What are you struggling with right now?",
          fieldKey: "struggle",
          placeholder: "Right now I'm struggling with...",
        }),
        label: "What are you struggling with?",
        validate: (r) => r.struggle.trim().length >= 1,
      },
      {
        id: "mindfulness",
        component: createStep(AcknowledgeStep, {
          title: "Mindfulness",
          subtitle: "Acknowledge your pain without judgment.",
          fieldKey: "mindfulnessAcknowledged",
          body: '"This is a moment of suffering. This is hard."',
          buttonLabel: "I acknowledge this",
        }),
        label: 'Acknowledge: "This is a moment of suffering"',
        validate: (r) => r.mindfulnessAcknowledged,
      },
      {
        id: "common_humanity",
        component: createStep(AcknowledgeStep, {
          title: "Common Humanity",
          subtitle: "Remember you are not alone in this.",
          fieldKey: "commonHumanityAcknowledged",
          body: '"Suffering is part of being human. Others feel this way too."',
          buttonLabel: "I remember this",
        }),
        label: "Remember: Others struggle too",
        validate: (r) => r.commonHumanityAcknowledged,
      },
      {
        id: "friend_advice",
        component: createStep(TextInputStep, {
          title: "Friend Advice",
          subtitle: "What would you say to a dear friend in this situation?",
          fieldKey: "friendAdvice",
          placeholder: "I would tell them...",
        }),
        label: "What would you tell a friend?",
        validate: (r) => r.friendAdvice.trim().length >= 1,
      },
      {
        id: "self_kindness",
        component: createStep(AcknowledgeStep, {
          title: "Self-Kindness",
          subtitle: "Now direct that same kindness to yourself.",
          fieldKey: "selfDirectedKindness",
          body: "Place your hand on your heart and say the kind words to yourself.",
          buttonLabel: "I've done this",
        }),
        label: "Direct that kindness to yourself",
        validate: (r) => r.selfDirectedKindness,
      },
      {
        id: "summary",
        component: createSummaryStep<SelfCompassionBreakResponse>(
          [
            { label: "Struggle", key: "struggle" },
            { label: "Friend Advice", key: "friendAdvice" },
          ],
          {
            title: "Self-compassion practiced!",
            exerciseType: "self_compassion_break",
          },
        ),
        label: "Summary",
        validate: () => true,
        excludeFromProgress: true,
      },
    ],
  };

import type {
  ExerciseConfig,
  Grounding54321Response,
} from "@/src/types/exerciseFlow";
import { createStep } from "@/src/components/exercise/steps/createStep";
import { createDynamicSummaryStep } from "@/src/components/exercise/steps/createDynamicSummaryStep";
import { IntroStep } from "@/src/components/exercise/steps/IntroStep";
import { SliderStep } from "@/src/components/exercise/steps/SliderStep";
import { MultiTextInputStep } from "@/src/components/exercise/steps/MultiTextInputStep";

const INITIAL: Grounding54321Response = {
  see: [],
  touch: [],
  hear: [],
  smell: [],
  taste: [],
  prePresenceRating: 5,
  presenceRating: 5,
};

export const grounding54321Config: ExerciseConfig<Grounding54321Response> = {
  type: "grounding_54321",
  category: "mindfulness",
  title: "5-4-3-2-1 Grounding",
  subtitle: "Anchor yourself using your senses",
  icon: "grounding_54321",
  duration: "5-7 min",
  xp: 10,
  backgroundColor: "#fff",
  schemaVersion: 2,
  initialResponse: INITIAL,

  steps: [
    {
      id: "intro",
      component: createStep(IntroStep, {
        title: "5-4-3-2-1 Grounding",
        subtitle: "Use your senses to anchor yourself in the present moment.",
        exerciseType: "grounding_54321",
        duration: "5-7 min",
        bulletPoints: [
          "5 things you see",
          "4 things you touch",
          "3 things you hear",
          "2 things you smell",
          "1 thing you taste",
        ],
      }),
      label: "Welcome",
      validate: () => true,
      excludeFromProgress: true,
    },
    {
      id: "pre_presence_rating",
      component: createStep(SliderStep, {
        title: "Before We Start",
        subtitle: "How present and grounded do you feel right now?",
        fieldKey: "prePresenceRating",
        min: 1,
        max: 10,
        minLabel: "Not at all",
        maxLabel: "Fully present",
      }),
      label: "How present do you feel now? (1-10)",
      validate: () => true,
    },
    {
      id: "see_5",
      component: createStep(MultiTextInputStep, {
        title: "5 Things You See",
        subtitle: "Look around and name 5 things you can see right now.",
        fieldKey: "see",
        placeholder: "I can see...",
        minItems: 5,
        maxItems: 5,
      }),
      label: "Name 5 things you can see",
      validate: (r) => r.see.length >= 5,
    },
    {
      id: "touch_4",
      component: createStep(MultiTextInputStep, {
        title: "4 Things You Can Touch",
        subtitle: "Reach out and name 4 things you can feel.",
        fieldKey: "touch",
        placeholder: "I can touch...",
        minItems: 4,
        maxItems: 4,
      }),
      label: "Name 4 things you can touch",
      validate: (r) => r.touch.length >= 4,
    },
    {
      id: "hear_3",
      component: createStep(MultiTextInputStep, {
        title: "3 Things You Hear",
        subtitle: "Listen carefully and name 3 sounds.",
        fieldKey: "hear",
        placeholder: "I can hear...",
        minItems: 3,
        maxItems: 3,
      }),
      label: "Name 3 things you can hear",
      validate: (r) => r.hear.length >= 3,
    },
    {
      id: "smell_2",
      component: createStep(MultiTextInputStep, {
        title: "2 Things You Smell",
        subtitle: "Notice 2 scents around you.",
        fieldKey: "smell",
        placeholder: "I can smell...",
        minItems: 2,
        maxItems: 2,
      }),
      label: "Name 2 things you can smell",
      validate: (r) => r.smell.length >= 2,
    },
    {
      id: "taste_1",
      component: createStep(MultiTextInputStep, {
        title: "1 Thing You Taste",
        subtitle: "Notice one taste in your mouth.",
        fieldKey: "taste",
        placeholder: "I can taste...",
        minItems: 1,
        maxItems: 1,
      }),
      label: "Name 1 thing you can taste",
      validate: (r) => r.taste.length >= 1,
    },
    {
      id: "presence_rating",
      component: createStep(SliderStep, {
        title: "Presence Check",
        subtitle: "How present and grounded do you feel now?",
        fieldKey: "presenceRating",
        min: 1,
        max: 10,
        minLabel: "Not at all",
        maxLabel: "Fully present",
      }),
      label: "How present do you feel? (1-10)",
      validate: () => true,
    },
    {
      id: "summary",
      component: createDynamicSummaryStep({
        title: "Grounded!",
        celebrationEmoji: "🌱",
        exerciseType: "grounding_54321",
        preScoreKey: "prePresenceRating",
        postScoreKey: "presenceRating",
        scoreLabel: "Presence level",
        scoreMax: 10,
      }),
      label: "Summary",
      validate: () => true,
      excludeFromProgress: true,
    },
  ],
};

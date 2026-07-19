import type {
  ExerciseConfig,
  DecatastrophizingResponse,
} from "@/src/types/exerciseFlow";
import { createStep } from "@/src/components/exercise/steps/createStep";
import { DecatastrophizingSummary } from "./DecatastrophizingSummary";
import { IntroStep } from "@/src/components/exercise/steps/IntroStep";
import {MultiTextInputStep } from "@/src/components/exercise/steps/MultiTextInputStep";
import { SliderStep } from "@/src/components/exercise/steps/SliderStep";
import { BalanceSliderStep } from "@/src/components/exercise/steps/BalanceSliderStep";

const INITIAL: DecatastrophizingResponse = {
  fearedCatastrophe: "",
  probability: 50,
  copingPlan: "",
  mostLikelyOutcome: "",
  perspective1Week: "",
  perspective1Month: "",
  perspective1Year: "",
  anxietyBefore: 5,
  anxietyAfter: 5,
};

export const decatastrophizingConfig: ExerciseConfig<DecatastrophizingResponse> =
  {
    type: "decatastrophizing",
    category: "anxiety",
    title: "Decatastrophizing",
    subtitle: "Put feared outcomes in perspective",
    icon: "decatastrophizing",
    duration: "7-10 min",
    xp: 12,
    backgroundColor: "#fff",
    schemaVersion: 3,
    initialResponse: INITIAL,
    migrate: (old, fromVersion) => {
      if (fromVersion < 3) {
        return {
          ...INITIAL,
          ...old,
          perspective1Month: old.perspective1Month ?? "",
          perspective1Year: old.perspective1Year ?? "",
        };
      }
      return old;
    },

    steps: [
      {
        id: "intro",
        component: createStep(IntroStep, {
          title: "Decatastrophizing",
          subtitle:
            "Feared outcomes rarely come true. Let's put them in perspective.",
          exerciseType: "decatastrophizing",
          duration: "7-10 min",
          bulletPoints: [
            "Identify your feared catastrophe",
            "Estimate its real probability",
            "Create a practical coping plan",
            "Put the outcome in perspective",
          ],
        }),
        label: "Welcome",
        validate: () => true,
        excludeFromProgress: true,
      },
      {
        id: "anxiety_before",
        component: createStep(SliderStep, {
          title: "Before We Start",
          subtitle: "How anxious does this fear make you feel?",
          fieldKey: "anxietyBefore",
          min: 1,
          max: 10,
          minLabel: "Calm",
          maxLabel: "Very anxious",
        }),
        label: "How anxious do you feel? (1-10)",
        validate: () => true,
      },
      {
        id: "feared_catastrophe",
        component: createStep(MultiTextInputStep, {
        maxItems: 1,
          title: "The Fear",
          subtitle: "What catastrophe are you imagining?",
          fieldKey: "fearedCatastrophe",
          placeholder: "I fear that...",
          validationMessage:
            "Catastrophic thoughts feel absolutely real when they hit. Let's slow down and look at the full picture together.",
        }),
        label: "What catastrophe do you fear?",
        validate: (r) => r.fearedCatastrophe.trim().length >= 1,
      },
      {
        id: "probability",
        component: createStep(BalanceSliderStep, {
          title: "Probability",
          subtitle: "Realistically, how likely is this?",
          fieldKey: "probability",
          leftLabel: "Impossible",
          rightLabel: "Certain",
          colors: {
            left: { box: "#F1F5F9", label: "#475569", percentage: "#1E293B" }, // Slate 100, 600, 800
            right: { box: "#FFE4E6", label: "#E11D48", percentage: "#9F1239" }, // Rose 100, 600, 800
          },
          psychoeducationText:
            "Anxiety inflates probability estimates. Explicitly rating likelihood activates your rational brain and deflates the fear.",
        }),
        label: "How likely is this? (0-100%)",
        validate: () => true,
      },
      {
        id: "coping_plan",
        component: createStep(MultiTextInputStep, {
        maxItems: 1,
          title: "Coping Plan",
          subtitle: "If it did happen, how could you cope?",
          fieldKey: "copingPlan",
          placeholder: "I could cope by...",
          psychoeducationText:
            "Having a plan reduces anxiety even if you never use it. Your brain settles when it knows you have a response ready.",
        }),
        label: "How could you cope?",
        validate: (r) => r.copingPlan.trim().length >= 1,
      },
      {
        id: "most_likely_outcome",
        component: createStep(MultiTextInputStep, {
          title: "Most Likely Outcome",
          subtitle: "What is most likely to actually happen?",
          fieldKey: "mostLikelyOutcome",
          placeholder: "Most likely...",
        }),
        label: "What is most likely to happen?",
        validate: (r) => r.mostLikelyOutcome.trim().length >= 1,
        ai: {
          promptBuilder: (r) =>
            `The user fears: "${r.fearedCatastrophe}" with ${r.probability}% probability estimate.\nCoping plan: "${r.copingPlan}"\n\nSuggest 2 realistic most-likely outcomes that are more balanced than the catastrophe. Each should be specific and grounded.`,
          responseSchema: {
            type: "array",
            items: {
              type: "object",
              properties: { text: { type: "string" } },
              required: ["text"],
            },
          },
          maxResults: 2,
          aiLoadingMessage: "Finding realistic outcomes...",
        },
      },
      {
        id: "perspective_1_week",
        component: createStep(MultiTextInputStep, {
        maxItems: 1,
          title: "In One Week",
          subtitle: "How will this situation look in 7 days?",
          fieldKey: "perspective1Week",
          placeholder: "In a week, this will probably...",
          validationMessage: "That's a useful perspective shift. Keep going.",
          psychoeducationText:
            "Anxiety narrows your time horizon to right now. Zooming out reveals that most threats shrink with time.",
        }),
        label: "One week from now",
        validate: (r) => r.perspective1Week.trim().length >= 1,
      },
      {
        id: "perspective_1_month",
        component: createStep(MultiTextInputStep, {
        maxItems: 1,
          title: "In One Month",
          subtitle: "What else will have happened by then?",
          fieldKey: "perspective1Month",
          placeholder: "In a month, I'll probably...",
          tipText: "Life keeps moving. What else might change by then?",
        }),
        label: "One month from now",
        validate: (r) => r.perspective1Month.trim().length >= 1,
      },
      {
        id: "perspective_1_year",
        component: createStep(MultiTextInputStep, {
        maxItems: 1,
          title: "In One Year",
          subtitle: "How much will this matter in the bigger picture?",
          fieldKey: "perspective1Year",
          placeholder: "In a year, this will...",
          tipText: "A year from now, how much mental space will this take up?",
        }),
        label: "One year from now",
        validate: (r) => r.perspective1Year.trim().length >= 1,
      },
      {
        id: "anxiety_after",
        component: createStep(SliderStep, {
          title: "After Perspective",
          subtitle: "How anxious does this fear make you feel now?",
          fieldKey: "anxietyAfter",
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
        component: DecatastrophizingSummary,
        label: "Summary",
        validate: () => true,
        excludeFromProgress: true,
        hideHeader: true,
      },
    ],
  };

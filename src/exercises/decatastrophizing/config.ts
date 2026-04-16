import type {
  ExerciseConfig,
  DecatastrophizingResponse,
} from "@/src/types/exerciseFlow";
import { createStep } from "@/src/components/exercise/steps/createStep";
import { createSummaryStep } from "@/src/components/exercise/steps/createSummaryStep";
import { IntroStep } from "@/src/components/exercise/steps/IntroStep";
import { TextInputStep } from "@/src/components/exercise/steps/TextInputStep";
import { SliderStep } from "@/src/components/exercise/steps/SliderStep";
import { AITextInputStep } from "@/src/components/exercise/steps/AITextInputStep";

const INITIAL: DecatastrophizingResponse = {
  fearedCatastrophe: "",
  probability: 50,
  copingPlan: "",
  mostLikelyOutcome: "",
  perspective1Week: "",
  perspective1Month: "",
  perspective1Year: "",
};

export const decatastrophizingConfig: ExerciseConfig<DecatastrophizingResponse> =
  {
    type: "decatastrophizing",
    category: "anxiety",
    title: "Decatastrophizing",
    subtitle: "Put feared outcomes in perspective",
    icon: "decatastrophizing",
    duration: "5-7 min",
    xp: 12,
    backgroundColor: "#E1F5FE",
    schemaVersion: 1,
    initialResponse: INITIAL,

    steps: [
      {
        id: "intro",
        component: createStep(IntroStep, {
          title: "Decatastrophizing",
          subtitle:
            "Feared outcomes rarely come true. Let's put them in perspective.",
          exerciseType: "decatastrophizing",
          duration: "5-7 min",
        }),
        label: "Welcome",
        validate: () => true,
        excludeFromProgress: true,
      },
      {
        id: "feared_catastrophe",
        component: createStep(TextInputStep, {
          title: "The Fear",
          subtitle: "What catastrophe are you imagining?",
          fieldKey: "fearedCatastrophe",
          placeholder: "I fear that...",
        }),
        label: "What catastrophe do you fear?",
        validate: (r) => r.fearedCatastrophe.trim().length >= 1,
      },
      {
        id: "probability",
        component: createStep(SliderStep, {
          title: "Probability",
          subtitle: "Realistically, how likely is this?",
          fieldKey: "probability",
          min: 0,
          max: 100,
          minLabel: "Impossible",
          maxLabel: "Certain",
          unit: "%",
        }),
        label: "How likely is this? (0-100%)",
        validate: () => true,
      },
      {
        id: "coping_plan",
        component: createStep(TextInputStep, {
          title: "Coping Plan",
          subtitle: "If it did happen, how could you cope?",
          fieldKey: "copingPlan",
          placeholder: "I could cope by...",
        }),
        label: "How could you cope?",
        validate: (r) => r.copingPlan.trim().length >= 1,
      },
      {
        id: "most_likely_outcome",
        component: createStep(AITextInputStep, {
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
        },
      },
      {
        id: "time_perspective",
        component: createStep(TextInputStep, {
          title: "Time Perspective",
          subtitle: "How will this look in 1 week, 1 month, 1 year?",
          fieldKey: "perspective1Week",
          placeholder: "In a week: ... In a month: ... In a year: ...",
        }),
        label: "How will this look in 1 week / 1 month / 1 year?",
        validate: (r) => r.perspective1Week.trim().length >= 1,
      },
      {
        id: "summary",
        component: createSummaryStep<DecatastrophizingResponse>(
          [
            { label: "Fear", key: "fearedCatastrophe" },
            { label: "Probability", key: "probability" },
            { label: "Most Likely", key: "mostLikelyOutcome" },
            { label: "Coping Plan", key: "copingPlan" },
          ],
          {
            title: "Fear put in perspective!",
            exerciseType: "decatastrophizing",
          },
        ),
        label: "Summary",
        validate: () => true,
        excludeFromProgress: true,
      },
    ],
  };

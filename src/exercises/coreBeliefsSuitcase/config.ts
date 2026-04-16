import type {
  ExerciseConfig,
  CoreBeliefsSuitcaseResponse,
} from "@/src/types/exerciseFlow";
import { createStep } from "@/src/components/exercise/steps/createStep";
import { createSummaryStep } from "@/src/components/exercise/steps/createSummaryStep";
import { IntroStep } from "@/src/components/exercise/steps/IntroStep";
import { TextInputStep } from "@/src/components/exercise/steps/TextInputStep";
import { MultiTextInputStep } from "@/src/components/exercise/steps/MultiTextInputStep";
import { AITextInputStep } from "@/src/components/exercise/steps/AITextInputStep";
import { SliderStep } from "@/src/components/exercise/steps/SliderStep";

const INITIAL: CoreBeliefsSuitcaseResponse = {
  negativeCoreBelief: "",
  origin: "",
  evidenceFor: [],
  evidenceAgainst: [],
  rewrittenBelief: "",
  beliefRating: 50,
};

export const coreBeliefsSuitcaseConfig: ExerciseConfig<CoreBeliefsSuitcaseResponse> =
  {
    type: "core_beliefs_suitcase",
    category: "self_esteem",
    title: "Core Beliefs Suitcase",
    subtitle: "Unpack and rewrite deep-seated beliefs",
    icon: "core_beliefs_suitcase",
    duration: "10-15 min",
    xp: 15,
    backgroundColor: "#fff",
    schemaVersion: 1,
    initialResponse: INITIAL,

    steps: [
      {
        id: "intro",
        component: createStep(IntroStep, {
          title: "Core Beliefs Suitcase",
          subtitle:
            "Unpack the beliefs you've been carrying and lighten the load.",
          exerciseType: "core_beliefs_suitcase",
          duration: "10-15 min",
        }),
        label: "Welcome",
        validate: () => true,
        excludeFromProgress: true,
      },
      {
        id: "identify_belief",
        component: createStep(TextInputStep, {
          title: "The Core Belief",
          subtitle: "Name a negative belief you hold about yourself.",
          fieldKey: "negativeCoreBelief",
          placeholder: "I believe I am...",
        }),
        label: "Name a negative core belief",
        validate: (r) => r.negativeCoreBelief.trim().length >= 1,
      },
      {
        id: "origin",
        component: createStep(TextInputStep, {
          title: "Origin Story",
          subtitle: "Where did this belief come from?",
          fieldKey: "origin",
          placeholder: "This belief started when...",
        }),
        label: "Where did this belief come from?",
        validate: (r) => r.origin.trim().length >= 1,
      },
      {
        id: "evidence_for",
        component: createStep(MultiTextInputStep, {
          title: "Evidence For",
          subtitle: "What evidence seems to support this belief?",
          fieldKey: "evidenceFor",
          placeholder: "One piece of evidence...",
        }),
        label: "Evidence supporting the belief",
        validate: () => true,
      },
      {
        id: "evidence_against",
        component: createStep(MultiTextInputStep, {
          title: "Evidence Against",
          subtitle: "What evidence contradicts this belief?",
          fieldKey: "evidenceAgainst",
          placeholder: "On the other hand...",
        }),
        label: "Evidence against the belief",
        validate: () => true,
      },
      {
        id: "rewrite",
        component: createStep(AITextInputStep, {
          title: "Rewrite the Belief",
          subtitle: "Write a more balanced, realistic version.",
          fieldKey: "rewrittenBelief",
          placeholder: "A more balanced belief is...",
        }),
        label: "Rewrite the belief",
        validate: (r) => r.rewrittenBelief.trim().length >= 1,
        ai: {
          promptBuilder: (r) => {
            const ef =
              r.evidenceFor.length > 0 ? r.evidenceFor.join("; ") : "None";
            const ea =
              r.evidenceAgainst.length > 0
                ? r.evidenceAgainst.join("; ")
                : "None";
            return `The user holds the core belief: "${r.negativeCoreBelief}" (origin: "${r.origin}").\nEvidence for: ${ef}\nEvidence against: ${ea}\n\nSuggest 2 rewritten, more balanced core beliefs. Each should be realistic and self-affirming.`;
          },
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
        id: "belief_rating",
        component: createStep(SliderStep, {
          title: "New Belief Strength",
          subtitle: "How much do you believe the rewritten version?",
          fieldKey: "beliefRating",
          min: 0,
          max: 100,
          minLabel: "Not at all",
          maxLabel: "Completely",
          unit: "%",
        }),
        label: "How much do you believe the new one? (0-100%)",
        validate: () => true,
      },
      {
        id: "summary",
        component: createSummaryStep<CoreBeliefsSuitcaseResponse>(
          [
            { label: "Old Belief", key: "negativeCoreBelief" },
            { label: "New Belief", key: "rewrittenBelief" },
            { label: "Belief Strength", key: "beliefRating" },
          ],
          {
            title: "Suitcase lightened!",
            exerciseType: "core_beliefs_suitcase",
          },
        ),
        label: "Summary",
        validate: () => true,
        excludeFromProgress: true,
      },
    ],
  };

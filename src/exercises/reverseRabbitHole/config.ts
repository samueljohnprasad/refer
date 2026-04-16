import type {
  ExerciseConfig,
  ReverseRabbitHoleResponse,
} from "@/src/types/exerciseFlow";
import { createStep } from "@/src/components/exercise/steps/createStep";
import { createSummaryStep } from "@/src/components/exercise/steps/createSummaryStep";
import { IntroStep } from "@/src/components/exercise/steps/IntroStep";
import { TextInputStep } from "@/src/components/exercise/steps/TextInputStep";
import { ChoiceStep } from "@/src/components/exercise/steps/ChoiceStep";

const INITIAL: ReverseRabbitHoleResponse = {
  worry: "",
  worstOutcome: "",
  flippedSpiral: "",
  bestRealisticOutcome: "",
  whichSpiralDeservesEnergy: null,
};

export const reverseRabbitHoleConfig: ExerciseConfig<ReverseRabbitHoleResponse> =
  {
    type: "reverse_rabbit_hole",
    category: "overthinking",
    title: "Reverse Rabbit Hole",
    subtitle: "Flip your worry spiral into a positive one",
    icon: "reverse_rabbit_hole",
    duration: "5-7 min",
    xp: 10,
    backgroundColor: "#FFF3E0",
    schemaVersion: 1,
    initialResponse: INITIAL,

    steps: [
      {
        id: "intro",
        component: createStep(IntroStep, {
          title: "Reverse Rabbit Hole",
          subtitle: "You can spiral up just as easily as you spiral down.",
          exerciseType: "reverse_rabbit_hole",
          duration: "5-7 min",
        }),
        label: "Welcome",
        validate: () => true,
        excludeFromProgress: true,
      },
      {
        id: "write_worry",
        component: createStep(TextInputStep, {
          title: "The Worry Spiral",
          subtitle: "Describe the negative spiral in your mind.",
          fieldKey: "worry",
          placeholder: "My worry spiral goes like this...",
        }),
        label: "Describe your worry spiral",
        validate: (r) => r.worry.trim().length >= 1,
      },
      {
        id: "worst_outcome",
        component: createStep(TextInputStep, {
          title: "Worst Outcome",
          subtitle: "Where does this spiral end up?",
          fieldKey: "worstOutcome",
          placeholder: "The worst case would be...",
        }),
        label: "What is the worst outcome?",
        validate: (r) => r.worstOutcome.trim().length >= 1,
      },
      {
        id: "flip_it",
        component: createStep(TextInputStep, {
          title: "Flip the Spiral",
          subtitle: "Now rewrite each step in a positive direction.",
          fieldKey: "flippedSpiral",
          placeholder: "Instead, what if...",
        }),
        label: "Rewrite each step positively",
        validate: (r) => r.flippedSpiral.trim().length >= 1,
      },
      {
        id: "best_realistic_outcome",
        component: createStep(TextInputStep, {
          title: "Best Realistic Outcome",
          subtitle: "Where does the positive spiral lead?",
          fieldKey: "bestRealisticOutcome",
          placeholder: "Realistically, the best outcome is...",
        }),
        label: "Best realistic outcome?",
        validate: (r) => r.bestRealisticOutcome.trim().length >= 1,
      },
      {
        id: "which_spiral",
        component: createStep(ChoiceStep, {
          title: "Choose Your Spiral",
          subtitle: "Which spiral deserves your mental energy?",
          fieldKey: "whichSpiralDeservesEnergy",
          options: [
            {
              value: "negative",
              label: "The worry spiral",
              iconKey: "arrow_down",
            },
            {
              value: "positive",
              label: "The positive spiral",
              iconKey: "arrow_up",
            },
          ],
        }),
        label: "Which spiral deserves your energy?",
        validate: (r) => r.whichSpiralDeservesEnergy !== null,
      },
      {
        id: "summary",
        component: createSummaryStep<ReverseRabbitHoleResponse>(
          [
            { label: "Worry", key: "worry" },
            { label: "Flipped", key: "flippedSpiral" },
            { label: "Best Outcome", key: "bestRealisticOutcome" },
            { label: "Chose", key: "whichSpiralDeservesEnergy" },
          ],
          { title: "Spiral flipped!", exerciseType: "reverse_rabbit_hole" },
        ),
        label: "Summary",
        validate: () => true,
        excludeFromProgress: true,
      },
    ],
  };

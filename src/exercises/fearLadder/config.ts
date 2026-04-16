import type {
  ExerciseConfig,
  FearLadderResponse,
} from "@/src/types/exerciseFlow";
import { createStep } from "@/src/components/exercise/steps/createStep";
import { createSummaryStep } from "@/src/components/exercise/steps/createSummaryStep";
import { IntroStep } from "@/src/components/exercise/steps/IntroStep";
import { MultiTextInputStep } from "@/src/components/exercise/steps/MultiTextInputStep";
import { TextInputStep } from "@/src/components/exercise/steps/TextInputStep";
import { SliderStep } from "@/src/components/exercise/steps/SliderStep";

const INITIAL: FearLadderResponse = {
  fears: [],
  rankedFears: [],
  firstRung: "",
  exposurePlan: "",
  anxietyBefore: 5,
  anxietyDuring: 5,
  anxietyAfter: 5,
  habituationInsight: "",
};

export const fearLadderConfig: ExerciseConfig<FearLadderResponse> = {
  type: "fear_ladder",
  category: "anxiety",
  title: "Fear Ladder",
  subtitle: "Gradually face your fears, one rung at a time",
  icon: "fear_ladder",
  duration: "10-15 min",
  xp: 15,
  backgroundColor: "#FBE9E7",
  schemaVersion: 1,
  initialResponse: INITIAL,

  steps: [
    {
      id: "intro",
      component: createStep(IntroStep, {
        title: "Fear Ladder",
        subtitle:
          "Build a ladder of feared situations and start with the easiest.",
        exerciseType: "fear_ladder",
        duration: "10-15 min",
      }),
      label: "Welcome",
      validate: () => true,
      excludeFromProgress: true,
    },
    {
      id: "list_fears",
      component: createStep(MultiTextInputStep, {
        title: "List Your Fears",
        subtitle: "Write down situations that scare you.",
        fieldKey: "fears",
        placeholder: "A situation I fear...",
        minItems: 1,
      }),
      label: "List your fears",
      validate: (r) => r.fears.length >= 1,
    },
    {
      id: "rank",
      component: createStep(MultiTextInputStep, {
        title: "Rank by Difficulty",
        subtitle: "Reorder from least scary to most scary.",
        fieldKey: "rankedFears",
        placeholder: "Ranked fear...",
        minItems: 1,
      }),
      label: "Rank fears by scariness",
      validate: (r) => r.rankedFears.length >= 1,
    },
    {
      id: "pick_first_rung",
      component: createStep(TextInputStep, {
        title: "First Rung",
        subtitle: "Which is the easiest fear to start with?",
        fieldKey: "firstRung",
        placeholder: "I'll start with...",
      }),
      label: "Pick the easiest fear",
      validate: (r) => r.firstRung.length > 0,
    },
    {
      id: "plan_exposure",
      component: createStep(TextInputStep, {
        title: "Exposure Plan",
        subtitle: "How will you safely face this fear?",
        fieldKey: "exposurePlan",
        placeholder: "My plan is to...",
      }),
      label: "Plan your exposure",
      validate: (r) => r.exposurePlan.trim().length >= 1,
    },
    {
      id: "anxiety_before",
      component: createStep(SliderStep, {
        title: "Anxiety Before",
        subtitle: "Rate your anxiety before the exposure.",
        fieldKey: "anxietyBefore",
        min: 0,
        max: 10,
        minLabel: "Calm",
        maxLabel: "Extreme",
      }),
      label: "Anxiety before (0-10)",
      validate: () => true,
    },
    {
      id: "post_exposure",
      component: createStep(SliderStep, {
        title: "Anxiety After",
        subtitle: "How anxious do you feel after the exposure?",
        fieldKey: "anxietyAfter",
        min: 0,
        max: 10,
        minLabel: "Calm",
        maxLabel: "Extreme",
      }),
      label: "Anxiety during & after",
      validate: () => true,
    },
    {
      id: "habituation_insight",
      component: createStep(TextInputStep, {
        title: "What Did You Learn?",
        subtitle: "What insight did you gain from facing this fear?",
        fieldKey: "habituationInsight",
        placeholder: "I learned that...",
      }),
      label: "What did you learn?",
      validate: (r) => r.habituationInsight.trim().length >= 1,
    },
    {
      id: "summary",
      component: createSummaryStep<FearLadderResponse>(
        [
          { label: "First Rung", key: "firstRung" },
          { label: "Anxiety Before", key: "anxietyBefore" },
          { label: "Anxiety After", key: "anxietyAfter" },
          { label: "Insight", key: "habituationInsight" },
        ],
        { title: "Brave step taken!", exerciseType: "fear_ladder" },
      ),
      label: "Summary",
      validate: () => true,
      excludeFromProgress: true,
    },
  ],
};

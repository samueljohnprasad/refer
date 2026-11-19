import type { ExerciseConfig, FearLadderResponse } from "@/src/types/exerciseFlow";
import { FLFearStep, FLIntroStep, FLLearnedStep, FLPeakStep, FLPostStep, FLPredictStep, longEnough } from "./flSteps";
import { FLPickStep, FLRateStep, FLRungsStep, MIN_RUNGS } from "./flLadderSteps";
import { FLHoldStep } from "./flHoldStep";
import { FLSummaryStep } from "./flSummary";

const INITIAL: FearLadderResponse = {
  fear: "",
  peakFear: 7,
  rungs: [],
  rungRatings: {},
  pickedRung: "",
  startAnxiety: 5,
  prediction: "",
  holdCompleted: false,
  postAnxiety: 5,
  learned: "",
};

// ponytail: the step list of .agents/fear-ladder.html. Every step is a Fear Ladder component drawn from the
// prototype; the state the engine saves each step (rungs, ratings, pickedRung) is what lets a paused run
// say "rung 2 of 5".
export const fearLadderConfig: ExerciseConfig<FearLadderResponse> = {
  type: "fear_ladder",
  category: "anxiety",
  title: "Fear Ladder",
  subtitle: "Break a fear into rungs and stay with the easiest one.",
  icon: "fear_ladder",
  duration: "15-20 min",
  xp: 15,
  backgroundColor: "#fff",
  schemaVersion: 1,
  initialResponse: INITIAL,
  steps: [
    { id: "intro", component: FLIntroStep, label: "Welcome", validate: () => true, excludeFromProgress: true, nextLabel: "Begin" },
    { id: "fear", component: FLFearStep, label: "The fear", validate: (r) => longEnough(r.fear) },
    { id: "peak", component: FLPeakStep, label: "Worst version", validate: () => true },
    { id: "rungs", component: FLRungsStep, label: "Smaller steps", validate: (r) => r.rungs.length >= MIN_RUNGS },
    { id: "rate", component: FLRateStep, label: "Rate each", validate: () => true },
    { id: "pick", component: FLPickStep, label: "Pick one", validate: (r) => r.rungs.includes(r.pickedRung) },
    { id: "predict", component: FLPredictStep, label: "Your prediction", validate: (r) => longEnough(r.prediction) },
    { id: "hold", component: FLHoldStep, label: "Try the rung", validate: () => true },
    { id: "post", component: FLPostStep, label: "After", validate: () => true },
    { id: "learned", component: FLLearnedStep, label: "What happened", validate: (r) => longEnough(r.learned) },
    {
      id: "summary",
      component: FLSummaryStep,
      label: "Summary",
      validate: () => true,
      excludeFromProgress: true,
      nextLabel: "Complete",
      secondaryLabel: "Edit answers",
    },
  ],
};

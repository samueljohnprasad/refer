import type { BehavioralActivationResponse, ExerciseConfig } from "@/src/types/exerciseFlow";
import { MAX_ACTIVITIES, isPlanned } from "./activities";
import { BASummaryStep } from "./BASummaryStep";
import { BaDoStep, BaFeltStep, BaGuessStep, BaMoodAfterStep, BaMoodBeforeStep } from "./baFeelSteps";
import { BaIntroStep } from "./baIntroStep";
import { BaPickStep } from "./baPickStep";
import { BaNowStep, BaPlanStep, BaSizeStep } from "./baPlanSteps";

const INITIAL: BehavioralActivationResponse = {
  mood: 4,
  activities: [],
  sizes: {},
  plans: {},
  tryNow: "",
  didIt: false,
  expectedEnjoyment: 5,
  expectedAccomplishment: 5,
  actualEnjoyment: 5,
  actualAccomplishment: 5,
  moodAfter: 4,
};

// ponytail: .agents/behavioral-activation.html as a step list; every step is drawn by this folder's own
// prototype components. Stages in the prototype: Pick, Plan, Do, Notice.
export const behavioralActivationConfig: ExerciseConfig<BehavioralActivationResponse> = {
  type: "behavioral_activation",
  category: "cbt_core",
  title: "Behavioral Activation",
  subtitle: "Pick one small thing to do today and see how it actually feels.",
  icon: "behavioral_activation",
  duration: "8-10 min",
  xp: 10,
  backgroundColor: "#fff",
  schemaVersion: 1,
  initialResponse: INITIAL,
  steps: [
    { id: "intro", component: BaIntroStep, label: "Welcome", nextLabel: "Begin", validate: () => true, excludeFromProgress: true },
    { id: "mood", component: BaMoodBeforeStep, label: "Mood before", validate: () => true },
    { id: "pick", component: BaPickStep, label: "Pick activities", validate: (r) => r.activities.length >= 1 && r.activities.length <= MAX_ACTIVITIES },
    { id: "size", component: BaSizeStep, label: "How small", validate: () => true },
    { id: "plan", component: BaPlanStep, label: "When", validate: (r) => r.activities.every((k) => isPlanned(r, k)) },
    { id: "now", component: BaNowStep, label: "Try now", validate: (r) => r.activities.includes(r.tryNow) },
    { id: "expect", component: BaGuessStep, label: "Guess", validate: () => true },
    { id: "do", component: BaDoStep, label: "Do it", nextLabel: "I did it", validate: () => true },
    { id: "feel", component: BaFeltStep, label: "How it felt", validate: () => true },
    { id: "mood_after", component: BaMoodAfterStep, label: "Mood after", validate: () => true },
    { id: "summary", component: BASummaryStep, label: "Summary", nextLabel: "Save and finish", validate: () => true, excludeFromProgress: true },
  ],
};

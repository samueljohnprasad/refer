import type {
  ExerciseConfig,
  ABCAnalysisResponse,
} from "@/src/types/exerciseFlow";
import {
  AbcChecksStep,
  AbcIntroStep,
  ABCActivatingEventStep,
  ABCAlternativeBeliefStep,
  ABCBeliefStep,
  ABCConsequenceEmotionStep,
  ABCPostStrengthStep,
  ABCPreStrengthStep,
  hasSelectedABCEmotion,
} from "./customSteps";
import { ABCSummaryStep } from "./ABCSummaryStep";
import { words } from "@/src/domains/thoughtCatcher/domain/words";
import { checksComplete, ownWords } from "./abcDomain";

const INITIAL: ABCAnalysisResponse = {
  activatingEvent: "",
  belief: "",
  consequenceEmotion: "",
  consequenceBehavior: "",
  alternativeBelief: "",
  newConsequence: "",
  preEmotionalIntensity: 5,
  postEmotionalIntensity: 5,
  beliefChecks: {},
};

export const abcAnalysisConfig: ExerciseConfig<ABCAnalysisResponse> = {
  type: "abc_analysis",
  category: "cbt_core",
  title: "ABC Analysis",
  subtitle: "See how a moment, a thought, and a reaction connect.",
  icon: "abc_analysis",
  duration: "7-10 min",
  xp: 15,
  backgroundColor: "#fff",
  schemaVersion: 2,
  initialResponse: INITIAL,

  steps: [
    {
      id: "intro",
      component: AbcIntroStep,
      label: "Welcome",
      nextLabel: "Begin",
      validate: () => true,
      excludeFromProgress: true,
    },
    {
      id: "activating_event",
      component: ABCActivatingEventStep,
      label: "What happened?",
      validate: (r) => words(r.activatingEvent) >= 2,
    },
    {
      id: "consequence_emotion",
      component: ABCConsequenceEmotionStep,
      label: "How did you feel?",
      validate: (r) => hasSelectedABCEmotion(r.consequenceEmotion),
    },
    {
      id: "pre_emotional_intensity",
      component: ABCPreStrengthStep,
      label: "How strong is it right now? (0-10)",
      validate: () => true,
    },
    {
      id: "belief",
      component: ABCBeliefStep,
      label: "Automatic thought",
      validate: (r) => words(ownWords(r.belief)) >= 2,
    },
    {
      id: "belief_checks",
      component: AbcChecksStep,
      label: "Check the thought",
      validate: (r) => checksComplete(r.beliefChecks),
    },
    {
      id: "alternative_belief",
      component: ABCAlternativeBeliefStep,
      label: "A fairer way to say it",
      validate: (r) => words(ownWords(r.alternativeBelief)) >= 2,
    },
    {
      id: "post_emotional_intensity",
      component: ABCPostStrengthStep,
      label: "How strong is it now? (0-10)",
      validate: () => true,
    },
    {
      id: "summary",
      component: ABCSummaryStep,
      label: "Summary",
      nextLabel: "Save and finish",
      validate: () => true,
      excludeFromProgress: true,
    },
  ],
};

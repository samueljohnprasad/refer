import { AngerThermometerResponse, ExerciseConfig } from "@/src/types/exerciseFlow";
import {
  AngerThermometerCopingSkillStep,
  AngerThermometerPostRatingStep,
  AngerThermometerRatingStep,
  AngerThermometerSummaryStep,
  AngerThermometerTechniqueStep,
  AngerThermometerThoughtsStep,
  AngerThermometerTriggerStep,
} from "./customSteps";

const INITIAL: AngerThermometerResponse = {
  angerRating: 5,
  trigger: "",
  thoughts: "",
  matchedCopingSkill: "",
  techniqueCompleted: false,
  postAngerRating: 5,
};

export const angerThermometerConfig: ExerciseConfig<AngerThermometerResponse> =
  {
    type: "anger_thermometer",
    category: "anger",
    title: "Anger Thermometer",
    subtitle: "Measure and cool down your anger",
    icon: "anger_thermometer",
    duration: "5-7 min",
    xp: 10,
    backgroundColor: "#fff",
    schemaVersion: 1,
    initialResponse: INITIAL,

    steps: [
      {
        id: "anger_rating",
        component: AngerThermometerRatingStep,
        label: "Rate your anger (0-10)",
        validate: () => true,
      },
      {
        id: "trigger",
        component: AngerThermometerTriggerStep,
        label: "What triggered this?",
        validate: (r) => r.trigger.trim().length >= 1,
      },
      {
        id: "thoughts",
        component: AngerThermometerThoughtsStep,
        label: "What thoughts are fuelling it?",
        validate: (r) => r.thoughts.trim().length >= 1,
      },
      {
        id: "coping_skill",
        component: AngerThermometerCopingSkillStep,
        label: "Match a coping skill",
        validate: (r) => r.matchedCopingSkill.length > 0,
      },
      {
        id: "do_technique",
        component: AngerThermometerTechniqueStep,
        label: "Do the technique (60s)",
        validate: (r) => r.techniqueCompleted,
      },
      {
        id: "post_anger_rating",
        component: AngerThermometerPostRatingStep,
        label: "Anger now? (0-10)",
        validate: () => true,
      },
      {
        id: "summary",
        component: AngerThermometerSummaryStep,
        label: "Summary",
        validate: () => true,
        excludeFromProgress: true,
      },
    ],
  };

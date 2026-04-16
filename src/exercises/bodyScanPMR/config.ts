import type {
  ExerciseConfig,
  BodyScanPMRResponse,
} from "@/src/types/exerciseFlow";
import { createStep } from "@/src/components/exercise/steps/createStep";
import { createSummaryStep } from "@/src/components/exercise/steps/createSummaryStep";
import { IntroStep } from "@/src/components/exercise/steps/IntroStep";
import { SliderStep } from "@/src/components/exercise/steps/SliderStep";
import { ChecklistStep } from "@/src/components/exercise/steps/ChecklistStep";

const INITIAL: BodyScanPMRResponse = {
  preTensionRating: 5,
  completedAreas: [],
  postTensionRating: 5,
};

export const bodyScanPMRConfig: ExerciseConfig<BodyScanPMRResponse> = {
  type: "body_scan_pmr",
  category: "mindfulness",
  title: "Body Scan & PMR",
  subtitle: "Release tension from head to toe",
  icon: "body_scan_pmr",
  duration: "10-15 min",
  xp: 12,
  backgroundColor: "#fff",
  schemaVersion: 1,
  initialResponse: INITIAL,

  steps: [
    {
      id: "intro",
      component: createStep(IntroStep, {
        title: "Body Scan & PMR",
        subtitle: "Progressively relax your muscles from head to toe.",
        exerciseType: "body_scan_pmr",
        duration: "10-15 min",
        bulletPoints: [
          "Tense each muscle group for 5 seconds",
          "Release and notice the difference",
          "Move through your whole body",
        ],
      }),
      label: "Welcome",
      validate: () => true,
      excludeFromProgress: true,
    },
    {
      id: "pre_tension_rating",
      component: createStep(SliderStep, {
        title: "Before We Start",
        subtitle: "How tense does your body feel?",
        fieldKey: "preTensionRating",
        min: 1,
        max: 10,
        minLabel: "Very relaxed",
        maxLabel: "Very tense",
      }),
      label: "Rate your tension (1-10)",
      validate: () => true,
    },
    {
      id: "guided_body_scan",
      component: createStep(ChecklistStep, {
        title: "Body Scan",
        subtitle: "Tense and release each area. Check off when done.",
        fieldKey: "completedAreas",
        presetItems: [
          { label: "Forehead & Scalp", value: "forehead" },
          { label: "Jaw & Face", value: "jaw" },
          { label: "Neck & Shoulders", value: "neck" },
          { label: "Arms & Hands", value: "arms" },
          { label: "Chest & Upper Back", value: "chest" },
          { label: "Stomach & Lower Back", value: "stomach" },
          { label: "Hips & Glutes", value: "hips" },
          { label: "Legs & Feet", value: "legs" },
        ],
        minChecked: 5,
      }),
      label: "Body scan",
      validate: (r) => r.completedAreas.length >= 5,
    },
    {
      id: "post_tension_rating",
      component: createStep(SliderStep, {
        title: "After the Scan",
        subtitle: "How tense does your body feel now?",
        fieldKey: "postTensionRating",
        min: 1,
        max: 10,
        minLabel: "Very relaxed",
        maxLabel: "Very tense",
      }),
      label: "Rate your tension now (1-10)",
      validate: () => true,
    },
    {
      id: "summary",
      component: createSummaryStep<BodyScanPMRResponse>(
        [
          { label: "Tension Before", key: "preTensionRating" },
          { label: "Tension After", key: "postTensionRating" },
          { label: "Areas Completed", key: "completedAreas" },
        ],
        { title: "Body released!", exerciseType: "body_scan_pmr" },
      ),
      label: "Summary",
      validate: () => true,
      excludeFromProgress: true,
    },
  ],
};

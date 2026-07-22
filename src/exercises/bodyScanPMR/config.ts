import type {
  ExerciseConfig,
  BodyScanPMRResponse,
} from "@/src/types/exerciseFlow";
import { createStep } from "@/src/components/exercise/steps/createStep";
import { createDynamicSummaryStep } from "@/src/components/exercise/steps/createDynamicSummaryStep";
import { IntroStep } from "@/src/components/exercise/steps/IntroStep";
import { SliderStep } from "@/src/components/exercise/steps/SliderStep";
import { ChecklistStep } from "@/src/components/exercise/steps/ChecklistStep";
import { PMRCircularTimerStep } from "@/src/components/exercise/steps/PMRCircularTimerStep";

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
      component: createStep(PMRCircularTimerStep, {
        title: "Guided Body Scan & PMR",
        subtitle: "Tense each muscle group for 5s using the circular timer, then release.",
        fieldKey: "completedAreas",
        areas: [
          {
            label: "Forehead & Scalp",
            value: "forehead",
            instruction: "Raise eyebrows high and wrinkle your forehead tightly. Feel the tension across your scalp, then release completely.",
            defaultDurationSec: 5,
          },
          {
            label: "Jaw & Face",
            value: "jaw",
            instruction: "Clench your jaw gently and scrunch all facial muscles tightly around your eyes and nose, then let go.",
            defaultDurationSec: 5,
          },
          {
            label: "Neck & Shoulders",
            value: "neck",
            instruction: "Raise shoulders high toward your ears while pulling your neck firmly back, hold, then release.",
            defaultDurationSec: 5,
          },
          {
            label: "Arms & Hands",
            value: "arms",
            instruction: "Make tight fists and curl your wrists to flex both biceps and forearms firmly, then release.",
            defaultDurationSec: 5,
          },
          {
            label: "Chest & Upper Back",
            value: "chest",
            instruction: "Take a deep breath, hold it, and pull shoulder blades back while tightening your chest, then breathe out and relax.",
            defaultDurationSec: 5,
          },
          {
            label: "Stomach & Lower Back",
            value: "stomach",
            instruction: "Tighten your abdominal muscles firmly as if bracing for an impact while arching slightly, then let go.",
            defaultDurationSec: 5,
          },
          {
            label: "Hips & Glutes",
            value: "hips",
            instruction: "Squeeze your buttocks and hip muscles together firmly, notice the tightness, then release.",
            defaultDurationSec: 5,
          },
          {
            label: "Legs & Feet",
            value: "legs",
            instruction: "Point toes upward toward your shins, tensing your thighs and calf muscles firmly, then let go completely.",
            defaultDurationSec: 5,
          },
        ],
        minCompleted: 5,
      }),
      label: "Body scan timer",
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
      component: createDynamicSummaryStep({
        title: "Body released!",
        celebrationEmoji: "💆",
        exerciseType: "body_scan_pmr",
        preScoreKey: "preTensionRating",
        postScoreKey: "postTensionRating",
        scoreLabel: "Tension level",
        scoreMax: 10,
      }),
      label: "Summary",
      validate: () => true,
      excludeFromProgress: true,
    },
  ],
};

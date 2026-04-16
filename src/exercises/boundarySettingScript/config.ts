import type {
  ExerciseConfig,
  BoundarySettingScriptResponse,
} from "@/src/types/exerciseFlow";
import { createStep } from "@/src/components/exercise/steps/createStep";
import { createSummaryStep } from "@/src/components/exercise/steps/createSummaryStep";
import { IntroStep } from "@/src/components/exercise/steps/IntroStep";
import { TextInputStep } from "@/src/components/exercise/steps/TextInputStep";
import { SliderStep } from "@/src/components/exercise/steps/SliderStep";

const INITIAL: BoundarySettingScriptResponse = {
  boundary: "",
  scriptWhen: "",
  scriptFeel: "",
  scriptNeed: "",
  scriptIf: "",
  confidenceRating: 5,
};

export const boundarySettingScriptConfig: ExerciseConfig<BoundarySettingScriptResponse> =
  {
    type: "boundary_setting_script",
    category: "relationships",
    title: "Boundary Setting Script",
    subtitle: "Write a script to set a healthy boundary",
    icon: "boundary_setting_script",
    duration: "7-10 min",
    xp: 12,
    backgroundColor: "#E8F5E9",
    schemaVersion: 1,
    initialResponse: INITIAL,

    steps: [
      {
        id: "intro",
        component: createStep(IntroStep, {
          title: "Boundary Setting Script",
          subtitle: "Use a proven formula to set a clear, healthy boundary.",
          exerciseType: "boundary_setting_script",
          duration: "7-10 min",
          bulletPoints: [
            "When you…",
            "I feel…",
            "I need…",
            "If that doesn't happen…",
          ],
        }),
        label: "Welcome",
        validate: () => true,
        excludeFromProgress: true,
      },
      {
        id: "boundary",
        component: createStep(TextInputStep, {
          title: "The Boundary",
          subtitle: "What boundary do you need to set?",
          fieldKey: "boundary",
          placeholder: "I need to set a boundary about...",
        }),
        label: "What boundary do you need to set?",
        validate: (r) => r.boundary.trim().length >= 1,
      },
      {
        id: "when",
        component: createStep(TextInputStep, {
          title: '"When you…"',
          subtitle: "Describe the specific behavior.",
          fieldKey: "scriptWhen",
          placeholder: "When you...",
        }),
        label: '"When you…"',
        validate: (r) => r.scriptWhen.trim().length >= 1,
      },
      {
        id: "feel",
        component: createStep(TextInputStep, {
          title: '"I feel…"',
          subtitle: "Name the emotion it causes.",
          fieldKey: "scriptFeel",
          placeholder: "I feel...",
        }),
        label: '"I feel…"',
        validate: (r) => r.scriptFeel.trim().length >= 1,
      },
      {
        id: "need",
        component: createStep(TextInputStep, {
          title: '"I need…"',
          subtitle: "State what you need instead.",
          fieldKey: "scriptNeed",
          placeholder: "I need...",
        }),
        label: '"I need…"',
        validate: (r) => r.scriptNeed.trim().length >= 1,
      },
      {
        id: "if",
        component: createStep(TextInputStep, {
          title: '"If that doesn\'t happen…"',
          subtitle: "State the consequence.",
          fieldKey: "scriptIf",
          placeholder: "If that doesn't happen, I will...",
        }),
        label: '"If that doesn\'t happen…"',
        validate: (r) => r.scriptIf.trim().length >= 1,
      },
      {
        id: "confidence_rating",
        component: createStep(SliderStep, {
          title: "Confidence",
          subtitle: "How confident do you feel delivering this?",
          fieldKey: "confidenceRating",
          min: 1,
          max: 10,
          minLabel: "Not confident",
          maxLabel: "Very confident",
        }),
        label: "Confidence to deliver (1-10)",
        validate: () => true,
      },
      {
        id: "summary",
        component: createSummaryStep<BoundarySettingScriptResponse>(
          [
            { label: "Boundary", key: "boundary" },
            { label: "When", key: "scriptWhen" },
            { label: "I feel", key: "scriptFeel" },
            { label: "I need", key: "scriptNeed" },
            { label: "Confidence", key: "confidenceRating" },
          ],
          { title: "Script ready!", exerciseType: "boundary_setting_script" },
        ),
        label: "Summary",
        validate: () => true,
        excludeFromProgress: true,
      },
    ],
  };

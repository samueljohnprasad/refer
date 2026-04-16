import type {
  ExerciseConfig,
  StopSkillResponse,
} from "@/src/types/exerciseFlow";
import { createStep } from "@/src/components/exercise/steps/createStep";
import { createSummaryStep } from "@/src/components/exercise/steps/createSummaryStep";
import { IntroStep } from "@/src/components/exercise/steps/IntroStep";
import { CountdownTimerStep } from "@/src/components/exercise/steps/CountdownTimerStep";
import { BreathingTimerStep } from "@/src/components/exercise/steps/BreathingTimerStep";
import { TextInputStep } from "@/src/components/exercise/steps/TextInputStep";

const INITIAL: StopSkillResponse = {
  stopCompleted: false,
  breathCompleted: false,
  observations: "",
  skillfulAction: "",
};

export const stopSkillConfig: ExerciseConfig<StopSkillResponse> = {
  type: "stop_skill",
  category: "dbt",
  title: "STOP Skill",
  subtitle: "Stop, Take a breath, Observe, Proceed mindfully",
  icon: "stop_skill",
  duration: "3-5 min",
  xp: 8,
  backgroundColor: "#FFEBEE",
  schemaVersion: 1,
  initialResponse: INITIAL,

  steps: [
    {
      id: "intro",
      component: createStep(IntroStep, {
        title: "STOP Skill",
        subtitle: "Stop · Take a breath · Observe · Proceed mindfully",
        exerciseType: "stop_skill",
        duration: "3-5 min",
      }),
      label: "Welcome",
      validate: () => true,
      excludeFromProgress: true,
    },
    {
      id: "stop",
      component: createStep(CountdownTimerStep, {
        title: "S — STOP",
        subtitle: "Freeze. Don't react. Just stop.",
        timerConfig: {
          type: "countdown" as const,
          durationMs: 3_000,
          label: "STOP",
        },
        completedFieldKey: "stopCompleted",
      }),
      label: "STOP",
      validate: (r) => r.stopCompleted,
      timerConfig: { type: "countdown", durationMs: 3_000, label: "STOP" },
    },
    {
      id: "take_a_breath",
      component: createStep(BreathingTimerStep, {
        title: "T — Take a Breath",
        subtitle: "Breathe slowly and deeply.",
        pattern: {
          inhale: 4,
          holdIn: 0,
          exhale: 6,
          holdOut: 0,
          rounds: 2,
          visual: "circle" as const,
        },
        completedFieldKey: "breathCompleted",
      }),
      label: "Take a breath",
      validate: (r) => r.breathCompleted,
      timerConfig: {
        type: "breathing",
        durationMs: 20_000,
        pattern: {
          inhale: 4,
          holdIn: 0,
          exhale: 6,
          holdOut: 0,
          rounds: 2,
          visual: "circle",
        },
      },
    },
    {
      id: "observe",
      component: createStep(TextInputStep, {
        title: "O — Observe",
        subtitle: "What are you feeling, thinking, and sensing in your body?",
        fieldKey: "observations",
        placeholder: "I notice...",
      }),
      label: "Observe your feelings, thoughts, body",
      validate: (r) => r.observations.trim().length >= 1,
    },
    {
      id: "proceed",
      component: createStep(TextInputStep, {
        title: "P — Proceed Mindfully",
        subtitle: "What is one skillful action you can take right now?",
        fieldKey: "skillfulAction",
        placeholder: "I will...",
      }),
      label: "One skillful action",
      validate: (r) => r.skillfulAction.trim().length >= 1,
    },
    {
      id: "summary",
      component: createSummaryStep<StopSkillResponse>(
        [
          { label: "Observations", key: "observations" },
          { label: "Skillful Action", key: "skillfulAction" },
        ],
        { title: "STOP complete!", exerciseType: "stop_skill" },
      ),
      label: "Summary",
      validate: () => true,
      excludeFromProgress: true,
    },
  ],
};

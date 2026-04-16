import type {
  ExerciseConfig,
  SleepDiaryResponse,
} from "@/src/types/exerciseFlow";
import { createStep } from "@/src/components/exercise/steps/createStep";
import { createSummaryStep } from "@/src/components/exercise/steps/createSummaryStep";
import { IntroStep } from "@/src/components/exercise/steps/IntroStep";
import { TextInputStep } from "@/src/components/exercise/steps/TextInputStep";
import { SliderStep } from "@/src/components/exercise/steps/SliderStep";

const INITIAL: SleepDiaryResponse = {
  bedtime: "",
  wakeTime: "",
  timeToFallAsleep: "",
  nightWakeups: 0,
  sleepQuality: 5,
  notes: "",
};

export const sleepDiaryConfig: ExerciseConfig<SleepDiaryResponse> = {
  type: "sleep_diary",
  category: "sleep",
  title: "Sleep Diary",
  subtitle: "Track your sleep patterns nightly",
  icon: "sleep_diary",
  duration: "2-3 min",
  xp: 5,
  backgroundColor: "#fff",
  schemaVersion: 1,
  initialResponse: INITIAL,

  steps: [
    {
      id: "intro",
      component: createStep(IntroStep, {
        title: "Sleep Diary",
        subtitle: "A quick nightly check-in to track your sleep.",
        exerciseType: "sleep_diary",
        duration: "2-3 min",
      }),
      label: "Welcome",
      validate: () => true,
      excludeFromProgress: true,
    },
    {
      id: "bedtime",
      component: createStep(TextInputStep, {
        title: "Bedtime",
        subtitle: "What time did you go to bed?",
        fieldKey: "bedtime",
        placeholder: "e.g. 10:30 PM",
      }),
      label: "What time did you go to bed?",
      validate: (r) => r.bedtime.length > 0,
    },
    {
      id: "wake_time",
      component: createStep(TextInputStep, {
        title: "Wake Time",
        subtitle: "What time did you wake up?",
        fieldKey: "wakeTime",
        placeholder: "e.g. 7:00 AM",
      }),
      label: "What time did you wake up?",
      validate: (r) => r.wakeTime.length > 0,
    },
    {
      id: "time_to_fall_asleep",
      component: createStep(TextInputStep, {
        title: "Time to Fall Asleep",
        subtitle: "How long did it take to fall asleep?",
        fieldKey: "timeToFallAsleep",
        placeholder: "e.g. 20 minutes",
      }),
      label: "How long to fall asleep?",
      validate: (r) => r.timeToFallAsleep.length > 0,
    },
    {
      id: "night_wakeups",
      component: createStep(SliderStep, {
        title: "Night Wakeups",
        subtitle: "How many times did you wake up during the night?",
        fieldKey: "nightWakeups",
        min: 0,
        max: 10,
        minLabel: "None",
        maxLabel: "10+",
      }),
      label: "Number of night wakeups",
      validate: () => true,
    },
    {
      id: "sleep_quality",
      component: createStep(SliderStep, {
        title: "Sleep Quality",
        subtitle: "How would you rate your sleep?",
        fieldKey: "sleepQuality",
        min: 1,
        max: 10,
        minLabel: "Terrible",
        maxLabel: "Excellent",
      }),
      label: "Sleep quality (1-10)",
      validate: () => true,
    },
    {
      id: "notes",
      component: createStep(TextInputStep, {
        title: "Notes",
        subtitle: "Anything else worth noting? (optional)",
        fieldKey: "notes",
        placeholder: "e.g. Had caffeine late, felt rested...",
      }),
      label: "Notes (optional)",
      validate: () => true,
      optional: true,
    },
    {
      id: "summary",
      component: createSummaryStep<SleepDiaryResponse>(
        [
          { label: "Bedtime", key: "bedtime" },
          { label: "Wake Time", key: "wakeTime" },
          { label: "Quality", key: "sleepQuality" },
          { label: "Wakeups", key: "nightWakeups" },
        ],
        { title: "Sleep logged!", exerciseType: "sleep_diary" },
      ),
      label: "Summary",
      validate: () => true,
      excludeFromProgress: true,
    },
  ],
};

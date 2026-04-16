import type {
  ExerciseConfig,
  PreSleepWorryJournalResponse,
} from "@/src/types/exerciseFlow";
import { createStep } from "@/src/components/exercise/steps/createStep";
import { createSummaryStep } from "@/src/components/exercise/steps/createSummaryStep";
import { IntroStep } from "@/src/components/exercise/steps/IntroStep";
import { TextInputStep } from "@/src/components/exercise/steps/TextInputStep";
import { AcknowledgeStep } from "@/src/components/exercise/steps/AcknowledgeStep";
import { ChoiceStep } from "@/src/components/exercise/steps/ChoiceStep";
import { CountdownTimerStep } from "@/src/components/exercise/steps/CountdownTimerStep";
import { SliderStep } from "@/src/components/exercise/steps/SliderStep";

const INITIAL: PreSleepWorryJournalResponse = {
  worries: "",
  journalClosed: false,
  relaxationChoice: null,
  relaxationCompleted: false,
  readinessRating: 5,
};

export const preSleepWorryJournalConfig: ExerciseConfig<PreSleepWorryJournalResponse> =
  {
    type: "pre_sleep_worry_journal",
    category: "sleep",
    title: "Pre-Sleep Worry Journal",
    subtitle: "Dump worries before bed so you can rest",
    icon: "pre_sleep_worry_journal",
    duration: "5-10 min",
    xp: 10,
    backgroundColor: "#fff",
    schemaVersion: 1,
    initialResponse: INITIAL,

    steps: [
      {
        id: "intro",
        component: createStep(IntroStep, {
          title: "Pre-Sleep Worry Journal",
          subtitle: "Get worries out of your head and onto paper before bed.",
          exerciseType: "pre_sleep_worry_journal",
          duration: "5-10 min",
        }),
        label: "Welcome",
        validate: () => true,
        excludeFromProgress: true,
      },
      {
        id: "dump_worries",
        component: createStep(TextInputStep, {
          title: "Dump Your Worries",
          subtitle: "Write freely for up to 5 minutes. Get it all out.",
          fieldKey: "worries",
          placeholder: "Everything on my mind right now...",
        }),
        label: "Write out your worries (5 min)",
        validate: (r) => r.worries.trim().length >= 1,
        timerConfig: {
          type: "countdown",
          durationMs: 300_000,
          label: "Write freely...",
          skippable: true,
        },
      },
      {
        id: "close_journal",
        component: createStep(AcknowledgeStep, {
          title: "Close the Journal",
          subtitle: "Symbolically close the journal on today's worries.",
          fieldKey: "journalClosed",
          body: "These worries will be here tomorrow if needed. For now, let them rest.",
          buttonLabel: "Journal closed",
        }),
        label: "Close the journal",
        validate: (r) => r.journalClosed,
      },
      {
        id: "relaxation_choice",
        component: createStep(ChoiceStep, {
          title: "Mini Relaxation?",
          subtitle: "Would you like a quick relaxation before sleep?",
          fieldKey: "relaxationChoice",
          options: [
            {
              value: "breathing",
              label: "Deep breathing (60s)",
              iconKey: "breathing",
            },
            {
              value: "body_scan",
              label: "Quick body scan (60s)",
              iconKey: "body_scan",
            },
            { value: "skip", label: "Skip to sleep", iconKey: "skip_sleep" },
          ],
        }),
        label: "Choose a relaxation",
        validate: (r) => r.relaxationChoice !== null,
        next: (r) =>
          r.relaxationChoice === "skip"
            ? "readiness_rating"
            : "mini_relaxation",
      },
      {
        id: "mini_relaxation",
        component: createStep(CountdownTimerStep, {
          title: "Mini Relaxation",
          subtitle: "Relax for 60 seconds.",
          timerConfig: {
            type: "countdown" as const,
            durationMs: 60_000,
            label: "Relax...",
          },
          completedFieldKey: "relaxationCompleted",
        }),
        label: "Mini relaxation (60s)",
        validate: (r) => r.relaxationCompleted,
        timerConfig: { type: "countdown", durationMs: 60_000 },
        optional: true,
      },
      {
        id: "readiness_rating",
        component: createStep(SliderStep, {
          title: "Sleep Readiness",
          subtitle: "How ready for sleep do you feel?",
          fieldKey: "readinessRating",
          min: 1,
          max: 10,
          minLabel: "Wide awake",
          maxLabel: "Very sleepy",
        }),
        label: "Ready for sleep? (1-10)",
        validate: () => true,
      },
      {
        id: "summary",
        component: createSummaryStep<PreSleepWorryJournalResponse>(
          [{ label: "Readiness", key: "readinessRating" }],
          { title: "Ready for rest!", exerciseType: "pre_sleep_worry_journal" },
        ),
        label: "Summary",
        validate: () => true,
        excludeFromProgress: true,
      },
    ],
  };

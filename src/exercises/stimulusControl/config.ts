import type {
  ExerciseConfig,
  StimulusControlResponse,
} from "@/src/types/exerciseFlow";
import { createStep } from "@/src/components/exercise/steps/createStep";
import { createSummaryStep } from "@/src/components/exercise/steps/createSummaryStep";
import { IntroStep } from "@/src/components/exercise/steps/IntroStep";
import { AcknowledgeStep } from "@/src/components/exercise/steps/AcknowledgeStep";
import { ChecklistStep } from "@/src/components/exercise/steps/ChecklistStep";
import { TextInputStep } from "@/src/components/exercise/steps/TextInputStep";

const INITIAL: StimulusControlResponse = {
  rulesAcknowledged: false,
  routineItems: [],
  adherence: {},
  reflection: "",
};

export const stimulusControlConfig: ExerciseConfig<StimulusControlResponse> = {
  type: "stimulus_control",
  category: "sleep",
  title: "Stimulus Control",
  subtitle: "Build healthy sleep associations",
  icon: "stimulus_control",
  duration: "5-7 min",
  xp: 8,
  backgroundColor: "#E8EAF6",
  schemaVersion: 1,
  initialResponse: INITIAL,

  steps: [
    {
      id: "intro",
      component: createStep(IntroStep, {
        title: "Stimulus Control",
        subtitle: "Train your brain to associate bed with sleep only.",
        exerciseType: "stimulus_control",
        duration: "5-7 min",
      }),
      label: "Welcome",
      validate: () => true,
      excludeFromProgress: true,
    },
    {
      id: "learn_rules",
      component: createStep(AcknowledgeStep, {
        title: "Sleep Hygiene Rules",
        subtitle: "Review the key rules:",
        fieldKey: "rulesAcknowledged",
        body: "1. Only use bed for sleep\n2. Go to bed only when sleepy\n3. If awake 20 min, get up\n4. Wake at the same time daily\n5. No naps during the day",
        buttonLabel: "I understand",
      }),
      label: "Sleep hygiene rules",
      validate: (r) => r.rulesAcknowledged,
    },
    {
      id: "checklist_builder",
      component: createStep(ChecklistStep, {
        title: "Pre-Sleep Routine",
        subtitle: "Build your ideal bedtime routine.",
        fieldKey: "routineItems",
        presetItems: [
          { label: "Dim lights", value: "dim_lights" },
          { label: "No screens 30 min before", value: "no_screens" },
          { label: "Brush teeth", value: "brush_teeth" },
          { label: "Read a book", value: "read" },
          { label: "Stretch or yoga", value: "stretch" },
        ],
        allowCustom: true,
        minChecked: 1,
      }),
      label: "Build your pre-sleep routine",
      validate: (r) => r.routineItems.length >= 1,
    },
    {
      id: "track_adherence",
      component: createStep(TextInputStep, {
        title: "Tonight's Adherence",
        subtitle: "Which rules did you follow tonight?",
        fieldKey: "adherence",
        placeholder: "Tonight I followed...",
      }),
      label: "Track tonight's adherence",
      validate: () => true,
    },
    {
      id: "reflection",
      component: createStep(TextInputStep, {
        title: "Reflect",
        subtitle: "How is building this routine going?",
        fieldKey: "reflection",
        placeholder: "I noticed that...",
      }),
      label: "Reflect",
      validate: (r) => r.reflection.trim().length >= 1,
    },
    {
      id: "summary",
      component: createSummaryStep<StimulusControlResponse>(
        [
          { label: "Routine Items", key: "routineItems" },
          { label: "Reflection", key: "reflection" },
        ],
        { title: "Routine built!", exerciseType: "stimulus_control" },
      ),
      label: "Summary",
      validate: () => true,
      excludeFromProgress: true,
    },
  ],
};

import type { ExerciseType } from "@/src/types/exerciseFlow";

export interface ExerciseLink {
  exerciseType: ExerciseType;
  label: string;
}

export const EXERCISE_LINKING_MAP: Partial<Record<ExerciseType, ExerciseLink>> =
  {
    thought_catcher: {
      exerciseType: "thought_reframing",
      label: "Go deeper → Thought Reframing",
    },
    thought_reframing: {
      exerciseType: "detached_mindfulness",
      label: "Practice detachment → Detached Mindfulness",
    },
    gratitude_reframe: {
      exerciseType: "thought_catcher",
      label: "Notice a thought → Thought Catcher",
    },
    abc_analysis: {
      exerciseType: "thought_reframing",
      label: "Challenge further → Thought Reframing",
    },
    decatastrophizing: {
      exerciseType: "fear_ladder",
      label: "Face it gradually → Fear Ladder",
    },
    worry_time: {
      exerciseType: "worry_decision_tree",
      label: "Sort each worry → Worry Decision Tree",
    },
    worry_decision_tree: {
      exerciseType: "detached_mindfulness",
      label: "Let it go → Detached Mindfulness",
    },
    fear_ladder: {
      exerciseType: "decatastrophizing",
      label: "Challenge the outcome → Decatastrophizing",
    },
    recognizing_rumination: {
      exerciseType: "attention_training",
      label: "Train your focus → Attention Training",
    },
    detached_mindfulness: {
      exerciseType: "attention_training",
      label: "Train flexible attention → Attention Training",
    },
    attention_training: {
      exerciseType: "detached_mindfulness",
      label: "Apply it → Detached Mindfulness",
    },
    box_breathing: {
      exerciseType: "breathing_478",
      label: "Go longer → 4-7-8 Breathing",
    },
    breathing_478: {
      exerciseType: "body_scan_pmr",
      label: "Release tension → Body Scan & PMR",
    },
    grounding_54321: {
      exerciseType: "detached_mindfulness",
      label: "Deepen it → Detached Mindfulness",
    },
    body_scan_pmr: {
      exerciseType: "box_breathing",
      label: "Breathe it out → Box Breathing",
    },
    mindful_breathing_1min: {
      exerciseType: "box_breathing",
      label: "Go structured → Box Breathing",
    },
  };

// ponytail: which Happi pose (and prop) each exercise uses, from .agents/happi.js's pose `use:` list.
// Provided once by the flow screen so every step's Happi header picks it up without prop drilling.
import { createContext, useContext } from "react";
import { ActingPose } from "@/src/domains/onboarding/ui/containers/happiPoses";
import type { ExerciseType } from "@/src/types/exerciseFlow";

const EXERCISE_POSE: Partial<Record<ExerciseType, ActingPose>> = {
  thought_reframing: ActingPose.Reframe,
  abc_analysis: ActingPose.Abc,
  thought_catcher: ActingPose.Catch,
  behavioral_activation: ActingPose.Act,
  fear_ladder: ActingPose.Ladder,
};

export const poseForExercise = (type: ExerciseType): ActingPose => EXERCISE_POSE[type] ?? ActingPose.Gentle;

export const ExercisePoseContext = createContext<ActingPose>(ActingPose.Gentle);
export const useExercisePose = (): ActingPose => useContext(ExercisePoseContext);

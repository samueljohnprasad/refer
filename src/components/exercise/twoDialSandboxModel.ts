import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

export type Quadrant = "HL" | "HH" | "LH" | "LL";

export const ALL_QUADRANTS: Quadrant[] = ["HL", "HH", "LH", "LL"];

export function getQuadrant(demand: number, recovery: number): Quadrant {
  return `${demand >= 50 ? "H" : "L"}${recovery >= 50 ? "H" : "L"}` as Quadrant;
}

export function createTwoDialResponse(
  demand: number,
  recovery: number,
  visitedQuadrants: string[],
  hasInteracted: boolean,
  isComplete: boolean,
) {
  return {
    format: CourseExerciseCategoryEnum.TwoDialSandbox,
    phase: "sandbox",
    demand,
    load: demand,
    recovery,
    visitedQuadrants,
    hasInteracted,
    isComplete,
    isCorrect: true,
  };
}

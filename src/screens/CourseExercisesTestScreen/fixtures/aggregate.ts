import type { Exercise } from "@/src/types/journeyV5";
import { modelMicrolearningFixtures } from "./model";
import { narrativeMicrolearningFixtures } from "./narrative";
import { priorityMicrolearningFixtures } from "./priority";
import { reviewMicrolearningFixtures } from "./review";

export interface MicrolearningFixtureGroup {
  id: string;
  label: string;
  exercises: readonly Exercise[];
}

export const microlearningFixtureGroups: readonly MicrolearningFixtureGroup[] = [
  {
    id: "priority",
    label: "Priority interactions",
    exercises: priorityMicrolearningFixtures,
  },
  {
    id: "model",
    label: "Interactive models",
    exercises: modelMicrolearningFixtures,
  },
  {
    id: "narrative",
    label: "Narrative exercises",
    exercises: narrativeMicrolearningFixtures,
  },
  {
    id: "review",
    label: "Review exercises",
    exercises: reviewMicrolearningFixtures,
  },
];

export const allMicrolearningFixtures: readonly Exercise[] = [
  ...priorityMicrolearningFixtures.filter(
    (fixture) => fixture.id !== "fixture-reframe-builder-space",
  ),
  ...modelMicrolearningFixtures,
  ...narrativeMicrolearningFixtures,
  ...reviewMicrolearningFixtures,
];

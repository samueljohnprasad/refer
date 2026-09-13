import type { Exercise } from "@/src/types/journeyV5";
import { modelMicrolearningFixtures } from "./model";
import { narrativeMicrolearningFixtures } from "./narrative";
import { priorityMicrolearningFixtures } from "./priority";
import { reviewMicrolearningFixtures } from "./review";
import { draftMicrolearningFixtures } from "./drafts";
import { showcaseMicrolearningFixtures } from "./showcase";

export interface MicrolearningFixtureGroup {
  id: string;
  label: string;
  exercises: readonly Exercise[];
}

// ponytail: showcase group for latest requested exercises
export const microlearningFixtureGroups: readonly MicrolearningFixtureGroup[] =
  [
    {
      id: "showcase",
      label: "Showcase",
      exercises: [
        ...draftMicrolearningFixtures.filter((fixture) =>
          [
            "fixture-socratic-dialogue",
            "fixture-story-serial",
            "fixture-surge-diagram",
          ].includes(fixture.id),
        ),
        ...showcaseMicrolearningFixtures,
      ],
    },
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
    {
      id: "drafts",
      label: "Drafts",
      exercises: draftMicrolearningFixtures,
    },
  ];

export const allMicrolearningFixtures: readonly Exercise[] = [
  ...showcaseMicrolearningFixtures.filter(
    (fixture) => fixture.id !== "fixture-teach-back-chain",
  ),
  ...priorityMicrolearningFixtures.filter(
    (fixture) => fixture.id !== "fixture-reframe-builder-space",
  ),
  ...modelMicrolearningFixtures,
  ...narrativeMicrolearningFixtures,
  ...reviewMicrolearningFixtures,
  ...draftMicrolearningFixtures,
];

import type { Exercise } from "@/src/types/journeyV5";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

const dialogueFixture: Exercise = {
  id: "fixture-dialogue",
  nodeId: "node-dialogue",
  orderIndex: 0,
  type: CourseExerciseCategoryEnum.Dialogue,
  content: {
    title: "Navigating Conflict",
    instruction: "Read the scenario and decide how to respond.",
    insight: "Great job! Acknowledging the perspective is the first step.",
    beats: [
      {
        id: "beat-1",
        type: "passive",
        speaker: "Alex",
        side: "left",
        message: "I didn't really like the way you handled that meeting.",
        historySummary: "Alex gives feedback",
      },
      {
        id: "beat-2",
        type: "passive",
        speaker: "You",
        side: "right",
        message: "Oh. I thought it went fine. What bothered you?",
        historySummary: "You ask for clarity",
      },
      {
        id: "beat-3",
        type: "decision",
        speaker: "Alex",
        side: "left",
        message: "You talked over me twice when I tried to explain the timeline.",
        historySummary: "Alex explains concern",
        options: [
          {
            id: "opt-1",
            label: "Defend yourself",
            feedback: "Defensiveness can escalate conflict. Try acknowledging first.",
          },
          {
            id: "opt-2",
            label: "Acknowledge and apologize",
            feedback: "Good choice. Acknowledgment diffuses tension.",
          },
        ],
      },
      {
        id: "beat-4",
        type: "passive",
        speaker: "You",
        side: "right",
        message: "I didn't realize I did that. I'm sorry.",
        historySummary: "You apologize",
      },
    ],
  },
};

export const reviewMicrolearningFixtures: readonly Exercise[] = [dialogueFixture];

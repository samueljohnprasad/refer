import { CheckpointContent } from "@/src/components/exercise/checkpoint/checkpointContent";
import type { Exercise } from "@/src/types/journeyV5";

export const checkpointFixtureContent: CheckpointContent = {
  format: "checkpoint",
  intro: { title: "Knowledge Check", subtitle: "Let's review what we learned." },
  items: [
    {
      type: "single_choice",
      id: "item1",
      conceptId: "concept_cbt_1",
      question: "What is cognitive restructuring?",
      options: [
        { id: "opt1", text: "Changing how you think", isCorrect: true },
        { id: "opt2", text: "Changing what you eat", isCorrect: false },
      ],
      workedSupport: "Cognitive restructuring is about identifying and disputing irrational thoughts.",
    },
    {
      type: "recall",
      id: "item2",
      conceptId: "concept_cbt_2",
      question: "Name one cognitive distortion.",
      answer: "Catastrophizing, All-or-nothing thinking, etc.",
    },
    {
      type: "ordering",
      id: "item3",
      conceptId: "concept_cbt_3",
      instruction: "Order the steps of exposure therapy.",
      items: [
        { id: "step1", text: "Create hierarchy" },
        { id: "step2", text: "Start small" },
        { id: "step3", text: "Habituate" },
      ],
      correctOrderIds: ["step1", "step2", "step3"],
      workedSupport: "First create a hierarchy, then start with the smallest fear, and repeat until habituated.",
    },
    {
      type: "matching",
      id: "item4",
      conceptId: "concept_cbt_4",
      instruction: "Match the distortion to the example.",
      pairs: [
        { id: "pair1", left: "Catastrophizing", right: "I'll definitely fail." },
        { id: "pair2", left: "Mind Reading", right: "They think I'm stupid." },
      ],
      workedSupport: "Catastrophizing assumes the worst possible outcome.",
    },
  ],
  summary: { title: "Checkpoint Complete", subtitle: "Here is your progress." },
};

export const checkpointFixture: Exercise = {
  id: "ex_checkpoint_01",
  nodeId: "node_checkpoint_01",
  orderIndex: 1,
  type: "checkpoint",
  content: checkpointFixtureContent as any, // Temporary any
};

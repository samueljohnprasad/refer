// ponytail: discriminated unions for absolute safety
export interface CheckpointContent {
  format: "checkpoint";
  intro: { title: string; subtitle: string };
  items: CheckpointItem[];
  summary: { title: string; subtitle: string };
}

export type CheckpointItem = 
  | CheckpointSingleChoice
  | CheckpointOrdering
  | CheckpointMatching
  | CheckpointRecall;

export interface CheckpointSingleChoice {
  type: "single_choice";
  id: string;
  conceptId: string;
  question: string;
  options: { id: string; text: string; isCorrect: boolean }[];
  workedSupport: string;
}

export interface CheckpointOrdering {
  type: "ordering";
  id: string;
  conceptId: string;
  instruction: string;
  items: { id: string; text: string }[];
  correctOrderIds: string[];
  workedSupport: string;
}

export interface CheckpointMatching {
  type: "matching";
  id: string;
  conceptId: string;
  instruction: string;
  pairs: { id: string; left: string; right: string }[];
  workedSupport: string;
}

export interface CheckpointRecall {
  type: "recall";
  id: string;
  conceptId: string;
  question: string;
  answer: string;
}

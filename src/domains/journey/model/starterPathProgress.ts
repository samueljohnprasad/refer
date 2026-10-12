import type { StarterPathNextAction } from "./starterPath";

export type StarterPathProgressStatus = "active" | "completed";

export interface StarterPathProgressV1 {
  userId: string;
  pathId: string;
  pathVersion: number;
  status: StarterPathProgressStatus;
  lastCompletedStep: string | null;
  lastIdempotencyKey: string | null;
  nextAction: StarterPathNextAction;
  revision: number;
  updatedAt: string;
}

export interface StarterPathMutationResult {
  progress: StarterPathProgressV1;
  conflict: boolean;
}

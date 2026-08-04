export interface MockNodeLearningEvidence {
  courseId: string;
  nodeId: string;
  responses: Record<string, unknown>;
  completedAt: string;
}

const completedNodeEvidence = new Map<string, MockNodeLearningEvidence>();

export function saveMockNodeLearningEvidence(
  evidence: MockNodeLearningEvidence,
): void {
  completedNodeEvidence.set(keyFor(evidence.courseId, evidence.nodeId), evidence);
}

export function readMockNodeLearningEvidence(
  courseId: string,
  nodeId: string,
): MockNodeLearningEvidence | null {
  return completedNodeEvidence.get(keyFor(courseId, nodeId)) ?? null;
}

function keyFor(courseId: string, nodeId: string): string {
  return `${courseId}:${nodeId}`;
}

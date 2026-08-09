import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  V1CheckStatusEnum,
  type V1CheckStatus,
} from "@/src/types/journeyLearning";

export interface V1SessionDraft {
  nodeId: string;
  exerciseSignature?: string;
  currentIndex: number;
  responses: Record<string, unknown>;
  currentResponse: Record<string, unknown> | null;
  ready: boolean;
  checkStatus: V1CheckStatus;
  attemptCount?: number;
  hydrated?: boolean;
}

const PREFIX = "journey:v1-session-draft";

export async function loadV1SessionDraft(
  nodeId: string,
  exerciseSignature: string,
): Promise<V1SessionDraft | null> {
  const raw = await AsyncStorage.getItem(keyFor(nodeId));
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<V1SessionDraft>;
    if (
      parsed.nodeId !== nodeId ||
      parsed.exerciseSignature !== exerciseSignature ||
      typeof parsed.currentIndex !== "number"
    ) {
      return null;
    }

    return {
      nodeId,
      exerciseSignature,
      currentIndex: parsed.currentIndex,
      responses: isRecord(parsed.responses) ? parsed.responses : {},
      currentResponse: isRecord(parsed.currentResponse)
        ? parsed.currentResponse
        : null,
      ready: parsed.ready === true,
      checkStatus:
        parsed.checkStatus === V1CheckStatusEnum.Success ||
        parsed.checkStatus === V1CheckStatusEnum.Error
          ? parsed.checkStatus
          : V1CheckStatusEnum.Idle,
      attemptCount: clampCount(parsed.attemptCount),
      hydrated: true,
    };
  } catch {
    return null;
  }
}

export async function saveV1SessionDraft(draft: V1SessionDraft): Promise<void> {
  await AsyncStorage.setItem(keyFor(draft.nodeId), JSON.stringify(draft));
}

export async function clearV1SessionDraft(nodeId: string): Promise<void> {
  await AsyncStorage.removeItem(keyFor(nodeId));
}

function keyFor(nodeId: string): string {
  return `${PREFIX}:${nodeId}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function clampCount(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.max(Math.floor(value), 0)
    : 0;
}

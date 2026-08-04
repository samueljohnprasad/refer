import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  V1CheckStatusEnum,
  V1ActivityResolutionEnum,
  V1SupportLevelEnum,
  type V1CheckStatus,
  type V1SupportKey,
  type V1SupportLevel,
} from "@/src/types/journeyLearning";

export interface V1SessionDraft {
  nodeId: string;
  exerciseSignature?: string;
  currentIndex: number;
  responses: Record<string, unknown>;
  currentResponse: Record<string, unknown> | null;
  ready: boolean;
  checkStatus: V1CheckStatus;
  supportLevel: V1SupportLevel;
  supportKey?: V1SupportKey | null;
  attemptCount?: number;
  currentStartedAtMs?: number;
  firstAnsweredAtMs?: number | null;
  lastResolution?: V1ActivityResolutionEnum | null;
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
      supportLevel:
        parsed.supportLevel === V1SupportLevelEnum.Clue ||
        parsed.supportLevel === V1SupportLevelEnum.Easier ||
        parsed.supportLevel === V1SupportLevelEnum.Worked
          ? parsed.supportLevel
          : V1SupportLevelEnum.None,
      supportKey:
        parsed.supportKey === V1SupportLevelEnum.Clue ||
        parsed.supportKey === V1SupportLevelEnum.Easier ||
        parsed.supportKey === V1SupportLevelEnum.Worked
          ? parsed.supportKey
          : null,
      attemptCount: clampCount(parsed.attemptCount),
      currentStartedAtMs:
        typeof parsed.currentStartedAtMs === "number"
          ? parsed.currentStartedAtMs
          : Date.now(),
      firstAnsweredAtMs:
        typeof parsed.firstAnsweredAtMs === "number"
          ? parsed.firstAnsweredAtMs
          : null,
      lastResolution:
        parsed.lastResolution === V1ActivityResolutionEnum.IndependentComplete ||
        parsed.lastResolution === V1ActivityResolutionEnum.SupportedComplete ||
        parsed.lastResolution === V1ActivityResolutionEnum.Skipped
          ? parsed.lastResolution
          : null,
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

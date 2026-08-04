import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  V1ActivityResolutionEnum,
  V1CheckStatusEnum,
  V1SupportLevelEnum,
  type V1CheckStatus,
  type V1SupportKey,
  type V1SupportLevel,
} from "@/src/types/journeyLearning";

export interface V1LearningNodeSession {
  currentIndex: number;
  responses: Record<string, unknown>;
  currentResponse: Record<string, unknown> | null;
  ready: boolean;
  checkStatus: V1CheckStatus;
  supportLevel: V1SupportLevel;
  supportKey: V1SupportKey | null;
  attemptCount: number;
  currentStartedAtMs: number;
  firstAnsweredAtMs: number | null;
  lastResolution: V1ActivityResolutionEnum | null;
  hydrated: boolean;
}

interface V1LearningSessionsState {
  byNodeId: Record<string, V1LearningNodeSession>;
}

interface SessionPayload {
  nodeId: string;
}

interface EnsureSessionPayload extends SessionPayload {
  initialSavedResponses?: Record<string, unknown>;
}

interface HydrateSessionPayload extends EnsureSessionPayload {
  session?: Partial<V1LearningNodeSession> | null;
  exerciseCount: number;
}

interface RecordInteractionPayload extends SessionPayload {
  response: Record<string, unknown>;
  ready: boolean;
}

interface CompleteItemPayload extends SessionPayload {
  exerciseId: string;
  response?: Record<string, unknown>;
}

interface CheckAnswerPayload extends SessionPayload {
  maxAttempts: number;
}

const initialState: V1LearningSessionsState = {
  byNodeId: {},
};

export const v1LearningSessionSlice = createSlice({
  name: "v1LearningSessions",
  initialState,
  reducers: {
    ensureV1LearningSession(
      state,
      action: PayloadAction<EnsureSessionPayload>,
    ) {
      const { nodeId, initialSavedResponses = {} } = action.payload;
      if (!state.byNodeId[nodeId]) {
        state.byNodeId[nodeId] = createSession(initialSavedResponses, true);
      }
    },
    hydrateV1LearningSession(
      state,
      action: PayloadAction<HydrateSessionPayload>,
    ) {
      const { nodeId, initialSavedResponses = {}, session, exerciseCount } =
        action.payload;
      state.byNodeId[nodeId] = normalizeSession(
        session,
        initialSavedResponses,
        exerciseCount,
      );
    },
    recordV1LearningInteraction(
      state,
      action: PayloadAction<RecordInteractionPayload>,
    ) {
      const session = state.byNodeId[action.payload.nodeId];
      if (!session) {
        return;
      }

      session.currentResponse = action.payload.response;
      session.ready = action.payload.ready;
      session.checkStatus = V1CheckStatusEnum.Idle;
      session.supportKey = null;
      session.firstAnsweredAtMs = session.firstAnsweredAtMs ?? Date.now();
    },
    checkV1LearningAnswer(state, action: PayloadAction<CheckAnswerPayload>) {
      const session = state.byNodeId[action.payload.nodeId];
      if (!session?.currentResponse) {
        return;
      }

      const isCorrect = session.currentResponse.isCorrect === true;
      session.checkStatus = isCorrect
        ? V1CheckStatusEnum.Success
        : V1CheckStatusEnum.Error;

      if (isCorrect) {
        session.lastResolution =
          session.supportLevel === V1SupportLevelEnum.None &&
          session.attemptCount === 0
            ? V1ActivityResolutionEnum.IndependentComplete
            : V1ActivityResolutionEnum.SupportedComplete;
        return;
      }

      session.attemptCount += 1;
      session.lastResolution = null;

      if (session.attemptCount >= action.payload.maxAttempts) {
        session.supportLevel = V1SupportLevelEnum.Worked;
        session.supportKey = V1SupportLevelEnum.Worked;
        session.lastResolution = V1ActivityResolutionEnum.SupportedComplete;
        return;
      }

      if (session.attemptCount >= 2) {
        session.supportLevel = V1SupportLevelEnum.Easier;
        session.supportKey = V1SupportLevelEnum.Worked;
        return;
      }

      if (session.supportLevel === V1SupportLevelEnum.None) {
        session.supportLevel = V1SupportLevelEnum.Clue;
        session.supportKey = V1SupportLevelEnum.Clue;
      }
    },
    resetV1LearningAnswer(state, action: PayloadAction<SessionPayload>) {
      const session = state.byNodeId[action.payload.nodeId];
      if (!session) {
        return;
      }

      session.currentResponse = null;
      session.ready = false;
      session.checkStatus = V1CheckStatusEnum.Idle;
    },
    showV1LearningSupport(
      state,
      action: PayloadAction<SessionPayload & { supportLevel: V1SupportLevel }>,
    ) {
      const session = state.byNodeId[action.payload.nodeId];
      if (!session) {
        return;
      }

      session.supportLevel = action.payload.supportLevel;
      session.supportKey =
        action.payload.supportLevel === V1SupportLevelEnum.Worked
          ? V1SupportLevelEnum.Worked
          : action.payload.supportLevel === V1SupportLevelEnum.Easier
          ? V1SupportLevelEnum.Easier
          : V1SupportLevelEnum.Clue;
    },
    completeV1LearningItem(
      state,
      action: PayloadAction<CompleteItemPayload>,
    ) {
      const session = state.byNodeId[action.payload.nodeId];
      const response = action.payload.response ?? session?.currentResponse;
      if (!session || !response) {
        return;
      }

      session.responses[action.payload.exerciseId] = response;
      session.currentIndex += 1;
      resetCurrentItem(session);
    },
    skipV1LearningItem(state, action: PayloadAction<CompleteItemPayload>) {
      const session = state.byNodeId[action.payload.nodeId];
      if (!session) {
        return;
      }

      session.responses[action.payload.exerciseId] = action.payload.response ?? {
        resolution: V1ActivityResolutionEnum.Skipped,
        supportLevel: session.supportLevel,
      };
      session.currentIndex += 1;
      resetCurrentItem(session);
    },
    clearV1LearningSession(state, action: PayloadAction<SessionPayload>) {
      delete state.byNodeId[action.payload.nodeId];
    },
  },
});

export const {
  checkV1LearningAnswer,
  clearV1LearningSession,
  completeV1LearningItem,
  ensureV1LearningSession,
  hydrateV1LearningSession,
  recordV1LearningInteraction,
  resetV1LearningAnswer,
  showV1LearningSupport,
  skipV1LearningItem,
} = v1LearningSessionSlice.actions;

export const v1LearningSessionReducer = v1LearningSessionSlice.reducer;

function createSession(
  responses: Record<string, unknown>,
  hydrated: boolean,
): V1LearningNodeSession {
  return {
    currentIndex: 0,
    responses,
    currentResponse: null,
    ready: false,
    checkStatus: V1CheckStatusEnum.Idle,
    supportLevel: V1SupportLevelEnum.None,
    supportKey: null,
    attemptCount: 0,
    currentStartedAtMs: Date.now(),
    firstAnsweredAtMs: null,
    lastResolution: null,
    hydrated,
  };
}

function normalizeSession(
  session: Partial<V1LearningNodeSession> | null | undefined,
  initialSavedResponses: Record<string, unknown>,
  exerciseCount: number,
): V1LearningNodeSession {
  if (!session) {
    return createSession(initialSavedResponses, true);
  }

  const maxIndex = Math.max(exerciseCount - 1, 0);

  return {
    currentIndex: clampIndex(session.currentIndex, maxIndex),
    responses: session.responses ?? initialSavedResponses,
    currentResponse: session.currentResponse ?? null,
    ready: session.ready === true,
    checkStatus: session.checkStatus ?? V1CheckStatusEnum.Idle,
    supportLevel: session.supportLevel ?? V1SupportLevelEnum.None,
    supportKey: session.supportKey ?? null,
    attemptCount: clampCount(session.attemptCount),
    currentStartedAtMs:
      typeof session.currentStartedAtMs === "number"
        ? session.currentStartedAtMs
        : Date.now(),
    firstAnsweredAtMs:
      typeof session.firstAnsweredAtMs === "number"
        ? session.firstAnsweredAtMs
        : null,
    lastResolution: session.lastResolution ?? null,
    hydrated: true,
  };
}

function resetCurrentItem(session: V1LearningNodeSession): void {
  session.currentResponse = null;
  session.ready = false;
  session.checkStatus = V1CheckStatusEnum.Idle;
  session.supportLevel = V1SupportLevelEnum.None;
  session.supportKey = null;
  session.attemptCount = 0;
  session.currentStartedAtMs = Date.now();
  session.firstAnsweredAtMs = null;
  session.lastResolution = null;
}

function clampIndex(value: number | undefined, maxIndex: number): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 0;
  }

  return Math.min(Math.max(Math.floor(value), 0), maxIndex);
}

function clampCount(value: number | undefined): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 0;
  }

  return Math.max(Math.floor(value), 0);
}

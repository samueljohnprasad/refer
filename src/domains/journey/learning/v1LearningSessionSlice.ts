import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  V1CheckStatusEnum,
  type V1CheckStatus,
} from "@/src/types/journeyLearning";

export interface V1LearningNodeSession {
  currentIndex: number;
  responses: Record<string, unknown>;
  currentResponse: Record<string, unknown> | null;
  ready: boolean;
  checkStatus: V1CheckStatus;
  attemptCount: number;
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
    },
    checkV1LearningAnswer(state, action: PayloadAction<SessionPayload>) {
      const session = state.byNodeId[action.payload.nodeId];
      if (!session?.currentResponse) {
        return;
      }

      const isCorrect = session.currentResponse.isCorrect === true;
      session.attemptCount += 1;
      session.checkStatus = isCorrect
        ? V1CheckStatusEnum.Success
        : V1CheckStatusEnum.Error;

      if (isCorrect) {
        return;
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
        exerciseId: action.payload.exerciseId,
        isCorrect: false,
        attempts: 0,
        skipped: true,
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
    attemptCount: 0,
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
    attemptCount: clampCount(session.attemptCount),
    hydrated: true,
  };
}

function resetCurrentItem(session: V1LearningNodeSession): void {
  session.currentResponse = null;
  session.ready = false;
  session.checkStatus = V1CheckStatusEnum.Idle;
  session.attemptCount = 0;
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

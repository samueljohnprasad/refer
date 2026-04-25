import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  JourneyState,
  PathNodeData,
  UnitData,
  JourneyStats,
  JourneyConfig,
} from "@/src/types/journey";
import { NodeStatus, NodeIcon } from "@/src/types/journey/enums";

interface JourneyStateSlice {
  journeyState: JourneyState | null;
  config: JourneyConfig | null;
  currentUnitIndex: number;
  lastActiveNodeId: string | null;
  stats: JourneyStats;
  isLoading: boolean;
  error: string | null;
}

const initialState: JourneyStateSlice = {
  journeyState: null,
  config: null,
  currentUnitIndex: 0,
  lastActiveNodeId: null,
  stats: {
    streakDays: 0,
    wallet: { coins: 0, gems: 0 },
    hearts: 5,
    totalXP: 0,
  },
  isLoading: false,
  error: null,
};

const journeySlice = createSlice({
  name: "journey",
  initialState,
  reducers: {
    setJourneyState: (state, action: PayloadAction<JourneyState>) => {
      state.journeyState = action.payload;
      state.currentUnitIndex = action.payload.currentUnit;
      state.lastActiveNodeId = action.payload.lastActiveNodeId;
      state.stats = action.payload.stats;
    },
    setJourneyConfig: (state, action: PayloadAction<JourneyConfig>) => {
      state.config = action.payload;
    },
    updateNodeStatus: (
      state,
      action: PayloadAction<{ nodeId: string; status: NodeStatus }>,
    ) => {},
    updateNodeProgress: (
      state,
      action: PayloadAction<{ nodeId: string; progress: number }>,
    ) => {
      if (!state.journeyState) return;
    },
    completeNode: (state, action: PayloadAction<string>) => {},
    unlockUnit: (state) => {
      if (!state.journeyState) return;
    },
    setCurrentUnitIndex: (state, action: PayloadAction<number>) => {
      state.currentUnitIndex = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetJourneyState: (state) => {
      return initialState;
    },
  },
});

export const {
  setJourneyState,
  setJourneyConfig,
  updateNodeStatus,
  updateNodeProgress,
  completeNode,
  unlockUnit,
  setCurrentUnitIndex,
  setLoading,
  setError,
  resetJourneyState,
} = journeySlice.actions;

export default journeySlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  JourneyState,
  PathNodeData,
  UnitData,
  JourneyStats,
} from "@/src/types/journey";
import { NodeStatus, NodeIcon } from "@/src/types/journey/enums";

interface JourneyStateSlice {
  journeyState: JourneyState | null;
  currentUnitIndex: number;
  lastActiveNodeId: string | null;
  stats: JourneyStats;
  isLoading: boolean;
  error: string | null;
}

const initialState: JourneyStateSlice = {
  journeyState: null,
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
    updateNodeStatus: (
      state,
      action: PayloadAction<{ nodeId: string; status: NodeStatus }>,
    ) => {
      if (!state.journeyState) return;

      const { nodeId, status } = action.payload;

      // Find the node and update its status
      for (
        let unitIndex = 0;
        unitIndex < state.journeyState.units.length;
        unitIndex++
      ) {
        const unit = state.journeyState.units[unitIndex];
        const nodeIndex = unit.nodes.findIndex((node) => node.id === nodeId);

        if (nodeIndex !== -1) {
          const updatedNodes = [...unit.nodes];
          updatedNodes[nodeIndex] = {
            ...updatedNodes[nodeIndex],
            status,
            icon:
              status === NodeStatus.COMPLETED
                ? NodeIcon.CHECKMARK
                : status === NodeStatus.ACTIVE
                  ? NodeIcon.STAR
                  : NodeIcon.LOCK,
            progress:
              status === NodeStatus.COMPLETED
                ? 1
                : status === NodeStatus.ACTIVE
                  ? 0
                  : 0,
          };

          state.journeyState.units[unitIndex] = {
            ...unit,
            nodes: updatedNodes,
          };
          break;
        }
      }
    },
    updateNodeProgress: (
      state,
      action: PayloadAction<{ nodeId: string; progress: number }>,
    ) => {
      if (!state.journeyState) return;

      const { nodeId, progress } = action.payload;

      for (const unit of state.journeyState.units) {
        const nodeIndex = unit.nodes.findIndex((node) => node.id === nodeId);
        if (nodeIndex !== -1) {
          unit.nodes[nodeIndex].progress = Math.max(0, Math.min(1, progress));
          break;
        }
      }
    },
    completeNode: (state, action: PayloadAction<string>) => {
      if (!state.journeyState) return;

      const nodeId = action.payload;

      // Find the node and mark it as completed
      for (
        let unitIndex = 0;
        unitIndex < state.journeyState.units.length;
        unitIndex++
      ) {
        const unit = state.journeyState.units[unitIndex];
        const nodeIndex = unit.nodes.findIndex((node) => node.id === nodeId);

        if (nodeIndex !== -1) {
          const node = unit.nodes[nodeIndex];
          if (node.status === NodeStatus.COMPLETED) return; // Already completed
          if (node.status !== NodeStatus.ACTIVE) return; // Only active nodes can be completed

          const updatedNodes = [...unit.nodes];
          updatedNodes[nodeIndex] = {
            ...node,
            status: NodeStatus.COMPLETED,
            icon: NodeIcon.CHECKMARK,
            progress: 1,
            label: undefined,
          };

          // Unlock next node
          const nextIndex = nodeIndex + 1;
          if (
            nextIndex < updatedNodes.length &&
            updatedNodes[nextIndex].status === NodeStatus.LOCKED
          ) {
            updatedNodes[nextIndex] = {
              ...updatedNodes[nextIndex],
              status: NodeStatus.ACTIVE,
              icon: NodeIcon.STAR,
              label: "START",
              progress: 0,
            };
          }

          // Apply rewards
          const updatedStats = { ...state.stats };
          for (const reward of node.rewards) {
            switch (reward.type) {
              case "xp":
                updatedStats.totalXP += reward.amount;
                break;
              case "gems":
                updatedStats.wallet.gems += reward.amount;
                break;
              case "hearts":
                updatedStats.hearts += reward.amount;
                break;
            }
          }

          state.journeyState.units[unitIndex] = {
            ...unit,
            nodes: updatedNodes,
          };
          state.stats = updatedStats;
          state.lastActiveNodeId =
            nextIndex < updatedNodes.length
              ? updatedNodes[nextIndex].id
              : node.id;
          break;
        }
      }
    },
    unlockUnit: (state) => {
      if (!state.journeyState) return;

      const nextUnitIndex = state.currentUnitIndex + 1;
      if (nextUnitIndex >= state.journeyState.units.length) return;

      const nextUnit = state.journeyState.units[nextUnitIndex];
      if (nextUnit.nodes.length === 0) return;

      const updatedNodes = [...nextUnit.nodes];
      updatedNodes[0] = {
        ...updatedNodes[0],
        status: NodeStatus.ACTIVE,
        icon: NodeIcon.STAR,
        label: "START",
        progress: 0,
      };

      state.journeyState.units[nextUnitIndex] = {
        ...nextUnit,
        nodes: updatedNodes,
      };
      state.currentUnitIndex = nextUnitIndex;
      state.lastActiveNodeId = updatedNodes[0].id;
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

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { TimelineTabType } from '../model/timeline.types';

interface TimelineState {
  activeTab: TimelineTabType;
}

const initialState: TimelineState = {
  activeTab: 'days',
};

export const timelineSlice = createSlice({
  name: 'timeline',
  initialState,
  reducers: {
    setActiveTab(state, action: PayloadAction<TimelineTabType>) {
      state.activeTab = action.payload;
    },
  },
});

export const { setActiveTab } = timelineSlice.actions;
export const timelineReducer = timelineSlice.reducer;

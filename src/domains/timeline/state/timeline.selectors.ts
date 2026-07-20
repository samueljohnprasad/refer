import type { RootState } from '@/src/store/store';

export const selectActiveTimelineTab = (state: RootState) => state.timeline.activeTab;

// domains/journey/state/journeySelectorBase.ts
// Raw selector inputs for the journey feature.
// These stay intentionally simple so higher-level selectors can compose them
// without repeating `state.journey.*` plumbing all over the feature.

import type { RootState } from "@/src/store/store";

export const selectRootState = (state: RootState) => state;

export const selectJourneyState = (state: RootState) => state.journey;

export const selectCourseEntities = (state: RootState) =>
  selectJourneyState(state).courses.entities;

export const selectSectionEntities = (state: RootState) =>
  selectJourneyState(state).sections.entities;

export const selectUnitEntities = (state: RootState) =>
  selectJourneyState(state).units.entities;

export const selectNodeEntities = (state: RootState) =>
  selectJourneyState(state).nodes.entities;

export const selectSectionsByCourseIndex = (state: RootState) =>
  selectJourneyState(state).sectionsByCourse;

export const selectUnitsBySectionIndex = (state: RootState) =>
  selectJourneyState(state).unitsBySection;

export const selectNodesByUnitIndex = (state: RootState) =>
  selectJourneyState(state).nodesByUnit;

export const selectCourseProgressMap = (state: RootState) =>
  selectJourneyState(state).courseProgress;

export const selectNodeProgressMap = (state: RootState) =>
  selectJourneyState(state).nodeProgress;

export const selectLoadedCoursesMap = (state: RootState) =>
  selectJourneyState(state).loadedCourses;

export const selectLoadingCoursesMap = (state: RootState) =>
  selectJourneyState(state).loadingCourses;

export const selectCourseLoadErrorsMap = (state: RootState) =>
  selectJourneyState(state).courseLoadErrors;

export const selectActiveCourseIdState = (state: RootState) =>
  selectJourneyState(state).activeCourseId;

export const selectPreviewSectionIdByCourseMap = (state: RootState) =>
  selectJourneyState(state).previewSectionIdByCourse;

export const selectActiveNodeModalIdByCourseMap = (state: RootState) =>
  selectJourneyState(state).activeNodeModalIdByCourse;

export const selectPendingCelebrationMap = (state: RootState) =>
  selectJourneyState(state).pendingCelebration;

export const selectCourseFinaleSeenMap = (state: RootState) =>
  selectJourneyState(state).courseFinaleSeenByCourse;

export const selectCourseIdParam = (_: RootState, courseId: string) => courseId;

export const selectSectionIdParam = (_: RootState, sectionId: string) =>
  sectionId;

export const selectUnitIdParam = (_: RootState, unitId: string) => unitId;

export const selectNodeIdParam = (_: RootState, nodeId: string) => nodeId;

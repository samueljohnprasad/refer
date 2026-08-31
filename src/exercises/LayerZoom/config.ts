import { getLayerZoomPrimaryLabel, getNextLayerZoomState } from '@/src/domains/journey/learning/courseExercisePrimaryTransition';
import { CourseExerciseCategoryConfig, IMMEDIATE_OPTION_SELECTION } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { LayerZoomCategoryEngine } from "@/src/components/exercise/LayerZoomCategoryEngine";
import { validateLayerZoomContent } from "@/src/components/exercise/layerZoomContent";

export const LayerZoomConfig: CourseExerciseCategoryConfig = {
category: CourseExerciseCategoryEnum.LayerZoom,
    formats: [CourseExerciseCategoryEnum.LayerZoom],
    engine: LayerZoomCategoryEngine,
    goalLabel: "Separate an event, body alarm, and interpretation.",
    unavailableCopy: "This layered explanation is not available yet.",
  interaction: {
    submissionMode: "explicit",
    getPrimaryLabel: (exercise, response) => getLayerZoomPrimaryLabel(exercise, response),
    getPrimaryTransition: (exercise, response) => getNextLayerZoomState(exercise, response) ?? null,
  },
  validation: validateLayerZoomContent,
};

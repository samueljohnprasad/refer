import { useAppSelector } from "@/src/store/hooks";
import {
  selectActiveGlobalIndex,
  selectActiveNodeY,
  selectFlashListData,
} from "@/src/store/selectors/journeySelectors";
import {
  selectActiveNodeIndex,
  selectTotalCompletedCount,
  selectUnitCompletedCounts,
  selectUnits,
} from "@/src/store/slices/sectionMapSelectors";

export function useJourneyDerivedState() {
  const units = useAppSelector(selectUnits);
  const unitCompletedCounts = useAppSelector(selectUnitCompletedCounts);
  const totalCompletedCount = useAppSelector(selectTotalCompletedCount);
  const flashListData = useAppSelector(selectFlashListData);
  const flashActiveNodeIndex = useAppSelector(selectActiveNodeIndex);
  const activeGlobalIndex = useAppSelector(selectActiveGlobalIndex);
  const flashActiveNodeY = useAppSelector(selectActiveNodeY);

  return {
    units,
    unitCompletedCounts,
    totalCompletedCount,
    flashListData,
    flashActiveNodeIndex,
    activeGlobalIndex,
    flashActiveNodeY,
  };
}

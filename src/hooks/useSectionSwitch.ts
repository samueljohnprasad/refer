import { useCallback } from "react";
import { useAppDispatch } from "@/src/store/hooks";
import { setCurrentSectionNumber } from "@/src/store/slices/sectionMapSlice";
import { createLogger } from "@/src/lib/logger";

const log = createLogger("useSectionSwitch");

/**
 * Hook to handle section switching logic.
 * Only updates Redux state; RTK Query handles the API call automatically.
 */
export function useSectionSwitch() {
  const dispatch = useAppDispatch();

  const handleSectionSwitch = useCallback(
    (unitNumber: number) => {
      dispatch(setCurrentSectionNumber(unitNumber));
    },
    [dispatch],
  );

  return handleSectionSwitch;
}

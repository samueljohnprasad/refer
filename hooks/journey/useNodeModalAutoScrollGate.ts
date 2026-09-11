import { useEffect, useRef, useState } from "react";

import { JOURNEY } from "@/src/lib/constants/journey";
import { selectActiveNodeModalIdForCourse } from "@/src/domains/journey/state/journeySelectors";
import { useAppSelector } from "@/src/store/hooks";

const AUTO_SCROLL_RESUME_DELAY_MS = JOURNEY.SCROLL_TO_NODE_DELAY_MS;

export function useNodeModalAutoScrollGate(
  courseId: string,
  isBlocked?: boolean,
): boolean {
  const isNodeModalOpen = useAppSelector(
    (state) => selectActiveNodeModalIdForCourse(state, courseId) !== null,
  );
  const isGated = isNodeModalOpen || Boolean(isBlocked);
  const [canAutoScroll, setCanAutoScroll] = useState(!isGated);
  const hasPausedForModalRef = useRef(isGated);

  useEffect(() => {
    if (isGated) {
      hasPausedForModalRef.current = true;
      setCanAutoScroll(false);
      return;
    }

    if (!hasPausedForModalRef.current) {
      setCanAutoScroll(true);
      return;
    }

    const timeoutId = setTimeout(() => {
      hasPausedForModalRef.current = false;
      setCanAutoScroll(true);
    }, AUTO_SCROLL_RESUME_DELAY_MS);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isGated]);

  return canAutoScroll;
}

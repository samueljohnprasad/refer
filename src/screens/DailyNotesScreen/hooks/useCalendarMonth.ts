import { useEffect, useMemo, useState, type SetStateAction } from "react";
import {
  addMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  type Locale,
  format,
} from "date-fns";
import { useAtom, useSetAtom } from "jotai";
import { calenderVisibleDatesAtom } from "../atoms";

export interface UseCalendarMonthOptions {
  selectedDate: Date;
  visible?: boolean;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6; // default 0 (Sunday)
  locale?: Locale; // reserved for future localization
}

export interface UseCalendarMonthReturn {
  currentMonth: Date;
  setCurrentMonth: (update: SetStateAction<Date>) => void;
  visibleStart: Date;
  visibleEnd: Date;
  days: Date[];
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
}

const useCalendarMonth = (
  options: UseCalendarMonthOptions
): UseCalendarMonthReturn => {
  const { selectedDate, visible, weekStartsOn = 0 } = options;
  const setCalenderVisibleDates = useSetAtom(calenderVisibleDatesAtom);
  const [currentMonth, setCurrentMonth] = useState<Date>(
    startOfMonth(selectedDate)
  );

  // Keep the calendar's visible month in sync with the externally selected date
  useEffect((): void => {
    setCurrentMonth(startOfMonth(selectedDate));
  }, [selectedDate]);

  // When the calendar becomes visible (e.g., expanded), ensure it shows the selected date's month
  useEffect((): void => {
    if (visible) {
      setCurrentMonth(startOfMonth(selectedDate));
    }
  }, [visible, selectedDate]);

  const visibleStart = useMemo<Date>((): Date => {
    return startOfWeek(startOfMonth(currentMonth), { weekStartsOn });
  }, [currentMonth, weekStartsOn]);

  const visibleEnd = useMemo<Date>((): Date => {
    return endOfWeek(endOfMonth(currentMonth), { weekStartsOn });
  }, [currentMonth, weekStartsOn]);

  const days = useMemo<Date[]>((): Date[] => {
    return eachDayOfInterval({ start: visibleStart, end: visibleEnd });
  }, [visibleStart, visibleEnd]);

  const goToPreviousMonth = (): void => {
    setCurrentMonth((prev: Date) => startOfMonth(addMonths(prev, -1)));
  };

  const goToNextMonth = (): void => {
    setCurrentMonth((prev: Date) => startOfMonth(addMonths(prev, 1)));
  };

  useEffect(() => {
    setCalenderVisibleDates({
      visibleStartDate: visibleStart,
      visibleEndDate: visibleEnd,
    });
  }, [format(visibleStart, "yyyy-MM-dd"), format(visibleEnd, "yyyy-MM-dd")]);

  return {
    currentMonth,
    setCurrentMonth,
    visibleStart,
    visibleEnd,
    days,
    goToPreviousMonth,
    goToNextMonth,
  };
};

export default useCalendarMonth;

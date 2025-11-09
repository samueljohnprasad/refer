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
import { formateDate_y_m_d } from "@/src/utils/date";

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
  goToDate: (date: Date) => void;
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
    const allDays = eachDayOfInterval({ start: visibleStart, end: visibleEnd });
    // Always return 42 days (6 weeks) for consistent calendar display
    const CALENDAR_DAYS = 42;

    // If we have fewer than 42 days, add days from the next month
    if (allDays.length < CALENDAR_DAYS) {
      const additionalDays = CALENDAR_DAYS - allDays.length;
      const lastDay = allDays[allDays.length - 1];
      for (let i = 1; i <= additionalDays; i++) {
        allDays.push(new Date(lastDay.getTime() + i * 24 * 60 * 60 * 1000));
      }
    }

    return allDays;
  }, [visibleStart, visibleEnd]);

  const goToPreviousMonth = (): void => {
    setCurrentMonth((prev: Date) => startOfMonth(addMonths(prev, -1)));
  };

  const goToNextMonth = (): void => {
    setCurrentMonth((prev: Date) => startOfMonth(addMonths(prev, 1)));
  };

  const goToDate = (date: Date): void => {
    setCurrentMonth(startOfMonth(date));
  };

  const visibleStartDate = formateDate_y_m_d(visibleStart);
  const visibleEndDate = formateDate_y_m_d(visibleEnd);

  useEffect(() => {
    setCalenderVisibleDates({
      visibleStartDate,
      visibleEndDate,
    });
  }, [visibleStartDate, visibleEndDate]);

  return {
    currentMonth,
    setCurrentMonth,
    visibleStart,
    visibleEnd,
    days,
    goToPreviousMonth,
    goToNextMonth,
    goToDate,
  };
};

export default useCalendarMonth;

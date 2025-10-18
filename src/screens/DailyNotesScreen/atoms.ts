import { atom } from "jotai";

export const selectedDateAtom = atom(new Date());
export const currentWeekViewAtom = atom(new Date());
export const calenderVisibleDatesAtom = atom<{
  visibleStartDate: Date;
  visibleEndDate: Date;
}>();

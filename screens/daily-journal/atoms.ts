import { atom } from "jotai";

export const showCalendarModalAtom = atom(false);
export const selectedDateAtom = atom(new Date());
export const currentWeekViewAtom = atom(new Date());

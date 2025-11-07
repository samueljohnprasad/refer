import { atom } from "jotai";

export const recorderOpenAtom = atom(false);
export const keyboardJournalOpenAtom = atom(false);
export const selectedDateDiscoveryAtom = atom<Date>(new Date());

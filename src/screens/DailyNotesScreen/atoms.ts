import { JournalEntry } from "@/hooks/data/types";
import { atom } from "jotai";

export const selectedDateAtom = atom(new Date());
export const currentWeekViewAtom = atom(new Date());
export const calenderVisibleDatesAtom = atom<{
  visibleStartDate?: string;
  visibleEndDate?: string;
}>({
  visibleStartDate: undefined,
  visibleEndDate: undefined,
});

export const startRecordingAtom = atom(false);
export const openAIInsightsAtom = atom(false);

export type DeleteJournal = {
  flag?: boolean;
  entry?: JournalEntry | null;
  selectedDate?: Date;
};
// export const deleteJournalEntry = atom<DeleteJournal>({
//   flag: false,
//   entry: null,
// });

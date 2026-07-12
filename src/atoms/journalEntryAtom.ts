import { atom } from "jotai";
import { JournalEntry } from "@/hooks/data/types";

export const selectedJournalEntryAtom = atom<JournalEntry | null>(null);

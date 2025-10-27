import { atom } from "jotai";
import type { RemindersConfig } from "@/src/lib/notification-reminders";

/**
 * Global atom for reminder configuration state
 */
export const cfgAtom = atom<RemindersConfig>({});

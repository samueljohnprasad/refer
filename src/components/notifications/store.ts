import { atom } from "jotai";
import type { RemindersConfig } from "@/src/components/lib/notification-reminders";

/**
 * Global atom for reminder configuration state
 */
export const cfgAtom = atom<RemindersConfig>({});

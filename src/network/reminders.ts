import { supabase } from "@/src/network/auth/supabase";
import { Tables, TablesInsert } from "@/database.types";
import {
  RemindersConfig,
  parseHourMinute,
  saveRemindersConfig,
} from "@/src/lib/notification-reminders";

// Return the current authenticated user id or null
export async function getCurrentUserId(): Promise<string | null> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user?.id) return null;
  return data.user.id;
}

// Pick a single "primary" time from the multi-slot config. Strategy: earliest enabled time.
export function pickPrimaryFromConfig(cfg: RemindersConfig): {
  enabled: boolean;
  hour: number | null;
  minute: number | null;
} {
  const enabledEntries = Object.entries(cfg).filter(([, v]) => v?.enabled);
  if (enabledEntries.length === 0)
    return { enabled: false, hour: null, minute: null };
  const times = enabledEntries.map(([id, v]) => {
    const { hour, minute } = parseHourMinute(v.time);
    return { id, hour, minute, total: hour * 60 + minute };
  });
  times.sort((a, b) => a.total - b.total);
  const t = times[0];
  return { enabled: true, hour: t.hour, minute: t.minute };
}

// Upsert into user_preferences a single daily reminder (schema only supports one time)
export async function syncRemindersToSupabase(
  cfg: RemindersConfig
): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId) return;
  const { enabled, hour, minute } = pickPrimaryFromConfig(cfg);
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? null;

  const payload: TablesInsert<"user_preferences"> = {
    user_id: userId,
    daily_reminder_enabled: enabled,
    daily_reminder_hour: enabled ? hour : null,
    daily_reminder_min: enabled ? minute : null,
    timezone,
  };

  // Upsert by user_id if there is a unique index; otherwise this will insert a new row.
  const { error } = await supabase
    .from("user_preferences")
    .upsert(payload, { onConflict: "user_id" });
  if (error) {
    // Optionally log or surface the error to UI
    console.warn("syncRemindersToSupabase error", error);
  }
}

// Fetch user_preferences and return a normalized shape
export async function fetchUserPreferences(): Promise<{
  enabled: boolean;
  hour: number | null;
  minute: number | null;
} | null> {
  const userId = await getCurrentUserId();
  if (!userId) return null;
  const { data, error } = await supabase
    .from("user_preferences")
    .select("daily_reminder_enabled, daily_reminder_hour, daily_reminder_min")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) {
    console.warn("fetchUserPreferences error", error);
    return null;
  }
  if (!data) return null;
  const row = data as Pick<
    Tables<"user_preferences">,
    "daily_reminder_enabled" | "daily_reminder_hour" | "daily_reminder_min"
  >;
  return {
    enabled: !!row.daily_reminder_enabled,
    hour: row.daily_reminder_hour,
    minute: row.daily_reminder_min,
  };
}

// Persist a provided cfg locally after optionally fetching from Supabase first
export async function hydrateLocalFromSupabaseIfEmpty(
  currentCfg: RemindersConfig,
  defaultId: string,
  defaultTitle: string
): Promise<RemindersConfig> {
  if (Object.keys(currentCfg).length > 0) return currentCfg;
  const prefs = await fetchUserPreferences();
  if (!prefs || !prefs.enabled || prefs.hour == null || prefs.minute == null)
    return currentCfg;
  const nextCfg: RemindersConfig = {
    [defaultId]: {
      hour: prefs.hour,
      minute: prefs.minute,
      enabled: true,
      title: defaultTitle,
    },
  };
  await saveRemindersConfig(nextCfg);
  return nextCfg;
}

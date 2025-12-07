import { useAuth } from "@/src/context/AuthContext";
import { supabase } from "@/src/network/auth/supabase";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";

/**
 * Map of time slots to mood scores for daily view
 * Key format: "HH:mm" (e.g., "09:00", "09:30", "10:00")
 */
export type DailyMoodsMap = Map<string, number>;

interface MoodEntry {
  selected_date: string;
  mood_score: number | null;
}

interface FetchDailyMoodsParams {
  userId?: string;
  targetDate: string; // YYYY-MM-DD format
}

/**
 * Fetch mood entries for a single day and organize by 30-minute intervals
 */
async function fetchDailyMoods({
  userId,
  targetDate,
}: FetchDailyMoodsParams): Promise<DailyMoodsMap> {
  const moodMap: DailyMoodsMap = new Map<string, number>();

  if (!userId || !targetDate) {
    return moodMap;
  }

  const startOfDay = dayjs(targetDate).startOf("day").toISOString();
  const endOfDay = dayjs(targetDate).endOf("day").toISOString();

  const { data, error } = await supabase
    .from("moods")
    .select("selected_date, mood_score")
    .eq("user_id", userId)
    .gte("selected_date", startOfDay)
    .lte("selected_date", endOfDay)
    .not("mood_score", "is", null)
    .order("selected_date", { ascending: true });

  if (error || !data) {
    return moodMap;
  }

  // Group mood entries by 30-minute intervals
  data.forEach((entry) => {
    if (entry.mood_score === null) return;

    const entryTime = dayjs(entry.selected_date);
    const hour = entryTime.hour();
    const minute = entryTime.minute();
    // Round to nearest 30-minute interval
    const roundedMinute = minute < 30 ? 0 : 30;
    const timeKey = `${hour.toString().padStart(2, "0")}:${roundedMinute
      .toString()
      .padStart(2, "0")}`;

    // If multiple entries in same slot, keep the latest (or average them)
    // For simplicity, we'll keep the latest one
    moodMap.set(timeKey, entry.mood_score);
  });

  return moodMap;
}

interface UseFetchDailyMoodsParams {
  targetDate: string; // YYYY-MM-DD format
}

/**
 * Hook to fetch mood data for a single day organized by 30-minute intervals
 */
export const useFetchDailyMoods = ({
  targetDate,
}: UseFetchDailyMoodsParams) => {
  const { user } = useAuth();

  const query = useQuery({
    queryKey: ["daily-moods-intervals", user?.id, targetDate],
    queryFn: () =>
      fetchDailyMoods({
        userId: user?.id,
        targetDate,
      }),
    staleTime: 5 * 60_000,
    gcTime: 10 * 60_000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: !!user?.id && !!targetDate,
  });

  return query;
};

export default useFetchDailyMoods;

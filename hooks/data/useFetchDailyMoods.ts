import { useAuth } from "@/src/context/AuthContext";
import { supabase } from "@/src/network/auth/supabase";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";

export interface RawMoodEntry {
  selected_date: string;
  mood_score: number;
  input_method: string | null;
}

export type DailyMoodsMap = Map<string, RawMoodEntry>;

export type DailyMoodsList = RawMoodEntry[];

interface FetchParams {
  userId?: string;
  targetDate: string;
}

function isValidMoodEntry(entry: {
  selected_date: string | null;
  mood_score: number | null;
  input_method: string | null;
}): entry is RawMoodEntry {
  return entry.selected_date !== null && entry.mood_score !== null;
}

async function fetchRawDailyMoods({
  userId,
  targetDate,
}: FetchParams): Promise<RawMoodEntry[]> {
  if (!userId || !targetDate) {
    return [];
  }

  const startOfDay = dayjs(targetDate).startOf("day").toISOString();
  const endOfDay = dayjs(targetDate).endOf("day").toISOString();

  const { data, error } = await supabase
    .from("moods")
    .select("selected_date, mood_score, input_method")
    .eq("user_id", userId)
    .gte("selected_date", startOfDay)
    .lte("selected_date", endOfDay)
    .not("mood_score", "is", null)
    .order("selected_date", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data.filter(isValidMoodEntry);
}

function transformToIntervalMoods(entries: RawMoodEntry[]): DailyMoodsMap {
  const moodMap: DailyMoodsMap = new Map();

  entries.forEach((entry) => {
    const entryTime = dayjs(entry.selected_date);
    const hour = entryTime.hour();
    const minute = entryTime.minute();

    const roundedMinute = minute < 30 ? 0 : 30;
    const timeKey = `${hour.toString().padStart(2, "0")}:${roundedMinute
      .toString()
      .padStart(2, "0")}`;

    moodMap.set(timeKey, {
      mood_score: entry.mood_score,
      selected_date: entry.selected_date,
      input_method: entry.input_method,
    });
  });

  return moodMap;
}

interface UseFetchDailyMoodsParams {
  targetDate: string; // YYYY-MM-DD format
}

export const useFetchDailyMoods = ({
  targetDate,
}: UseFetchDailyMoodsParams) => {
  const { user } = useAuth();

  const { data = [], isLoading } = useQuery({
    queryKey: ["daily-moods-intervals", user?.id, targetDate],
    queryFn: () =>
      fetchRawDailyMoods({
        userId: user?.id,
        targetDate,
      }),
    staleTime: 5 * 60_000,
    gcTime: 10 * 60_000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: !!user?.id && !!targetDate,
  });

  const groupedMoods = transformToIntervalMoods(data);
  return { data, groupedMoods, isLoading };
};

export default useFetchDailyMoods;

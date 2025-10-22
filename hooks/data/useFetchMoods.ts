import { useAuth } from "@/src/context/AuthContext";
import { supabase } from "@/src/network/auth/supabase";
import { calenderVisibleDatesAtom } from "@/src/screens/DailyNotesScreen/atoms";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useAtomValue } from "jotai";
import { formateDate_y_m_d } from "./date";

type FetchMonthlyMoodsParams = {
  userId?: string;
  visibleStartDate?: string;
  visibleEndDate?: string;
};
async function fetchMonthlyMoods({
  userId,
  visibleStartDate,
  visibleEndDate,
}: FetchMonthlyMoodsParams) {
  const moodMap = new Map<string, number>();
  if (!userId || !visibleEndDate || !visibleStartDate) {
    return moodMap;
  }

  const startDate = new Date(visibleStartDate);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(visibleEndDate);
  endDate.setHours(23, 59, 59, 999);
  const { data, error } = await supabase
    .from("daily_moods")
    .select("day, mood_avg")
    .eq("user_id", userId)
    .gte("day", startDate.toISOString())
    .lt("day", endDate.toISOString())
    .order("day", { ascending: true });
  if (error || !data) {
    console.error("Error fetching daily moods:", error);
    return moodMap;
  }

  const moodMapData = data.reduce((acc, mood) => {
    const localDate = new Date(mood.day);
    localDate.setHours(0, 0, 0, 0);
    acc.set(formateDate_y_m_d(localDate), Math.round(mood.mood_avg));
    return acc;
  }, moodMap);

  return moodMapData;
}

const useFetchMoods = () => {
  const { user } = useAuth();
  const { visibleStartDate, visibleEndDate } = useAtomValue(
    calenderVisibleDatesAtom
  );

  const query = useQuery({
    queryKey: ["daily-moods", user?.id, visibleStartDate, visibleEndDate],
    queryFn: () =>
      fetchMonthlyMoods({
        userId: user?.id,
        visibleStartDate,
        visibleEndDate,
      }),
    staleTime: 5 * 60_000,
    gcTime: 10 * 60_000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: !!user?.id && !!visibleStartDate && !!visibleEndDate,
  });

  return query;
};

export default useFetchMoods;

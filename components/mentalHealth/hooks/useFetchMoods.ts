import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { calenderVisibleDatesAtom } from "@/screens/daily-journal/atoms";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useAtomValue } from "jotai";

const useFetchMoods = () => {
  const { user } = useAuth();
  const calenderVisibleDates = useAtomValue(calenderVisibleDatesAtom);
  async function fetchMonthlyMoods() {
    const moodMap = new Map<string, number>();
    if (
      !user?.id ||
      !calenderVisibleDates?.visibleEndDate ||
      !calenderVisibleDates?.visibleStartDate
    ) {
      return moodMap;
    }

    const startDate = new Date(calenderVisibleDates.visibleStartDate);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(calenderVisibleDates.visibleEndDate);
    endDate.setHours(23, 59, 59, 999);

    const { data, error } = await supabase
      .from("daily_moods")
      .select("day, mood_avg")
      .eq("user_id", user?.id)
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
      acc.set(format(localDate, "yyyy-MM-dd"), Math.round(mood.mood_avg));
      return acc;
    }, moodMap);

    return moodMapData;
  }

  const query = useQuery({
    queryKey: [
      user?.id,
      !calenderVisibleDates?.visibleEndDate,
      !calenderVisibleDates?.visibleStartDate,
    ],
    queryFn: fetchMonthlyMoods,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    enabled:
      !!user?.id &&
      !!calenderVisibleDates?.visibleEndDate &&
      !!calenderVisibleDates?.visibleStartDate,
  });

  return query;
};

export default useFetchMoods;

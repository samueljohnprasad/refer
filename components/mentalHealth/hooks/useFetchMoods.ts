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
    console.log("datadatadata", data);
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

  const startKey = calenderVisibleDates?.visibleStartDate
    ? format(new Date(calenderVisibleDates.visibleStartDate), "yyyy-MM-dd")
    : null;
  const endKey = calenderVisibleDates?.visibleEndDate
    ? format(new Date(calenderVisibleDates.visibleEndDate), "yyyy-MM-dd")
    : null;

  const query = useQuery({
    queryKey: ["daily-moods", user?.id, startKey, endKey],
    queryFn: fetchMonthlyMoods,
    staleTime: 5 * 60_000,
    gcTime: 10 * 60_000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: !!user?.id && !!startKey && !!endKey,
  });

  return query;
};

export default useFetchMoods;

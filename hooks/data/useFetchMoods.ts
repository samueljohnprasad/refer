import { useAuth } from "@/src/context/AuthContext";
import { supabase } from "@/src/network/auth/supabase";
import { calenderVisibleDatesAtom } from "@/src/screens/DailyNotesScreen/atoms";
import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import dayjs from "dayjs";
import { ISO_DATE_FORMAT } from "@/src/utils/date";

type FetchMonthlyMoodsParams = {
  userId?: string;
  visibleStartDate?: string;
  visibleEndDate?: string;
};

export type MoodsMap = Map<string, number>;
async function fetchMoodsInRange({
  userId,
  visibleStartDate,
  visibleEndDate,
}: FetchMonthlyMoodsParams) {
  const moodMap: MoodsMap = new Map<string, number>();
  if (!userId || !visibleEndDate || !visibleStartDate) {
    return moodMap;
  }

  const startDate = dayjs(visibleStartDate).startOf("day");
  const endDate = dayjs(visibleEndDate).endOf("day");
  const { data, error } = await supabase
    .from("daily_moods")
    .select("day, mood_avg")
    .eq("user_id", userId)
    .gte("day", startDate)
    .lt("day", endDate)
    .order("day", { ascending: true });
  if (error || !data) {
    return moodMap;
  }

  const moodMapData = data.reduce((acc, mood) => {
    const localDate = dayjs(mood.day).format(ISO_DATE_FORMAT);
    acc.set(localDate, Math.round(mood.mood_avg));
    return acc;
  }, moodMap);

  return moodMapData;
}

interface FetchMoodsParams {
  visibleStartDate?: string;
  visibleEndDate?: string;
}

const useFetchMoods = ({
  visibleStartDate,
  visibleEndDate,
}: FetchMoodsParams) => {
  const { user } = useAuth();

  const query = useQuery({
    queryKey: ["daily-moods", user?.id, visibleStartDate, visibleEndDate],
    queryFn: () =>
      fetchMoodsInRange({
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

export const useFetchMoodsMonthly = () => {
  const { visibleStartDate, visibleEndDate } = useAtomValue(
    calenderVisibleDatesAtom
  );
  return useFetchMoods({
    visibleStartDate,
    visibleEndDate,
  });
};

export default useFetchMoods;

import { useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/src/context/AuthContext";
import { supabase } from "@/src/network/auth/supabase";
import { formateDate_y_m_d } from "../../src/utils/date";
import { TWO_HOUR } from "@/constants/Colors";
import { Tables } from "@/types/types";
import { JournalEntry } from "./types";
import dayjs from "dayjs";

export const useMentalHealthData = (selectedDate: Date) => {
  const { user } = useAuth();
  const formattedDate = formateDate_y_m_d(selectedDate);

  const loadData = useCallback(async (): Promise<JournalEntry[]> => {
    if (!user?.id) {
      return [];
    }
    try {
      const start = dayjs(selectedDate).startOf("day").toISOString();
      const end = dayjs(selectedDate).endOf("day").toISOString();

      const { data, error: dateColErr } = await supabase
        .from("journal_records")
        .select(
          `*,
          journal_ai_insights(*),
          moods(*)
          `
        )
        .eq("user_id", user.id)
        .gte("selected_date", start)
        .lte("selected_date", end)
        .order("selected_date", { ascending: true });

      if (dateColErr) {
        throw dateColErr;
      }

      if (!data) {
        return [];
      }

      return data as JournalEntry[];
    } catch (err) {
      return [];
    }
  }, [user?.id, formattedDate]);

  const query = useQuery<JournalEntry[]>({
    queryKey: ["journals_data", user?.id, formattedDate],
    queryFn: loadData,
    staleTime: TWO_HOUR,
    gcTime: TWO_HOUR,
    enabled: !!user?.id && !!formattedDate,
    retry: 2, // Retry failed requests twice
    retryDelay: (attemptIndex: number): number =>
      Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    refetchOnMount: false, // Don't refetch on mount if data exists
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });
  return query;
};

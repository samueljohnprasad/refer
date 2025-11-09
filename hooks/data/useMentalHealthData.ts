import { useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/src/context/AuthContext";
import { supabase } from "@/src/network/auth/supabase";
import { formateDate_y_m_d } from "../../src/utils/date";
import { TWO_HOUR } from "@/constants/Colors";
import { Tables } from "@/types/types";
import { JournalEntry } from "./types";

export const useMentalHealthData = (selectedDate: Date) => {
  const { user } = useAuth();
  const formattedDate = formateDate_y_m_d(selectedDate);

  const loadData = useCallback(async (): Promise<JournalEntry[]> => {
    if (!user?.id) {
      return [];
    }
    try {
      const start: Date = new Date(formattedDate);
      start.setHours(0, 0, 0, 0);
      const end: Date = new Date(formattedDate);
      end.setHours(23, 59, 59, 999);

      const { data, error: dateColErr } = await supabase
        .from("journal_records")
        .select(
          `*,
          journal_ai_insights(*),
          moods(*)
          `
        )
        .eq("user_id", user.id)
        .gte("selected_date", start.toISOString())
        .lte("selected_date", end.toISOString())
        .order("selected_date", { ascending: false });

      if (dateColErr) {
        console.error("[useMentalHealthData] Supabase query error:", {
          error: dateColErr,
          userId: user.id,
          date: formattedDate,
        });
        throw dateColErr;
      }

      if (!data) {
        console.warn("[useMentalHealthData] No data returned for:", {
          userId: user.id,
          date: formattedDate,
        });
        return [];
      }

      return data as JournalEntry[];
    } catch (err) {
      const errorMessage: string =
        err instanceof Error ? err.message : "Unknown error";
      console.error("[useMentalHealthData] Error loading data:", {
        message: errorMessage,
        userId: user?.id,
        date: formattedDate,
        error: err,
      });
      // Return empty array to prevent app crash
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

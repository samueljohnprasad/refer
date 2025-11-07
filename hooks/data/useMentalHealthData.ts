import { useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/src/context/AuthContext";
import { supabase } from "@/src/network/auth/supabase";
import { formateDate_y_m_d } from "./date";
import { TWO_HOUR } from "@/constants/Colors";
import { Tables } from "@/types/types";

// Custom hook for mental health data management (for potential reuse)
export const useMentalHealthData = (selectedDate: Date) => {
  const { user } = useAuth();
  const formattedDate = formateDate_y_m_d(selectedDate);

  const loadData = useCallback(async () => {
    if (!user?.id) {
      return [];
    }
    try {
      const start = new Date(selectedDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(selectedDate);
      end.setHours(23, 59, 59, 999);

      const { data, error: dateColErr } = await supabase
        .from("journal_records")
        .select("*")
        .eq("user_id", user.id)
        .gte("selected_date", start.toISOString())
        .lte("selected_date", end.toISOString())
        .order("selected_date", { ascending: false });

      if (dateColErr || !data) throw dateColErr;

      return data;
    } catch (err) {
      console.error("Error loading mental health data:", err);
      return [];
    }
  }, [user?.id, formattedDate]);

  
  const query = useQuery<Tables<"journal_records">[]>({
    queryKey: [user?.id, formattedDate],
    queryFn: loadData,
    staleTime: TWO_HOUR,
    gcTime: TWO_HOUR,
    enabled: !!user?.id && !!formattedDate,
  });
  return query;
};

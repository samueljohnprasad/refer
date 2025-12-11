import React, { useCallback, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/src/network/auth/supabase";
import { useAuth } from "@/src/context/AuthContext";
import { format } from "date-fns";
import type { Database } from "@/database.types";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState, Platform } from "react-native";
import { ExtensionStorage } from "@bacons/apple-targets";
import {
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
} from "@/components/ui/toast";
import { useDailyStreak } from "./useDailyStreak";

type MoodEnum = Database["public"]["Enums"]["mood"];

// Map emotion IDs (1-5) to mood enum values
const EMOTION_ID_TO_MOOD: Record<number, MoodEnum> = {
  1: "terrible",
  2: "bad",
  3: "fine",
  4: "good",
  5: "great",
};

const MOOD_TO_EMOTION_ID: Record<MoodEnum, number> = {
  terrible: 1,
  bad: 2,
  fine: 3,
  good: 4,
  great: 5,
};

export interface EmotionCount {
  emotionId: number;
  count: number;
}

/**
 * Fetch emotion counts for a specific day
 */
async function fetchDailyEmotions(
  userId: string,
  selectedDate: Date
): Promise<Map<number, number>> {
  const emotionCounts = new Map<number, number>();

  const startOfDay = dayjs(selectedDate).startOf("day").toISOString();
  const endOfDay = dayjs(selectedDate).endOf("day").toISOString();

  const { data, error } = await supabase
    .from("moods")
    .select("main_mood")
    .eq("user_id", userId)
    .gte("selected_date", startOfDay)
    .lte("selected_date", endOfDay)
    .not("main_mood", "is", null);

  if (error) {
    return emotionCounts;
  }

  // Count each mood
  data.forEach((mood) => {
    if (mood.main_mood) {
      const emotionId = MOOD_TO_EMOTION_ID[mood.main_mood];
      emotionCounts.set(emotionId, (emotionCounts.get(emotionId) || 0) + 1);
    }
  });

  return emotionCounts;
}

const APP_GROUP_IDENTIFIER = "group.samuelprasad.happy";
const storage = new ExtensionStorage(APP_GROUP_IDENTIFIER);
const widgetEmotionsKey = "emotionCounts";
const syncToWidget = async (counts: Map<number, number>) => {
  if (Platform.OS !== "ios") return;
  try {
    const countsObj: Record<string, number> = {};
    counts.forEach((value, key) => {
      countsObj[key.toString()] = value;
    });

    storage.set(widgetEmotionsKey, countsObj);
  } catch (error) {
    console.warn("Failed to sync to widget:", error);
  }
};

/**
 * Log a new emotion entry
 */
async function logEmotion(userId: string, emotionId: number): Promise<void> {
  const mood = EMOTION_ID_TO_MOOD[emotionId];

  if (!mood) {
    throw new Error(`Invalid emotion ID: ${emotionId}`);
  }

  const { error } = await supabase.from("moods").insert({
    user_id: userId,
    main_mood: mood,
    selected_date: new Date().toISOString(),
    input_method: "emotion_logger",
    journal_entry_id: null,
    mood_score: emotionId,
  });

  if (error) {
    throw error;
  }
}

/**
 * Custom hook for emotion logging with Supabase
 */
export function useEmotionLogger(selectedDate: Date = new Date()) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const dateStr = format(selectedDate, "yyyy-MM-dd");
  const toast = useToast();
  const { logStreakIfNeeded } = useDailyStreak();

  const COOLDOWN_MS: number = 30 * 60 * 1000; // 30 minutes
  const lastLogKey = "lastLogKey";

  // Fetch daily emotions
  const {
    data: emotionCounts = new Map<number, number>(),
    isLoading,
    error,
  } = useQuery({
    queryKey: ["daily-emotions", user?.id, dateStr],
    queryFn: async () => {
      if (!user?.id) return new Map<number, number>();
      return fetchDailyEmotions(user.id, selectedDate);
    },
    staleTime: 2 * 60 * 60 * 1000, // 2 hours
    gcTime: 5 * 60 * 60 * 1000, // 5 hours
    refetchOnWindowFocus: false,
    enabled: Boolean(user?.id),
  });

  React.useEffect(() => {
    if (emotionCounts) {
      syncToWidget(emotionCounts);
    }
  }, [emotionCounts]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "background") {
        console.log("background");
        ExtensionStorage.reloadWidget();
      }
    });
    return () => {
      subscription.remove();
    };
  }, []);

  const logEmotionMutation = useMutation({
    mutationFn: async (emotionId: number) => {
      if (!user?.id) throw new Error("User not authenticated");
      return logEmotion(user.id, emotionId);
    },
    onSuccess: () => {
      logStreakIfNeeded();
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({
        queryKey: ["daily-emotions", user?.id, dateStr],
      });

      // Invalidate all mood-related queries
      queryClient.invalidateQueries({
        queryKey: ["moods"],
        refetchType: "active",
      });

      // Invalidate daily moods for calendar display
      queryClient.invalidateQueries({
        queryKey: ["daily-moods"],
        refetchType: "active",
      });

      // Invalidate daily moods range queries for weekly mood chart
      queryClient.invalidateQueries({
        queryKey: ["daily-moods-range"],
        refetchType: "active",
      });

      // Persist last emotion log time and update cache
      if (lastLogKey) {
        const ts = dayjs().valueOf();
        AsyncStorage.setItem(lastLogKey, String(ts)).catch(() => {});
      }
    },
    onError: (error) => {},
  });

  const handleLogEmotion = useCallback(
    async (emotionId: number) => {
      const raw = await AsyncStorage.getItem(lastLogKey);
      const ts = raw ? Number(raw) : 0;

      const now = dayjs();
      const nextAllowed = ts ? dayjs(ts).add(COOLDOWN_MS, "millisecond") : null;
      const remainingMs: number = nextAllowed
        ? Math.max(0, nextAllowed.diff(now))
        : 0;
      const isOnCooldown: boolean = remainingMs > 0;

      if (false) {
        const timeLeft: string = dayjs.duration(remainingMs).format("mm:ss");

        toast.show({
          placement: "top",
          render: ({ id }) => (
            <Toast nativeID={id} variant="solid" action="warning">
              <ToastTitle>Please wait</ToastTitle>
              <ToastDescription>{`You can log another mood in ${timeLeft}.`}</ToastDescription>
            </Toast>
          ),
        });
        return;
      }

      await logEmotionMutation.mutateAsync(emotionId);
    },
    [logEmotionMutation, toast]
  );

  return {
    emotionCounts,
    isLoading,
    error,
    logEmotion: handleLogEmotion,
    isLoggingEmotion: logEmotionMutation.isPending,
  };
}

export default useEmotionLogger;

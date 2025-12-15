import { useEffect } from "react";
import { AppState, Platform } from "react-native";
import { ExtensionStorage } from "@bacons/apple-targets";
import dayjs from "dayjs";
import { ISO_DATE_FORMAT } from "@/src/utils/date";
import useFetchMoods from "./useFetchMoods";

const APP_GROUP_IDENTIFIER = "group.samuelprasad.happy";
const storage = new ExtensionStorage(APP_GROUP_IDENTIFIER);
const WIDGET_WEEKLY_MOODS_KEY = "weeklyMoodData";

export const useWidgetWeekMoods = () => {
  // Get start and end of current week (Sunday to Saturday)
  const startOfWeek = dayjs().startOf("week");
  const endOfWeek = dayjs().endOf("week");

  const { data: moodMap } = useFetchMoods({
    visibleStartDate: startOfWeek.toISOString(),
    visibleEndDate: endOfWeek.toISOString(),
  });

  useEffect(() => {
    if (Platform.OS !== "ios" || !moodMap) return;

    try {
      // Create a plain object with day index as key and mood score as value
      const weeklyMoodData: Record<string, number> = {};

      moodMap.forEach((score, dateStr) => {
        const dayIndex = dayjs(dateStr).day(); // 0 (Sunday) to 6 (Saturday)
        if (dayIndex >= 0 && dayIndex < 7) {
          weeklyMoodData[dayIndex.toString()] = Math.round(score);
        }
      });

      storage.set(WIDGET_WEEKLY_MOODS_KEY, weeklyMoodData);
      ExtensionStorage.reloadWidget();
    } catch (error) {
      console.warn("Failed to sync weekly moods to widget:", error);
    }
  }, [moodMap]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "background") {
        ExtensionStorage.reloadWidget();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);
};

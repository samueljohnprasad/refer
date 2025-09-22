import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  EmotionTag,
  MentalHealthData,
  MoodEntry,
  MoodType,
} from "@/types/mentalHealth";
import { generateTestMentalHealthData } from "@/data/testMentalHealthData";
import { DailyStatisticsView } from "./DailyStatistics/DailyStatisticsView";
import { EntryCardsView } from "./EntryCards/EntryCardsView";
import { EntryDetailModal } from "./EntryModal/EntryDetailModal";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import type { FeelingsType, InsightsType } from "@/network/genAi";
import { Text, View } from "../Themed";
import { Button } from "../ui/button";
import { InsightsTypeResponse } from "./types";
import { useQuery } from "@tanstack/react-query";
import BlurModal from "@/screens/components/BlurModal";
import JournalEntryScreen from "@/screens/JournalEntryScreen";

interface MentalHealthProfileContainerProps {
  selectedDate: Date;
  onRefresh?: () => void;
}

export const MentalHealthProfileContainer: React.FC<
  MentalHealthProfileContainerProps
> = ({ selectedDate }) => {
  const [selectedEntry, setSelectedEntry] = useState<InsightsTypeResponse>();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const {
    data: insightsResponse,
    isLoading: mentalHealthLoading,
    error,
  } = useMentalHealthData(selectedDate);

  // Handle entry card press
  const handleEntryPress = useCallback((entry: InsightsTypeResponse): void => {
    setSelectedEntry(entry);
    setIsModalVisible(true);
  }, []);

  // // Handle modal close
  // const handleModalClose = useCallback((): void => {
  //   setIsModalVisible(false);
  //   // Clear selected entry after animation completes
  //   setTimeout(() => {
  //     setSelectedEntry(null);
  //   }, 300);
  // }, []);

  if (!insightsResponse && !mentalHealthLoading) {
    return (
      <View className="p-4">
        <View className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <Text className="text-red-700">
            Unable to load mental health data. Please try again.
          </Text>
          <Button
            // onClick={handleRefresh}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Retry
          </Button>
        </View>
      </View>
    );
  }

  return (
    <>
      {/* Daily Statistics Section */}
      {/* <DailyStatisticsView
        dailyStats={mentalHealthData?.dailyStats || null}
        isLoading={isLoading}
        onRefresh={handleRefresh}
      /> */}

      {/* Journal Entries Section */}
      <EntryCardsView
        entries={insightsResponse || []}
        isLoading={mentalHealthLoading}
        onEntryPress={handleEntryPress}
        onRefresh={() => {}}
      />

      <BlurModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      >
        <JournalEntryScreen
          insights={selectedEntry}
          onClose={() => setIsModalVisible(false)}
        />
      </BlurModal>
      {/* Entry Detail Modal */}
      {/* <EntryDetailModal
        entry={selectedEntry}
        isVisible={isModalVisible}
        onClose={handleModalClose}
      /> */}
    </>
  );
};

// Custom hook for mental health data management (for potential reuse)
export const useMentalHealthData = (selectedDate: Date) => {
  const { user } = useAuth();

  const formatDateKey = useCallback((date: Date): string => {
    const tz: number = date.getTimezoneOffset() * 60000;
    const local: Date = new Date(date.getTime() - tz);
    return local.toISOString().slice(0, 10);
  }, []);

  const dayRange = useMemo(() => {
    const startKey: string = formatDateKey(selectedDate);
    const start: string = `${startKey}T00:00:00`;
    const endDate: Date = new Date(selectedDate);
    endDate.setDate(endDate.getDate() + 1);
    const endKey: string = formatDateKey(endDate);
    const end: string = `${endKey}T00:00:00`;
    return { start, end, startKey };
  }, [selectedDate, formatDateKey]);

  const loadData = useCallback(async () => {
    if (!user?.id) {
      return [];
    }
    try {
      const { data, error: dateColErr } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("user_id", user.id)
        .eq("created_at", dayRange.startKey)
        .order("created_at", { ascending: false })
        .overrideTypes<Array<{ feelings: FeelingsType[] }>>();
      if (dateColErr || !data) throw dateColErr;

      const insightsResponse: InsightsTypeResponse[] = data.map((entry) => {
        return {
          moodScore: entry.moodScore || 0,
          aiInsights: entry.aiInsights || "",
          positiveInsights: entry.positiveInsights || [],
          suggestedTags: entry.suggestedTags || [],
          summary: entry.summary || "",
          title: entry.title || "",
          mainEmoji: entry.mainEmoji || "",
          feelings: entry.feelings,
          enrichedTranscript: entry.enrichedTranscript || "",
          created_at: entry.created_at,
          id: entry.id,
        };
      });

      return insightsResponse;
    } catch (err) {
      console.error("Error loading mental health data:", err);
      return [];
    }
  }, [user?.id, dayRange.startKey]);

  const query = useQuery({
    queryKey: [user?.id, dayRange.startKey],
    queryFn: loadData,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    enabled: !!user?.id && !!dayRange.startKey,
  });
  return query;
};

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
import { useMentalHealthData } from "./hooks/useMentalHealthData";

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

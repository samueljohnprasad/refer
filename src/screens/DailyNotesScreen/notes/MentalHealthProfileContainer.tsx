import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useMentalHealthData } from "@/hooks/data/useMentalHealthData";
import { InsightsTypeResponse } from "../types";
import { View } from "@/components/ui/view";
import { Text } from "@/components/Themed";
import { Button, ButtonText } from "@/components/ui/button";
import { EntryCardsView } from "./EntryCardsView";
import BlurModal from "@/src/components/BlurModal";
import JournalEntryScreen from "../../JournalEntryScreen/JournalEntryScreen";

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
            <ButtonText>Retry</ButtonText>
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

      <BlurModal visible={isModalVisible}>
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

import React, { useState, useCallback } from "react";
import { useMentalHealthData } from "@/hooks/data/useMentalHealthData";
import { View } from "@/components/ui/view";
import { Text } from "@/components/Themed";
import { Button, ButtonText } from "@/components/ui/button";
import { EntryCardsView } from "./EntryCardsView";
import BlurModal from "@/src/components/BlurModal";
import JournalEntryScreen from "../../JournalEntryScreen/JournalEntryScreen";
import { JournalEntry } from "@/hooks/data/types";

interface MentalHealthProfileContainerProps {
  selectedDate: Date;
  onRefresh?: () => void;
}

export const MentalHealthProfileContainer: React.FC<
  MentalHealthProfileContainerProps
> = ({ selectedDate }) => {
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry>();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const {
    data: insightsResponse,
    isLoading: mentalHealthLoading,
    error,
  } = useMentalHealthData(selectedDate);

  // Handle entry card press
  const handleEntryPress = useCallback((entry: JournalEntry): void => {
    setSelectedEntry(entry);
    setIsModalVisible(true);
  }, []);

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
    </>
  );
};

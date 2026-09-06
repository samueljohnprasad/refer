import React from "react";
import { View, ScrollView } from "react-native";
import { SafeAreaView } from "@/src/components/tw";
import SuspensLoader from "@/src/components/SuspensLoader";
import { JournalingOptionsModal } from "./JournalingOptionsModal";
import ImageJournalModal from "./ImageJournalModal";
import { DiscoveryHeader } from "./components/DiscoveryHeader";
import { RecordPromptSection } from "./components/RecordPromptSection";
import { RecordMascotStage } from "./components/RecordMascotStage";
import { RecordActionCluster } from "./components/RecordActionCluster";
import { CalendarDatePickerSheet } from "./components/CalendarDatePickerSheet";
import type { DiscoveryScreenViewModel } from "./hooks/useDiscoveryScreenViewModel";

export interface DiscoveryViewProps extends DiscoveryScreenViewModel {}

// ponytail: pure presentational component with unified vertical content stack balanced at 60-65% screen height
export const DiscoveryView: React.FC<DiscoveryViewProps> = React.memo(
  ({
    currentStreak,
    isStreakLoading,
    selectedDate,
    currentPrompt,
    allPrompts,
    isCalendarVisible,
    isOptionsVisible,
    isImageJournalVisible,
    onOpenRecorder,
    onOpenKeyboard,
    onScanJournal,
    onImageInsightsReady,
    onDateSelect,
    onTodayPress,
    onShufflePrompt,
    onSetPrompt,
    onOpenCalendar,
    onCloseCalendar,
    onOpenOptions,
    onCloseOptions,
    onCloseImageJournal,
  }) => {
    return (
      <SafeAreaView className="flex-1 bg-sage-50" edges={["top"]}>
        <ScrollView
          contentContainerClassName="px-5 pt-2 pb-6 flex-grow flex-col"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Top Region: Quiet Streak Badge */}
          <DiscoveryHeader
            currentStreak={currentStreak}
            isLoading={isStreakLoading}
          />

          {/* ponytail: main content stack moved down ~20pt with balanced internal gaps */}
          <View className="mt-10 flex-col">
            {/* Prompt Section: Date Metadata (~20-24pt gap) Prompt Headline */}
            <View className="mb-11">
              <RecordPromptSection
                selectedDate={selectedDate}
                onDatePress={onOpenCalendar}
                onTodayPress={onTodayPress}
                prompt={currentPrompt}
                onShufflePrompt={onShufflePrompt}
                onOpenOptions={onOpenOptions}
              />
            </View>

            {/* Mascot Stage: ~44pt gap from prompt, ~40pt gap to input buttons */}
            <View className="mb-10">
              <RecordMascotStage />
            </View>

            {/* Unified Input Action Cluster (Camera / 70px Mic / Write) */}
            <RecordActionCluster
              onScanJournal={onScanJournal}
              onOpenRecorder={onOpenRecorder}
              onOpenKeyboard={onOpenKeyboard}
            />
          </View>

          {/* Flexible Remaining Space: leaves ~80-120pt calm breathing room above tab bar */}
          <View className="flex-1 min-h-[60px]" />
        </ScrollView>

        {/* Date Picker Bottom Sheet */}
        <CalendarDatePickerSheet
          isVisible={isCalendarVisible}
          selectedDate={selectedDate}
          onClose={onCloseCalendar}
          onSelectDate={onDateSelect}
        />

        {/* Modals */}
        <SuspensLoader>
          <JournalingOptionsModal
            visible={isOptionsVisible}
            onClose={onCloseOptions}
            onSelectPrompt={onSetPrompt}
            allPrompts={allPrompts}
            currentPrompt={currentPrompt}
            onScanJournal={onScanJournal}
          />
          <ImageJournalModal
            visible={isImageJournalVisible}
            onClose={onCloseImageJournal}
            onInsightsReady={onImageInsightsReady}
            selectedDate={selectedDate}
          />
        </SuspensLoader>
      </SafeAreaView>
    );
  }
);

DiscoveryView.displayName = "DiscoveryView";
export default DiscoveryView;

import React from "react";
import { View, ScrollView } from "react-native";
import Animated, { FadeInDown, ReduceMotion } from "react-native-reanimated";
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

// ponytail: pure presentational component with Emil-compliant 40ms staggered entrance and balanced negative space
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
          scrollEnabled={false}
          contentContainerClassName="px-5 pt-1 pb-4 flex-grow flex-col"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Top Region: Quiet Streak Badge */}
          <Animated.View entering={FadeInDown.duration(180).reduceMotion(ReduceMotion.System)}>
            <DiscoveryHeader
              currentStreak={currentStreak}
              isLoading={isStreakLoading}
            />
          </Animated.View>

          {/* Prompt Section: Hero question kept in upper third */}
          <Animated.View
            entering={FadeInDown.duration(200).delay(40).reduceMotion(ReduceMotion.System)}
            className="mt-2"
          >
            <RecordPromptSection
              selectedDate={selectedDate}
              onDatePress={onOpenCalendar}
              onTodayPress={onTodayPress}
              prompt={currentPrompt}
              onShufflePrompt={onShufflePrompt}
              onOpenOptions={onOpenOptions}
            />
          </Animated.View>

          {/* Upper Spacer: 70–90pt breathing room */}
          <View
            className="flex-1 min-h-[70px] max-h-[90px]"
            style={{ flex: 1 }}
          />

          {/* ponytail: Mochi + capture controls as ONE unified composition, staggered in at 80ms */}
          <Animated.View
            entering={FadeInDown.duration(220).delay(80).reduceMotion(ReduceMotion.System)}
            className="items-center"
          >
            <RecordMascotStage />
            {/* 28–36pt intentional gap between Mochi and capture controls */}
            <View className="h-8" />
            <RecordActionCluster
              onScanJournal={onScanJournal}
              onOpenRecorder={onOpenRecorder}
              onOpenKeyboard={onOpenKeyboard}
            />
          </Animated.View>

          {/* Lower Spacer: 140–200pt intentional whitespace before bottom navigation */}
          <View
            className="min-h-[140px] max-h-[200px]"
            style={{ flex: 2 }}
          />
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
  },
);

DiscoveryView.displayName = "DiscoveryView";
export default DiscoveryView;

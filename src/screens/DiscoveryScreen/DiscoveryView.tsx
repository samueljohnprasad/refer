import React from "react";
import { View, Text, Pressable } from "react-native";
import Animated, { FadeInDown, ReduceMotion } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { SymbolView } from "expo-symbols";
import { GlassContainer } from "expo-glass-effect";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SafeAreaView } from "@/src/components/tw";
import SuspensLoader from "@/src/components/SuspensLoader";
import { PromptInputBody, PromptInputAction } from "@/src/components/chat/prompt-input";
import { JournalingOptionsModal } from "./JournalingOptionsModal";
import ImageJournalModal from "./ImageJournalModal";
import { DiscoveryHeader } from "./components/DiscoveryHeader";
import { RecordPromptSection } from "./components/RecordPromptSection";
import { RecordMascotStage } from "./components/RecordMascotStage";
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
    isVoiceEnabled,
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
    const insets = useSafeAreaInsets();
    // ponytail: ensure bottom action cluster and its labels sit cleanly above NativeTabs bar (49pt tab bar + safe bottom inset + 16pt breathing room)
    const bottomPadding = Math.max(insets.bottom, 20) + 64;

    return (
      <SafeAreaView className="flex-1 bg-sage-50" edges={["top"]}>
        <View
          className="flex-1 px-5 pt-1 justify-between"
          style={{ paddingBottom: bottomPadding }}
        >
          {/* Top Region: Unified Header (Date + Streak) & Hero Prompt */}
          <Animated.View
            entering={FadeInDown.duration(200).reduceMotion(ReduceMotion.System)}
            className="mt-1"
          >
            <RecordPromptSection
              selectedDate={selectedDate}
              onDatePress={onOpenCalendar}
              onTodayPress={onTodayPress}
              prompt={currentPrompt}
              onShufflePrompt={onShufflePrompt}
              onOpenOptions={onOpenOptions}
              headerRight={
                <DiscoveryHeader
                  currentStreak={currentStreak}
                  isLoading={isStreakLoading}
                />
              }
            />
          </Animated.View>

          {/* Center Stage: Grounded Mochi mascot with breathing presence */}
          <Animated.View
            entering={FadeInDown.duration(220).delay(60).reduceMotion(ReduceMotion.System)}
            className="items-center justify-center my-auto py-2"
          >
            <RecordMascotStage />
          </Animated.View>

          {/* Bottom Dock: Unified Smart Composer Bar (Ahead & Support Chat style) */}
          <Animated.View
            entering={FadeInDown.duration(240).delay(100).reduceMotion(ReduceMotion.System)}
            className="w-full pb-1"
          >
            {/* ponytail: unified liquid-glass composer combining Camera, Text, and Voice into single thumb-friendly bar */}
            <GlassContainer
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
              spacing={8}
            >
              {/* Camera / Photo Attachment Action */}
              <PromptInputAction
                onPress={() => {
                  Haptics.selectionAsync();
                  onScanJournal();
                }}
              >
                <SymbolView
                  name="camera"
                  size={20}
                  weight="medium"
                  tintColor="#142414"
                />
              </PromptInputAction>

              {/* Text Scratchpad & Voice/Text Hero Button */}
              <PromptInputBody>
                <View className="flex-1 flex-row items-center justify-between pl-4 pr-1.5 py-1 min-h-[48px]">
                  <Pressable
                    onPress={() => {
                      Haptics.selectionAsync();
                      onOpenKeyboard();
                    }}
                    className="flex-1 py-2 justify-center active:opacity-70"
                    accessibilityRole="button"
                    accessibilityLabel="Tap to write your thoughts"
                  >
                    <Text className="text-[15px] text-[#788576] happy-font-body-medium">
                      Tap to write your thoughts...
                    </Text>
                  </Pressable>

                  {isVoiceEnabled ? (
                    <Pressable
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        onOpenRecorder();
                      }}
                      className="w-[36px] h-[36px] rounded-full bg-[#2D4D28] items-center justify-center m-[2px] active:scale-95"
                      style={{ borderCurve: "continuous" }}
                      accessibilityRole="button"
                      accessibilityLabel="Record voice"
                    >
                      <SymbolView
                        name="mic.fill"
                        size={18}
                        weight="semibold"
                        tintColor="#FFFFFF"
                      />
                    </Pressable>
                  ) : (
                    <Pressable
                      onPress={() => {
                        Haptics.selectionAsync();
                        onOpenKeyboard();
                      }}
                      className="w-[36px] h-[36px] rounded-full bg-foreground items-center justify-center m-[2px] active:scale-95"
                      style={{ borderCurve: "continuous" }}
                      accessibilityRole="button"
                      accessibilityLabel="Write thoughts"
                    >
                      <SymbolView
                        name="square.and.pencil"
                        size={16}
                        weight="semibold"
                        tintColor="#FFFFFF"
                      />
                    </Pressable>
                  )}
                </View>
              </PromptInputBody>
            </GlassContainer>
          </Animated.View>
        </View>

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

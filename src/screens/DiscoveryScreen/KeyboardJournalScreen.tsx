import React, {
  useState,
  useCallback,
  useEffect,
} from "react";
import {
  View,
  Text,
  TextInput,
  Platform,
  Modal,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { format } from "date-fns";
import { useJournalEntry } from "@/hooks/useJournalEntry";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { CalendarPicker } from "../DailyNotesScreen/CalendarPicker";
import { AnimatedBlurView } from "@/src/components/AnimatedLinearGradient";
import { selectedDateDiscoveryAtom } from "./helpers";
import { useAtom } from "jotai";
import WhisperUI from "@/src/components/ui/swiftui";
import * as Haptics from "expo-haptics";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  Cancel01Icon,
  Tick01Icon,
  SparklesIcon,
  CircleArrowReload01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/src/components/ui/Button";
import { BRAND_SURFACE, INK_MUTED, INK_SOFT, SAGE } from "@/lib/tokens";

interface KeyboardJournalScreenProps {
  onSubmit: (text: string, enableAIInsights: boolean) => void;
  onClose: () => void;
}

const KeyboardJournalScreen: React.FC<KeyboardJournalScreenProps> = ({
  onSubmit,
  onClose,
}) => {
  const [journalText, setJournalText] = useState<string>("");
  const [localSelectedDate, setLocalSelectedDate] = useAtom(
    selectedDateDiscoveryAtom
  );
  const [realtimeResult, setRealtimeResult] = useState<string>("");
  const [isRealtimeActive, setIsRealtimeActive] = useState(false);
  const [enableAIInsights, setEnableAIInsights] = useState<boolean>(true);

  const [isCalendarVisible, setIsCalendarVisible] = useState<boolean>(false);
  const { currentPrompt, shufflePrompt } = useJournalEntry();
  const rotation = useSharedValue(0);
  const insets = useSafeAreaInsets();

  const formattedDate = format(localSelectedDate, "MMMM d, yyyy");

  const handleShufflePrompt = useCallback(() => {
    rotation.value = withSpring(rotation.value + 360, { damping: 20, stiffness: 100, overshootClamping: true });
    shufflePrompt();
  }, [rotation, shufflePrompt]);

  const rotateStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  const handleDatePress = useCallback(() => {
    Keyboard.dismiss();
    setIsCalendarVisible(true);
  }, []);

  const handleDateSelect = useCallback((date: Date) => {
    setLocalSelectedDate(date);
    setIsCalendarVisible(false);
  }, []);

  const handleCloseCalendar = useCallback(() => {
    setIsCalendarVisible(false);
  }, []);

  const handleTodayPress = useCallback(() => {
    const today = new Date();
    setLocalSelectedDate(today);
  }, []);

  useEffect(() => {
    return () => {
      Keyboard.dismiss();
    };
  }, []);

  useEffect(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, []);

  const handleSubmit = useCallback(() => {
    Keyboard.dismiss();
    if (journalText.trim().length > 0) {
      onSubmit(journalText.substring(0, 7000), enableAIInsights);
    }
  }, [journalText, enableAIInsights, onSubmit]);

  const isSubmitDisabled = journalText.trim().length === 0;

  return (
    <>
      <View className="flex-1 bg-white" style={{ flex: 1, paddingTop: insets.top }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1"
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        >
          {/* Date Header - Centered and Clickable */}
          <View className="flex-row justify-between items-center border-b border-sage-100 px-6 pb-4 pt-4">
            <Pressable
              disabled={isRealtimeActive}
              onPress={() => {
                Keyboard.dismiss();
                onClose();
              }}
              className="p-2 -ml-2 rounded-full"
              style={({ pressed }) => ({
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <HugeiconsIcon icon={Cancel01Icon} size={22} color={INK_SOFT} />
            </Pressable>

            <Pressable
              onPress={handleDatePress}
              className="rounded-full bg-sage-pill px-4 py-2"
            >
              <Text className="text-sage-600 text-sm happy-font-body-bold">
                {formattedDate}
              </Text>
            </Pressable>

            <View className="w-8" />
          </View>

          {/* Content */}
          <ScrollView
            className="flex-1 px-6"
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 28, paddingTop: 24 }}
          >
            {/* Prompt - No Card, Just Text with Icon */}
            <View className="flex-row justify-between items-start mb-6">
              <Text className="flex-1 text-ink text-[24px] leading-7 pr-4 happy-font-heading-bold">
                {currentPrompt}
              </Text>
              <Pressable
                onPress={handleShufflePrompt}
                className="p-2"
                style={({ pressed }) => ({
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <Animated.View style={rotateStyle}>
                  <HugeiconsIcon
                    icon={CircleArrowReload01Icon}
                    size={22}
                    color={SAGE[600]}
                  />
                </Animated.View>
              </Pressable>
            </View>

            {/* Text Input */}
            <View
              className="happy-brand-card flex-1 rounded-[28px] p-5"
              style={{ minHeight: 200 }}
            >
              <TextInput
                focusable
                maxLength={7000}
                value={journalText + realtimeResult}
                onChangeText={setJournalText}
                placeholder="Start by answering the prompt, or write anything on your mind."
                placeholderTextColor={INK_MUTED}
                multiline
                textAlignVertical="top"
                className="text-ink text-[17px] leading-7 happy-font-body"
                style={{
                  flex: 1,
                  minHeight: 140,
                }}
                autoFocus
              />
            </View>
          </ScrollView>

          {/* Bottom Actions */}
          <View
            className="px-6 pt-4 bg-white border-t border-sage-100"
            style={{ paddingBottom: 24}}
          >
            {/* XP Counter */}
            <View className="mb-4 items-center">
              <Text className="text-ink-muted text-sm happy-font-body-medium">
                {journalText.length}{" "}
                <Text className="text-sage-400 text-sm">/7000</Text>
              </Text>
            </View>

            {/* Action Buttons */}
            <View className="flex-row items-center justify-between gap-3">
              <WhisperUI
                setRealtimeResult={(text) => {
                  setRealtimeResult(text);
                }}
                onStop={() => {
                  setJournalText((prev) => prev + " \n " + realtimeResult);
                  setRealtimeResult("");
                }}
                isRealtimeActive={isRealtimeActive}
                setIsRealtimeActive={setIsRealtimeActive}
              />

              <View className="flex-row items-center gap-3">
                <Button
                  disabled={isRealtimeActive}
                  onPress={() => setEnableAIInsights(!enableAIInsights)}
                  variant={enableAIInsights ? "primary" : "secondary"}
                  size="lg"
                  width={56}
                  fullWidth={false}
                  leftIcon={
                    <HugeiconsIcon
                      icon={SparklesIcon}
                      size={22}
                      color={enableAIInsights ? BRAND_SURFACE : INK_SOFT}
                    />
                  }
                />

                <Button
                  disabled={isSubmitDisabled || isRealtimeActive}
                  onPress={handleSubmit}
                  variant="primary"
                  size="lg"
                  width={56}
                  fullWidth={false}
                  leftIcon={
                    <HugeiconsIcon icon={Tick01Icon} size={22} color={BRAND_SURFACE} />
                  }
                />
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>

      {/* Calendar Modal */}
      < Modal
        visible={isCalendarVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCloseCalendar}
      >
        <AnimatedBlurView
          intensity={40}
          className="flex-1 justify-center items-center"
        >
          <Pressable
            className="flex-1 bg-black/50 px-2 justify-center items-center"
            onPress={handleCloseCalendar}
          >
            <Pressable
              className="bg-white rounded-3xl p-4 w-full border-2 border-sage-100"
              onPress={(e) => e.stopPropagation()}
            >
              <View className="flex-row justify-between items-center mb-4">
                <View className="flex-row items-center gap-3">
                  <Text className="text-ink text-xl happy-font-body-bold">
                    Select Date
                  </Text>
                  <Pressable
                    onPress={handleTodayPress}
                    className="bg-sage-pill px-3 py-1.5 rounded-full"
                  >
                    <Text className="text-sage-600 text-xs happy-font-body-semibold">
                      Today
                    </Text>
                  </Pressable>
                </View>
                <Pressable onPress={handleCloseCalendar} className="p-2">
                  <HugeiconsIcon icon={Cancel01Icon} size={24} color={INK_SOFT} />
                </Pressable>
              </View>
              <CalendarPicker
                selectedDate={localSelectedDate}
                onDateSelect={handleDateSelect}
                visible={isCalendarVisible}
                moodMap={undefined}
                showMoodBadges={false}
              />
            </Pressable>
          </Pressable>
        </AnimatedBlurView>
      </Modal >
    </>
  );
};

export default React.memo(KeyboardJournalScreen);

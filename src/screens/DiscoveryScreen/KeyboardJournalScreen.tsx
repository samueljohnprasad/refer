import React, {
  useState,
  useCallback,
  useEffect,
} from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
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
import { Feather } from "@expo/vector-icons";
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
    rotation.value = withSpring(rotation.value + 360, {
      damping: 15,
      stiffness: 150,
    });
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
      <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
        <KeyboardAvoidingView
          behavior="padding"
          className="flex-1"
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        >
          {/* Date Header - Centered and Clickable */}
          <View className="px-6 pt-6 pb-4 items-center">
            <Pressable onPress={handleDatePress}>
              <Text className="text-ink-muted text-base happy-font-body-semibold">
                {formattedDate}
              </Text>
            </Pressable>
          </View>

          {/* Content */}
          <ScrollView
            className="flex-1 px-6"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {/* Prompt - No Card, Just Text with Icon */}
            <View className="flex-row justify-between items-start mb-8">
              <Text className="flex-1 text-ink text-[30px] leading-9 pr-4 happy-font-heading-bold">
                {currentPrompt}
              </Text>
              <TouchableOpacity
                onPress={handleShufflePrompt}
                className="p-2"
                activeOpacity={0.7}
              >
                <Animated.View style={rotateStyle}>
                  <Feather
                    name="refresh-cw"
                    size={22}
                    color={SAGE[600]}
                  />
                </Animated.View>
              </TouchableOpacity>
            </View>

            {/* Text Input */}
            <TextInput
              focusable
              maxLength={7000}
              value={journalText + realtimeResult}
              onChangeText={setJournalText}
              placeholder="Start by answering prompt or write anything you have in mind"
              placeholderTextColor={INK_MUTED}
              multiline
              textAlignVertical="top"
              className="text-ink text-base leading-6 happy-font-body"
              style={{
                minHeight: 400,
              }}
              autoFocus
            />
          </ScrollView>

          {/* Bottom Actions */}
          <View
            className="px-6 pt-4 bg-white border-t border-sage-100"
            style={{ paddingBottom: Math.max(insets.bottom, 24) }}
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
              <TouchableOpacity
                disabled={isRealtimeActive}
                onPress={() => {
                  Keyboard.dismiss();
                  onClose();
                }}
                className="w-14 h-14 rounded-full bg-sage-pill items-center justify-center"
                activeOpacity={0.7}
              >
                <Feather name="x" size={24} color={INK_SOFT} />
              </TouchableOpacity>

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

              <TouchableOpacity
                onPress={() => setEnableAIInsights(!enableAIInsights)}
                disabled={isRealtimeActive}
                className={`w-14 h-14 rounded-full items-center justify-center ${
                  enableAIInsights ? "bg-sage-500" : "bg-sage-pill"
                }`}
                activeOpacity={0.7}
              >
                <Feather
                  name="zap"
                  size={20}
                  color={enableAIInsights ? BRAND_SURFACE : INK_MUTED}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSubmit}
                disabled={isSubmitDisabled || isRealtimeActive}
                className={`w-14 h-14 rounded-full items-center justify-center ${
                  isSubmitDisabled ? "bg-sage-100" : "bg-sage-600"
                }`}
                activeOpacity={0.7}
              >
                <Feather
                  name="check"
                  size={24}
                  color={isSubmitDisabled ? INK_MUTED : BRAND_SURFACE}
                />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* Calendar Modal */}
      <Modal
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
                  <Feather name="x" size={24} color={INK_SOFT} />
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
      </Modal>
    </>
  );
};

export default React.memo(KeyboardJournalScreen);

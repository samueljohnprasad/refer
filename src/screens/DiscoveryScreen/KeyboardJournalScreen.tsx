import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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

interface KeyboardJournalScreenProps {
  selectedDate?: Date;
  onSubmit: (text: string) => void;
  onClose: () => void;
  onDateChange?: (date: Date) => void;
}

const KeyboardJournalScreen: React.FC<KeyboardJournalScreenProps> = ({
  selectedDate,
  onSubmit,
  onClose,
  onDateChange,
}) => {
  const [journalText, setJournalText] = useState<string>("");
  const [localSelectedDate, setLocalSelectedDate] = useState<Date>(selectedDate || new Date());
  const [isCalendarVisible, setIsCalendarVisible] = useState<boolean>(false);
  const { currentPrompt, shufflePrompt } = useJournalEntry();
  const rotation = useSharedValue(0);

  const formattedDate = format(localSelectedDate, "MMMM d, yyyy");
  const characterCount = journalText.length;
  const xpValue = Math.min(Math.floor(characterCount / 10), 50);

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
    setIsCalendarVisible(true);
  }, []);

  const handleDateSelect = useCallback((date: Date) => {
    setLocalSelectedDate(date);
    onDateChange?.(date);
    setIsCalendarVisible(false);
  }, [onDateChange]);

  const handleCloseCalendar = useCallback(() => {
    setIsCalendarVisible(false);
  }, []);

  const handleSubmit = useCallback(() => {
    if (journalText.trim().length > 0) {
      onSubmit(journalText);
    }
  }, [journalText, onSubmit]);

  const isSubmitDisabled = journalText.trim().length === 0;

  return (
    <>
      <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
          keyboardVerticalOffset={0}
        >
          {/* Date Header - Centered and Clickable */}
          <View className="px-6 pt-6 pb-4 items-center">
            <Pressable onPress={handleDatePress}>
              <Text className="text-[#6B7280] text-base font-semibold">
                {formattedDate}
              </Text>
            </Pressable>
          </View>

          {/* Content */}
          <ScrollView
            className="flex-1 px-6"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Prompt - No Card, Just Text with Icon */}
            <View className="flex-row justify-between items-start mb-8">
              <Text className="flex-1 text-[#1F2937] text-2xl font-bold leading-tight pr-4">
                {currentPrompt}
              </Text>
              <TouchableOpacity
                onPress={handleShufflePrompt}
                className="p-2"
                activeOpacity={0.7}
              >
                <Animated.View style={rotateStyle}>
                  <Feather name="refresh-cw" size={22} color="#CBD5E1" />
                </Animated.View>
              </TouchableOpacity>
            </View>

            {/* Text Input */}
            <TextInput
              value={journalText}
              onChangeText={setJournalText}
              placeholder="Start by answering prompt or write anything you have in mind"
              placeholderTextColor="#CBD5E1"
              multiline
              textAlignVertical="top"
              className="text-[#1F2937] text-base leading-6"
              style={{
                fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
                minHeight: 400,
              }}
              autoFocus
            />
          </ScrollView>

          {/* Bottom Actions */}
          <View className="px-6 pb-6 pt-4 bg-white">
            {/* XP Counter */}
            <View className="mb-4 items-center">
              <Text className="text-[#6B7280] text-sm font-medium">
                {xpValue}{" "}
                <Text className="text-[#9CA3AF] text-sm">/50 XP</Text>
              </Text>
            </View>

            {/* Action Buttons */}
            <View className="flex-row items-center justify-between gap-3">
              {/* Close Button */}
              <TouchableOpacity
                onPress={onClose}
                className="w-14 h-14 rounded-full bg-[#F3F4F6] items-center justify-center"
                activeOpacity={0.7}
              >
                <Feather name="x" size={24} color="#6B7280" />
              </TouchableOpacity>

              {/* Reflect with AI Button */}
              <TouchableOpacity
                className="flex-1 h-14 rounded-full bg-[#F3F4F6] items-center justify-center"
                activeOpacity={0.7}
              >
                <Text className="text-[#6B7280] text-base font-semibold">
                  Reflect with AI
                </Text>
              </TouchableOpacity>

              {/* Submit Button - Purple when enabled */}
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={isSubmitDisabled}
                className={`w-14 h-14 rounded-full items-center justify-center ${
                  isSubmitDisabled ? "bg-[#E5E7EB]" : "bg-[#7B61FF]"
                }`}
                activeOpacity={0.7}
              >
                <Feather
                  name="check"
                  size={24}
                  color={isSubmitDisabled ? "#D1D5DB" : "#FFFFFF"}
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
              className="bg-violet-300 rounded-3xl p-4 w-full"
              onPress={(e) => e.stopPropagation()}
            >
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-white text-xl font-bold">
                  Select Date
                </Text>
                <Pressable onPress={handleCloseCalendar} className="p-2">
                  <Feather name="x" size={24} color="white" />
                </Pressable>
              </View>
              <CalendarPicker
                selectedDate={localSelectedDate}
                onDateSelect={handleDateSelect}
                visible={isCalendarVisible}
                moodMap={undefined}
              />
            </Pressable>
          </Pressable>
        </AnimatedBlurView>
      </Modal>
    </>
  );
};

export default React.memo(KeyboardJournalScreen);

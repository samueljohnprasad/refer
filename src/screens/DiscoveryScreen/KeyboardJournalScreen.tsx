import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
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
  Switch,
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
import { Stack } from "expo-router";

import { AnimatedBlurView } from "@/src/components/AnimatedLinearGradient";
import { selectedDateDiscoveryAtom } from "./helpers";
import { useAtom } from "jotai";
import WhisperUI from "@/src/components/ui/swiftui";
import * as Haptics from "expo-haptics";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Host, RNHostView, DatePicker as SwiftUIDateTimePicker, Button as SUIButton, Toggle as SUIToggle, Menu as SUIMenu, Text as SUIText } from "@expo/ui/swift-ui";
import { datePickerStyle, font, foregroundStyle, labelStyle, buttonStyle, controlSize, tint, toggleStyle, labelsHidden } from "@expo/ui/swift-ui/modifiers";
import {
  Cancel01Icon,
  Tick01Icon,
  SparklesIcon,
  CircleArrowReload01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/src/components/ui/Button";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { RADIUS } from "@/src/theme/radius";

interface KeyboardJournalScreenProps {
  onSubmit?: (text: string, enableAIInsights?: boolean) => void;
  onStop?: (text: string, enableAIInsights?: boolean) => void;
  onClose: () => void;
}

const KeyboardJournalScreen: React.FC<KeyboardJournalScreenProps> = ({
  onSubmit,
  onStop,
  onClose,
}) => {
  const [journalText, setJournalText] = useState<string>("");
  const [localSelectedDate, setLocalSelectedDate] = useAtom(
    selectedDateDiscoveryAtom
  );
  const scrollViewRef = useRef<ScrollView>(null);
  const [realtimeResult, setRealtimeResult] = useState<string>("");
  const [isRealtimeActive, setIsRealtimeActive] = useState(false);
  const [enableAIInsights, setEnableAIInsights] = useState<boolean>(true);

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

  const handleDateSelect = useCallback((date: Date) => {
    setLocalSelectedDate(date);
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
      const handler = onSubmit || onStop;
      if (handler) {
        handler(journalText.substring(0, 7000), enableAIInsights);
      }
    }
  }, [journalText, enableAIInsights, onSubmit, onStop]);

  const isSubmitDisabled = journalText.trim().length === 0;

  const MAX_LENGTH = 7000;
  const MAX_PROGRESS_WIDTH = 30;
  const progressWidth = Math.max(4, Math.min(MAX_PROGRESS_WIDTH, (journalText.length / MAX_LENGTH) * MAX_PROGRESS_WIDTH));

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
          <View className="flex-row justify-between items-center px-4 pb-2 pt-2">
            <Host matchContents style={{ width: 44, height: 44 }}>
              <SUIButton
                label="Cancel"
                systemImage="xmark"
                onPress={() => {
                  if (isRealtimeActive) return;
                  Keyboard.dismiss();
                  onClose();
                }}
                modifiers={[
                  labelStyle("iconOnly"),
                  buttonStyle("glass"),
                  controlSize("large"),
                  tint(SEMANTIC_COLORS.text.secondary),
                ]}
              />
            </Host>

            <Host matchContents style={{ height: 40, width: 150, justifyContent: "center", alignItems: "center" }}>
              <SwiftUIDateTimePicker
                selection={localSelectedDate}
                onDateChange={(date: Date) => {
                  Haptics.selectionAsync();
                  handleDateSelect(date);
                }}
                displayedComponents={["date"]}
                modifiers={[datePickerStyle("compact")]}
              />
            </Host>

            <Host matchContents style={{ height: 44, justifyContent: "center" }}>
              <SUIMenu
                label="Options"
                systemImage="line.3.horizontal.decrease"
                modifiers={[
                  labelStyle("iconOnly"),
                  buttonStyle("glass"),
                  controlSize("large"),
                  tint(SEMANTIC_COLORS.text.secondary),
                ]}
              >
                <SUIToggle
                  isOn={enableAIInsights}
                  onIsOnChange={(isOn: boolean) => {
                    if (isRealtimeActive) return;
                    setEnableAIInsights(isOn);
                  }}
                >
                  <SUIText>AI Insights</SUIText>
                  <SUIText>Generate AI analysis</SUIText>
                </SUIToggle>
              </SUIMenu>
            </Host>
          </View>

          {/* Content */}
          <ScrollView
            ref={scrollViewRef}
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
                accessibilityLabel="Shuffle writing prompt"
                accessibilityRole="button"
                className="p-2"
                style={({ pressed }) => ({
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <Animated.View style={rotateStyle}>
                  <HugeiconsIcon
                    icon={CircleArrowReload01Icon}
                    size={22}
                    color={SEMANTIC_COLORS.brand.pressed}
                  />
                </Animated.View>
              </Pressable>
            </View>

            <View
              className="happy-brand-card flex-1 rounded-2xl p-5 relative"
              style={{ minHeight: 200 }}
            >
              <TextInput
                focusable
                maxLength={MAX_LENGTH}
                value={journalText + realtimeResult}
                onChangeText={setJournalText}
                placeholder="Start by answering the prompt, or write anything on your mind."
                placeholderTextColor={SEMANTIC_COLORS.text.tertiary}
                multiline
                textAlignVertical="top"
                className="text-ink text-[17px] leading-7 happy-font-body pb-6"
                style={{
                  flex: 1,
                  minHeight: 140,
                }}
                autoFocus
              />
              <View className="absolute bottom-4 right-4 flex-row items-center gap-1.5">
                <View 
                  className="rounded-full h-1.5 bg-sage-400" 
                  style={{ width: progressWidth }} 
                />
                <Text className="text-sage-600 text-[10px] happy-font-body-semibold">
                  {journalText.length}/{MAX_LENGTH / 1000}k
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Bottom Actions */}
          <View
            className="px-6 pt-4 bg-white border-t border-sage-100"
            style={{ paddingBottom: 24}}
          >
            {/* Action Buttons */}
            <View className="flex-row items-center justify-between gap-3">
              <WhisperUI
                setRealtimeResult={(text) => {
                  setRealtimeResult(text);
                }}
                onStop={() => {
                  setJournalText((prev) => {
                    const trimmedPrev = prev.trim();
                    const trimmedResult = realtimeResult.trim();
                    if (!trimmedPrev) return trimmedResult;
                    if (!trimmedResult) return trimmedPrev;
                    return trimmedPrev + "\n\n" + trimmedResult;
                  });
                  setRealtimeResult("");
                  setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd({ animated: true });
                  }, 100);
                }}
                isRealtimeActive={isRealtimeActive}
                setIsRealtimeActive={setIsRealtimeActive}
              />

                <Button
                  disabled={isSubmitDisabled || isRealtimeActive}
                  onPress={handleSubmit}
                  variant="primary"
                  size="lg"
                  width={56}
                  fullWidth={false}
                  accessibilityLabel="Submit journal entry"
                  leftIcon={
                    <HugeiconsIcon icon={Tick01Icon} size={22} color={SEMANTIC_COLORS.surface.primary} />
                  }
                />
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </>
  );
};

export default React.memo(KeyboardJournalScreen);

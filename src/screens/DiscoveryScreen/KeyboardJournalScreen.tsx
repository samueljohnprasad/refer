import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from "react";
import {
  View,
  Text,
  TextInput,
  Platform,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useJournalEntry } from "@/hooks/useJournalEntry";
import { useAtom } from "jotai";
import * as Haptics from "expo-haptics";
import {
  Host,
  DatePicker as SwiftUIDateTimePicker,
  Button as SUIButton,
  Toggle as SUIToggle,
  Menu as SUIMenu,
  Text as SUIText,
} from "@expo/ui/swift-ui";
import {
  datePickerStyle,
  labelStyle,
  buttonStyle,
  controlSize,
  tint,
} from "@expo/ui/swift-ui/modifiers";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { useAppDispatch } from "@/src/store/hooks";
import { setVisible as setAssistantVisible } from "@/src/store/slices/happyAssistantSlice";
import { selectedDateDiscoveryAtom } from "./helpers";
import { useJournalDraft } from "./hooks/useJournalDraft";
import {
  useKeyboardJournalOperations,
  MAX_JOURNAL_LENGTH,
  CHAR_COUNT_THRESHOLD,
  CHAR_COUNT_WARNING,
} from "./hooks/useKeyboardJournalOperations";
import { JournalPromptRow } from "./components/JournalPromptRow";
import { KeyboardJournalBottomBar } from "./components/KeyboardJournalBottomBar";

interface KeyboardJournalScreenProps {
  onSubmit?: (text: string, enableAIInsights?: boolean) => void;
  onStop?: (text: string, enableAIInsights?: boolean) => void;
  onClose: () => void;
}

// ponytail: warm cream memory background matching JournalEntryScreen
const WARM_CREAM_GRADIENT = ["#FAF7EE", "#F5F0E1"] as const;

const KeyboardJournalScreen: React.FC<KeyboardJournalScreenProps> = ({
  onSubmit,
  onStop,
  onClose,
}) => {
  const [journalText, setJournalText] = useState<string>("");
  const [realtimeResult, setRealtimeResult] = useState<string>("");
  const [isRealtimeActive, setIsRealtimeActive] = useState<boolean>(false);
  const [enableAIInsights, setEnableAIInsights] = useState<boolean>(true);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const [localSelectedDate, setLocalSelectedDate] = useAtom(selectedDateDiscoveryAtom);
  const scrollViewRef = useRef<ScrollView>(null);
  const textInputRef = useRef<TextInput>(null);

  const { currentPrompt, shufflePrompt } = useJournalEntry();
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const dispatch = useAppDispatch();

  const { initialDraft, isDraftLoaded, saveDraft, clearDraft } = useJournalDraft(currentPrompt);

  const { handleClose, handleSubmit } = useKeyboardJournalOperations({
    isRealtimeActive,
    journalText,
    realtimeResult,
    enableAIInsights,
    saveDraft,
    clearDraft,
    setJournalText,
    onClose,
    onSubmit,
    onStop,
  });

  // Restore saved draft when available
  useEffect(() => {
    if (isDraftLoaded && initialDraft && !journalText) {
      setJournalText(initialDraft);
    }
  }, [isDraftLoaded, initialDraft]);

  // ponytail: auto-save draft while typing
  useEffect(() => {
    if (isDraftLoaded) {
      void saveDraft(journalText);
    }
  }, [journalText, isDraftLoaded, saveDraft]);

  // ponytail: hide floating panda assistant during writing
  useEffect(() => {
    dispatch(setAssistantVisible(false));
    return () => {
      dispatch(setAssistantVisible(true));
      Keyboard.dismiss();
    };
  }, [dispatch]);

  useEffect(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const handleVoiceStop = useCallback(() => {
    setJournalText((prev) => {
      const trimmedPrev = prev.trim();
      const trimmedResult = realtimeResult.trim();
      if (!trimmedPrev) return trimmedResult;
      if (!trimmedResult) return trimmedPrev;
      return `${trimmedPrev}\n\n${trimmedResult}`;
    });
    setRealtimeResult("");
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [realtimeResult]);

  const combinedLength = (journalText + realtimeResult).length;
  const hasText = combinedLength > 0;
  const isSubmitDisabled = !hasText;
  const showCharacterCount = combinedLength >= CHAR_COUNT_THRESHOLD;
  const isNearLimit = combinedLength >= CHAR_COUNT_WARNING;

  const wordCount = useMemo(() => {
    const raw = (journalText + realtimeResult).trim();
    return raw ? raw.split(/\s+/).filter(Boolean).length : 0;
  }, [journalText, realtimeResult]);

  // ponytail: flexible canvas height filling available viewport gracefully
  const canvasMinHeight = useMemo(
    () => Math.max(260, Math.round(windowHeight * 0.46)),
    [windowHeight]
  );

  return (
    <LinearGradient
      colors={WARM_CREAM_GRADIENT}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1"
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        {/* Apple SwiftUI Native Header */}
        <View
          className="flex-row justify-between items-center px-4 pb-2"
          style={{ paddingTop: Math.max(insets.top + 4, 16) }}
        >
          <Host matchContents style={{ width: 44, height: 44, justifyContent: "center", alignItems: "center" }}>
            <SUIButton
              label="Cancel"
              systemImage="xmark"
              onPress={handleClose}
              modifiers={[
                labelStyle("iconOnly"),
                buttonStyle("glass"),
                controlSize("large"),
                tint(SEMANTIC_COLORS.text.primary),
              ]}
            />
          </Host>

          <Host matchContents style={{ height: 40, width: 140, justifyContent: "center", alignItems: "center" }}>
            <SwiftUIDateTimePicker
              selection={localSelectedDate}
              onDateChange={(date: Date) => {
                Haptics.selectionAsync();
                setLocalSelectedDate(date);
              }}
              displayedComponents={["date"]}
              modifiers={[
                datePickerStyle("compact"),
                tint(SEMANTIC_COLORS.text.primary),
              ]}
            />
          </Host>

          <Host matchContents style={{ width: 44, height: 44, justifyContent: "center", alignItems: "center" }}>
            <SUIMenu
              label="Options"
              systemImage="ellipsis"
              modifiers={[
                labelStyle("iconOnly"),
                buttonStyle("glass"),
                controlSize("large"),
                tint(SEMANTIC_COLORS.text.primary),
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

        {/* Content Body */}
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 px-5"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: 8,
            paddingBottom: 16,
          }}
        >
          {/* Prompt Section */}
          <JournalPromptRow prompt={currentPrompt} onShuffle={shufflePrompt} />

          {/* Premium Paper Writing Canvas */}
          <Pressable
            onPress={() => textInputRef.current?.focus()}
            className={`bg-white rounded-[26px] p-6 border relative flex-1 shadow-xs transition-all ${
              isFocused ? "border-sage-400/90 shadow-sm" : "border-[#EAE5D8]"
            }`}
            style={{ minHeight: canvasMinHeight }}
          >
            <TextInput
              ref={textInputRef}
              focusable
              maxLength={MAX_JOURNAL_LENGTH}
              value={journalText + realtimeResult}
              onChangeText={setJournalText}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Start writing here…"
              placeholderTextColor="rgba(20, 36, 20, 0.35)"
              multiline
              textAlignVertical="top"
              className="text-ink text-[18px] leading-[28px] happy-font-body pb-8"
              style={{ flex: 1, minHeight: 180 }}
              autoFocus
            />

            {/* Bottom info row inside canvas */}
            <View className="absolute bottom-3.5 left-6 right-6 flex-row justify-between items-center">
              {showCharacterCount ? (
                <Text
                  className={`text-[11px] happy-font-caption font-semibold ${
                    isNearLimit ? "text-terracotta-500" : "text-ink-muted"
                  }`}
                >
                  {combinedLength.toLocaleString()} / {MAX_JOURNAL_LENGTH.toLocaleString()}
                </Text>
              ) : (
                <View />
              )}

              {wordCount > 0 && (
                <Text className="text-[12px] text-ink-muted happy-font-caption font-medium">
                  {wordCount} {wordCount === 1 ? "word" : "words"}
                </Text>
              )}
            </View>
          </Pressable>
        </ScrollView>

        {/* Bottom Toolbar */}
        <KeyboardJournalBottomBar
          paddingBottom={Math.max(16, insets.bottom)}
          hasText={hasText}
          isSubmitDisabled={isSubmitDisabled}
          isRealtimeActive={isRealtimeActive}
          setIsRealtimeActive={setIsRealtimeActive}
          setRealtimeResult={setRealtimeResult}
          onVoiceStop={handleVoiceStop}
          onSubmit={handleSubmit}
        />
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default React.memo(KeyboardJournalScreen);

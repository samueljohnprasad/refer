import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Platform,
  Keyboard,
  KeyboardEvent,
  useWindowDimensions,
  useColorScheme,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useToast, Toast, ToastTitle } from "@/components/ui/toast";
import { Colors } from "@/constants/Colors";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Animated, {
  Easing,
  interpolate,
  interpolateColor,
  Extrapolation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
  FadeIn,
  FadeOut,
  Layout,
} from "react-native-reanimated";
import { FeelingsType, InsightsType } from "@/src/network/genAi";
import { AnimatedBlurView } from "@/src/components/AnimatedLinearGradient";
import { useSaveJournal } from "@/hooks/post/useSaveJournal";
const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

interface JournalEntryScreenProps {
  insights?: InsightsType;
  transcripts?: string[];
  onClose?: () => void;
}
export default function JournalEntryScreen({
  insights,
  transcripts,
  onClose,
}: JournalEntryScreenProps) {
  // const initialTags = [
  //   { label: "Gratitude", emoji: "🌸", colors: ["#FFE5EC", "#FFD6E8"] },
  //   { label: "Hope", emoji: "✨", colors: ["#E5F1FF", "#D6E8FF"] },
  //   { label: "Happiness", emoji: "💡", colors: ["#E6FFE5", "#D6FFD6"] },
  // ];
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const { saveJournal, saving } = useSaveJournal();

  const [isEditing, setIsEditing] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState("😊");
  const [tags, setTags] = useState(insights?.feelings || []);
  const [journalText, setJournalText] = useState(
    insights?.enrichedTranscript || ""
  );
  // Reanimated progress for back/close icon transition
  const editProgress = useSharedValue(0);
  const editProgressDelayed = useSharedValue(0);
  const moodProgress = useSharedValue(0);
  const [footerHeight, setFooterHeight] = useState<number>(0);
  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);
  const [isInsightsOpen, setIsInsightsOpen] = useState<boolean>(false);
  const colorScheme = useColorScheme();

  const formattedDateTime = useMemo<string>(() => {
    const now = new Date();
    const date = now.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const time = now.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
    return `${date} • ${time}`;
  }, []);

  useEffect(() => {
    const config = {
      duration: 620,
      easing: Easing.bezier(0.22, 1, 0.36, 1),
    } as const;

    editProgress.value = withTiming(isEditing ? 1 : 0, config);
    editProgressDelayed.value = withDelay(
      120,
      withTiming(isEditing ? 1 : 0, config)
    );
    // Mood card gets a gentle spring lift when entering edit mode
    moodProgress.value = withSpring(isEditing ? 1 : 0, {
      damping: 18,
      stiffness: 140,
      mass: 0.9,
    });
  }, [isEditing]);

  useEffect((): (() => void) => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const onShow = (e: KeyboardEvent): void => {
      setKeyboardHeight(e.endCoordinates.height);
    };
    const onHide = (): void => setKeyboardHeight(0);

    const subShow = Keyboard.addListener(showEvent, onShow);
    const subHide = Keyboard.addListener(hideEvent, onHide);

    return () => {
      subShow.remove();
      subHide.remove();
    };
  }, []);

  const backIconStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      editProgress.value,
      [0, 1],
      [1, 0],
      Extrapolation.CLAMP
    ),
    transform: [
      {
        scale: interpolate(
          editProgress.value,
          [0, 1],
          [1, 0.98],
          Extrapolation.CLAMP
        ),
      },
    ],
  }));

  // Collapsible AI Insights chevron animation
  const insightsOpen = useSharedValue(0);
  const insightsChevronStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${interpolate(insightsOpen.value, [0, 1], [0, 180])}deg`,
      },
    ],
  }));

  const toggleInsights = (): void => {
    setIsInsightsOpen((prev) => {
      const next = !prev;
      insightsOpen.value = withTiming(next ? 1 : 0, {
        duration: 220,
        easing: Easing.bezier(0.22, 1, 0.36, 1),
      });
      return next;
    });
  };

  // Emoji morph animation: single emoji -> 5 emoji selector
  const singleEmojiStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      editProgress.value,
      [0, 1],
      [1, 0],
      Extrapolation.CLAMP
    ),
    transform: [
      {
        scale: interpolate(
          editProgress.value,
          [0, 1],
          [1, 0.9],
          Extrapolation.CLAMP
        ),
      },
      {
        translateX: interpolate(
          editProgress.value,
          [0, 1],
          [0, -8],
          Extrapolation.CLAMP
        ),
      },
      {
        translateY: interpolate(
          editProgress.value,
          [0, 1],
          [0, -4],
          Extrapolation.CLAMP
        ),
      },
    ],
  }));

  const emojiRowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      editProgressDelayed.value,
      [0, 1],
      [0, 1],
      Extrapolation.CLAMP
    ),
    transform: [
      {
        scale: interpolate(
          editProgressDelayed.value,
          [0, 1],
          [0.95, 1],
          Extrapolation.CLAMP
        ),
      },
    ],
  }));

  const summaryStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      editProgress.value,
      [0, 1],
      [1, 0],
      Extrapolation.CLAMP
    ),
    transform: [
      {
        translateY: interpolate(
          editProgress.value,
          [0, 1],
          [0, -6],
          Extrapolation.CLAMP
        ),
      },
    ],
  }));

  const closeIconStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      editProgressDelayed.value,
      [0, 1],
      [0, 1],
      Extrapolation.CLAMP
    ),
    transform: [
      {
        scale: interpolate(
          editProgressDelayed.value,
          [0, 1],
          [0.98, 1],
          Extrapolation.CLAMP
        ),
      },
    ],
  }));

  // Button background now handled via NativeWind classes for consistency

  const moodCardStyle = useAnimatedStyle(() => {
    const startColor = colorScheme === "dark" ? "#6A5100" : "#FFD24A";
    const endColor = colorScheme === "dark" ? "#7F6300" : "#FFE08A";
    return {
      backgroundColor: interpolateColor(
        moodProgress.value,
        [0, 1],
        [startColor, endColor]
      ),
      transform: [
        {
          translateY: interpolate(
            moodProgress.value,
            [0, 1],
            [0, -4],
            Extrapolation.CLAMP
          ),
        },
        {
          scale: interpolate(
            moodProgress.value,
            [0, 1],
            [1, 1.02],
            Extrapolation.CLAMP
          ),
        },
      ],
      shadowColor: "#000",
      shadowOpacity: interpolate(
        moodProgress.value,
        [0, 1],
        [0.08, 0.16],
        Extrapolation.CLAMP
      ),
      shadowRadius: interpolate(
        moodProgress.value,
        [0, 1],
        [4, 8],
        Extrapolation.CLAMP
      ),
      shadowOffset: { width: 0, height: 2 },
      // Android elevation
      elevation: interpolate(
        moodProgress.value,
        [0, 1],
        [0, 4],
        Extrapolation.CLAMP
      ) as unknown as number,
    };
  });
  const [backupState, setBackupState] = useState<{
    selectedEmoji: string;
    tags: FeelingsType[];
    journalText: string;
  }>({
    selectedEmoji: "",
    tags: [],
    journalText: "",
  });

  const mainEmotions = ["😢", "😕", "🙂", "😄", "🤩"];

  const handleEdit = () => {
    setBackupState({
      selectedEmoji,
      tags: tags,
      journalText,
    });
    setIsEditing(true);
  };

  const handleDone = () => {
    setIsEditing(false);
  };

  const handleClose = () => {
    if (isEditing) {
      setSelectedEmoji(backupState.selectedEmoji);
      setTags(backupState.tags);
      setJournalText(backupState.journalText);
      setIsEditing(false);
    }
    onClose?.();
  };

  const removeTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
  };

  const addTag = () => {
    const lightGradient = ["#EEE", "#DDD"] as const;
    const darkGradient = ["#2E2E2E", "#3A3A3A"] as const;
    setTags([
      ...tags,
      {
        name: "New Tag",
        emoji: "🆕",
        colorsGradient:
          colorScheme === "dark" ? [...darkGradient] : [...lightGradient],
      },
    ]);
  };

  const handleContinue = async (): Promise<void> => {
    try {
      await saveJournal({
        title: insights?.title,
        enrichedTranscript: journalText,
        aiInsights: insights?.aiInsights,
        moodScore: insights?.moodScore,
        mainEmoji: insights?.mainEmoji,
        feelings: tags,
        suggestedTags: insights?.suggestedTags,
        growthAreas: insights?.growthAreas,
        positiveInsights: insights?.positiveInsights,
      });

      toast.show({
        placement: "bottom right",
        render: ({ id }) => (
          <Toast nativeID={id} variant="solid" action="success">
            <ToastTitle>Journal saved</ToastTitle>
          </Toast>
        ),
      });
    } catch (error) {
      console.error("Failed to save journal:", error);
      toast.show({
        placement: "bottom right",
        render: ({ id }) => (
          <Toast nativeID={id} variant="solid" action="error">
            <ToastTitle>Failed to save journal</ToastTitle>
          </Toast>
        ),
      });
    }
  };

  return (
    <SafeAreaView
      style={styles.safeArea}
      className="flex-1 bg-background-light dark:bg-background-dark"
      edges={["bottom"]}
    >
      <AnimatedBlurView
        intensity={50}
        tint={colorScheme === "dark" ? "dark" : "light"}
        style={[
          styles.headerRow,
          {
            height: height * 0.14,
            justifyContent: "space-between",
            alignItems: "flex-end",
            paddingHorizontal: 16,
            backgroundColor: "transparent",
            paddingBottom: 16,
          },
        ]}
      >
        <AnimatedTouchableOpacity
          className="w-10 h-10 rounded-full items-center justify-center bg-accent"
          activeOpacity={0.7}
          onPress={handleClose}
        >
          <Animated.View
            style={[
              {
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                justifyContent: "center",
                alignItems: "center",
              },
              backIconStyle,
            ]}
          >
            <Feather name="arrow-left" size={22} color="#FFF" />
          </Animated.View>
          <Animated.View
            style={[
              {
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                justifyContent: "center",
                alignItems: "center",
              },
              closeIconStyle,
            ]}
          >
            <Feather name="x" size={22} color="#fff" />
          </Animated.View>
        </AnimatedTouchableOpacity>
        <View className="flex-1 items-center">
          <Text className="text-base font-extrabold text-typography-900 dark:text-typography-50">
            {formattedDateTime}
          </Text>
        </View>
        <AnimatedTouchableOpacity
          className="w-10 h-10 rounded-full items-center justify-center bg-accent"
          activeOpacity={0.7}
          onPress={isEditing ? handleDone : handleEdit}
        >
          <Animated.View
            style={[
              {
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                justifyContent: "center",
                alignItems: "center",
              },
              backIconStyle,
            ]}
          >
            <Feather name="edit-3" size={22} color="#fff" />
          </Animated.View>
          <Animated.View
            style={[
              {
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                justifyContent: "center",
                alignItems: "center",
              },
              closeIconStyle,
            ]}
          >
            <Feather name="check" size={22} color="#fff" />
          </Animated.View>
        </AnimatedTouchableOpacity>
      </AnimatedBlurView>

      <View style={styles.contentContainer} className="flex-1">
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingBottom: Math.max(footerHeight + 16, 120) },
          ]}
          showsVerticalScrollIndicator={true}
          bounces={true}
          alwaysBounceVertical={true}
          keyboardShouldPersistTaps="handled"
        >
          {/* Mood + Journal Summary (Yellow Card) */}
          <Animated.View
            style={[moodCardStyle]}
            className="flex-row items-center p-5 rounded-2xl mb-6 shadow-soft-1"
          >
            {/* Single emoji (fades/scales out) */}
            <Animated.Text
              className="mr-4 text-[34px]"
              style={[singleEmojiStyle]}
            >
              {selectedEmoji}
            </Animated.Text>

            {/* Summary (fades out) */}
            <Animated.View style={[{ flex: 1 }, summaryStyle]}>
              <Text className="text-lg font-bold text-typography-900 dark:text-typography-50">
                {insights?.title}
              </Text>
            </Animated.View>

            {/* 5-emoji selector overlay (fades/scales in) */}
            <Animated.View
              pointerEvents={isEditing ? "auto" : "none"}
              style={[emojiRowStyle]}
              className="absolute left-[18px] right-[18px] top-[18px] flex-row justify-between items-center"
            >
              {mainEmotions.map((emo, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => setSelectedEmoji(emo)}
                >
                  <Text
                    style={[
                      styles.moodEmoji,
                      selectedEmoji === emo && { fontSize: 40 },
                    ]}
                  >
                    {emo}
                  </Text>
                </TouchableOpacity>
              ))}
            </Animated.View>
          </Animated.View>

          {/* Tags */}
          <View className="flex-row flex-wrap mb-6 gap-2">
            {tags.map((tag, index) => (
              <Animated.View
                key={index}
                style={[
                  tag.colorsGradient?.[0]
                    ? { backgroundColor: tag.colorsGradient[0] }
                    : undefined,
                ]}
                className="flex-row items-center py-2 px-3 rounded-full mr-2 mb-2 border border-outline-100 dark:border-outline-800 bg-background-100 dark:bg-background-800"
                entering={FadeIn.springify().damping(16)}
                exiting={FadeOut.duration(140)}
                layout={Layout.springify().stiffness(180)}
              >
                <Text className="text-[15px] text-typography-900 dark:text-typography-50">
                  {tag.emoji} {tag.name}
                </Text>
                {isEditing && (
                  <TouchableOpacity onPress={() => removeTag(index)}>
                    <Feather
                      name="x-circle"
                      size={16}
                      color={
                        colorScheme === "dark"
                          ? Colors.dark.icon
                          : Colors.light.icon
                      }
                    />
                  </TouchableOpacity>
                )}
              </Animated.View>
            ))}
            {isEditing && (
              <TouchableOpacity
                onPress={addTag}
                className="flex-row items-center py-2 px-3 rounded-full mr-2 mb-2 border border-outline-100 dark:border-outline-800 bg-background-100 dark:bg-background-800"
              >
                <Text className="text-[15px] text-typography-900 dark:text-typography-50">
                  ＋ Add Tag
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Journal Content */}
          <View className="bg-background-50 dark:bg-background-900 rounded-2xl p-5 mb-6 shadow-soft-1">
            <Text className="text-lg font-semibold text-typography-900 dark:text-typography-50 mb-3 ml-2">
              Journal Content
            </Text>
            {isEditing ? (
              <TextInput
                className="text-base leading-6 text-typography-600 dark:text-typography-300 tracking-[0.2px] border border-outline-200 dark:border-outline-700 rounded-lg p-2"
                multiline
                value={journalText || ""}
                onChangeText={(text) => setJournalText(text)}
              />
            ) : (
              <Text className="text-base leading-6 text-typography-600 dark:text-typography-300 tracking-[0.2px]">
                {insights?.enrichedTranscript || ""}
              </Text>
            )}
          </View>

          {/* AI Insights */}
          <View className="bg-background-50 dark:bg-background-900 rounded-2xl p-5 mb-6 shadow-soft-1">
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Toggle AI Insights"
              activeOpacity={0.8}
              onPress={toggleInsights}
              className="flex-row items-center mb-4 pb-3 border-b border-outline-100 dark:border-outline-800 justify-between"
            >
              <View className="flex-row items-center">
                <Feather name="eye" size={22} color="#7B61FF" />
                <Text className="text-lg font-semibold text-typography-900 dark:text-typography-50 ml-2">
                  AI Insights
                </Text>
              </View>
              <Animated.View style={insightsChevronStyle} className="p-1">
                <Feather
                  name="chevron-down"
                  size={18}
                  color={
                    colorScheme === "dark"
                      ? Colors.dark.text
                      : Colors.light.text
                  }
                />
              </Animated.View>
            </TouchableOpacity>
            {isInsightsOpen && (
              <Animated.View
                entering={FadeIn.duration(150)}
                exiting={FadeOut.duration(120)}
                layout={Layout.springify().damping(20).stiffness(180)}
              >
                <Text className="text-base leading-6 text-typography-600 dark:text-typography-300 tracking-[0.2px]">
                  {insights?.aiInsights || ""}
                </Text>
              </Animated.View>
            )}
          </View>
        </ScrollView>
      </View>

      {/* Sticky Bottom Button */}
      <View
        style={[{ bottom: keyboardHeight, paddingBottom: 16 + insets.bottom }]}
        className="absolute left-0 right-0 bg-background-light dark:bg-background-dark p-5 border-t border-outline-100 dark:border-outline-800 shadow-soft-2"
        onLayout={({ nativeEvent }) =>
          setFooterHeight(nativeEvent.layout.height)
        }
      >
        <TouchableOpacity
          style={[saving && { opacity: 0.6 }]}
          className="bg-accent rounded-xl p-4 items-center shadow-soft-2"
          onPress={handleContinue}
          disabled={saving}
          activeOpacity={0.8}
        >
          <View className="flex-row items-center justify-center">
            {saving && (
              <View className="mr-2">
                <ActivityIndicator color="#fff" size="small" />
              </View>
            )}
            <Text className="text-typography-white text-lg font-bold">
              {saving ? "Saving…" : "Continue"}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },

  scroll: {
    padding: 24,
    paddingBottom: 120, // Extra space for the sticky button
    flexGrow: 1, // Ensure content can grow beyond the screen
  },
  contentContainer: {
    flex: 1, // Take up all available space
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  moodEmoji: { fontSize: 34 },
});

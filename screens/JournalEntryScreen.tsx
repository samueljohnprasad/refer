import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Modal,
  useWindowDimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useToast, Toast, ToastTitle } from "@/components/ui/toast";
import { FeelingsType, InsightsType } from "@/network/genAi";
import { AnimatedBlurView } from "@/components/ui/AnimatedModal";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSaveJournal } from "@/hooks/useSaveJournal";
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
} from "react-native-reanimated";
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

  const btnBgStyle = useAnimatedStyle(() => ({
    // Keep the button background consistent in both modes to avoid
    // perceived icon opacity differences against changing contrast.
    backgroundColor: "#6A4AF5",
  }));

  const moodCardStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      moodProgress.value,
      [0, 1],
      ["#FFD24A", "#FFE08A"]
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
  }));
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
    setTags([
      ...tags,
      { name: "New Tag", emoji: "🆕", colorsGradient: ["#EEE", "#DDD"] },
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
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <AnimatedBlurView
        intensity={50}
        tint="light"
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
          style={[styles.backBtn, btnBgStyle]}
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
        <View style={styles.headerCenter}>
          <Text style={styles.headerDate}>Sept 3, 2025 • 10:42 AM</Text>
        </View>
        <AnimatedTouchableOpacity
          style={[styles.backBtn, btnBgStyle]}
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

      <View style={styles.contentContainer}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={true}
          bounces={true}
          alwaysBounceVertical={true}
          keyboardShouldPersistTaps="handled"
        >
          {/* Mood + Journal Summary (Yellow Card) */}
          <Animated.View style={[styles.moodRow, moodCardStyle]}>
            {/* Single emoji (fades/scales out) */}
            <Animated.Text
              className="mr-4"
              style={[styles.moodEmoji, singleEmojiStyle]}
            >
              {selectedEmoji}
            </Animated.Text>

            {/* Summary (fades out) */}
            <Animated.View style={[{ flex: 1 }, summaryStyle]}>
              <Text style={styles.summaryText}>{insights?.title}</Text>
            </Animated.View>

            {/* 5-emoji selector overlay (fades/scales in) */}
            <Animated.View
              pointerEvents={isEditing ? "auto" : "none"}
              style={[styles.emojiRowOverlay, emojiRowStyle]}
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
          <View style={styles.tagsRow}>
            {tags.map((tag, index) => (
              <View
                key={index}
                style={[
                  styles.tagChip,
                  { backgroundColor: tag.colorsGradient?.[0] || "#E5F1FF" },
                ]}
              >
                <Text style={styles.tagText}>
                  {tag.emoji} {tag.name}
                </Text>
                {isEditing && (
                  <TouchableOpacity onPress={() => removeTag(index)}>
                    <Feather name="x-circle" size={16} color="#555" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
            {isEditing && (
              <TouchableOpacity
                onPress={addTag}
                style={[styles.tagChip, { backgroundColor: "#EEE" }]}
              >
                <Text style={styles.tagText}>＋ Add Tag</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Journal Content */}
          <View style={styles.cardLarge}>
            <Text style={styles.cardTitle}>Journal Content</Text>
            {isEditing ? (
              <TextInput
                style={[
                  styles.cardText,
                  {
                    borderWidth: 1,
                    borderColor: "#ddd",
                    borderRadius: 8,
                    padding: 8,
                  },
                ]}
                multiline
                value={journalText || ""}
                onChangeText={(text) => {
                  console.log("text", text);
                  setJournalText(text);
                }}
              />
            ) : (
              <Text style={styles.cardText}>
                {insights?.enrichedTranscript || ""}
              </Text>
            )}
          </View>

          {/* AI Insights */}
          <View style={styles.cardLarge}>
            <View style={styles.insightRow}>
              <Feather name="eye" size={22} color="#7B61FF" />
              <Text style={styles.cardTitle}>AI Insights</Text>
            </View>
            <Text style={styles.cardText}>{insights?.aiInsights || ""}</Text>
          </View>
        </ScrollView>
      </View>

      {/* Sticky Bottom Button */}
      <View style={styles.stickyButtonContainer}>
        <TouchableOpacity
          style={[styles.continueButton, saving && { opacity: 0.6 }]}
          onPress={handleContinue}
          disabled={saving}
          activeOpacity={0.8}
        >
          <Text style={styles.continueText}>
            {saving ? "Saving…" : "Continue"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  stickyButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 20,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 5,
  },
  scroll: {
    padding: 24,
    paddingBottom: 120, // Extra space for the sticky button
    flexGrow: 1, // Ensure content can grow beyond the screen
  },
  contentContainer: {
    flex: 1, // Take up all available space
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#7C5CFF",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0F172A",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerCenter: { flex: 1, alignItems: "center" },
  headerDate: { fontSize: 18, fontWeight: "700", color: "#111" },
  iconCircle: {
    backgroundColor: "#7B61FF",
    borderRadius: 24,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  moodRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    backgroundColor: "#FFE08A",
  },
  moodEmoji: { fontSize: 34 },

  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 24,
    gap: 8,
  },
  tagChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  tagText: { fontSize: 15, color: "#111" },

  cardLarge: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 12,
    marginLeft: 8,
  },
  cardText: {
    fontSize: 16,
    lineHeight: 26,
    color: "#334155",
    letterSpacing: 0.2,
  },

  insightRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },

  footer: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  continueButton: {
    backgroundColor: "#7C5CFF",
    borderRadius: 14,
    padding: 18,
    alignItems: "center",
    shadowColor: "#7C5CFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  continueText: { fontSize: 18, fontWeight: "700", color: "#111" },
  emojiRowOverlay: {
    position: "absolute",
    left: 18,
    right: 18,
    top: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

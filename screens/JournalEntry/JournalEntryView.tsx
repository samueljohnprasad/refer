import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  useWindowDimensions,
  StatusBar,
  FlatList,
  TextInput,
} from "react-native";
import type { MoodOption, Recommendation } from "@/hooks/useJournalEntry";
import { Stack } from "expo-router";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import { SafeAreaView } from "react-native-safe-area-context";
import useJournalEntryAnimations from "@/hooks/useJournalEntryAnimations";

// Animated helper (kept for potential future touchables)

// Removed unused width constant to follow clean code standards

export interface JournalEntryViewProps {
  moods: MoodOption[];
  selectedMood: string;
  setSelectedMood: (emoji: string) => void;
  currentRecommendation: Recommendation;
}

const JournalEntryView: React.FC<JournalEntryViewProps> = ({
  moods,
  selectedMood,
  setSelectedMood,
  currentRecommendation,
}) => {
  const { height } = useWindowDimensions();
  const headerHeight = useHeaderHeight();
  const { heroOpacity, heroTranslateY, sectionStyle } =
    useJournalEntryAnimations(5);

  // Edit state for transcript and tags (local UI state)
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [tags, setTags] = useState<string[]>(["Mindfulness"]);
  const [newTag, setNewTag] = useState<string>("");
  const [transcript, setTranscript] = useState<string>(
    "Today was a wonderful day! I spent the afternoon volunteering at the local shelter, helping and organizing donations. Later, filled with joy, I met up with friends. We laughed so much! I'm truly optimistic about the future."
  );

  const dateLabel = useMemo(
    () =>
      new Date().toLocaleString("en-US", { month: "short", day: "numeric" }),
    []
  );
  const timeLabel = useMemo(
    () =>
      new Date().toLocaleString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
    []
  );

  const handleAddTag = (): void => {
    const t = newTag.trim();
    if (t.length > 0 && !tags.includes(t)) {
      setTags((prev) => [...prev, t]);
    }
    setNewTag("");
  };
  const handleRemoveTag = (t: string): void => {
    setTags((prev) => prev.filter((x) => x !== t));
  };

  return (
    <SafeAreaView style={styles.screen} edges={["bottom"]}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />

      <Stack.Screen
        options={{
          headerShown: true,
          headerTransparent: true,
          headerBlurEffect: "regular",
          header(props) {
            return (
              <BlurView
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
                <TouchableOpacity
                  style={styles.backBtn}
                  activeOpacity={0.7}
                  onPress={() => {}}
                >
                  <Ionicons name="arrow-back" size={20} color="#FFF" />
                </TouchableOpacity>

                <View style={styles.headerCenter}>
                  {isEditing ? (
                    <Text style={styles.headerDate}>Edit Entry</Text>
                  ) : (
                    <>
                      <Text style={styles.headerDate}>{dateLabel}</Text>
                      <Text style={styles.headerTime}>{timeLabel}</Text>
                    </>
                  )}
                </View>

                {isEditing ? (
                  <TouchableOpacity
                    style={styles.headerCtaDone}
                    onPress={() => setIsEditing(false)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.headerCtaDoneText}>Done</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.headerCta}
                    onPress={() => setIsEditing(true)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.headerCtaText}>Edit</Text>
                  </TouchableOpacity>
                )}
              </BlurView>
            );
          },
        }}
      />
      <View className="flex-1">
        <Animated.ScrollView
          contentContainerStyle={[
            styles.container,
            { paddingTop: headerHeight },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.mainCard}>
            {/* Journal emoji and title */}
            <Animated.View style={sectionStyle(0)}>
              <View style={styles.journalHeader}>
                <Text style={styles.headerEmojiLarge}>{selectedMood}</Text>
                <Text style={styles.journalTitle}>
                  Feeling sad and stomach ache
                </Text>

                {isEditing && (
                  <FlatList
                    horizontal
                    data={moods}
                    keyExtractor={(item) => item.label}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingTop: 12 }}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => setSelectedMood(item.emoji)}
                        style={[
                          styles.moodChip,
                          selectedMood === item.emoji &&
                            styles.moodChipSelected,
                        ]}
                      >
                        <Text style={styles.moodEmoji}>{item.emoji}</Text>
                        <Text style={styles.moodLabel}>{item.label}</Text>
                      </TouchableOpacity>
                    )}
                  />
                )}
              </View>
            </Animated.View>

            {/* Feelings (tags) */}
            <Animated.View style={sectionStyle(1)}>
              <View style={styles.sectionAiry}>
                <Text style={styles.sectionLabel}>FEELINGS</Text>
                <View style={styles.entryTags}>
                  {tags.map((t) => (
                    <View key={t} style={styles.tag}>
                      <Text style={styles.tagText}>{t}</Text>
                      {isEditing && (
                        <TouchableOpacity
                          onPress={() => handleRemoveTag(t)}
                          style={styles.tagRemove}
                          accessibilityLabel={`Remove ${t}`}
                        >
                          <Ionicons name="close" size={12} color="#64748B" />
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}
                </View>
                {isEditing && (
                  <View style={styles.addTagRow}>
                    <TextInput
                      style={styles.tagInput}
                      placeholder="Add tag"
                      value={newTag}
                      onChangeText={setNewTag}
                    />
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={handleAddTag}
                    >
                      <Text style={styles.addButtonText}>Add</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </Animated.View>

            {/* Recommendations (hidden in edit mode) */}
            {!isEditing && (
              <Animated.View style={sectionStyle(2)}>
                <View style={styles.recommendationCard}>
                  <Text style={styles.cardTitle}>Today's Recommendation</Text>
                  <Text style={styles.recommendationText}>
                    ✨ {currentRecommendation.activity}
                  </Text>
                  <Text style={styles.quoteText}>
                    "{currentRecommendation.quote}"
                  </Text>
                </View>
              </Animated.View>
            )}

            {/* AI Insights (hidden in edit mode) */}
            {!isEditing && (
              <Animated.View style={sectionStyle(3)}>
                <View style={styles.insightCard}>
                  <View style={styles.insightHeader}>
                    <View style={styles.insightIcon}>
                      <Text style={styles.insightEmoji}>🔮</Text>
                    </View>
                    <View style={styles.insightContent}>
                      <Text style={styles.insightTitle}>AI Insights</Text>
                      <Text style={styles.insightText}>
                        Positive sentiment with strong themes of joy and
                        connection
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.chevron}
                      accessibilityRole="button"
                      accessibilityLabel="Open AI Insights"
                    >
                      <Ionicons
                        name="chevron-forward"
                        size={18}
                        color="#0F172A"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </Animated.View>
            )}

            {/* Transcript (no card) - moved to last */}
            <Animated.View style={sectionStyle(4)}>
              <View style={styles.sectionAiry}>
                <Text style={styles.sectionLabel}>TRANSCRIPT</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.transcriptInput}
                    multiline
                    placeholder="Type your thoughts..."
                    value={transcript}
                    onChangeText={setTranscript}
                  />
                ) : (
                  <Text style={styles.transcriptText}>{transcript}</Text>
                )}
              </View>
            </Animated.View>
          </View>
        </Animated.ScrollView>
      </View>
    </SafeAreaView>
  );
};

// Design system styles following quiz UI patterns
const styles = StyleSheet.create({
  // Base layout
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  mainCard: {
    backgroundColor: "#FFFFFF",
  },

  // Header
  header: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    fontWeight: "500",
    color: "#64748B",
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1E293B",
    lineHeight: 34,
  },
  editButton: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
  },

  // Extracted hero/level progress styles now live in components
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerCenter: {
    alignItems: "center",
  },
  headerDate: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
    lineHeight: 18,
  },
  headerTime: {
    fontSize: 12,
    fontWeight: "700",
    color: "#475569",
  },
  headerCta: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
  headerCtaText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  headerCtaDone: {
    backgroundColor: "#0F172A",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
  },
  headerCtaDoneText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
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
  // Sections
  section: {
    marginBottom: 20,
  },
  sectionAiry: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
    color: "#94A3B8",
    marginBottom: 10,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748B",
  },

  // Journal header
  journalHeader: {
    marginBottom: 24,
    paddingTop: 4,
  },
  headerEmojiLarge: {
    fontSize: 54,
    marginBottom: 8,
  },
  journalTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1E293B",
  },
  journalSubtitle: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 20,
    marginTop: 6,
  },
  transcriptText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#334155",
  },

  // Mood chips
  moodChip: {
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 16,
    marginRight: 12,
    backgroundColor: "#F1F5F9",
    borderWidth: 2,
    borderColor: "transparent",
    minWidth: 70,
  },
  moodChipSelected: {
    backgroundColor: "#FFD93D",
    borderColor: "#1E293B",
  },
  moodEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  moodLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
    textAlign: "center",
  },

  // Recommendation card (blue like quiz categories)
  recommendationCard: {
    backgroundColor: "#60A5FA",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: "#FFFFFF",
    marginBottom: 6,
    fontWeight: "500",
  },
  quoteText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    fontStyle: "italic",
    lineHeight: 20,
  },

  // Badge items
  badgeItem: {
    width: 70,
    height: 80,
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    borderWidth: 2,
    borderColor: "#E2E8F0",
  },
  badgeItemLocked: {
    opacity: 0.5,
  },
  badgeEmoji: {
    fontSize: 24,
    marginBottom: 6,
  },
  badgeTitle: {
    fontSize: 10,
    fontWeight: "600",
    color: "#475569",
    textAlign: "center",
  },
  badgeTitleLocked: {
    color: "#94A3B8",
  },

  // Entry card
  entryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(15,23,42,0.06)",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  entryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  entryMood: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  entryMoodEmoji: {
    fontSize: 18,
  },
  entryInfo: {
    flex: 1,
  },
  entryDate: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 2,
  },
  entryTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
  },
  entryContent: {
    fontSize: 14,
    lineHeight: 20,
    color: "#475569",
    marginBottom: 12,
  },
  entryTags: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  // Tags
  tag: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
  },
  tagText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },
  tagRemove: {
    marginLeft: 6,
  },
  addTagRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  tagInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: "#FFFFFF",
  },
  addButton: {
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  transcriptInput: {
    fontSize: 16,
    lineHeight: 24,
    color: "#334155",
    minHeight: 100,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#FFFFFF",
  },

  // Insight card
  insightCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(15,23,42,0.06)",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  insightHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  insightIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#EDE9FE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  insightEmoji: {
    fontSize: 20,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 4,
  },
  insightText: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 20,
  },
  chevron: {
    padding: 8,
  },
  chevronText: {
    fontSize: 16,
    color: "#0F172A",
  },
});

export default JournalEntryView;

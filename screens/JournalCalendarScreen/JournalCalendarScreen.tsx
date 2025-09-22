import React, { useEffect, useRef, useState } from "react";
import { useUserProfile } from "@/hooks/useUserProfile";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  Pressable,
} from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import Svg, { Circle, Rect, Ellipse } from "react-native-svg";
import { Calendar } from "react-native-calendars";
import { BlurView } from "expo-blur";
import LottieView from "lottie-react-native";
import { girlMeditationBlue, manRocket } from "@/assets/lottie";
import { useRouter } from "expo-router";
import { Box } from "@/components/ui/box";
import BlurModal from "../components/BlurModal";
import { EntryDetailModal } from "@/components/mentalHealth/EntryModal/EntryDetailModal";
import type { MoodEntry } from "@/types/mentalHealth";
import { useCalendarEntries } from "@/hooks/useCalendarEntries";

const { width, height } = Dimensions.get("window");

// Global color palette
const PALETTE = {
  purple: "#7B61FF",
  lightPurple: "#DCD6FF",
  yellow: "#FFD24A",
  lightYellow: "#FFF2CC",
  blue: "#60A6FF",
  lightBlue: "#DFF0FF",
  pink: "#FFDFE8",
  white: "#FFFFFF",
  softBackground: "#F6F4FF",
  grey: "#C4C4C4",
};

// Colors mapped to emojis for calendar cells
const emojiColors = {
  "😊": "#FFD24A", // yellow
  "😎": "#60A6FF", // blue
  "🙂": "#7B61FF", // purple
  "😁": "#FF6A3D", // orange/red
  "🤔": "#3B82F6", // darker blue
  "😴": "#FFDFE8", // pink
};

export default function JournalCalendarScreen() {
  // Animated value for streak progress bar
  const progressAnim = useRef(new Animated.Value(0)).current;
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedEntries, setSelectedEntries] = useState<MoodEntry[]>([]);
  const [detailVisible, setDetailVisible] = useState<boolean>(false);
  const [selectedEntry, setSelectedEntry] = useState<MoodEntry | null>(null);
  const [monthDate, setMonthDate] = useState<Date>(new Date("2025-08-01"));
  const { data: userProfile, isLoading: isLoadingProfile } = useUserProfile();

  const { markedDays, getEntriesForDate } = useCalendarEntries(monthDate);

  // Animated values for counting streak and XP numbers
  const streakAnim = useRef(new Animated.Value(0)).current;
  const xpAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate progress bar fill on mount
    Animated.timing(progressAnim, {
      toValue: 0.55, // 55% filled
      duration: 1200,
      useNativeDriver: false,
    }).start();

    // Animate streak number count-up
    Animated.timing(streakAnim, {
      toValue: 2, // Current streak value
      duration: 1000,
      useNativeDriver: false,
    }).start();

    // Animate XP number count-up
    Animated.timing(xpAnim, {
      toValue: 200, // XP value
      duration: 1200,
      useNativeDriver: false,
    }).start();
  }, []);

  // Interpolate streak animated value to integer text
  const streakValue = streakAnim.interpolate({
    inputRange: [0, 2],
    outputRange: ["0", "2"],
  });

  // Interpolate XP animated value to integer text
  const xpValue = xpAnim.interpolate({
    inputRange: [0, 200],
    outputRange: ["0", "200"],
  });
  const router = useRouter();

  const handleAddEntry = (): void => {
    setModalVisible(false);
    // Navigate to voice recorder screen
    router.push("/voice-recorder");
  };

  const handleSelectEntry = (entry: MoodEntry): void => {
    setSelectedEntry(entry);
    setModalVisible(false);
    setDetailVisible(true);
  };

  const formatDateLabel = (dateStr: string): string => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Background illustrations behind everything */}
      <View style={styles.illustrationLayer} pointerEvents="none">
        <Box style={{ marginTop: 40 }}>
          <LottieView
            autoPlay
            style={{
              width: 200,
              height: 200,
            }}
            source={girlMeditationBlue}
          />
        </Box>
        <Svg height={height} width={width}>
          {/* Light, playful faded shapes */}
          <Ellipse
            cx={width * 0.8}
            cy={100}
            rx={120}
            ry={80}
            fill={PALETTE.lightPurple}
            opacity={0.2}
          />
          <Circle
            cx={80}
            cy={height * 0.3}
            r={60}
            fill={PALETTE.lightYellow}
            opacity={0.2}
          />
          <Circle
            cx={width * 0.9}
            cy={height * 0.6}
            r={90}
            fill={PALETTE.lightBlue}
            opacity={0.15}
          />
          <Ellipse
            cx={width * 0.2}
            cy={height * 0.8}
            rx={100}
            ry={70}
            fill={PALETTE.pink}
            opacity={0.15}
          />
        </Svg>
      </View>

      <ScrollView
        // contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Outer panel container */}
        <BlurView intensity={50} tint="light" style={styles.panel}>
          {/* Top bar with blur background */}
          <View style={styles.topBarBlur}>
            <View style={styles.topRow}>
              <TouchableOpacity
                onPress={() => {
                  router.push("/tabs/pages/Compdisplay");
                }}
                style={styles.iconCircle}
                activeOpacity={0.8}
              >
                <Feather name="arrow-left" size={20} color={PALETTE.white} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.iconCircle, styles.iconCircleRight]}
                activeOpacity={0.8}
                onPress={() => router.push("/tabs/settings")}
              >
                <Feather name="settings" size={20} color={PALETTE.white} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Greeting text */}
          <Text style={styles.greeting}>
            Hi, {isLoadingProfile ? '...' : userProfile?.displayName || 'there'} <Text style={styles.wave}>👋</Text>
          </Text>

          {/* Streak card with animated progress bar */}
          <View style={styles.streakCard}>
            <View style={{ flex: 1 }}>
              {/* Streak info */}
              <View style={styles.streakRow}>
                <View>
                  <Text style={styles.streakTitle}>Current Streak</Text>
                  <View style={styles.streakValueRow}>
                    <MaterialIcons
                      name="local-fire-department"
                      size={28}
                      color="#FF6A3D"
                    />
                    <Animated.Text style={styles.streakNumber}>
                      {streakAnim.interpolate({
                        inputRange: [0, 2],
                        outputRange: ["0", "2"],
                      })}
                    </Animated.Text>
                  </View>
                </View>

                <View style={{ marginLeft: 18 }}>
                  <Text style={[styles.streakTitle, { textAlign: "center" }]}>
                    Next Milestone
                  </Text>
                  <Text style={[styles.streakNumber, { textAlign: "center" }]}>
                    3
                  </Text>
                </View>
              </View>

              {/* Animated progress bar */}
              <View style={styles.progressTrack}>
                <Animated.View
                  style={[
                    styles.progressFill,
                    {
                      width: progressAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0%", "100%"],
                      }),
                    },
                  ]}
                />
              </View>
            </View>

            {/* Illustration placeholder (SVG character) */}
            <View style={styles.personIllustration}>
              <LottieView
                autoPlay
                style={{
                  width: 100,
                  height: 60,
                }}
                source={manRocket}
              />
            </View>
          </View>

          {/* Calendar section */}
          <View style={styles.calendarCard}>
            <Calendar
              current={"2025-08-01"}
              onMonthChange={(m) => {
                const next = new Date(`${m.year}-${String(m.month).padStart(2, "0")}-01`);
                setMonthDate(next);
              }}
              theme={{
                calendarBackground: "#fff",
                textSectionTitleColor: "#8F8F8F",
                monthTextColor: "#222",
                textMonthFontWeight: "700",
                textMonthFontSize: 20,
                todayTextColor: PALETTE.purple,
                selectedDayBackgroundColor: PALETTE.purple,
                selectedDayTextColor: "#fff",
                arrowColor: "#6B6B6B",
              }}
              // Custom day cell rendering
              dayComponent={({ date, state }) => {
                if (!date) return null;

                const emoji = markedDays[date.dateString as string];
                const bgColor = emoji
                  ? emojiColors[emoji as keyof typeof emojiColors] ||
                    PALETTE.purple
                  : PALETTE.grey;

                // Scale animation for press interaction
                const scaleAnim = useRef(new Animated.Value(1)).current;
                const handlePress = (): void => {
                  Animated.sequence([
                    Animated.timing(scaleAnim, {
                      toValue: 1.2,
                      duration: 120,
                      useNativeDriver: true,
                    }),
                    Animated.timing(scaleAnim, {
                      toValue: 1,
                      duration: 120,
                      useNativeDriver: true,
                    }),
                  ]).start();
                  const ds = date.dateString as string;
                  setSelectedDate(ds);
                  setSelectedEntries(getEntriesForDate(ds));
                  setModalVisible(true);
                };

                return (
                  <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
                    <Animated.View
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                        width: 46,
                        height: 56,
                        transform: [{ scale: scaleAnim }],
                      }}
                    >
                      {/* Circle container for emoji or plus */}
                      <View
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 16,
                          borderWidth: 1,
                          borderColor: "#ccc",
                          borderStyle: "dashed",
                          alignItems: "center",
                          justifyContent: "center",
                          marginBottom: 2,
                          shadowColor: "#000",
                          shadowOpacity: 0.1,
                          shadowOffset: { width: 0, height: 2 },
                          shadowRadius: 3,
                          elevation: 2,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: emoji ? 18 : 16,
                            color: "#ccc",
                          }}
                        >
                          {emoji ? emoji : "＋"}
                        </Text>
                      </View>
                      {/* Date number below the circle */}
                      <Text
                        style={{
                          fontSize: 12,
                          color: state === "disabled" ? "#ccc" : "#000",
                        }}
                      >
                        {date.day}
                      </Text>
                    </Animated.View>
                  </TouchableOpacity>
                );
              }}
              hideExtraDays={true}
              firstDay={1}
            />
          </View>

          {/* XP progress card */}
          <View style={styles.xpCard}>
            <Animated.Text style={styles.xpTitle}>
              {xpAnim.interpolate({
                inputRange: [0, 200],
                outputRange: ["0 XP", "200 XP"],
              })}
            </Animated.Text>
            <View style={styles.xpTrack}>
              <View style={styles.xpFill} />
            </View>
            <View style={styles.xpMascot}>
              <Text style={{ fontSize: 26 }}>👩‍🎤</Text>
            </View>
          </View>

          {/* Bottom action buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.addButton} activeOpacity={0.85}>
              <Text style={styles.addText}>+ Add Entry</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.nextButton} activeOpacity={0.85}>
              <Text style={styles.nextText}>Next Month</Text>
            </TouchableOpacity>
          </View>

          {/* Badges header */}
          <Text style={styles.badgesHeading}>Badges</Text>
        </BlurView>
        <BlurModal
          visible={modalVisible}
          onClose={() => {
            setModalVisible(false);
          }}
          dateLabel={selectedDate ? formatDateLabel(selectedDate) : undefined}
          onAddEntry={handleAddEntry}
          entries={selectedEntries}
          onSelectEntry={handleSelectEntry}
        />
        <EntryDetailModal
          entry={selectedEntry}
          isVisible={detailVisible}
          onClose={() => setDetailVisible(false)}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

// StyleSheet definitions
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  illustrationLayer: {
    ...StyleSheet.absoluteFillObject,
    top: 40,
    left: "50%",
    transform: [{ translateX: "-50%" }],
    zIndex: -1,
  },
  panel: {
    width: width,
    backgroundColor: "#fff",
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 24,
    elevation: 6,
  },
  topBarBlur: {
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 10,
    paddingLeft: 0,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: PALETTE.purple,
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircleRight: { backgroundColor: PALETTE.purple },
  greeting: { fontSize: 34, fontWeight: "700", marginTop: 8, color: "#111" },
  wave: { fontSize: 30 },
  streakCard: {
    backgroundColor: PALETTE.yellow,
    borderRadius: 18,
    padding: 16,
    paddingRight: 0,
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  streakRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  streakTitle: { color: "#111", fontSize: 16, fontWeight: "600" },
  streakNumber: { fontSize: 28, fontWeight: "800", marginLeft: 8 },
  streakValueRow: { flexDirection: "row", alignItems: "center" },
  progressTrack: {
    height: 12,
    backgroundColor: "#F0D97A",
    borderRadius: 12,
    marginTop: 12,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: PALETTE.blue,
    borderRadius: 8,
  },
  personIllustration: { transform: [{ scaleX: -1 }] },

  calendarCard: {
    marginTop: 20,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 2,
  },

  xpCard: {
    backgroundColor: PALETTE.purple,
    borderRadius: 18,
    marginTop: 18,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  xpTitle: { color: "#fff", fontSize: 18, fontWeight: "700", flex: 1 },
  xpTrack: {
    height: 10,
    backgroundColor: "#FFD24A",
    borderRadius: 10,
    flex: 2,
    marginHorizontal: 10,
    overflow: "hidden",
  },
  xpFill: { width: "75%", height: "100%", backgroundColor: "#3B2DFB" },
  xpMascot: { width: 36, alignItems: "center" },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },
  addButton: {
    backgroundColor: PALETTE.yellow,
    flex: 1,
    marginRight: 8,
    paddingVertical: 14,
    borderRadius: 28,
    alignItems: "center",
  },
  addText: { fontWeight: "700", color: "#111", fontSize: 16 },
  nextButton: {
    backgroundColor: PALETTE.purple,
    flex: 1,
    marginLeft: 8,
    paddingVertical: 14,
    borderRadius: 28,
    alignItems: "center",
  },
  nextText: { fontWeight: "700", color: "#fff", fontSize: 16 },

  badgesHeading: {
    marginTop: 18,
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
  },
});

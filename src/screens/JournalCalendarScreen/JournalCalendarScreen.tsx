import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  Pressable,
} from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import Svg, { Circle, Rect, Ellipse } from "react-native-svg";
import { Calendar, DateData } from "react-native-calendars";
import { BlurView } from "expo-blur";
import LottieView from "lottie-react-native";
// import { girlMeditationBlue, manRocket } from "@/assets/lottie";
import { endOfWeek, format, startOfWeek, sub } from "date-fns";
import { useRouter } from "expo-router";
import { Box } from "@/components/ui/box";
// import { EntryDetailModal } from "@/components/mentalHealth/EntryModal/EntryDetailModal";
// import type { MoodEntry } from "@/types/mentalHealth";
// import { useCalendarEntries } from "@/hooks/useCalendarEntries";
// import WeeklyMoodChart from "@/components/mentalHealth/WeeklyMoodChart";
import { useUserProfile } from "@/hooks/data/useUserProfile";
import BlurModal from "@/src/components/BlurModal";
import WeeklyMoodChart from "@/src/components/WeeklyMoodChart";
// import { girlMeditationBlue } from "@/assets/lottie";
import { SafeAreaView } from "@/components/ui/safe-area-view";
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
  //   const [selectedEntries, setSelectedEntries] = useState<MoodEntry[]>([]);
  const [detailVisible, setDetailVisible] = useState<boolean>(false);
  //   const [selectedEntry, setSelectedEntry] = useState<MoodEntry | null>(null);
  const [monthDate, setMonthDate] = useState<Date>(new Date("2025-08-01"));
  const { data: userProfile, isLoading: isLoadingProfile } = useUserProfile();

  //   const { markedDays, getEntriesForDate } = useCalendarEntries(monthDate);

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
    // router.push("/voice-recorder");
  };

  const handleNextMonth = (): void => {
    setMonthDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  //   const handleSelectEntry = (entry: MoodEntry): void => {
  //     setSelectedEntry(entry);
  //     setModalVisible(false);
  //     setDetailVisible(true);
  //   };

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

  const yesterday = sub(new Date(), { days: 0 });
  const startOfWeekDate = startOfWeek(yesterday, { weekStartsOn: 0 });
  const endOfWeekDate = endOfWeek(yesterday, { weekStartsOn: 0 });

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Background illustrations behind everything */}
      <View
        className="absolute top-10 left-1/2 -translate-x-1/2 -z-10"
        style={{ width: width, height: height }}
        pointerEvents="none"
      >
        <Box className="mt-10">
          {/* <LottieView
            autoPlay
            style={{
              width: 200,
              height: 200,
            }}
            source={girlMeditationBlue}
          /> */}
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
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        contentInsetAdjustmentBehavior="automatic"
      >
        {/* Outer panel container */}
        <BlurView
          intensity={50}
          tint="light"
          className="bg-white p-4 pb-24"
          style={{ width: width }}
        >
          {/* Top bar with blur background */}
          <View className="rounded-2xl overflow-hidden mb-2.5 pl-0">
            <View className="flex-row justify-between py-1.5">
              <TouchableOpacity
                onPress={() => {
                  //   router.push("/tabs/pages/Compdisplay");
                }}
                className="w-10 h-10 rounded-full bg-[#7B61FF] items-center justify-center"
                activeOpacity={0.8}
              >
                <Feather name="arrow-left" size={20} color={PALETTE.white} />
              </TouchableOpacity>

              <TouchableOpacity
                className="w-10 h-10 rounded-full bg-[#7B61FF] items-center justify-center"
                activeOpacity={0.8}
                onPress={() => router.push("/tabs/screens/settings")}
              >
                <Feather name="settings" size={20} color={PALETTE.white} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Greeting text */}
          <Text className="text-[34px] font-bold mt-2 text-gray-900">
            Hi, {isLoadingProfile ? "..." : userProfile?.displayName || "there"}{" "}
            <Text className="text-3xl">👋</Text>
          </Text>

          {/* Streak card with animated progress bar */}
          <View className="bg-[#FFD24A] rounded-2xl p-4 pr-0 flex-row items-center overflow-hidden mt-3">
            <View className="flex-1">
              {/* Streak info */}
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-gray-900 text-base font-semibold">
                    Current Streak
                  </Text>
                  <View className="flex-row items-center">
                    <MaterialIcons
                      name="local-fire-department"
                      size={28}
                      color="#FF6A3D"
                    />
                    <Animated.Text className="text-[28px] font-extrabold ml-2">
                      2
                    </Animated.Text>
                  </View>
                </View>

                <View className="ml-4.5">
                  <Text className="text-gray-900 text-base font-semibold text-center">
                    Next Milestone
                  </Text>
                  <Text className="text-[28px] font-extrabold text-center">
                    3
                  </Text>
                </View>
              </View>

              {/* Animated progress bar */}
              <View className="h-3 bg-[#F0D97A] rounded-xl mt-3 overflow-hidden">
                <Animated.View
                  className="h-full bg-[#60A6FF] rounded-lg"
                  style={{
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0%", "100%"],
                    }),
                  }}
                />
              </View>
            </View>

            {/* Illustration placeholder (SVG character) */}
            <View style={{ transform: [{ scaleX: -1 }] }}>
              {/* <LottieView
                autoPlay
                style={{
                  width: 100,
                  height: 60,
                }}
                source={manRocket}
              /> */}
            </View>
          </View>

          <View className="mt-5">
            <WeeklyMoodChart
              startDate={startOfWeekDate}
              endDate={endOfWeekDate}
              title="This Week's Mood"
            />
          </View>

          {/* Calendar section */}
          <View className="mt-5 bg-white rounded-2xl py-3 border border-indigo-50">
            <Calendar
              enableSwipeMonths
              onVisibleMonthsChange={(months: DateData[]) => {
                console.log("months", months);
              }}
              firstDay={0}
              showSixWeeks={true}
              hideExtraDays={false}
              current={format(monthDate, "yyyy-MM-dd")}
              onMonthChange={(m) => {
                console.log("onMonthChange", m);
                const next = new Date(
                  `${m.year}-${String(m.month).padStart(2, "0")}-01`
                );
                setMonthDate(next);
              }}
              theme={{
                calendarBackground: "#fff",
                textSectionTitleColor: "#94A3B8",
                monthTextColor: "#111827",
                textMonthFontWeight: "700",
                textMonthFontSize: 20,
                todayTextColor: PALETTE.purple,
                selectedDayBackgroundColor: PALETTE.purple,
                selectedDayTextColor: "#fff",
                arrowColor: "#6B7280",
              }}
              // Custom day cell rendering
              dayComponent={({ date, state }) => {
                if (!date) return null;

                // const emoji = markedDays[date.dateString as string];
                const emoji = "🚀";
                const isSelected = selectedDate === date.dateString;
                const isDisabled = state === "disabled";
                const isTodayDate = state === "today";

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
                  //   setSelectedEntries(getEntriesForDate(ds));
                  setModalVisible(true);
                };

                return (
                  <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
                    <Animated.View
                      className="items-center justify-center"
                      style={{
                        transform: [{ scale: scaleAnim }],
                      }}
                    >
                      {/* Circle container for emoji or plus */}
                      <View
                        className="w-7 h-7 rounded-full items-center justify-center"
                        style={{
                          backgroundColor: isSelected
                            ? PALETTE.purple
                            : isTodayDate
                            ? "rgba(123,97,255,0.15)"
                            : "transparent",
                          borderWidth: isSelected ? 0 : 1,
                          borderColor: isTodayDate ? PALETTE.purple : "#E5E7EB",
                        }}
                      >
                        {emoji ? (
                          <Text className="text-lg">{emoji}</Text>
                        ) : (
                          <Text
                            className="text-base font-bold"
                            style={{
                              color: isSelected ? "#fff" : "#94A3B8",
                            }}
                          >
                            +
                          </Text>
                        )}
                      </View>
                      {/* Date number below the circle */}
                      <Text
                        className="text-xs"
                        style={{
                          color: isDisabled ? "#C7BFE7" : "#111827",
                        }}
                      >
                        {date.day}
                      </Text>
                    </Animated.View>
                  </TouchableOpacity>
                );
              }}
            />
          </View>

          {/* XP progress card */}
          <View className="bg-[#7B61FF] rounded-2xl mt-4.5 p-3 flex-row items-center">
            <Animated.Text className="text-white text-lg font-bold flex-1">
              {xpAnim.interpolate({
                inputRange: [0, 200],
                outputRange: ["0 XP", "200 XP"],
              })}
            </Animated.Text>
            <View className="h-2.5 bg-[#FFD24A] rounded-full flex-[2] mx-2.5 overflow-hidden">
              <View className="w-3/4 h-full bg-[#3B2DFB]" />
            </View>
            <View className="w-9 items-center">
              <Text className="text-[26px]">👩‍🎤</Text>
            </View>
          </View>

          {/* Bottom action buttons */}
          <View className="flex-row gap-3 mt-4.5">
            <TouchableOpacity
              className="flex-1 bg-[#7B61FF] py-3.5 rounded-2xl items-center"
              activeOpacity={0.85}
              onPress={handleAddEntry}
            >
              <Text className="font-bold text-white text-base">Add Entry</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 bg-white py-3.5 rounded-2xl items-center border border-gray-200"
              activeOpacity={0.85}
              onPress={handleNextMonth}
            >
              <Text className="font-bold text-gray-900 text-base">
                Next Month
              </Text>
            </TouchableOpacity>
          </View>

          {/* Badges header */}
          <Text className="mt-4.5 text-lg font-bold text-gray-800">Badges</Text>
        </BlurView>
        <BlurModal visible={modalVisible} />
        {/* <EntryDetailModal
          entry={selectedEntry}
          isVisible={detailVisible}
          onClose={() => setDetailVisible(false)}
        /> */}
      </ScrollView>
    </SafeAreaView>
  );
}

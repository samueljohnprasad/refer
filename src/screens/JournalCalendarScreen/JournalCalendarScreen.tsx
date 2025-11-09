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
import {
  Feather,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Svg, { Circle, Rect, Ellipse } from "react-native-svg";
import { Calendar, DateData } from "react-native-calendars";
import { BlurView } from "expo-blur";
import LottieView from "lottie-react-native";
import { girlMeditationBlue } from "@/assets/lottie";
import { endOfWeek, format, startOfWeek, sub } from "date-fns";
import { Box } from "@/components/ui/box";
// import { EntryDetailModal } from "@/components/mentalHealth/EntryModal/EntryDetailModal";
// import type { MoodEntry } from "@/types/mentalHealth";
// import { useCalendarEntries } from "@/hooks/useCalendarEntries";
// import WeeklyMoodChart from "@/components/mentalHealth/WeeklyMoodChart";
import { useUserProfile } from "@/hooks/data/useUserProfile";
import BlurModal from "@/src/components/BlurModal";
import WeeklyMoodChart from "@/src/components/WeeklyMoodChart";
import { getNextMilestone } from "@/hooks/data/useStreakCalculation";
import { StreakRecoveryModal } from "@/src/components/StreakRecoveryModal";
import { useCanRecoverStreak } from "@/hooks/data/useStreakRecovery";
// import { girlMeditationBlue } from "@/assets/lottie";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { router } from "expo-router";
import { EmotionLogger } from "@/src/components/EmotionLogger";
import { supabase } from "@/src/network/auth/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
const { width, height } = Dimensions.get("window");

// Global color palette
export const PALETTE = {
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
  const [showRecoveryModal, setShowRecoveryModal] = useState<boolean>(false);
  const [selectedEmotionDate, setSelectedEmotionDate] = useState<Date>(
    new Date()
  );
  const { data: userProfile, isLoading: isLoadingProfile } = useUserProfile();
  const { canRecover } = useCanRecoverStreak();

  const currentStreak = userProfile?.currentStreak ?? 0;
  const nextMilestone = getNextMilestone(currentStreak);

  useEffect(() => {
    const fetchToken = async () => {
      async function logStorage() {
        const keys = await AsyncStorage.getAllKeys();
        const stores = await AsyncStorage.multiGet(keys);
        const allData = Object.fromEntries(stores);
        console.log("📦 AsyncStorage contents:", allData);
      }

      logStorage();
    };
    // fetchToken();
    // Animate progress bar fill based on actual streak progress
    Animated.timing(progressAnim, {
      toValue: currentStreak / nextMilestone, // Convert percentage to 0-1
      duration: 1200,
      useNativeDriver: false,
    }).start();
  }, [currentStreak]);

  // Show recovery modal if streak can be recovered
  useEffect(() => {
    if (canRecover && !showRecoveryModal) {
      setShowRecoveryModal(true);
    }
  }, [canRecover]);

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
                  router.push("/tabs/screens/paywall");
                }}
                className="w-10 h-10 rounded-full bg-[#7B61FF] items-center justify-center"
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons
                  name="star-four-points-outline"
                  size={20}
                  color={PALETTE.white}
                />
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
          <View className="bg-[#FFD24A] rounded-2xl p-4  flex-row items-center overflow-hidden mt-3">
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
                      {isLoadingProfile ? "..." : currentStreak}
                    </Animated.Text>
                  </View>
                </View>

                <View className="ml-4.5">
                  <Text className="text-gray-900 text-base font-semibold text-center">
                    Next Milestone
                  </Text>
                  <Text className="text-[28px] font-extrabold text-center">
                    {isLoadingProfile ? "..." : nextMilestone}
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
          </View>

          {/* Emotion Logger Component */}
          <View className="mt-5">
            <EmotionLogger
              selectedDate={selectedEmotionDate}
              onEmotionLogged={(emotionScore) => {
                console.log("Emotion logged:", emotionScore);
                // You can add logic here to refresh mood data if needed
              }}
            />
          </View>

          <View className="mt-5">
            <WeeklyMoodChart
              startDate={startOfWeekDate}
              endDate={endOfWeekDate}
              title="This Week's Mood"
            />
          </View>

          {/* Calendar section */}
          {/* <View className="mt-5 bg-white rounded-2xl py-3 border border-indigo-50">
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
          </View> */}
        </BlurView>
        <BlurModal visible={modalVisible} />
        {/* <EntryDetailModal
          entry={selectedEntry}
          isVisible={detailVisible}
          onClose={() => setDetailVisible(false)}
        /> */}
      </ScrollView>

      {/* Streak Recovery Modal */}
      <StreakRecoveryModal
        visible={showRecoveryModal}
        onClose={() => setShowRecoveryModal(false)}
      />
    </SafeAreaView>
  );
}

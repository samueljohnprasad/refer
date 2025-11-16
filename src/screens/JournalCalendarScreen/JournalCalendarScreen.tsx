import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
} from "react-native";
import Svg, { Circle, Ellipse } from "react-native-svg";
import { BlurView } from "expo-blur";
import LottieView from "lottie-react-native";
import { girlMeditationBlue } from "@/assets/lottie";
import { endOfWeek, startOfWeek, sub } from "date-fns";
import { Box } from "@/components/ui/box";
import { useUserProfile } from "@/hooks/data/useUserProfile";
import WeeklyMoodChart from "@/src/components/WeeklyMoodChart";
import { getNextMilestone } from "@/hooks/data/useStreakCalculation";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { router } from "expo-router";
import { EmotionLogger } from "@/src/components/EmotionLogger";
import {
  Fire02Icon,
  Settings02Icon,
  StarsIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
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

export default function JournalCalendarScreen() {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const [selectedEmotionDate] = useState<Date>(new Date());
  const { data: userProfile, isLoading: isLoadingProfile } = useUserProfile();

  const currentStreak = userProfile?.currentStreak ?? 0;
  const nextMilestone = getNextMilestone(currentStreak);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: currentStreak / nextMilestone,
      duration: 1200,
      useNativeDriver: false,
    }).start();
  }, [currentStreak]);

  const yesterday = sub(new Date(), { days: 0 });
  const startOfWeekDate = startOfWeek(yesterday, { weekStartsOn: 0 });
  const endOfWeekDate = endOfWeek(yesterday, { weekStartsOn: 0 });

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View
        className="absolute top-10 left-1/2 -translate-x-1/2 -z-10"
        style={{ width: width, height: height }}
        pointerEvents="none"
      >
        <Box className="mt-10 w-full justify-center items-center">
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
                <HugeiconsIcon
                  icon={StarsIcon}
                  size={20}
                  color={PALETTE.white}
                />
              </TouchableOpacity>

              <TouchableOpacity
                className="w-10 h-10 rounded-full bg-[#7B61FF] items-center justify-center"
                activeOpacity={0.8}
                onPress={() => router.push("/tabs/screens/settings")}
              >
                <HugeiconsIcon
                  icon={Settings02Icon}
                  color={PALETTE.white}
                  size={20}
                />
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
                    <HugeiconsIcon
                      size={28}
                      icon={Fire02Icon}
                      fill={"#FF6A3D"}
                      color="#FF6A3D"
                    />

                    <Animated.Text className="text-[28px] font-extrabold ml-2">
                      {currentStreak}
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
              onEmotionLogged={(emotionScore: number) => {
                // Cache invalidation is handled automatically in useEmotionLogger hook
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
        </BlurView>
      </ScrollView>
    </SafeAreaView>
  );
}

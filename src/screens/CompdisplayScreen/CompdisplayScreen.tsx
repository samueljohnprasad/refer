import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useRef } from "react";
import { startOfWeek, endOfWeek, sub } from "date-fns";
import WeeklyMoodChart from "@/src/components/WeeklyMoodChart";
import useJournalEntryAnimations from "@/hooks/animations/useJournalEntryAnimations";
import TodayReflectionCard from "@/src/components/TodayReflectionCard";
import LevelProgressCard from "@/src/components/LevelProgressCard";
import { useJournalEntry } from "@/hooks/useJournalEntry";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { router } from "expo-router";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { PALETTE } from "../JournalCalendarScreen/JournalCalendarScreen";

const CompdisplayScreen = () => {
  const { heroOpacity, heroTranslateY, sectionStyle } =
    useJournalEntryAnimations(2);
  const { currentPrompt, shufflePrompt } = useJournalEntry();
  const yesterday = sub(new Date(), { days: 0 });
  const startOfWeekDate = startOfWeek(yesterday, { weekStartsOn: 0 });
  const endOfWeekDate = endOfWeek(yesterday, { weekStartsOn: 0 });
  const insets = useSafeAreaInsets();
  const xpAnim = useRef(new Animated.Value(0)).current;
  // Animated values for counting streak and XP numbers
  const streakAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate XP number count-up
    Animated.timing(xpAnim, {
      toValue: 200, // XP value
      duration: 1200,
      useNativeDriver: false,
    }).start();

    // Animate streak number count-up
    Animated.timing(streakAnim, {
      toValue: 2, // Current streak value
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, []);

  // Interpolate XP animated value to integer text
  const xpValue = xpAnim.interpolate({
    inputRange: [0, 200],
    outputRange: ["0", "200"],
  });

  const handleAddEntry = (): void => {
    // Navigate to voice recorder screen
    // router.push("/voice-recorder");
  };

  const handleNextMonth = (): void => {};

  return (
    <ScrollView
      contentContainerClassName={["flex-1 p-4 gap-4 bg-white"].join(" ")}
      contentContainerStyle={{ paddingTop: insets.top }}
    >
      <TouchableOpacity
        onPress={() => {
          router.back();
        }}
        className="w-10 h-10 rounded-full bg-[#7B61FF] items-center justify-center"
        activeOpacity={0.8}
      >
        <Feather name="arrow-left" size={20} color={PALETTE.white} />
      </TouchableOpacity>
      <Animated.View
        style={{
          opacity: heroOpacity,
          transform: [{ translateY: heroTranslateY }],
        }}
      >
        <TodayReflectionCard
          currentPrompt={currentPrompt}
          onShuffle={shufflePrompt}
        />
      </Animated.View>
      <Animated.View style={sectionStyle(0)}>
        <LevelProgressCard xp={323} levelLabel="Gold" percent={34} />
      </Animated.View>
      <Animated.View style={sectionStyle(1)}>
        <WeeklyMoodChart
          startDate={startOfWeekDate}
          endDate={endOfWeekDate}
          title="This Week's Mood"
        />
      </Animated.View>

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
          <Text className="font-bold text-gray-900 text-base">Next Month</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default CompdisplayScreen;

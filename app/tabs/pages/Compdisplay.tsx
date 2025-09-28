import { View, Text, Animated } from "react-native";
import React from "react";
import useJournalEntryAnimations from "@/hooks/useJournalEntryAnimations";
import TodayReflectionCard from "@/screens/JournalEntry/components/TodayReflectionCard";
import { useJournalEntry } from "@/hooks/useJournalEntry";
import LevelProgressCard from "@/screens/JournalEntry/components/LevelProgressCard";
import { startOfWeek, endOfWeek, sub } from "date-fns";
import WeeklyMoodChart from "@/components/mentalHealth/WeeklyMoodChart";

const Compdisplay = () => {
  const { heroOpacity, heroTranslateY, sectionStyle } =
    useJournalEntryAnimations(2);
  const { currentPrompt, shufflePrompt } = useJournalEntry();
  const yesterday = sub(new Date(), { days: 0 });
  const startOfWeekDate = startOfWeek(yesterday, { weekStartsOn: 0 });
  const endOfWeekDate = endOfWeek(yesterday, { weekStartsOn: 0 });
  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#fff" }}>
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
    </View>
  );
};

export default Compdisplay;

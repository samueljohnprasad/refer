import { View, Text } from "react-native";
import React from "react";
import ReanimatedView, { FadeInUp, FadeOutDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderBar from "./HeaderBar";
import PromptCard from "./PromptCard";

const JournalHeaderSection = () => {
  return (
    <ReanimatedView.View
      entering={FadeInUp.duration(1200).springify().damping(20).stiffness(80)}
      exiting={FadeOutDown.duration(800).springify().damping(18).stiffness(60)}
      className="flex-1"
    >
      <SafeAreaView className="flex-1 px-5">
        <HeaderBar />
        <PromptCard />
      </SafeAreaView>
    </ReanimatedView.View>
  );
};

export default JournalHeaderSection;

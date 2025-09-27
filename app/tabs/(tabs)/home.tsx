import { useSeasonalTheme } from "@/hooks/useSeasonalTheme";
import { LinearGradient } from "expo-linear-gradient";
import Animated from "react-native-reanimated";
import React from "react";
import { ModalType } from "@/types/journal";
import JournalCalendarScreen from "@/screens/JournalCalendarScreen/JournalCalendarScreen";

export default function Home() {
  const activeTheme = useSeasonalTheme();

  return <JournalCalendarScreen />;
}

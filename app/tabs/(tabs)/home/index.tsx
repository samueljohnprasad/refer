import React from "react";
import JournalCalendarScreen from "@/src/screens/JournalCalendarScreen/JournalCalendarScreen";

// ponytail: catch any unhandled render errors on home tab instead of native process abort
export { ErrorBoundary } from "expo-router";

export default function HomeTab() {
  return <JournalCalendarScreen />;
}

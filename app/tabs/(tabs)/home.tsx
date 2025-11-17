import React, { lazy } from "react";
const JournalCalendarScreen = lazy(() => import("@/src/screens/JournalCalendarScreen/JournalCalendarScreen"));

export default function HomeTab() {
  return <JournalCalendarScreen />;
}

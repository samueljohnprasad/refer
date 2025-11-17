import React, { lazy } from "react";
const DailyNotesScreen = lazy(() => import("@/src/screens/DailyNotesScreen/DailyNotesScreen"));
export default function JournalTab() {
  return <DailyNotesScreen />;
}

import SuspensLoader from "@/src/components/SuspensLoader";
import React, { lazy } from "react";
import DailyNotesScreen from "@/src/screens/DailyNotesScreen/DailyNotesScreen";


export default function JournalTab() {
  return (
    <SuspensLoader>
      <DailyNotesScreen />
    </SuspensLoader>
  );
}

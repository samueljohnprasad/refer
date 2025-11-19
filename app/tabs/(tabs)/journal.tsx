import SuspensLoader from "@/src/components/SuspensLoader";
import React, { lazy } from "react";
const DailyNotesScreen = lazy(
  () => import("@/src/screens/DailyNotesScreen/DailyNotesScreen")
);


export default function JournalTab() {
  return (
    <SuspensLoader>
      <DailyNotesScreen />
    </SuspensLoader>
  );
}

import SuspensLoader from "@/src/components/SuspensLoader";
import React, { lazy } from "react";
const ExercisesScreen = lazy(
  () => import("@/src/screens/ExercisesScreen/ExercisesScreen")
);

export default function ExercisesTab() {
  return (
    <SuspensLoader>
      <ExercisesScreen />
    </SuspensLoader>
  );
} 

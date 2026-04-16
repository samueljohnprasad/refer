import React, { lazy } from "react";
import SuspensLoader from "@/src/components/SuspensLoader";

const ExercisesScreen = lazy(
  () => import("@/src/screens/ExercisesScreen/ExercisesScreen"),
);

export default function ExercisesTab() {
  return (
    <SuspensLoader>
      <ExercisesScreen />
    </SuspensLoader>
  );
}

import React, { lazy } from "react";
import SuspensLoader from "@/src/components/SuspensLoader";

import ExercisesScreen from "@/src/screens/ExercisesScreen/ExercisesScreen";

export default function ExercisesTab() {
    return (
        <SuspensLoader>
            <ExercisesScreen />
        </SuspensLoader>
    );
}

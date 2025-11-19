import SuspensLoader from "@/src/components/SuspensLoader";
import React, { lazy } from "react";
const SettingsScreen = lazy(
  () => import("@/src/screens/SettingsScreen/SettingsScreen")
);
const Settings = () => {
  return (
    <SuspensLoader>
      <SettingsScreen />
    </SuspensLoader>
  );
};

export default Settings;

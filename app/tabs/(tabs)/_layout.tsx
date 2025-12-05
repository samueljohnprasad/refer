import React from "react";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { DynamicColorIOS, Platform, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  ArtificialIntelligence04Icon,
  Home03Icon,
  Mic01Icon,
  Notebook02Icon,
} from "@hugeicons/core-free-icons";

export default function TabLayout() {
  // Design system colors
  const accentColor = "#7B61FF"; // brand purple
  const inactiveColor = "#94A3B8"; // slate-400-ish

  return (
    <NativeTabs
      tintColor={accentColor}
      minimizeBehavior="onScrollDown"
      labelStyle={{
        color: inactiveColor, // inactive label color
      }}
      // labelStyle={{
      //   // For the text color
      //   color: DynamicColorIOS({
      //     dark: "white",
      //     light: "red",
      //   }),
      // }}
      // // For the selected icon color
      // tintColor={DynamicColorIOS({
      //   dark: "white",
      //   light: "red",
      // })}
    >
      <NativeTabs.Trigger name="home">
        <Label>Home</Label>
        <Icon
          sf={{
            default: "house", // inactive
            selected: "house.fill", // active
          }}
          drawable="custom_android_drawable"
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="journal">
        <Label>Journal</Label>
        <Icon
          sf={{
            default: "book.closed", // inactive
            selected: "book.closed.fill", // active
          }}
          drawable="custom_android_drawable"
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="record">
        <Label>Record</Label>
        <Icon
          sf={{
            default: "mic", // inactive
            selected: "mic.fill", // active
          }}
          drawable="custom_settings_drawable"
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="insights">
        <Label>Insights</Label>
        <Icon sf="sparkles" drawable="custom_settings_drawable" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

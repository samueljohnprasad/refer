import React from "react";
import { NativeTabs } from "expo-router/unstable-native-tabs";

const Label = NativeTabs.Trigger.Label;
const Icon = NativeTabs.Trigger.Icon;
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
import { useWidgetWeekMoods } from "@/hooks/data/useWidgetWeekMoods";
import { SAGE, INK_MUTED } from "@/lib/tokens";

export default function TabLayout() {
  useWidgetWeekMoods();

  return (
    <NativeTabs
      tintColor={SAGE[500]}
      minimizeBehavior="onScrollDown"
      labelStyle={{
        color: INK_MUTED,
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
      <NativeTabs.Trigger name="exercises">
        <Label>Exercises</Label>
        <Icon
          sf={{
            default: "doc.text", // inactive
            selected: "doc.text.fill", // active
          }}
          drawable="custom_android_drawable"
        />
      </NativeTabs.Trigger>
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
      <NativeTabs.Trigger name="journeys">
        <Label>Journeys</Label>
        <Icon
          sf={{
            default: "map",
            selected: "map.fill",
          }}
          drawable="custom_settings_drawable"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

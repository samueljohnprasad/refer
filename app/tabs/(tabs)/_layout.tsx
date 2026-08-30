import React from "react";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import { useColorScheme } from "react-native";

const Label = NativeTabs.Trigger.Label;
const Icon = NativeTabs.Trigger.Icon;
import { useWidgetWeekMoods } from "@/hooks/data/useWidgetWeekMoods";
import { BRAND_BORDER, BRAND_DARK, INK_SOFT, SAGE } from "@/lib/tokens";

export default function TabLayout() {
  const isDark = useColorScheme() === "dark";
  useWidgetWeekMoods();

  return (
    <NativeTabs
      tintColor={isDark ? SAGE[300] : SAGE[500]}
      backgroundColor={
        isDark ? "rgba(15, 26, 15, 0.92)" : "rgba(255, 255, 255, 0.92)"
      }
      shadowColor={isDark ? BRAND_DARK.border : BRAND_BORDER}
      blurEffect={
        isDark ? "systemUltraThinMaterialDark" : "systemUltraThinMaterialLight"
      }
      disableTransparentOnScrollEdge
      minimizeBehavior="onScrollDown"
      indicatorColor="transparent"
      rippleColor="rgba(93, 126, 87, 0.12)"
      labelStyle={{
        color: isDark ? BRAND_DARK.inkSoft : INK_SOFT,
      }}
    >
      <NativeTabs.Trigger name="exercises">
        <Label>Exercises</Label>
        <Icon
          sf={{
            default: "doc.text",
            selected: "doc.text.fill",
          }}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="home">
        <Label>Home</Label>
        <Icon
          sf={{
            default: "house",
            selected: "house.fill",
          }}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="journal">
        <Label>Journal</Label>
        <Icon
          sf={{
            default: "book.closed",
            selected: "book.closed.fill",
          }}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="record">
        <Label>Record</Label>
        <Icon
          sf={{
            default: "mic",
            selected: "mic.fill",
          }}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="journeys">
        <Icon
          sf={{
            default: "map",
            selected: "map.fill",
          }}
        />
        <Label>Journeys</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

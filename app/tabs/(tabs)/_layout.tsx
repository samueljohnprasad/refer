import React from "react";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import { useColorScheme } from "react-native";

const Label = NativeTabs.Trigger.Label;
const Icon = NativeTabs.Trigger.Icon;
import { useWidgetWeekMoods } from "@/hooks/data/useWidgetWeekMoods";
import { SEMANTIC_COLORS } from "@/src/theme/colors";

export default function TabLayout() {
  const isDark = useColorScheme() === "dark";
  useWidgetWeekMoods();

  return (
    <NativeTabs
      tintColor={isDark ? SEMANTIC_COLORS.border.selected : SEMANTIC_COLORS.brand.primary}
      backgroundColor={
        isDark ? "rgba(15, 26, 15, 0.92)" : "rgba(255, 255, 255, 0.92)"
      }
      shadowColor={isDark ? SEMANTIC_COLORS.border.default : SEMANTIC_COLORS.border.default}
      blurEffect={
        isDark ? "systemUltraThinMaterialDark" : "systemUltraThinMaterialLight"
      }
      disableTransparentOnScrollEdge
      minimizeBehavior="onScrollDown"
      indicatorColor="transparent"
      rippleColor="rgba(93, 126, 87, 0.12)"
      labelStyle={{
        color: isDark ? SEMANTIC_COLORS.text.secondary : SEMANTIC_COLORS.text.secondary,
      }}
    >
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
            default: "book",
            selected: "book.fill",
          }}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="record">
        <Label>Capture</Label>
        <Icon
          sf={{
            default: "plus",
            selected: "plus",
          }}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="journeys">
        <Label>Journeys</Label>
        <Icon
          sf={{
            default: "map",
            selected: "map.fill",
          }}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="exercises">
        <Label>Exercises</Label>
        <Icon
          sf={{
            default: "leaf",
            selected: "leaf.fill",
          }}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

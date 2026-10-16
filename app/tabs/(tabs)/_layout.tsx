import React from "react";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import { useColorScheme } from "react-native";
import { useTranslation } from "react-i18next";

const Label = NativeTabs.Trigger.Label;
const Icon = NativeTabs.Trigger.Icon;
import { useWidgetWeekMoods } from "@/hooks/data/useWidgetWeekMoods";
import { SEMANTIC_COLORS } from "@/src/theme/colors";

export default function TabLayout() {
  const isDark = useColorScheme() === "dark";
  const { t: tCommon } = useTranslation("common");
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
      minimizeBehavior="never"
      indicatorColor="transparent"
      rippleColor="rgba(93, 126, 87, 0.12)"
      labelStyle={{
        color: isDark ? SEMANTIC_COLORS.text.secondary : SEMANTIC_COLORS.text.secondary,
      }}
    >
      <NativeTabs.Trigger name="home">
        <Label>{tCommon("navigation.home")}</Label>
        <Icon
          sf={{
            default: "house",
            selected: "house.fill",
          }}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="journal">
        <Label>{tCommon("navigation.journal")}</Label>
        <Icon
          sf={{
            default: "book",
            selected: "book.fill",
          }}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="timeline">
        <Label>{tCommon("navigation.timeline")}</Label>
        <Icon
          sf={{
            default: "chart.bar.xaxis",
            selected: "chart.bar.fill",
          }}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="journeys">
        <Label>{tCommon("navigation.journeys")}</Label>
        <Icon
          sf={{
            default: "map",
            selected: "map.fill",
          }}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="exercises">
        <Label>{tCommon("navigation.exercises")}</Label>
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

import React from "react";
import { View, Pressable } from "react-native";
import ReanimatedModule, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { Text } from "@/src/components/ui/Text";
import { useTranslation } from "react-i18next";

export type TabType = "day" | "week";
interface TabProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TAB_WIDTH = 50;
const TAB_GAP = 16;

const TabSelector: React.FC<TabProps> = ({ activeTab, onTabChange }) => {
  const { t } = useTranslation("insights");
  const indicatorPosition = useSharedValue(
    activeTab === "day" ? 0 : TAB_WIDTH + TAB_GAP,
  );

  // Update indicator position when tab changes
  React.useEffect(() => {
    indicatorPosition.value = withSpring(
      activeTab === "day" ? 0 : TAB_WIDTH + TAB_GAP,
      {
        damping: 20,
        stiffness: 200,
      },
    );
  }, [activeTab, indicatorPosition]);

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: indicatorPosition.value }],
    };
  });

  return (
    <View>
      <View className="flex-row items-center">
        <Pressable
          onPress={() => onTabChange("day")}
          style={{ width: TAB_WIDTH, marginRight: TAB_GAP }}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === "day" }}
          accessibilityLabel={t("chart.weeklyMood.tabs.dayView")}
          accessibilityHint={t("chart.weeklyMood.tabs.dayHint")}
        >
          <Text
            className={`text-base font-medium ${activeTab === "day" ? "text-ink" : "text-ink-muted"
              }`}
          >
            {t("chart.weeklyMood.tabs.day")}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => onTabChange("week")}
          style={{ width: TAB_WIDTH }}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === "week" }}
          accessibilityLabel={t("chart.weeklyMood.tabs.weekView")}
          accessibilityHint={t("chart.weeklyMood.tabs.weekHint")}
        >
          <Text
            className={`text-base font-medium ${activeTab === "week" ? "text-ink" : "text-ink-muted"
              }`}
          >
            {t("chart.weeklyMood.tabs.week")}
          </Text>
        </Pressable>
      </View>
      {/* Animated Indicator */}
      <ReanimatedModule.View
        style={[
          {
            position: "absolute",
            bottom: -6,
            left: 0,
            height: 3,
            width: TAB_WIDTH,
            backgroundColor: "#3B82F6",
            borderRadius: 1.5,
          },
          animatedIndicatorStyle,
        ]}
      />
    </View>
  );
};
export default TabSelector;

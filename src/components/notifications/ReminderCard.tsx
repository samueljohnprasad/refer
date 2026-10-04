import React from "react";
import { View, Pressable, Switch } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { SymbolView, SymbolViewProps } from "expo-symbols";
import { Host, DatePicker } from "@expo/ui/swift-ui";
import type { ReminderItem } from "./types";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import * as Haptics from "expo-haptics";
import { useTranslation } from "react-i18next";

type ReminderCardProps = {
  item: ReminderItem;
  index: number;
  isSelected?: boolean;
  onToggle: () => void;
  onEditTime?: () => void;
  onTimeChange?: (hour: number, minute: number) => void;
  onPressItem?: () => void;
  isLast?: boolean;
};

const iconMap: Record<string, SymbolViewProps["name"]> = {
  "1": "sun.and.horizon.fill",
  "2": "sun.max.fill",
  "3": "moon.stars.fill",
};

// ponytail: stacked title + SwiftUI time chip eliminates ugly horizontal squeeze and hyphenation
export const ReminderCard: React.FC<ReminderCardProps> = React.memo(
  ({
    item,
    isSelected = false,
    onToggle,
    onTimeChange,
    onPressItem,
    isLast = false,
  }) => {
    const { t } = useTranslation("settings");
    const icon = iconMap[item.id] || "clock.fill";
    const title = t(`reminders.slots.${item.id}.title`, {
      defaultValue: item.title,
    });

    const handlePress = () => {
      Haptics.selectionAsync();
      onToggle();
      if (onPressItem) {
        onPressItem();
      }
    };

    return (
      <View
        className={`flex-row items-center px-4 py-3 bg-transparent ${
          !isLast ? "border-b border-sage-200/50" : ""
        } ${isSelected ? "opacity-100" : "opacity-45"}`}
      >
        {/* Tappable Icon Badge */}
        <Pressable
          onPress={handlePress}
          hitSlop={6}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: isSelected }}
          accessibilityLabel={`${title} icon`}
        >
          <View
            className={`w-9 h-9 rounded-xl items-center justify-center mr-3 ${
              isSelected ? "bg-sage-100/90" : "bg-neutral-100"
            }`}
          >
            <SymbolView
              name={icon as SymbolViewProps["name"]}
              size={18}
              tintColor={
                isSelected
                  ? SEMANTIC_COLORS.brand.primary
                  : SEMANTIC_COLORS.text.tertiary
              }
              type="hierarchical"
            />
          </View>
        </Pressable>

        {/* Middle Column: Title on top, Native DatePicker beneath */}
        <View className="flex-1 justify-center py-0.5">
          <Pressable
            onPress={handlePress}
            hitSlop={{ top: 6, bottom: 4, left: 4, right: 12 }}
            accessibilityRole="none"
          >
            <Text
              numberOfLines={1}
              style={{ fontFamily: APP_FONT_FAMILIES.bold }}
              className="text-[16px] text-ink leading-tight"
            >
              {title}
            </Text>
          </Pressable>

          {/* Time Picker Button (SwiftUI) aligned under title */}
          <View
            className="mt-1 items-start"
            pointerEvents={isSelected ? "auto" : "none"}
          >
            <Host matchContents>
              <DatePicker
                selection={
                  new Date(new Date().setHours(item.hour, item.minute, 0, 0))
                }
                displayedComponents={["hourAndMinute"]}
                onDateChange={(date: Date) => {
                  if (onTimeChange) {
                    onTimeChange(date.getHours(), date.getMinutes());
                  }
                  if (onPressItem) {
                    onPressItem();
                  }
                }}
              />
            </Host>
          </View>
        </View>

        {/* Native Toggle Switch */}
        <View className="ml-3">
          <Switch
            value={isSelected}
            onValueChange={handlePress}
            trackColor={{
              true: SEMANTIC_COLORS.brand.primary,
              false: "#E5E5EA",
            }}
            ios_backgroundColor="#E5E5EA"
            accessibilityRole="switch"
            accessibilityState={{ checked: isSelected }}
            accessibilityLabel={`${title} reminder`}
          />
        </View>
      </View>
    );
  }
);

ReminderCard.displayName = "ReminderCard";

import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import React, { useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "expo-router/react-navigation";
import { Text, View, ScrollView } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { NotificationTime } from "../types";
import { ReminderCard } from "@/src/components/notifications/ReminderCard";
import { useReminderConfig } from "@/src/components/notifications/useReminderConfig";
import { DEFAULT_REMINDERS } from "@/src/components/notifications/constants";

interface NotificationPermissionStepProps {
  selectedTime?: NotificationTime;
  onSelectTime: (time: NotificationTime) => void;
  stressTiming?: string;
}

const NotificationPermissionStep: React.FC<NotificationPermissionStepProps> = ({
  selectedTime,
  onSelectTime,
  stressTiming,
}) => {
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  
  const {
    items,
    cfg,
    handleTimeChange,
    toggleSelected,
  } = useReminderConfig(DEFAULT_REMINDERS);

  // Notify parent that a time is "selected" if any reminder is enabled
  useEffect(() => {
    const hasEnabled = Object.values(cfg).some((c) => c.enabled);
    if (hasEnabled && !selectedTime) {
      onSelectTime("evening"); // Dummy value to enable "Continue" button
    }
  }, [cfg, selectedTime, onSelectTime]);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 24, paddingTop: headerHeight - insets.top }}
      contentInsetAdjustmentBehavior="automatic"
      className="flex-1 pt-6"
    >
      <Animated.View entering={FadeIn.duration(180).delay(80)} className="px-6">
        <Text
          style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}
          className="text-[26px] leading-[1.1] text-ink"
        >
          Daily Reminders
        </Text>
        <Text className="mt-3 text-[15px] leading-relaxed text-ink-soft">
          Set up gentle nudges to help you build a consistent journaling habit
        </Text>
      </Animated.View>

      <Animated.View
        entering={FadeIn.duration(180).delay(160)}
        className="mt-8 border-y border-border/50"
      >
        {items.map((item, index) => {
          const isSelected = cfg[item.id]?.enabled;
          return (
            <ReminderCard
              key={item.id}
              item={item}
              index={index}
              isSelected={isSelected}
              onToggle={() => toggleSelected(item.id)}
              onTimeChange={(hour, minute) => handleTimeChange(item.id, hour, minute)}
              isLast={index === items.length - 1}
            />
          );
        })}
      </Animated.View>
    </ScrollView>
  );
};

export default React.memo(NotificationPermissionStep);

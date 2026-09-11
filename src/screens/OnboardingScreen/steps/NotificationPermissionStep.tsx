import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import React, { useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, View, ScrollView, Platform } from "react-native";
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
}) => {
  const insets = useSafeAreaInsets();
  const contentTopPadding = Platform.OS === "ios" ? 100 : insets.top + 100;
  
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
      onSelectTime("evening");
    }
  }, [cfg, selectedTime, onSelectTime]);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: 140,
        paddingTop: contentTopPadding,
      }}
      contentInsetAdjustmentBehavior="automatic"
      className="flex-1 px-6"
    >
      <Animated.View entering={FadeIn.duration(160).delay(80)}>
        <Text
          style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}
          className="text-xs font-semibold uppercase tracking-wider text-sage-600"
        >
          Gentle nudges
        </Text>
      </Animated.View>

      <Animated.View entering={FadeIn.duration(180).delay(140)} className="mt-1.5">
        <Text
          style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}
          className="text-[26px] leading-[1.15] text-ink"
        >
          Daily reminders
        </Text>
        <Text className="mt-2 text-[15px] leading-relaxed text-ink-soft">
          Choose when you’d like a gentle nudge.
        </Text>
      </Animated.View>

      <Animated.View
        entering={FadeIn.duration(180).delay(200)}
        style={{ borderCurve: "continuous" }}
        className="mt-6 overflow-hidden rounded-2xl border border-sage-200/80 bg-warm-white shadow-sm"
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

      <Animated.View entering={FadeIn.duration(180).delay(260)} className="mt-4 px-1">
        <Text
          style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}
          className="text-center text-[13px] leading-relaxed text-ink-soft"
        >
          You can change these anytime in Settings.
        </Text>
      </Animated.View>
    </ScrollView>
  );
};

export default React.memo(NotificationPermissionStep);

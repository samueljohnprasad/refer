import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import React, { useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "expo-router/react-navigation";
import { Text, ScrollView } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { NotificationTime } from "../types";
import { ReminderCard } from "@/src/components/notifications/ReminderCard";
import { useReminderConfig } from "@/src/components/notifications/useReminderConfig";
import { DEFAULT_REMINDERS } from "@/src/components/notifications/constants";
import { useTranslation } from "react-i18next";

interface NotificationPermissionStepProps {
  selectedTime?: NotificationTime;
  onSelectTime: (time: NotificationTime) => void;
  stressTiming?: string;
}

const FOOTER_CLEARANCE = 188;

// ponytail: one quiet schedule surface keeps the choice legible without card stacking
const NotificationPermissionStep: React.FC<NotificationPermissionStepProps> = ({
  selectedTime,
  onSelectTime,
}) => {
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation("onboarding");
  // ponytail: do not prompt OS dialog while toggling in onboarding; prompt on Continue click
  const {
    items,
    cfg,
    handleTimeChange,
    toggleSelected,
  } = useReminderConfig(DEFAULT_REMINDERS, { requestPermissionsOnToggle: false });

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
      bounces={false}
      contentContainerStyle={{
        paddingBottom: FOOTER_CLEARANCE,
        paddingTop: Math.max(headerHeight - insets.top, 16),
      }}
      contentInsetAdjustmentBehavior="automatic"
      className="flex-1 px-6"
    >
      <Animated.View entering={FadeIn.duration(180).delay(120)}>
        <Text
          style={{ fontFamily: APP_FONT_FAMILIES.extraBold }}
          className="text-[28px] leading-[34px] text-ink happy-font-body-extrabold"
        >
          {t("notification.title")}
        </Text>
        <Text
          style={{ fontFamily: APP_FONT_FAMILIES.regular }}
          className="mt-1.5 text-[15px] leading-relaxed text-ink-soft happy-font-body-medium"
        >
          {t("notification.description")}
        </Text>
      </Animated.View>

      {/* Reminder Config List */}
      <Animated.View
        entering={FadeIn.duration(180).delay(180)}
        style={{ borderCurve: "continuous" }}
        className="mt-7 overflow-hidden border-y border-sage-200/60 bg-transparent"
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
              appearance="schedule"
            />
          );
        })}
      </Animated.View>

      <Animated.View entering={FadeIn.duration(180).delay(220)} className="mt-5 px-1">
        <Text
          style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}
          className="text-[13px] leading-relaxed text-ink-soft"
        >
          {t("notification.customize_note")}
        </Text>
      </Animated.View>
    </ScrollView>
  );
};

export default React.memo(NotificationPermissionStep);

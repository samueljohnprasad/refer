import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import React, { useEffect, useMemo } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, ScrollView, Platform } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { NotificationTime } from "../types";
import { ReminderCard } from "@/src/components/notifications/ReminderCard";
import { useReminderConfig } from "@/src/components/notifications/useReminderConfig";
import { DEFAULT_REMINDERS } from "@/src/components/notifications/constants";
import { SymbolView } from "expo-symbols";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { useTranslation } from "react-i18next";

interface NotificationPermissionStepProps {
  selectedTime?: NotificationTime;
  onSelectTime: (time: NotificationTime) => void;
  stressTiming?: string;
}

// ponytail: benchmarked against stoic & Duolingo Mobbin flows (CBT habit proof + single-viewport no-scroll layout)
const NotificationPermissionStep: React.FC<NotificationPermissionStepProps> = ({
  selectedTime,
  onSelectTime,
}) => {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation("onboarding");
  const contentTopPadding = Platform.OS === "ios" ? insets.top + 32 : insets.top + 28;
  const reminderItems = useMemo(() => DEFAULT_REMINDERS.map((item) => ({
    ...item,
    title: t(`notification.reminders.${item.id}.title`, { defaultValue: item.title }),
    notificationBody: t(`notification.reminders.${item.id}.body`, { defaultValue: item.notificationBody }),
  })), [t]);
  
  // ponytail: do not prompt OS dialog while toggling in onboarding; prompt on Continue click
  const {
    items,
    cfg,
    handleTimeChange,
    toggleSelected,
  } = useReminderConfig(reminderItems, { requestPermissionsOnToggle: false });

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
        paddingBottom: 24,
        paddingTop: contentTopPadding,
      }}
      contentInsetAdjustmentBehavior="automatic"
      className="flex-1 px-6"
    >
      <Animated.View entering={FadeIn.duration(160).delay(80)}>
        <Text
          style={{ fontFamily: APP_FONT_FAMILIES.bold }}
          className="text-[11px] font-bold uppercase tracking-wider text-sage-600"
        >
          {t("notification.step_label")}
        </Text>
      </Animated.View>

      <Animated.View entering={FadeIn.duration(180).delay(120)} className="mt-1.5">
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
        className="mt-5 overflow-hidden rounded-2xl border border-sage-200/80 bg-warm-white shadow-sm"
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

      {/* Habit Consistency Proof Badge */}
      <Animated.View
        entering={FadeIn.duration(180).delay(220)}
        className="mt-4 flex-row items-center justify-center gap-2 py-2 px-3.5 rounded-full bg-sage-100/70 border border-sage-200/70 self-center"
      >
        <SymbolView
          name="chart.line.uptrend.xyaxis"
          size={14}
          tintColor={SEMANTIC_COLORS.brand.pressed}
          type="hierarchical"
        />
        <Text
          style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}
          className="text-[12px] text-sage-800"
        >
          {t("notification.consistency_proof")}
        </Text>
      </Animated.View>

      <Animated.View entering={FadeIn.duration(180).delay(260)} className="mt-2.5 px-1">
        <Text
          style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}
          className="text-center text-[13px] leading-relaxed text-ink-soft"
        >
          {t("notification.customize_note")}
        </Text>
      </Animated.View>
    </ScrollView>
  );
};

export default React.memo(NotificationPermissionStep);

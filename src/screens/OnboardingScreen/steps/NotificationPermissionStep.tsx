// ponytail: reminder picker with panda mascot & tactile time cards — no preview noise
import React, { useEffect, useMemo, useCallback } from "react";
import { View, Text, ScrollView, Switch, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "expo-router/react-navigation";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { Host, DatePicker } from "@expo/ui/swift-ui";
import { useTranslation } from "react-i18next";
import Svg, { Path } from "react-native-svg";
import HappiMascot from "../components/HappiMascot";
import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import { SAGE } from "@/src/theme/palette";
import { useOnboardingAnalytics } from "../hooks/useOnboardingAnalytics";
import { useReminderConfig } from "@/src/components/notifications/useReminderConfig";
import { DEFAULT_REMINDERS } from "@/src/components/notifications/constants";
import type { NotificationTime } from "../types";

interface NotificationPermissionStepProps {
  selectedTime?: NotificationTime;
  onSelectTime: (time: NotificationTime) => void;
  stressTiming?: string;
}

const SLOT_META: Record<
  string,
  { symbol: SymbolViewProps["name"]; tintColor: string; defaultTitle: string }
> = {
  "1": { symbol: "sun.and.horizon.fill", tintColor: "#D97706", defaultTitle: "Morning Reflection" },
  "2": { symbol: "sun.max.fill", tintColor: "#0284C7", defaultTitle: "Midday Check-in" },
  "3": { symbol: "moon.stars.fill", tintColor: "#4F46E5", defaultTitle: "Evening Wind-down" },
};

const FOOTER_CLEARANCE = 170;

const NotificationPermissionStep: React.FC<NotificationPermissionStepProps> = ({
  selectedTime,
  onSelectTime,
}) => {
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation("onboarding");
  const analytics = useOnboardingAnalytics();

  const { items, cfg, handleTimeChange, toggleSelected } = useReminderConfig(
    DEFAULT_REMINDERS,
    { requestPermissionsOnToggle: false },
  );

  const onToggleSlot = useCallback(
    (id: string, isCurrentlySelected: boolean) => {
      Haptics.selectionAsync();
      analytics.trackReminderSlotToggled(id, !isCurrentlySelected);
      toggleSelected(id);
    },
    [analytics, toggleSelected],
  );

  const onTimeChange = useCallback(
    (id: string, hours: number, minutes: number) => {
      const pad = (n: number) => n.toString().padStart(2, "0");
      analytics.trackReminderTimeChanged(id, `${pad(hours)}:${pad(minutes)}`);
      handleTimeChange(id, hours, minutes);
    },
    [analytics, handleTimeChange],
  );

  useEffect(() => {
    const hasEnabled = Object.values(cfg).some((c) => c.enabled);
    if (hasEnabled && !selectedTime) onSelectTime("evening");
  }, [cfg, selectedTime, onSelectTime]);

  const activeCount = useMemo(
    () => Object.values(cfg).filter((c) => c.enabled).length,
    [cfg],
  );

  const topPadding = (headerHeight > 0 ? headerHeight : insets.top + 44) + 8;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      bounces={false}
      alwaysBounceVertical={false}
      contentInsetAdjustmentBehavior="never"
      contentContainerStyle={{
        paddingTop: topPadding,
        paddingBottom: FOOTER_CLEARANCE,
      }}
      className="flex-1 px-5"
    >
      {/* 1. Header */}
      <Animated.View entering={FadeIn.duration(200)} className="mb-4">
        <View className="flex-row items-center mb-1.5">
          <View className="rounded-full bg-sage-100 px-3 py-1 border border-sage-200">
            <Text
              style={{ fontFamily: APP_FONT_FAMILIES.bold, color: SAGE[800] }}
              className="text-[11px] uppercase tracking-wider"
            >
              Step 5 · Daily habit
            </Text>
          </View>
        </View>
        <Text
          style={{ fontFamily: APP_FONT_FAMILIES.extraBold }}
          className="text-[26px] text-ink leading-tight"
        >
          Pick your check-in times
        </Text>
        <Text
          style={{ fontFamily: APP_FONT_FAMILIES.regular }}
          className="mt-1 text-[15px] text-ink-soft leading-snug"
        >
          A 2-minute pause builds the habit. Choose when Happi should nudge you.
        </Text>
      </Animated.View>

      {/* 2. Panda Mascot + Dialogue */}
      <Animated.View
        entering={FadeInDown.duration(250).delay(80)}
        className="flex-row items-center gap-3.5 mb-5"
      >
        <View className="shrink-0">
          <HappiMascot expression="bell" size={88} animate={false} delay={0} />
        </View>

        <View
          style={{ borderCurve: "continuous" }}
          className="flex-1 relative rounded-2xl border-2 border-stone-200 bg-white p-3.5"
        >
          <Svg
            width={13}
            height={18}
            viewBox="0 0 13 18"
            style={{ position: "absolute", left: -12, top: "50%", marginTop: -9 }}
          >
            <Path d="M13 0 L0 9 L13 18 Z" fill="#ffffff" />
            <Path d="M13 0 L0 9 L13 18" fill="none" stroke="#e2e8f0" strokeWidth={2} />
            <Path d="M13 1 L13 17" stroke="#ffffff" strokeWidth={3} />
          </Svg>

          <Text
            style={{ fontFamily: APP_FONT_FAMILIES.bold, color: SAGE[700] }}
            className="text-[11px] uppercase tracking-wider mb-0.5"
          >
            Habit commitment
          </Text>
          <Text
            style={{ fontFamily: APP_FONT_FAMILIES.bold }}
            className="text-[14px] leading-snug text-ink"
          >
            "Members with reminders are 3x more likely to keep their daily streak."
          </Text>
        </View>
      </Animated.View>

      {/* 3. Time Cards */}
      <View className="gap-3">
        {items.map((item, index) => {
          const isSelected = cfg[item.id]?.enabled;
          const meta = SLOT_META[item.id] || {
            symbol: "clock.fill" as SymbolViewProps["name"],
            tintColor: SAGE[600],
            defaultTitle: "Reminder",
          };

          return (
            <Animated.View
              key={item.id}
              entering={FadeInDown.duration(200).delay(180 + index * 40)}
              style={{ borderCurve: "continuous" }}
              className={`rounded-2xl border-2 ${
                isSelected ? "border-sage-500 bg-sage-50/80" : "border-stone-200 bg-white opacity-55"
              } px-4 py-3.5 flex-row items-center gap-3.5`}
            >
              <Pressable
                onPress={() => onToggleSlot(item.id, !!isSelected)}
                className="w-8 items-center justify-center"
              >
                <SymbolView
                  name={meta.symbol}
                  size={24}
                  tintColor={isSelected ? meta.tintColor : "#9ca3af"}
                  type="hierarchical"
                />
              </Pressable>

              <View className="flex-1 justify-center">
                <Text
                  style={{ fontFamily: APP_FONT_FAMILIES.bold }}
                  className={`text-[15px] leading-tight ${isSelected ? "text-ink" : "text-ink-soft"}`}
                >
                  {t(`reminders.slots.${item.id}.title`, { defaultValue: meta.defaultTitle })}
                </Text>

                <View className="mt-1 items-start" pointerEvents={isSelected ? "auto" : "none"}>
                  <Host matchContents>
                    <DatePicker
                      selection={new Date(new Date().setHours(item.hour, item.minute, 0, 0))}
                      displayedComponents={["hourAndMinute"]}
                      onDateChange={(date: Date) => onTimeChange(item.id, date.getHours(), date.getMinutes())}
                    />
                  </Host>
                </View>
              </View>

              <Switch
                value={isSelected}
                onValueChange={() => onToggleSlot(item.id, !!isSelected)}
                trackColor={{ true: SAGE[500], false: "#E5E5EA" }}
                ios_backgroundColor="#E5E5EA"
                accessibilityRole="switch"
                accessibilityState={{ checked: isSelected }}
                accessibilityLabel={`${meta.defaultTitle} toggle`}
              />
            </Animated.View>
          );
        })}
      </View>

      {/* 5. Status line */}
      <Animated.View entering={FadeIn.duration(180).delay(240)} className="mt-4 px-1 items-center">
        <Text
          style={{ fontFamily: APP_FONT_FAMILIES.regular }}
          className="text-xs text-ink-muted text-center"
        >
          {activeCount > 0
            ? `${activeCount} check-in${activeCount > 1 ? "s" : ""} scheduled · Change or mute anytime in Settings`
            : "No reminders set · You can enable them anytime in Settings"}
        </Text>
      </Animated.View>
    </ScrollView>
  );
};

export default React.memo(NotificationPermissionStep);

import { useNotificationPreferences } from "@/src/hooks/data/useNotificationPreferences";
import React from "react";
import {
  View,
  Text,
  ScrollView,
  Switch,
  ActivityIndicator,
} from "react-native";
import { BRAND_SURFACE, SAGE } from "@/lib/tokens";

export default function NotificationPreferencesScreen() {
  const { settings, isLoading, updateSettings, isUpdating } =
    useNotificationPreferences();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={SAGE[600]} />
      </View>
    );
  }

  const toggleSetting = (key: string, value: boolean) => {
    updateSettings({ [key]: value });
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
      className="flex-1 happy-brand-screen px-5"
    >
      <Text className="happy-font-heading-bold text-[30px] text-ink mb-6">
        Notification Preferences
      </Text>

      {/* Master toggle */}
      <SettingRow
        title="Push Notifications"
        description="Receive personalized reminders to journal, track mood, and maintain streaks"
        value={settings.push_enabled}
        onToggle={(v) => toggleSetting("push_enabled", v)}
        disabled={isUpdating}
      />

      {settings.push_enabled && (
        <>
          <View className="h-px bg-sage-100 my-4" />
          <Text className="happy-font-body-bold text-lg text-ink mb-3">
            Notification Types
          </Text>

          <SettingRow
            title="Streak Reminders"
            description="Get notified when your journal streak is at risk"
            value={settings.streak_reminders}
            onToggle={(v) => toggleSetting("streak_reminders", v)}
            disabled={isUpdating}
          />

          <SettingRow
            title="Mood Check-ins"
            description="Daily reminders to log your mood"
            value={settings.mood_reminders}
            onToggle={(v) => toggleSetting("mood_reminders", v)}
            disabled={isUpdating}
          />

          <SettingRow
            title="Habit Reminders"
            description="Reminders for your active habits"
            value={settings.habit_reminders}
            onToggle={(v) => toggleSetting("habit_reminders", v)}
            disabled={isUpdating}
          />

          <SettingRow
            title="Achievement Nudges"
            description="Get notified when you're close to unlocking an achievement"
            value={settings.achievement_reminders}
            onToggle={(v) => toggleSetting("achievement_reminders", v)}
            disabled={isUpdating}
          />

          <View className="h-px bg-sage-100 my-4" />
          <Text className="happy-font-body-medium text-sm text-ink-muted mb-2">
            Quiet hours: {settings.quiet_hours_start}:00 -{" "}
            {settings.quiet_hours_end}:00
          </Text>
          <Text className="happy-font-body-medium text-sm text-ink-muted mb-8">
            Max {settings.max_per_day} notification per day. We use AI to find
            the best time to send you notifications based on your usage
            patterns.
          </Text>
        </>
      )}
    </ScrollView>
  );
}

function SettingRow({
  title,
  description,
  value,
  onToggle,
  disabled,
}: {
  title: string;
  description: string;
  value: boolean;
  onToggle: (value: boolean) => void;
  disabled: boolean;
}) {
  return (
    <View className="happy-brand-card mb-3 flex-row items-center justify-between rounded-[24px] p-4">
      <View className="flex-1 mr-4">
        <Text className="happy-font-body-bold text-base text-ink">{title}</Text>
        <Text className="happy-font-body-medium text-sm text-ink-muted mt-0.5">
          {description}
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        disabled={disabled}
        trackColor={{ false: SAGE[100], true: SAGE[500] }}
        thumbColor={BRAND_SURFACE}
      />
    </View>
  );
}

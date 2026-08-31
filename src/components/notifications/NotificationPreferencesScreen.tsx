import { useNotificationPreferences } from "@/src/hooks/data/useNotificationPreferences";
import React from "react";
import {
  View,
  Text,
  ScrollView,
  Switch,
  ActivityIndicator,
} from "react-native";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { RADIUS } from "@/src/theme/radius";
import { Bell, Flame, Smile, CheckCircle2, Trophy } from "lucide-react-native";
import type { LucideIcon } from "lucide-react-native";

export default function NotificationPreferencesScreen() {
  const { settings, isLoading, updateSettings, isUpdating } =
    useNotificationPreferences();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={SEMANTIC_COLORS.brand.pressed} />
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
      className="flex-1 bg-background text-foreground"
      contentContainerClassName="pb-10"
    >
      <Text className="text-[30px] font-bold text-foreground px-5 mb-6 pt-4">
        Notification Preferences
      </Text>

      {/* Master toggle */}
      <SettingRow
        icon={Bell}
        title="Push Notifications"
        description="Receive personalized reminders to journal, track mood, and maintain streaks"
        value={settings.push_enabled}
        onToggle={(v) => toggleSetting("push_enabled", v)}
        disabled={isUpdating}
      />

      {settings.push_enabled && (
        <>
          <View className="h-px bg-border mx-5 mt-4" />
          
          <SectionHeader title="Notification Types" />

          <SettingRow
            icon={Flame}
            title="Streak Reminders"
            description="Get notified when your journal streak is at risk"
            value={settings.streak_reminders}
            onToggle={(v) => toggleSetting("streak_reminders", v)}
            disabled={isUpdating}
          />

          <SettingRow
            icon={Smile}
            title="Mood Check-ins"
            description="Daily reminders to log your mood"
            value={settings.mood_reminders}
            onToggle={(v) => toggleSetting("mood_reminders", v)}
            disabled={isUpdating}
          />

          <SettingRow
            icon={CheckCircle2}
            title="Habit Reminders"
            description="Reminders for your active habits"
            value={settings.habit_reminders}
            onToggle={(v) => toggleSetting("habit_reminders", v)}
            disabled={isUpdating}
          />

          <SettingRow
            icon={Trophy}
            title="Achievement Nudges"
            description="Get notified when you're close to unlocking an achievement"
            value={settings.achievement_reminders}
            onToggle={(v) => toggleSetting("achievement_reminders", v)}
            disabled={isUpdating}
          />

          <View className="h-px bg-border mx-5 mt-6 mb-4" />
          
          <Text className="text-[14px] text-foreground px-5 mb-1 font-medium">
            Quiet hours: {settings.quiet_hours_start}:00 -{" "}
            {settings.quiet_hours_end}:00
          </Text>
          <Text className="text-[13px] text-muted-foreground px-5 leading-snug">
            Max {settings.max_per_day} notification per day. We use AI to find
            the best time to send you notifications based on your usage
            patterns.
          </Text>
        </>
      )}
    </ScrollView>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <Text className="text-[15px] font-semibold text-foreground px-5 pt-6 pb-2">
      {title}
    </Text>
  );
}

function SettingRow({
  icon: Icon,
  title,
  description,
  value,
  onToggle,
  disabled,
}: {
  icon?: LucideIcon;
  title: string;
  description: string;
  value: boolean;
  onToggle: (value: boolean) => void;
  disabled: boolean;
}) {
  return (
    <View className="flex-row items-center px-5 py-3.5 gap-4">
      {Icon && <Icon size={24} color="var(--app-foreground)" strokeWidth={1.75} />}
      <View className="flex-1 gap-0.5">
        <Text className="text-[17px] text-foreground">{title}</Text>
        <Text className="text-[13px] text-muted-foreground leading-snug">
          {description}
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        disabled={disabled}
      />
    </View>
  );
}

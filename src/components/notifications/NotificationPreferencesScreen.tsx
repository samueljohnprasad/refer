import { useNotificationPreferences } from "@/src/hooks/data/useNotificationPreferences";
import React from "react";
import { View, Text, ScrollView, Switch, ActivityIndicator } from "react-native";

export default function NotificationPreferencesScreen() {
    const { settings, isLoading, updateSettings, isUpdating } =
        useNotificationPreferences();

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#7B61FF" />
            </View>
        );
    }

    const toggleSetting = (key: string, value: boolean) => {
        updateSettings({ [key]: value });
    };

    return (
        <ScrollView className="flex-1 bg-white px-5 pt-4">
            <Text className="text-2xl font-bold text-gray-900 mb-6">
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
                    <View className="h-px bg-gray-100 my-4" />
                    <Text className="text-lg font-semibold text-gray-800 mb-3">
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

                    <View className="h-px bg-gray-100 my-4" />
                    <Text className="text-sm text-gray-500 mb-2">
                        Quiet hours: {settings.quiet_hours_start}:00 -{" "}
                        {settings.quiet_hours_end}:00
                    </Text>
                    <Text className="text-sm text-gray-500 mb-8">
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
        <View className="flex-row items-center justify-between py-3">
            <View className="flex-1 mr-4">
                <Text className="text-base font-medium text-gray-900">{title}</Text>
                <Text className="text-sm text-gray-500 mt-0.5">{description}</Text>
            </View>
            <Switch
                value={value}
                onValueChange={onToggle}
                disabled={disabled}
                trackColor={{ false: "#E5E7EB", true: "#7B61FF" }}
                thumbColor="#FFFFFF"
            />
        </View>
    );
}

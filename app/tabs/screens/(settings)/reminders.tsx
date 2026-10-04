import React, { useEffect, useCallback } from "react";
import { View } from "react-native";
import { Stack, useRouter, useNavigation } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "@/src/components/tw";
import * as Haptics from "expo-haptics";
import useNotifications from "@/hooks/data/useNotifications";

import { GlassView } from "expo-glass-effect";

import NotificationsUI from "@/src/components/NotificationsUI";

/**
 * Reminders Screen
 * Saves notifications on ALL navigation methods: back button, swipe, device back
 */
const RemindersScreen = () => {
  const { t } = useTranslation("settings");
  const router = useRouter();
  const navigation = useNavigation();
  const { addNotifications } = useNotifications();

  const saveNotifications = useCallback(async () => {
    try {
      await addNotifications();
    } catch {}
  }, [addNotifications]);

  // Intercept ALL navigation attempts (back button, swipe, device back)
  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", async () => {
      // Save notifications before allowing navigation
      await saveNotifications();
    });

    return unsubscribe;
  }, [navigation, saveNotifications]);

  const handleBack = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Navigation listener will handle saving
    router.back();
  };

  return (
    <View className="flex-1 happy-brand-screen">
      <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
        <Stack.Screen
          options={{
            headerShown: true,
            headerTitle: t("reminders.title"),
            headerTransparent: true,
            headerBackButtonDisplayMode: "minimal",
            headerLeft: () => null,
            headerBackground: () => <GlassView glassEffectStyle="clear" style={{ flex: 1 }} />,
          }}
        />
        <Stack.Toolbar placement="left">
          <Stack.Toolbar.Button icon="chevron.left" onPress={handleBack} />
        </Stack.Toolbar>
        <View className="flex-1 w-full">
          <NotificationsUI />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default RemindersScreen;

import React, { useEffect, useCallback, lazy } from "react";
import { View, TouchableOpacity } from "react-native";
import { Stack, useRouter, useNavigation } from "expo-router";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/components/ui/Text";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import useNotifications from "@/hooks/data/useNotifications";

import { SAGE } from "@/lib/tokens";
import { GlassView } from "expo-glass-effect";

import NotificationsUI from "@/src/components/NotificationsUI";

/**
 * Reminders Screen
 * Saves notifications on ALL navigation methods: back button, swipe, device back
 */
const RemindersScreen = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const { addNotifications } = useNotifications();

  const saveNotifications = useCallback(async () => {
    try {
      await addNotifications();
    } catch (error) {}
  }, [addNotifications]);

  // Intercept ALL navigation attempts (back button, swipe, device back)
  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", async (e) => {
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
            headerTitle: "Daily Reminders",
            headerTransparent: true,
            headerBackButtonDisplayMode: "minimal",
            headerBackground: () => <GlassView glassEffectStyle="clear" style={{ flex: 1 }} />,
          }}
        />
        <View className="flex-1 w-full">
          <NotificationsUI />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default RemindersScreen;

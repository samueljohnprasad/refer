import React, { useEffect, useCallback, lazy } from "react";
import { View, TouchableOpacity } from "react-native";
import { Stack, useRouter, useNavigation } from "expo-router";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import useNotifications from "@/hooks/data/useNotifications";
import SuspensLoader from "@/src/components/SuspensLoader";
import { SAGE } from "@/lib/tokens";
const NotificationsUI = lazy(() => import("@/src/components/NotificationsUI"));

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
            headerTransparent: true,
            headerBlurEffect: "regular",
            header: () => (
              <BlurView
                intensity={50}
                tint="light"
                className="flex-row items-end justify-between px-4 pb-4 pt-[60px]"
              >
                <TouchableOpacity
                  className="h-11 w-11 items-center justify-center rounded-full bg-sage-pill"
                  activeOpacity={0.7}
                  onPress={handleBack}
                >
                  <Ionicons name="arrow-back" size={21} color={SAGE[600]} />
                </TouchableOpacity>

                <Text className="happy-font-heading-bold text-[30px] text-ink">
                  Daily Reminders
                </Text>

                <View className="w-11" />
              </BlurView>
            ),
          }}
        />
        <SuspensLoader>
          <View className="flex-1 w-full pt-24">
            <NotificationsUI />
          </View>
        </SuspensLoader>
      </SafeAreaView>
    </View>
  );
};

export default RemindersScreen;

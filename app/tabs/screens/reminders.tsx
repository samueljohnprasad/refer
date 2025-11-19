import React, { useEffect, useCallback, lazy } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Stack, useRouter, useNavigation } from "expo-router";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import useNotifications from "@/hooks/data/useNotifications";
import SuspensLoader from "@/src/components/SuspensLoader";
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
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTransparent: true,
          headerBlurEffect: "regular",
          header: () => (
            <BlurView intensity={50} tint="light" style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                activeOpacity={0.7}
                onPress={handleBack}
              >
                <Ionicons name="arrow-back" size={20} color="#FFF" />
              </TouchableOpacity>

              <Text style={styles.headerTitle}>Daily Reminders</Text>

              <View style={styles.placeholder} />
            </BlurView>
          ),
        }}
      />
      <SuspensLoader>
        <NotificationsUI />
      </SuspensLoader>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8FF",
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 60,
    backgroundColor: "transparent",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#7C5CFF",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
  },
  placeholder: {
    width: 40,
  },
});

export default RemindersScreen;

import React from "react";
import { ScrollView, Text, View } from "react-native";
import { Stack } from "expo-router";

import { AnimatedSymbolsDemo } from "@/src/screens/SettingsScreen/components/AnimatedSymbolsDemo";

export default function AnimatedSymbolsScreen() {
  return (
    <ScrollView
      className="flex-1 bg-offwhite"
      contentContainerStyle={{ padding: 20, paddingBottom: 48 }}
      showsVerticalScrollIndicator={false}
    >
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Animated Symbols",
          freezeOnBlur: true,
          animation: "slide_from_right",
          headerBackButtonDisplayMode: "minimal",
        }}
      />

      <View className="mb-5 gap-2">
        <Text className="happy-font-heading-bold text-[30px] text-ink">
          Animated Symbols
        </Text>
        <Text className="happy-font-body-medium text-[15px] leading-6 text-ink-muted">
          Tap an icon to replay its native SF Symbol effect.
        </Text>
      </View>

      <View className="rounded-[28px] border border-border/60 bg-background p-5 shadow-sm">
        <AnimatedSymbolsDemo />
      </View>
    </ScrollView>
  );
}

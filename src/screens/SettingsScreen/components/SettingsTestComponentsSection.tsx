import React from "react";
import { View } from "react-native";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useToast } from "heroui-native";
import {
  Notification01Icon,
  StarIcon,
} from "@hugeicons/core-free-icons";

import { AnimatedSymbolsDemo } from "./AnimatedSymbolsDemo";
import { SettingsSection } from "./SettingsSection";
import { SettingsItem } from "./SettingsItem";

export function SettingsTestComponentsSection() {
  const router = useRouter();
  const { toast } = useToast();

  return (
    <SettingsSection title="Test Components">
      <View className="mb-4 rounded-[28px] border border-sage-100 bg-white px-4 py-5 shadow-sm">
        <AnimatedSymbolsDemo />
      </View>
      <SettingsItem
        icon={StarIcon}
        title="Test Graph Components"
        subtitle="View mock graph and UI components"
        onPress={() => {
          Haptics.selectionAsync();
          router.push("/tabs/screens/test-charts" as any);
        }}
      />
      <SettingsItem
        icon={StarIcon}
        title="Animated Symbols"
        subtitle="Show native SF Symbol effects"
        onPress={() => {
          Haptics.selectionAsync();
          router.push("/tabs/screens/animated-symbols" as any);
        }}
      />
      <SettingsItem
        icon={Notification01Icon}
        title="Test Toast Notifications"
        subtitle="Trigger a sample toast"
        onPress={() => {
          Haptics.selectionAsync();
          toast.show({
            variant: "success",
            label: "Toast is working!",
            description:
              "If you see this, the toast provider is correctly configured.",
          });
        }}
        showArrow={false}
      />
    </SettingsSection>
  );
}

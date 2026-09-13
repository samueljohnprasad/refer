import React from "react";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import {
  Brain01Icon,
  Download02Icon,
  AlertSquareIcon,
} from "@hugeicons/core-free-icons";
import { SettingsSection } from "./SettingsSection";
import { SettingsItem } from "./SettingsItem";
import { SettingsTestComponentsSection } from "./SettingsTestComponentsSection";

interface SettingsDevSectionProps {
  onBulkImportPress: () => void;
}

export const SettingsDevSection: React.FC<SettingsDevSectionProps> = ({
  onBulkImportPress,
}) => {
  const router = useRouter();
  if (!__DEV__) return null;

  return (
    <SettingsSection title="Developer">
      <SettingsItem
        icon={Brain01Icon}
        title="Apple Intelligence"
        subtitle="On-device AI · Private & secure"
        onPress={() => {
          Haptics.selectionAsync();
          router.push("/tabs/screens/apple-intelligence");
        }}
      />
      <SettingsItem
        icon={Download02Icon}
        title="Bulk Import Journals"
        subtitle="Import sample data"
        onPress={onBulkImportPress}
        showArrow={false}
      />
      <SettingsItem
        icon={AlertSquareIcon}
        title="Active AI Model"
        subtitle="Configure local LLM"
        onPress={() => {
          Haptics.selectionAsync();
          router.push("/tabs/screens/active-model" as any);
        }}
      />
      <SettingsTestComponentsSection />
    </SettingsSection>
  );
};

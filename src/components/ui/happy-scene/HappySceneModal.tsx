import React from "react";
import { Modal, Pressable, View } from "react-native";
import { SymbolView } from "expo-symbols";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { HappyScene } from "./HappyScene";
import { SAGE } from "@/src/theme/palette";

export function HappySceneModal({ onClose }: { onClose: () => void }): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation("journeys");
  return (
    <Modal visible animationType="fade" presentationStyle="fullScreen" onRequestClose={onClose}>
      <View className="flex-1 bg-sage-50">
        <HappyScene />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t("close")}
          onPress={onClose}
          className="absolute right-4 h-12 w-12 items-center justify-center rounded-full bg-white active:opacity-60"
          style={{ top: insets.top + 8 }}
        >
          <SymbolView name="xmark" size={20} tintColor={SAGE[700]} />
        </Pressable>
      </View>
    </Modal>
  );
}

// ponytail: dedicated language selection screen with native stack toolbar
import React, { useCallback, useState } from "react";
import { View, Alert } from "react-native";
import { Stack, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "@/src/components/tw";

import { useLanguage } from "@/src/hooks/useLanguage";
import { LanguagePicker } from "@/src/components/settings/LanguagePicker";
import type { SupportedLanguage } from "@/src/lib/i18n";
import { SEMANTIC_COLORS } from "@/src/theme/colors";

export default function LanguageScreen() {
  const router = useRouter();
  const { t } = useTranslation("settings");
  const { currentLanguage, isCustomLanguage, setLanguage, resetToDeviceLanguage } = useLanguage();
  const [switchingLang, setSwitchingLang] = useState<string | null>(null);

  const handleSelectLanguage = useCallback(
    async (lang: SupportedLanguage): Promise<void> => {
      if (switchingLang) return;
      setSwitchingLang(lang);
      try {
        const wasRTL = currentLanguage === "ar";
        const willBeRTL = lang === "ar";
        await setLanguage(lang);
        if (wasRTL !== willBeRTL) {
          Alert.alert(
            t("language.restartPromptTitle"),
            t("language.restartPromptMessage"),
            [{ text: "OK" }],
          );
        }
      } finally {
        setSwitchingLang(null);
      }
    },
    [currentLanguage, setLanguage, switchingLang, t],
  );

  const handleResetLanguage = useCallback(async (): Promise<void> => {
    if (switchingLang) return;
    setSwitchingLang("device");
    try {
      const wasRTL = currentLanguage === "ar";
      await resetToDeviceLanguage();
      if (wasRTL) {
        Alert.alert(
          t("language.restartPromptTitle"),
          t("language.restartPromptMessage"),
          [{ text: "OK" }],
        );
      }
    } finally {
      setSwitchingLang(null);
    }
  }, [currentLanguage, resetToDeviceLanguage, switchingLang, t]);

  const textColor = String(SEMANTIC_COLORS.text.primary ?? "#243323");

  return (
    <View className="flex-1 bg-brand-canvas px-4 pt-2">
      <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
        <Stack.Screen
          options={{
            title: t("language.title") || "Language",
            headerShown: true,
            headerTransparent: false,
            headerShadowVisible: false,
            headerStyle: {
              backgroundColor: String(SEMANTIC_COLORS.surface.canvas),
            },
            headerTintColor: textColor,
            headerTitleStyle: {
              fontSize: 20,
              fontWeight: "700",
              color: textColor,
            },
            headerTitleAlign: "center",
            headerLeft: () => null,
          }}
        />
        <Stack.Toolbar placement="left">
          <Stack.Toolbar.Button icon="chevron.left" onPress={() => router.back()} />
        </Stack.Toolbar>
        <LanguagePicker
          currentLanguage={currentLanguage}
          isCustomLanguage={isCustomLanguage}
          switchingLang={switchingLang}
          onSelectLanguage={handleSelectLanguage}
          onReset={handleResetLanguage}
        />
      </SafeAreaView>
    </View>
  );
}

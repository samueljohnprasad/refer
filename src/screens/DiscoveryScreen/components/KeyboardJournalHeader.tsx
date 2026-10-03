import React from "react";
import { View } from "react-native";
import { Host, DatePicker, Button as SUIButton, Toggle, Menu, Text as SUIText } from "@expo/ui/swift-ui";
import { datePickerStyle, labelStyle, buttonStyle, controlSize, tint } from "@expo/ui/swift-ui/modifiers";
import { useTranslation } from "react-i18next";
import { SEMANTIC_COLORS } from "@/src/theme/colors";

interface KeyboardJournalHeaderProps {
  topInset: number;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  isAIInsightsEnabled: boolean;
  onAIInsightsChange: (enabled: boolean) => void;
  onClose: () => void;
}

export function KeyboardJournalHeader({
  topInset,
  selectedDate,
  onDateChange,
  isAIInsightsEnabled,
  onAIInsightsChange,
  onClose,
}: KeyboardJournalHeaderProps): React.JSX.Element {
  const { t } = useTranslation("journal");

  return (
    <View className="flex-row justify-between items-center px-4 pb-2" style={{ paddingTop: Math.max(topInset + 4, 16) }}>
      <Host matchContents style={{ width: 44, height: 44, justifyContent: "center", alignItems: "center" }}>
        <SUIButton label={t("capture.keyboard.cancel")} systemImage="xmark" onPress={onClose} modifiers={[labelStyle("iconOnly"), buttonStyle("glass"), controlSize("large"), tint(SEMANTIC_COLORS.text.primary)]} />
      </Host>

      <Host matchContents style={{ height: 40, width: 140, justifyContent: "center", alignItems: "center" }}>
        <DatePicker selection={selectedDate} onDateChange={onDateChange} displayedComponents={["date"]} modifiers={[datePickerStyle("compact"), tint(SEMANTIC_COLORS.text.primary)]} />
      </Host>

      <Host matchContents style={{ width: 44, height: 44, justifyContent: "center", alignItems: "center" }}>
        <Menu label={t("capture.keyboard.options")} systemImage="ellipsis" modifiers={[labelStyle("iconOnly"), buttonStyle("glass"), controlSize("large"), tint(SEMANTIC_COLORS.text.primary)]}>
          <Toggle isOn={isAIInsightsEnabled} onIsOnChange={onAIInsightsChange}>
            <SUIText>{t("capture.keyboard.aiInsights")}</SUIText>
            <SUIText>{t("capture.keyboard.generateAnalysis")}</SUIText>
          </Toggle>
        </Menu>
      </Host>
    </View>
  );
}

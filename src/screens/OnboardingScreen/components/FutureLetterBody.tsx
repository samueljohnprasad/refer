import React from "react";
import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { APP_FONT_FAMILIES } from "@/src/theme/typography";

interface FutureLetterBodyProps {
  weekday: string;
  moment: string;
}

export function FutureLetterBody({ weekday, moment }: FutureLetterBodyProps) {
  const { t } = useTranslation("onboarding");

  return (
    <View style={{ marginTop: 10 }}>
      <Text style={{ fontFamily: APP_FONT_FAMILIES.regular, fontSize: 16, lineHeight: 24, color: "#243324" }}>
        {t("future_letter_screen.body.intro", { weekday, moment })}{" "}
        <Text style={{ color: "#3A5636", fontFamily: APP_FONT_FAMILIES.semiBold }}>{t("future_letter_screen.body.closed_app")}</Text>{" "}
        {t("future_letter_screen.body.just_like_you")}
      </Text>
      <Text style={{ marginTop: 10, fontFamily: APP_FONT_FAMILIES.regular, fontSize: 16, lineHeight: 24, color: "#243324" }}>
        {t("future_letter_screen.body.honesty")}
      </Text>
      <Text style={{ marginTop: 10, fontFamily: APP_FONT_FAMILIES.regular, fontSize: 16, lineHeight: 24, color: "#243324" }}>
        {t("future_letter_screen.body.caught_it")}{" "}
        <Text style={{ color: "#3A5636", fontFamily: APP_FONT_FAMILIES.semiBold }}>{t("future_letter_screen.body.didnt_grow")}</Text>
      </Text>
      <Text style={{ marginTop: 10, fontFamily: APP_FONT_FAMILIES.regular, fontSize: 16, lineHeight: 24, color: "#243324" }}>
        {t("future_letter_screen.body.thirty_days_ago")}
      </Text>
      <Text style={{ marginTop: 10, fontFamily: APP_FONT_FAMILIES.regular, fontSize: 16, lineHeight: 24, color: "#243324" }}>
        {t("future_letter_screen.body.showed_up")}
      </Text>
      <Text style={{ marginTop: 10, fontFamily: APP_FONT_FAMILIES.regular, fontSize: 16, lineHeight: 24, color: "#243324" }}>
        {t("future_letter_screen.body.keep_going")}{" "}
        <Text style={{ color: "#3A5636", fontFamily: APP_FONT_FAMILIES.semiBold }}>{t("future_letter_screen.body.changed")}</Text>
      </Text>
    </View>
  );
}

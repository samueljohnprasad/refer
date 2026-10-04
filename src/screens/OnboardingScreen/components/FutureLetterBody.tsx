import React from "react";
import { Text, View } from "react-native";
import { APP_FONT_FAMILIES } from "@/src/theme/typography";

interface FutureLetterBodyProps {
  weekday: string;
  moment: string;
}

export function FutureLetterBody({ weekday, moment }: FutureLetterBodyProps) {
  return (
    <View style={{ marginTop: 10 }}>
      <Text style={{ fontFamily: APP_FONT_FAMILIES.regular, fontSize: 16, lineHeight: 24, color: "#243324" }}>
        I&apos;m writing from a {weekday} {moment}. I closed Happy{" "}
        <Text style={{ color: "#3A5636", fontFamily: APP_FONT_FAMILIES.semiBold }}>five minutes ago.</Text>{" "}
        Just like you will, in a moment.
      </Text>
      <Text style={{ marginTop: 10, fontFamily: APP_FONT_FAMILIES.regular, fontSize: 16, lineHeight: 24, color: "#243324" }}>
        I won&apos;t lie to you. The noise didn&apos;t stop. Some mornings the thoughts still race. Some evenings the weight is still there.
      </Text>
      <Text style={{ marginTop: 10, fontFamily: APP_FONT_FAMILIES.regular, fontSize: 16, lineHeight: 24, color: "#243324" }}>
        But yesterday, when the spiral started, I caught it. I named it. I sat with it for thirty seconds.{" "}
        <Text style={{ color: "#3A5636", fontFamily: APP_FONT_FAMILIES.semiBold }}>And it didn&apos;t get bigger.</Text>
      </Text>
      <Text style={{ marginTop: 10, fontFamily: APP_FONT_FAMILIES.regular, fontSize: 16, lineHeight: 24, color: "#243324" }}>
        Thirty days ago, that wasn&apos;t possible.
      </Text>
      <Text style={{ marginTop: 10, fontFamily: APP_FONT_FAMILIES.regular, fontSize: 16, lineHeight: 24, color: "#243324" }}>
        You showed up today. Five minutes. Just like you said you would, in that pact you signed.
      </Text>
      <Text style={{ marginTop: 10, fontFamily: APP_FONT_FAMILIES.regular, fontSize: 16, lineHeight: 24, color: "#243324" }}>
        Keep going.{" "}
        <Text style={{ color: "#3A5636", fontFamily: APP_FONT_FAMILIES.semiBold }}>We&apos;re not the same person anymore.</Text>
      </Text>
    </View>
  );
}

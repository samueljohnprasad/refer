import React from "react";
import { View, Text } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SymbolView } from "expo-symbols";
import { APP_FONT_FAMILIES } from "@/src/theme/typography";

interface NotificationPreviewCardProps {
  title: string;
  body: string;
  timeLabel?: string;
}

// ponytail: lightweight iOS push notification preview mockup grounded in stoic/Duolingo pattern
export const NotificationPreviewCard: React.FC<NotificationPreviewCardProps> = React.memo(
  ({ title, body, timeLabel = "now" }) => {
    return (
      <Animated.View
        entering={FadeInDown.duration(240)}
        style={{ borderCurve: "continuous" }}
        className="w-full rounded-2xl border border-sage-200/80 bg-warm-white p-3.5 shadow-sm"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-1.5">
            <View className="h-5 w-5 items-center justify-center rounded-[5px] bg-sage-600">
              <SymbolView
                name="leaf.fill"
                size={11}
                tintColor="#FFFFFF"
                type="hierarchical"
              />
            </View>
            <Text
              style={{ fontFamily: APP_FONT_FAMILIES.bold }}
              className="text-[11px] font-bold uppercase tracking-wider text-ink-soft/80"
            >
              Happy
            </Text>
          </View>
          <Text
            style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}
            className="text-[11px] text-ink-soft/60"
          >
            {timeLabel}
          </Text>
        </View>

        <View className="mt-2">
          <Text
            style={{ fontFamily: APP_FONT_FAMILIES.bold }}
            className="text-[14px] font-bold text-ink"
          >
            {title}
          </Text>
          <Text
            style={{ fontFamily: APP_FONT_FAMILIES.regular }}
            className="mt-0.5 text-[13px] leading-snug text-ink-soft"
          >
            {body}
          </Text>
        </View>
      </Animated.View>
    );
  }
);

NotificationPreviewCard.displayName = "NotificationPreviewCard";

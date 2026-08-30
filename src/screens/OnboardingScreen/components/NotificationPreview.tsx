import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import React from "react";
import { Text, View } from "react-native";

interface NotificationPreviewProps {
  time: string;
}

const NotificationPreview: React.FC<NotificationPreviewProps> = ({ time }) => {
  return (
    <View className="flex-row items-start gap-2.5 rounded-[14px] border border-sage-100 bg-white/90 px-3.5 py-3">
      <View className="h-8 w-8 items-center justify-center rounded-lg bg-sage-500">
        <Text
          style={{ fontFamily: APP_FONT_FAMILIES.extraBold }}
          className="text-sm text-white"
        >
          H
        </Text>
      </View>
      <View className="flex-1">
        <Text
          style={{ fontFamily: APP_FONT_FAMILIES.bold }}
          className="text-[13px] font-bold text-ink"
        >
          Happy
        </Text>
        <Text
          style={{ fontFamily: APP_FONT_FAMILIES.regular }}
          className="text-xs leading-[1.3] text-ink-soft"
        >
          Hey friend. 5 quiet minutes? Your lesson is ready.
        </Text>
      </View>
      <Text
        style={{ fontFamily: APP_FONT_FAMILIES.regular }}
        className="text-[11px] text-ink-muted"
      >
        {time}
      </Text>
    </View>
  );
};

export default React.memo(NotificationPreview);

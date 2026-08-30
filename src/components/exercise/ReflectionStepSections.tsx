import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import React from "react";
import { Pressable, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { Text } from "@/src/components/ui/Text";
import { BRAND_BORDER, INK, SAGE } from "@/lib/tokens";
import { triggerSelectionHaptic } from "@/src/components/exercise/selectionHaptics";

export function ReflectionContextBlock({
  label,
  text,
  variant = "plain",
}: {
  label: string;
  text: string;
  variant?: "plain" | "quote";
}) {
  if (!text.trim()) return null;

  if (variant === "quote") {
    return (
      <View className="mb-7 py-2">
        <Text
          variant="caption"
          className="mb-2 text-[11px] uppercase tracking-widest text-sage-500"
        >
          {label}
        </Text>
        <Text
          className="text-[17px] leading-[25px] text-ink"
          style={{ fontFamily: APP_FONT_FAMILIES.semiBoldItalic }}
        >
          "{text.trim()}"
        </Text>
      </View>
    );
  }

  return (
    <View
      className="mb-5 border-l-2 pl-3"
      style={{ borderColor: BRAND_BORDER }}
    >
      <Text variant="caption" className="mb-1 text-[12px] text-sage-700">
        {label}
      </Text>
      <Text variant="body" className="text-[14px] leading-[20px] text-ink">
        {text.trim()}
      </Text>
    </View>
  );
}

export function ReflectionDisclosure({
  expanded,
  onToggle,
  title = "Need an example?",
  children,
}: {
  expanded: boolean;
  onToggle: () => void;
  title?: string;
  children?: React.ReactNode;
}) {
  return (
    <View className="mt-3">
      <Pressable
        onPress={() => {
          triggerSelectionHaptic();
          onToggle();
        }}
        accessibilityRole="button"
        accessibilityLabel={expanded ? "Hide examples" : "Show optional examples"}
        accessibilityState={{ expanded }}
        className="mb-2 flex-row items-center justify-between border-t border-sage-100/70 py-3 active:opacity-70"
      >
        <Text variant="label-bold" className="text-[14px] text-sage-700">
          {expanded ? "Hide examples" : title}
        </Text>
        <Feather
          name={expanded ? "chevron-up" : "chevron-down"}
          size={18}
          color={SAGE[600]}
        />
      </Pressable>

      {expanded ? <View>{children}</View> : null}
    </View>
  );
}

export function ReflectionExampleRow({
  title,
  body,
  icon,
  iconColor,
}: {
  title: string;
  body: string;
  icon: React.ComponentProps<typeof Feather>["name"];
  iconColor: string;
}) {
  return (
    <View className="flex-row items-start border-b border-brand-border py-3">
      <View className="mr-3 mt-0.5">
        <Feather name={icon} size={18} color={iconColor} />
      </View>
      <View className="flex-1">
        <Text variant="label-bold" className="text-[14px] text-ink">
          {title}
        </Text>
        <Text
          variant="caption"
          className="mt-0.5 text-[14px] leading-[20px] text-ink-soft"
        >
          {body}
        </Text>
      </View>
    </View>
  );
}

export function ReflectionHint({
  text,
}: {
  text: string;
}) {
  return (
    <View className="mt-4 border-l-2 py-1 pl-3" style={{ borderColor: SAGE[300] }}>
      <Text variant="caption" className="text-sage-800">
        {text}
      </Text>
    </View>
  );
}

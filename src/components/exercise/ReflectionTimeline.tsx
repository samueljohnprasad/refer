import React from "react";
import { View } from "react-native";

import { Text } from "@/src/components/ui/Text";
import { INK, INK_SOFT, SAGE } from "@/lib/tokens";

interface ReflectionTimelineProps {
  children: React.ReactNode;
}

interface ReflectionTimelineItemProps {
  label: string;
  children: React.ReactNode;
  isLast?: boolean;
}

interface ReflectionBulletListProps {
  items: readonly string[];
  accentColor?: string;
  textColor?: string;
}

interface ReflectionScoreShiftProps {
  before: number;
  after: number;
  label: string;
  detail?: string;
  accentColor?: string;
}

export function ReflectionTimeline({ children }: ReflectionTimelineProps) {
  return (
    <View className="relative ml-2">
      <View
        pointerEvents="none"
        className="absolute bottom-[7px] left-[7px] top-[7px] w-px"
        style={{ backgroundColor: SAGE[100] }}
      />
      {children}
    </View>
  );
}

export function ReflectionTimelineItem({
  label,
  children,
  isLast = false,
}: ReflectionTimelineItemProps) {
  return (
    <View className={`relative pl-8 ${isLast ? "" : "pb-6"}`}>
      <View
        pointerEvents="none"
        className="absolute left-0 top-1 h-[15px] w-[15px] rounded-full border bg-white"
        style={{ borderColor: SAGE[200] }}
      />
      <Text
        style={{ fontFamily: "GeistMedium", color: INK_SOFT }}
        className="mb-1.5 text-[13px] leading-[18px]"
      >
        {label}
      </Text>
      {children}
    </View>
  );
}

export function ReflectionBulletList({
  items,
  accentColor = SAGE[600],
  textColor = INK_SOFT,
}: ReflectionBulletListProps) {
  return (
    <View className="gap-2.5">
      {items.map((item, index) => (
        <View key={`${index}-${item}`} className="flex-row items-start">
          <View
            className="mr-2.5 mt-[9px] h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: accentColor }}
          />
          <Text
            style={{ fontFamily: "GeistRegular", color: textColor }}
            className="flex-1 text-[15px] leading-[22px]"
          >
            {item}
          </Text>
        </View>
      ))}
    </View>
  );
}

export function ReflectionScoreShift({
  before,
  after,
  label,
  detail,
  accentColor = SAGE[700],
}: ReflectionScoreShiftProps) {
  return (
    <View>
      <View className="flex-row items-center">
        <View className="min-w-[48px] items-center">
          <Text
            style={{ fontFamily: "CormorantSemiBold", color: INK }}
            className="text-[32px] leading-[32px]"
          >
            {before}
          </Text>
          <Text
            style={{ fontFamily: "GeistMedium", color: INK_SOFT }}
            className="mt-1 text-[11px] leading-[15px]"
          >
            before /10
          </Text>
        </View>

        <View
          className="mx-3 h-px w-8"
          style={{ backgroundColor: SAGE[100] }}
        />

        <View className="min-w-[48px] items-center">
          <Text
            style={{ fontFamily: "CormorantSemiBold", color: accentColor }}
            className="text-[32px] leading-[32px]"
          >
            {after}
          </Text>
          <Text
            style={{ fontFamily: "GeistMedium", color: accentColor }}
            className="mt-1 text-[11px] leading-[15px]"
          >
            after /10
          </Text>
        </View>

        <Text
          style={{ fontFamily: "GeistSemiBold", color: accentColor }}
          className="ml-4 flex-1 text-[14px] leading-[20px]"
        >
          {label}
        </Text>
      </View>

      {detail ? (
        <Text
          style={{ fontFamily: "GeistRegular", color: INK_SOFT }}
          className="mt-3 text-[14px] leading-[20px]"
        >
          {detail}
        </Text>
      ) : null}
    </View>
  );
}

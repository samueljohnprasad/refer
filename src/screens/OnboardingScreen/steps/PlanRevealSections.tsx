import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import React from "react";
import { Image, Text, View } from "react-native";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { getCourseImageSource } from "@/src/domains/journey/model/courseVisuals";

export interface Milestone {
  title: string;
  subtitle: string;
}

interface MilestoneRowProps {
  index: number;
  milestone: Milestone;
  statusLabel: string;
  isFirst: boolean;
}

export const MilestoneRow: React.FC<MilestoneRowProps> = ({
  index,
  milestone,
  statusLabel,
  isFirst,
}) => (
  <View
    className="flex-row items-start gap-3 py-3.5"
  >
    <View
      className={`mt-0.5 h-9 w-9 flex-none items-center justify-center rounded-full ${
        isFirst ? "bg-sage-600" : "border border-sage-200 bg-white"
      }`}
    >
      <Text
        style={{ fontFamily: APP_FONT_FAMILIES.bold }}
        className={`text-[15px] ${isFirst ? "text-white" : "text-sage-600"}`}
      >
        {index + 1}
      </Text>
    </View>

    <View className="flex-1 pt-0.5">
      <View className="flex-row items-start gap-2">
        <Text
          style={{ fontFamily: APP_FONT_FAMILIES.bold }}
          className="flex-1 text-[16px] leading-[21px] text-ink"
        >
          {milestone.title}
        </Text>
        <Text
          style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}
          className={`mt-0.5 max-w-[92px] flex-none text-right text-[11px] leading-4 ${
            isFirst ? "text-sage-600" : "text-ink-soft"
          }`}
        >
          {statusLabel}
        </Text>
      </View>
      <Text
        style={{ fontFamily: APP_FONT_FAMILIES.regular }}
        className="mt-1 text-[13px] leading-[18px] text-ink-soft"
      >
        {milestone.subtitle}
      </Text>
    </View>
  </View>
);

interface CourseHeroProps {
  title: string;
  description: string;
  mascotArt: ReturnType<typeof getCourseImageSource>;
  paceLabel: string;
  milestonesLabel: string;
  selfPacedLabel: string;
  illustrationLabel: string;
}

interface HeroMetaItem {
  label: string;
  icon: SymbolViewProps["name"];
}

export const CourseHero: React.FC<CourseHeroProps> = ({
  title,
  description,
  mascotArt,
  paceLabel,
  milestonesLabel,
  selfPacedLabel,
  illustrationLabel,
}) => (
  <View className="mt-2 overflow-hidden rounded-[20px] bg-sage-700 px-5 pb-5 pt-5">
    <View className="flex-row items-start">
      <View className="flex-1 pr-2">
        <Text
          style={{ fontFamily: APP_FONT_FAMILIES.extraBold }}
          className="text-[28px] leading-[32px] text-white"
        >
          {title}
        </Text>
        <Text
          style={{ fontFamily: APP_FONT_FAMILIES.regular }}
          className="mt-3 text-[16px] leading-[23px] text-sage-50"
        >
          {description}
        </Text>
      </View>

      {mascotArt && (
        <Image
          source={mascotArt}
          className="-mr-1 -mt-1 h-[104px] w-[104px]"
          resizeMode="contain"
          accessibilityLabel={illustrationLabel}
        />
      )}
    </View>

    <View className="mt-5 flex-row flex-wrap items-center border-t border-white/15 pt-4">
      {[
        { label: paceLabel, icon: "clock" },
        { label: milestonesLabel, icon: "leaf.fill" },
        { label: selfPacedLabel, icon: "play.fill" },
      ].map(({ label, icon }, index) => (
        <View key={`${label}-${index}`} className="mb-1 mr-3 flex-row items-center">
          <SymbolView
            name={icon as HeroMetaItem["icon"]}
            size={14}
            tintColor="#D3E0CD"
            weight="medium"
            style={{ width: 16, height: 16, marginRight: 5 }}
          />
          <Text
            style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}
            className="text-[12px] leading-5 text-sage-100"
          >
            {label}
          </Text>
          {index < 2 && (
            <View className="ml-3 h-1 w-1 rounded-full bg-sage-300" />
          )}
        </View>
      ))}
    </View>
  </View>
);

interface TailoredInsightProps {
  label: string;
  body: string;
}

export const TailoredInsight: React.FC<TailoredInsightProps> = ({
  label,
  body,
}) => (
  <View className="mt-3 flex-row py-2">
    <View className="mr-3 w-5 flex-none items-center pt-0.5">
      <SymbolView
        name="person.fill"
        size={18}
        tintColor="#587C51"
        weight="medium"
      />
    </View>
    <View className="flex-1">
      <Text
        style={{ fontFamily: APP_FONT_FAMILIES.bold }}
        className="text-[15px] leading-5 text-sage-800"
      >
        {label}
      </Text>
      <Text
        style={{ fontFamily: APP_FONT_FAMILIES.regular }}
        className="mt-1 text-[16px] leading-[23px] text-ink-soft"
      >
        {body}
      </Text>
    </View>
  </View>
);

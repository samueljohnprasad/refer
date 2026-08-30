import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import React from "react";
import { View } from "react-native";

import {
  ReflectionBulletList,
  ReflectionScoreShift,
  ReflectionTimeline,
  ReflectionTimelineItem,
} from "@/src/components/exercise/ReflectionTimeline";
import { Mascot, type MascotState } from "@/src/components/ui/Mascot";
import { Text } from "@/src/components/ui/Text";
import { INK, INK_SOFT, SAGE } from "@/lib/tokens";

export type RecapSection = {
  label: string;
  value: string | string[];
  tone?: "default" | "serif" | "muted";
};

interface ThoughtRecordRecapProps {
  title: string;
  subtitle: string;
  mascotState?: MascotState;
  showMascot?: boolean;
  highlightLabel?: string;
  highlightText?: string;
  highlightAction?: React.ReactNode;
  situation?: string;
  automaticThought?: string;
  preScore?: number;
  postScore?: number;
  scoreLabel?: string;
  scoreDetail?: string;
  realityCheckLabel?: string;
  balancedThought?: string;
  sections?: readonly RecapSection[];
  afterTimeline?: React.ReactNode;
}

function ScoreSnapshot({
  score,
}: {
  score: number;
}) {
  return (
    <View className="flex-row items-end">
      <Text
        style={{ fontFamily: APP_FONT_FAMILIES.semiBold, color: INK }}
        className="text-[34px] leading-[34px]"
      >
        {score}
      </Text>
      <Text
        style={{ fontFamily: APP_FONT_FAMILIES.semiBold, color: INK_SOFT }}
        className="ml-2 text-[12px] leading-[18px]"
      >
        /10
      </Text>
    </View>
  );
}

function RealityPill({
  label,
}: {
  label: string;
}) {
  return (
    <View
      className="self-start rounded-full px-3.5 py-2"
      style={{ backgroundColor: SAGE[50] }}
    >
      <Text
        style={{ fontFamily: APP_FONT_FAMILIES.semiBold, color: SAGE[700] }}
        className="text-[13px] leading-[18px]"
      >
        {label}
      </Text>
    </View>
  );
}

function RecapSectionContent({
  section,
}: {
  section: RecapSection;
}) {
  const items = Array.isArray(section.value)
    ? section.value.filter((item) => item.trim())
    : [];

  if (items.length > 0) {
    return (
      <ReflectionBulletList
        items={items}
        textColor={section.tone === "muted" ? INK_SOFT : INK}
      />
    );
  }

  if (typeof section.value !== "string" || !section.value.trim()) {
    return null;
  }

  const style =
    section.tone === "serif"
      ? { fontFamily: APP_FONT_FAMILIES.semiBold, color: INK }
      : { fontFamily: APP_FONT_FAMILIES.regular, color: section.tone === "muted" ? INK_SOFT : INK };
  const className =
    section.tone === "serif"
      ? "text-[22px] leading-[30px]"
      : "text-[16px] leading-[24px]";

  return (
    <Text style={style} className={className}>
      {section.value.trim()}
    </Text>
  );
}

export const ThoughtRecordRecap: React.FC<ThoughtRecordRecapProps> = React.memo(
  ({
    title,
    subtitle,
    mascotState = "panda-happy",
    showMascot = true,
    highlightLabel,
    highlightText,
    highlightAction,
    situation,
    automaticThought,
    preScore,
    postScore,
    scoreLabel = "Belief intensity",
    scoreDetail,
    realityCheckLabel,
    balancedThought,
    sections,
    afterTimeline,
  }) => {
    const hasSituation = Boolean(situation?.trim());
    const hasAutomaticThought = Boolean(automaticThought?.trim());
    const hasScore = typeof preScore === "number";
    const hasShift = hasScore && typeof postScore === "number";
    const hasReality = Boolean(realityCheckLabel);
    const hasBalancedThought = Boolean(balancedThought?.trim());
    const recordSections = (sections ?? []).filter((section) =>
      Array.isArray(section.value)
        ? section.value.some((item) => item.trim())
        : section.value.trim(),
    );
    const hasThoughtRecordTimeline =
      recordSections.length === 0 &&
      (hasSituation ||
        hasAutomaticThought ||
        hasScore ||
        hasReality ||
        hasBalancedThought);
    const hasTimeline = recordSections.length > 0 || hasThoughtRecordTimeline;

    return (
      <View className="flex-1 px-3" style={{ paddingBottom: 40 }}>
        <View className="items-center pb-6 pt-2">
          {showMascot ? <Mascot state={mascotState} size={72} /> : null}
          <Text
            style={{ fontFamily: APP_FONT_FAMILIES.semiBold, color: INK }}
            className={`${showMascot ? "mt-3" : ""} text-center text-[34px] leading-[37px] tracking-[-0.01em]`}
          >
            {title}
          </Text>
          <Text
            style={{ fontFamily: APP_FONT_FAMILIES.regular, color: INK_SOFT }}
            className="mt-2 text-center text-[15px] leading-[22px]"
          >
            {subtitle}
          </Text>
        </View>

        {highlightText?.trim() ? (
          <View
            className="py-8"
            style={{
              marginHorizontal: -28,
              paddingHorizontal: 28,
              backgroundColor: SAGE[50],
            }}
          >
            {highlightLabel ? (
              <Text
                style={{ fontFamily: APP_FONT_FAMILIES.semiBold, color: SAGE[600] }}
                className="text-[13px] leading-[18px]"
              >
                {highlightLabel}
              </Text>
            ) : null}
            <Text
              style={{ fontFamily: APP_FONT_FAMILIES.semiBold, color: INK }}
              className="mt-1.5 text-[25px] leading-[33px]"
            >
              {highlightText}
            </Text>
            {highlightAction}
          </View>
        ) : null}

        {hasTimeline ? (
          <View className="mt-7">
            <ReflectionTimeline>
              {recordSections.map((section, index) => (
                <ReflectionTimelineItem
                  key={section.label}
                  label={section.label}
                  isLast={
                    index === recordSections.length - 1 && !hasScore
                  }
                >
                  <RecapSectionContent section={section} />
                </ReflectionTimelineItem>
              ))}

              {recordSections.length > 0 && hasScore ? (
                <ReflectionTimelineItem label={scoreLabel} isLast>
                  {hasShift ? (
                    <ReflectionScoreShift
                      before={preScore!}
                      after={postScore!}
                      label="Checked again"
                      detail={scoreDetail}
                    />
                  ) : (
                    <ScoreSnapshot score={preScore!} />
                  )}
                </ReflectionTimelineItem>
              ) : null}

              {hasThoughtRecordTimeline && hasSituation ? (
                <ReflectionTimelineItem
                  label="What happened"
                  isLast={
                    !hasAutomaticThought &&
                    !hasScore &&
                    !hasReality &&
                    !hasBalancedThought
                  }
                >
                  <Text
                    style={{ fontFamily: APP_FONT_FAMILIES.regular, color: INK }}
                    className="text-[16px] leading-[24px]"
                  >
                    {situation}
                  </Text>
                </ReflectionTimelineItem>
              ) : null}

              {hasThoughtRecordTimeline && hasAutomaticThought ? (
                <ReflectionTimelineItem
                  label="Automatic thought"
                  isLast={!hasScore && !hasReality && !hasBalancedThought}
                >
                  <Text
                    style={{ fontFamily: APP_FONT_FAMILIES.semiBoldItalic, color: INK }}
                    className="text-[25px] leading-[33px]"
                  >
                    "{automaticThought?.trim()}"
                  </Text>
                </ReflectionTimelineItem>
              ) : null}

              {hasThoughtRecordTimeline && hasScore ? (
                <ReflectionTimelineItem
                  label={scoreLabel}
                  isLast={!hasReality && !hasBalancedThought}
                >
                  {hasShift ? (
                    <ReflectionScoreShift
                      before={preScore!}
                      after={postScore!}
                      label="Checked again"
                      detail={scoreDetail}
                    />
                  ) : (
                    <ScoreSnapshot score={preScore!} />
                  )}
                </ReflectionTimelineItem>
              ) : null}

              {hasThoughtRecordTimeline && hasReality ? (
                <ReflectionTimelineItem
                  label="Reality check"
                  isLast={!hasBalancedThought}
                >
                  <RealityPill label={realityCheckLabel!} />
                </ReflectionTimelineItem>
              ) : null}

              {hasThoughtRecordTimeline && hasBalancedThought ? (
                <ReflectionTimelineItem label="Balanced thought" isLast>
                  <Text
                    style={{ fontFamily: APP_FONT_FAMILIES.regular, color: INK }}
                    className="text-[16px] leading-[24px]"
                  >
                    {balancedThought?.trim()}
                  </Text>
                </ReflectionTimelineItem>
              ) : null}
            </ReflectionTimeline>
          </View>
        ) : null}

        {afterTimeline ? <View className="mt-5">{afterTimeline}</View> : null}
      </View>
    );
  },
);

ThoughtRecordRecap.displayName = "ThoughtRecordRecap";

import React from "react";
import { View } from "react-native";

import {
  ReflectionScoreShift,
  ReflectionTimeline,
  ReflectionTimelineItem,
} from "@/src/components/exercise/ReflectionTimeline";
import { Mascot, type MascotState } from "@/src/components/ui/Mascot";
import { Text } from "@/src/components/ui/Text";
import { INK, INK_SOFT, SAGE } from "@/lib/tokens";

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
        style={{ fontFamily: "CormorantSemiBold", color: INK }}
        className="text-[34px] leading-[34px]"
      >
        {score}
      </Text>
      <Text
        style={{ fontFamily: "GeistMedium", color: INK_SOFT }}
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
        style={{ fontFamily: "GeistSemiBold", color: SAGE[700] }}
        className="text-[13px] leading-[18px]"
      >
        {label}
      </Text>
    </View>
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
    afterTimeline,
  }) => {
    const hasSituation = Boolean(situation?.trim());
    const hasAutomaticThought = Boolean(automaticThought?.trim());
    const hasScore = typeof preScore === "number";
    const hasShift = hasScore && typeof postScore === "number";
    const hasReality = Boolean(realityCheckLabel);
    const hasBalancedThought = Boolean(balancedThought?.trim());
    const hasTimeline =
      hasSituation ||
      hasAutomaticThought ||
      hasScore ||
      hasReality ||
      hasBalancedThought;

    return (
      <View className="flex-1 px-3" style={{ paddingBottom: 40 }}>
        <View className="items-center pb-6 pt-2">
          {showMascot ? <Mascot state={mascotState} size={72} /> : null}
          <Text
            style={{ fontFamily: "CormorantSemiBold", color: INK }}
            className={`${showMascot ? "mt-3" : ""} text-center text-[34px] leading-[37px] tracking-[-0.01em]`}
          >
            {title}
          </Text>
          <Text
            style={{ fontFamily: "GeistRegular", color: INK_SOFT }}
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
                style={{ fontFamily: "GeistMedium", color: SAGE[600] }}
                className="text-[13px] leading-[18px]"
              >
                {highlightLabel}
              </Text>
            ) : null}
            <Text
              style={{ fontFamily: "CormorantMedium", color: INK }}
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
              {hasSituation ? (
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
                    style={{ fontFamily: "GeistRegular", color: INK }}
                    className="text-[16px] leading-[24px]"
                  >
                    {situation}
                  </Text>
                </ReflectionTimelineItem>
              ) : null}

              {hasAutomaticThought ? (
                <ReflectionTimelineItem
                  label="Automatic thought"
                  isLast={!hasScore && !hasReality && !hasBalancedThought}
                >
                  <Text
                    style={{ fontFamily: "CormorantMediumItalic", color: INK }}
                    className="text-[25px] leading-[33px]"
                  >
                    "{automaticThought?.trim()}"
                  </Text>
                </ReflectionTimelineItem>
              ) : null}

              {hasScore ? (
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

              {hasReality ? (
                <ReflectionTimelineItem
                  label="Reality check"
                  isLast={!hasBalancedThought}
                >
                  <RealityPill label={realityCheckLabel!} />
                </ReflectionTimelineItem>
              ) : null}

              {hasBalancedThought ? (
                <ReflectionTimelineItem label="Balanced thought" isLast>
                  <Text
                    style={{ fontFamily: "GeistRegular", color: INK }}
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

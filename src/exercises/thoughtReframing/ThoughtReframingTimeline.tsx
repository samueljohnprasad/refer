import React from "react";
import { View } from "react-native";
import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { ReflectionBulletList, ReflectionScoreShift, ReflectionTimeline, ReflectionTimelineItem } from "@/src/components/exercise/ReflectionTimeline";
import { Text } from "@/src/components/ui/Text";
import { useExerciseCopy } from "@/src/hooks/useExerciseCopy";
import type { ThoughtReframingResponse } from "@/src/types/exerciseFlow";
import type { EmotionOption } from "@/src/screens/ThoughtReframingScreen/data/emotions";
import type { CognitiveDistortion } from "@/src/screens/ThoughtReframingScreen/types";

type ScoreShift = { label: string; detail: string; color: string };
interface Props {
  response: ThoughtReframingResponse;
  emotions: EmotionOption[];
  distortions: CognitiveDistortion[];
  preScore: number;
  postScore: number;
  hasTimeline: boolean;
  hasSituation: boolean;
  hasAutomaticThought: boolean;
  hasEmotions: boolean;
  hasDistortions: boolean;
  hasScores: boolean;
  hasEvidence: boolean;
  hasEvidenceFor: boolean;
  hasEvidenceAgainst: boolean;
  evidenceFor: string[];
  evidenceAgainst: string[];
  shift: ScoreShift | null;
}

export function ThoughtReframingTimeline(props: Props) {
  const translateCopy = useExerciseCopy();
  const { response, emotions, distortions, preScore, postScore, hasTimeline, hasSituation, hasAutomaticThought, hasEmotions, hasDistortions, hasScores, hasEvidence, hasEvidenceFor, hasEvidenceAgainst, evidenceFor, evidenceAgainst, shift } = props;
  return <>
      {hasTimeline ? (
        <View className="mt-7">
          <ReflectionTimeline>
            {hasSituation ? (
              <ReflectionTimelineItem
                label={translateCopy("What happened")}
                isLast={
                  !hasAutomaticThought &&
                  !hasEmotions &&
                  !hasDistortions &&
                  !hasScores &&
                  !hasEvidence
                }
              >
                <Text
                  style={{ fontFamily: APP_FONT_FAMILIES.regular, color: SEMANTIC_COLORS.text.primary }}
                  className="text-[16px] leading-[24px]"
                >
                  {response.situation}
                </Text>
              </ReflectionTimelineItem>
            ) : null}

            {hasAutomaticThought ? (
              <ReflectionTimelineItem
                label={translateCopy("The first thought")}
                isLast={
                  !hasEmotions &&
                  !hasDistortions &&
                  !hasScores &&
                  !hasEvidence
                }
              >
                <Text
                  style={{ fontFamily: APP_FONT_FAMILIES.semiBoldItalic, color: SEMANTIC_COLORS.text.primary }}
                  className="text-[21px] leading-[28px]"
                >
                  {response.automaticThought}
                </Text>
              </ReflectionTimelineItem>
            ) : null}

            {hasEmotions ? (
              <ReflectionTimelineItem
                label={translateCopy("What you felt")}
                isLast={!hasDistortions && !hasScores && !hasEvidence}
              >
                <View className="flex-row flex-wrap gap-x-4 gap-y-1.5">
                  {emotions.map((emotion) => (
                    <View key={emotion.name} className="flex-row items-center">
                      <Text className="mr-1.5 text-[17px]">
                        {emotion.emoji}
                      </Text>
                      <Text
                        style={{ fontFamily: APP_FONT_FAMILIES.semiBold, color: SEMANTIC_COLORS.text.primary }}
                        className="text-[14px] leading-[20px]"
                      >
                        {translateCopy(emotion.label)}
                      </Text>
                    </View>
                  ))}
                </View>
              </ReflectionTimelineItem>
            ) : null}

            {hasDistortions ? (
              <ReflectionTimelineItem
                label={translateCopy("Patterns you noticed")}
                isLast={!hasScores && !hasEvidence}
              >
                <View className="gap-4">
                  {distortions.map((distortion) => (
                    <View key={distortion.key}>
                      <Text
                        style={{ fontFamily: APP_FONT_FAMILIES.semiBold, color: SEMANTIC_COLORS.text.primary }}
                        className="text-[15px] leading-[21px]"
                      >
                        {translateCopy(distortion.label)}
                      </Text>
                      <Text
                        style={{ fontFamily: APP_FONT_FAMILIES.regular, color: SEMANTIC_COLORS.text.secondary }}
                        className="mt-0.5 text-[13px] leading-[19px]"
                      >
                        {translateCopy(distortion.description)}
                      </Text>
                    </View>
                  ))}
                </View>
              </ReflectionTimelineItem>
            ) : null}

            {hasScores && shift ? (
              <ReflectionTimelineItem
                label={translateCopy("How believable it felt")}
                isLast={!hasEvidence}
              >
                <ReflectionScoreShift
                  before={preScore}
                  after={postScore}
                  label={shift.label}
                  detail={shift.detail}
                  accentColor={shift.color}
                />
              </ReflectionTimelineItem>
            ) : null}

            {hasEvidenceFor ? (
              <ReflectionTimelineItem
                label={translateCopy("Evidence that supported it")}
                isLast={!hasEvidenceAgainst}
              >
                <ReflectionBulletList
                  items={evidenceFor}
                  accentColor="#8A948A"
                />
              </ReflectionTimelineItem>
            ) : null}

            {hasEvidenceAgainst ? (
              <ReflectionTimelineItem
                label={translateCopy("Evidence that challenged it")}
                isLast
              >
                <ReflectionBulletList items={evidenceAgainst} />
              </ReflectionTimelineItem>
            ) : null}
          </ReflectionTimeline>
        </View>
      ) : null}
  </>;
}

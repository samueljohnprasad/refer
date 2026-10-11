// src/components/ContinueJourneyCard/ContinueJourneyCard.tsx
// ponytail: compact continue journey row with unified tap target

import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { useTranslation } from "react-i18next";
// ponytail: use native expo-symbols SymbolView instead of lucide icons
import { SymbolView } from "expo-symbols";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import {
  getCourseImageSource,
  resolveCourseAccentColor,
  getCourseMonogram,
} from "@/src/domains/journey/model/courseVisuals";
import { ContinueJourneyCardSkeleton } from "./ContinueJourneyCardSkeleton";
import { useContinueJourneyViewModel } from "./useContinueJourneyViewModel";
import type { ContinueJourneyCardProps } from "./types";

export function ContinueJourneyCard({
  className = "",
  testID = "continue-journey-card",
}: ContinueJourneyCardProps): React.JSX.Element | null {
  const { t } = useTranslation("home");
  const { state, actions } = useContinueJourneyViewModel();

  if (state.type === "loading") {
    return (
      <View className={className} testID={testID}>
        <View className="mb-1.5 px-1">
        <Text className="happy-font-body-bold text-[12px] font-bold tracking-[1px] text-sage-700 uppercase">
            {t("sections.continueJourney")}
          </Text>
        </View>
        <ContinueJourneyCardSkeleton />
      </View>
    );
  }

  // Determine accessibility label based on state
  let a11yLabel = t("sections.continueJourney");
  if (state.type === "active_next_activity") {
    const duration = state.estimatedMins
      ? `, ${t("journey.a11yDuration", { count: state.estimatedMins })}`
      : "";
    a11yLabel = t("journey.a11yActive", {
      courseTitle: state.courseTitle,
      activityTitle: state.activityTitle,
      duration,
    });
  } else if (state.type === "no_active_course") {
    a11yLabel = t("journey.a11yNoCourse");
  } else if (state.type === "course_completed") {
    a11yLabel = t("journey.a11yCompleted");
  } else if (state.type === "error_fallback") {
    a11yLabel = t("journey.a11yError");
  }

  return (
    <View className={className} testID={testID}>
      <View className="mb-2.5 px-1">
        <Text className="happy-font-body-bold text-[12px] font-bold tracking-[1px] text-sage-700 uppercase">
          {t("sections.continueJourney")}
        </Text>
      </View>

      <Pressable
        className="border-y border-sage-200 py-4 active:opacity-70"
        onPress={actions.handleCardPress}
        accessibilityRole="button"
        accessibilityLabel={a11yLabel}
      >
        {state.type === "active_next_activity" && (
          <>
            <View className="flex-row items-center justify-between">
              <View className="flex-1 pr-5">
                <Text
                  className="happy-font-heading-bold font-bold text-[16px] text-ink tracking-tight"
                  numberOfLines={1}
                >
                  {state.courseTitle}
                </Text>
                <Text
                  className="happy-font-body-medium font-medium text-[14px] text-ink mt-0.5 leading-tight"
                  numberOfLines={2}
                >
                  {state.activityTitle}
                </Text>
                {state.estimatedMins ? (
                  <View className="flex-row items-center mt-1.5">
                    <SymbolView
                      name="clock"
                      size={11}
                      tintColor={SEMANTIC_COLORS.text.tertiary as string}
                    />
                    <Text className="happy-font-body-medium text-[11px] font-medium text-ink-muted ml-1">
                      {t("journey.durationCompact", { count: state.estimatedMins })}
                    </Text>
                  </View>
                ) : null}
              </View>

              {/* Course artwork thumbnail */}
              {getCourseImageSource(state.courseArtworkKey) ? (
               <Image
                  source={getCourseImageSource(state.courseArtworkKey)!}
                  className="w-10 h-10 rounded-full bg-sand/20"
                  resizeMode="cover"
                />
              ) : (
                <View
                  style={{
                    backgroundColor: resolveCourseAccentColor(state.courseColorHex),
                  }}
                  className="w-10 h-10 rounded-full items-center justify-center"
                >
                  <Text className="happy-font-body-bold text-white font-bold text-[15px]">
                    {getCourseMonogram(state.courseTitle)}
                  </Text>
                </View>
              )}
            </View>

            {/* Primary Action Row */}
            <ContinueJourneyActionRow
              label={t("journey.continueLearning")}
            />
          </>
        )}

        {state.type === "no_active_course" && (
          <>
            <View className="flex-row items-center justify-between">
              <View className="flex-1 pr-3">
                <Text className="happy-font-heading-bold font-bold text-[16px] text-ink tracking-tight">
                  {t("journey.findNextStep")}
                </Text>
                <Text className="happy-font-body text-[14px] text-ink-soft mt-0.5">
                  {t("journey.chooseJourney")}
                </Text>
              </View>
              <View className="w-10 h-10 rounded-full bg-sage-100 items-center justify-center">
                <SymbolView
                  name="safari"
                  size={20}
                  tintColor={SEMANTIC_COLORS.brand.primary as string}
                />
              </View>
            </View>
            {/* Primary Action Row */}
            <ContinueJourneyActionRow
              label={t("journey.exploreJourneys")}
            />
          </>
        )}

        {state.type === "course_completed" && (
          <>
            <View className="flex-row items-center justify-between">
              <View className="flex-1 pr-3">
                <Text className="happy-font-heading-bold font-bold text-[16px] text-ink tracking-tight">
                  {t("journey.completeTitle")}
                </Text>
                <Text className="happy-font-body text-[14px] text-ink-soft mt-0.5">
                  {t("journey.completeDesc")}
                </Text>
              </View>
              {getCourseImageSource(state.courseTitle) ? (
                <Image
                  source={getCourseImageSource(state.courseTitle)!}
                  className="w-10 h-10 rounded-full bg-sand/20"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-10 h-10 rounded-full bg-sage-100 items-center justify-center">
                  <Text className="happy-font-body-bold text-brand-primary font-bold text-[15px]">✓</Text>
                </View>
              )}
            </View>
            {/* Primary Action Row */}
            <ContinueJourneyActionRow
              label={t("journey.reviewSkills")}
            />
          </>
        )}

        {state.type === "error_fallback" && (
          <>
            <View className="flex-row items-center justify-between">
              <View className="flex-1 pr-3">
                <Text className="happy-font-heading-bold font-bold text-[16px] text-ink tracking-tight">
                  {t("journey.continueJourney")}
                </Text>
                <Text className="happy-font-body text-[14px] text-ink-soft mt-0.5">
                  {t("journey.pickUpWhereLeft")}
                </Text>
              </View>
              <View className="w-10 h-10 rounded-full bg-sand/30 items-center justify-center">
                <SymbolView
                  name="safari"
                  size={20}
                  tintColor={SEMANTIC_COLORS.text.secondary as string}
                />
              </View>
            </View>
            {/* Primary Action Row */}
            <ContinueJourneyActionRow
              label={t("journey.openJourneys")}
            />
          </>
        )}
      </Pressable>
    </View>
  );
}

// ponytail: quiet inline action keeps the journey row open and scannable
function ContinueJourneyActionRow({ label }: { label: string }) {
  return (
    <View className="mt-3 flex-row items-center justify-between">
      <Text className="happy-font-body-semibold text-[13px] font-semibold text-sage-600">
        {label}
      </Text>
      <SymbolView
        name="arrow.right"
        size={17}
        tintColor={SEMANTIC_COLORS.brand.primary as string}
        weight="semibold"
      />
    </View>
  );
}

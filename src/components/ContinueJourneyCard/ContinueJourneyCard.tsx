// src/components/ContinueJourneyCard/ContinueJourneyCard.tsx
// ponytail: compact continue journey card with unified tap target

import React from "react";
import { View, Text, Image } from "react-native";
import { ArrowRight, Clock, Compass } from "lucide-react-native";
import { Card } from "@/src/components/ui/Card";
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
  const { state, actions } = useContinueJourneyViewModel();

  if (state.type === "loading") {
    return (
      <View className={className} testID={testID}>
        <View className="mb-1.5 px-1">
          <Text className="text-[11px] font-semibold tracking-wider text-ink-muted/80 uppercase">
            Continue your journey
          </Text>
        </View>
        <ContinueJourneyCardSkeleton />
      </View>
    );
  }

  // Determine accessibility label based on state
  let a11yLabel = "Continue your journey";
  if (state.type === "active_next_activity") {
    const duration = state.estimatedMins ? `, ${state.estimatedMins} minutes` : "";
    a11yLabel = `${state.courseTitle}. Next activity: ${state.activityTitle}${duration}. Tap to continue learning.`;
  } else if (state.type === "no_active_course") {
    a11yLabel = "Find your next step. Choose a journey to start learning. Tap to explore journeys.";
  } else if (state.type === "course_completed") {
    a11yLabel = "Journey complete. You can revisit the skills you've learned. Tap to review your skills.";
  } else if (state.type === "error_fallback") {
    a11yLabel = "Continue your journey. Tap to open journeys.";
  }

  return (
    <View className={className} testID={testID}>
      <View className="mb-2 px-1">
        <Text className="text-[11px] font-semibold tracking-wider text-brand-primary/80 uppercase">
          Continue your journey
        </Text>
      </View>

      <Card
        variant="tile"
        radius="lg"
        showDepth={false}
        haptic="light"
        onPress={actions.handleCardPress}
        contentClassName="p-3.5 pt-3 pb-3"
        accessibilityRole="button"
        accessibilityLabel={a11yLabel}
      >
        {state.type === "active_next_activity" && (
          <>
            <View className="flex-row items-center justify-between">
              <View className="flex-1 pr-5">
                <Text
                  className="font-bold text-[16px] text-ink tracking-tight"
                  numberOfLines={1}
                >
                  {state.courseTitle}
                </Text>
                <Text
                  className="font-medium text-[14px] text-ink mt-0.5 leading-tight"
                  numberOfLines={2}
                >
                  {state.activityTitle}
                </Text>
                {state.estimatedMins ? (
                  <View className="flex-row items-center mt-1.5">
                    <Clock size={11} color={SEMANTIC_COLORS.text.tertiary as string} />
                    <Text className="text-[11px] font-medium text-ink-muted ml-1">
                      {state.estimatedMins} min
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
                  <Text className="text-white font-bold text-[15px]">
                    {getCourseMonogram(state.courseTitle)}
                  </Text>
                </View>
              )}
            </View>

            {/* Primary Action Row */}
            <View className="mt-3 pt-2 flex-row items-center justify-between">
              <Text className="text-[13px] font-semibold text-brand-primary">
                {state.actionLabel}
              </Text>
              <ArrowRight size={14} color={SEMANTIC_COLORS.brand.primary as string} />
            </View>
          </>
        )}

        {state.type === "no_active_course" && (
          <>
            <View className="flex-row items-center justify-between">
              <View className="flex-1 pr-3">
                <Text className="font-bold text-[16px] text-ink tracking-tight">
                  {state.title}
                </Text>
                <Text className="text-[14px] text-ink-soft mt-0.5">
                  {state.description}
                </Text>
              </View>
              <View className="w-10 h-10 rounded-full bg-sage-100 items-center justify-center">
                <Compass size={20} color={SEMANTIC_COLORS.brand.primary as string} />
              </View>
            </View>
            <View className="mt-3 pt-2 flex-row items-center justify-between">
              <Text className="text-[13px] font-semibold text-brand-primary">
                {state.actionLabel}
              </Text>
              <ArrowRight size={14} color={SEMANTIC_COLORS.brand.primary as string} />
            </View>
          </>
        )}

        {state.type === "course_completed" && (
          <>
            <View className="flex-row items-center justify-between">
              <View className="flex-1 pr-3">
                <Text className="font-bold text-[16px] text-ink tracking-tight">
                  {state.title}
                </Text>
                <Text className="text-[14px] text-ink-soft mt-0.5">
                  {state.description}
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
                  <Text className="text-brand-primary font-bold text-[15px]">✓</Text>
                </View>
              )}
            </View>
            <View className="mt-3 pt-2 flex-row items-center justify-between">
              <Text className="text-[13px] font-semibold text-brand-primary">
                {state.actionLabel}
              </Text>
              <ArrowRight size={14} color={SEMANTIC_COLORS.brand.primary as string} />
            </View>
          </>
        )}

        {state.type === "error_fallback" && (
          <>
            <View className="flex-row items-center justify-between">
              <View className="flex-1 pr-3">
                <Text className="font-bold text-[16px] text-ink tracking-tight">
                  Continue your journey
                </Text>
                <Text className="text-[14px] text-ink-soft mt-0.5">
                  Pick up where you left off.
                </Text>
              </View>
              <View className="w-10 h-10 rounded-full bg-sand/30 items-center justify-center">
                <Compass size={20} color={SEMANTIC_COLORS.text.secondary as string} />
              </View>
            </View>
            <View className="mt-3 pt-2 flex-row items-center justify-between">
              <Text className="text-[13px] font-semibold text-brand-primary">
                {state.actionLabel}
              </Text>
              <ArrowRight size={14} color={SEMANTIC_COLORS.brand.primary as string} />
            </View>
          </>
        )}
      </Card>
    </View>
  );
}

import React, { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import Animated, {
  Easing,
  FadeIn,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Text } from "@/src/components/ui/Text";
import { useReducedMotion } from "@/src/hooks/useReducedMotion";
import type {
  CourseOverviewSection,
  CourseOverviewUnit,
} from "@/src/domains/journey/model/courseOverview";
import { INK_MUTED, SAGE } from "@/lib/tokens";

interface CourseOutlineProps {
  sections: CourseOverviewSection[];
}

export function CourseOutline({
  sections,
}: CourseOutlineProps): React.JSX.Element {
  const [expandedSectionId, setExpandedSectionId] = useState<string | null>(
    sections[0]?.id ?? null,
  );
  const [expandedUnitId, setExpandedUnitId] = useState<string | null>(null);
  const isReducedMotion = useReducedMotion();

  const handleSectionPress = (sectionId: string) => {
    setExpandedSectionId((currentId) =>
      currentId === sectionId ? null : sectionId,
    );
    setExpandedUnitId(null);
  };

  const handleUnitPress = (unitId: string) => {
    setExpandedUnitId((currentId) =>
      currentId === unitId ? null : unitId,
    );
  };

  return (
    <View className="border-t border-slate-100">
      {sections.map((section) => {
        const isExpanded = expandedSectionId === section.id;
        return (
          <Animated.View
            key={section.id}
            layout={
              isReducedMotion
                ? undefined
                : LinearTransition.duration(180).easing(Easing.out(Easing.cubic))
            }
            className="border-b border-slate-100"
          >
            <SectionRow
              section={section}
              isExpanded={isExpanded}
              isReducedMotion={isReducedMotion}
              onPress={handleSectionPress}
            />
            {isExpanded ? (
              <Animated.View
                entering={isReducedMotion ? undefined : FadeIn.duration(160)}
                className="pb-3 pl-10"
              >
                {section.units.map((unit) => (
                  <UnitDisclosure
                    key={unit.id}
                    unit={unit}
                    isExpanded={expandedUnitId === unit.id}
                    isReducedMotion={isReducedMotion}
                    onPress={handleUnitPress}
                  />
                ))}
              </Animated.View>
            ) : null}
          </Animated.View>
        );
      })}
    </View>
  );
}

function SectionRow({
  section,
  isExpanded,
  isReducedMotion,
  onPress,
}: {
  section: CourseOverviewSection;
  isExpanded: boolean;
  isReducedMotion: boolean;
  onPress: (sectionId: string) => void;
}): React.JSX.Element {
  return (
    <Pressable
      onPress={() => onPress(section.id)}
      className="min-h-16 flex-row gap-3 py-4 active:opacity-70"
      accessibilityRole="button"
      accessibilityState={{ expanded: isExpanded }}
      accessibilityLabel={`${section.title}, ${section.units.length} units, ${section.lessonCount} lessons`}
    >
      <Text
        variant="h3"
        className="w-7 pt-0.5 text-center"
        color={isExpanded ? "sage" : "muted"}
      >
        {section.orderIndex}
      </Text>
      <View className="flex-1 gap-1">
        <Text variant="h3" color={isExpanded ? "sage" : "ink"}>
          {section.title}
        </Text>
        <Text variant="caption-muted">
          {formatCount(section.units.length, "unit")}
          {" · "}
          {formatCount(section.lessonCount, "lesson")}
        </Text>
        {isExpanded && section.description ? (
          <Text variant="caption" className="pr-3 pt-1">
            {section.description}
          </Text>
        ) : null}
      </View>
      <DisclosureChevron
        isExpanded={isExpanded}
        isReducedMotion={isReducedMotion}
      />
    </Pressable>
  );
}

function UnitDisclosure({
  unit,
  isExpanded,
  isReducedMotion,
  onPress,
}: {
  unit: CourseOverviewUnit;
  isExpanded: boolean;
  isReducedMotion: boolean;
  onPress: (unitId: string) => void;
}): React.JSX.Element {
  return (
    <Animated.View
      layout={
        isReducedMotion
          ? undefined
          : LinearTransition.duration(180).easing(Easing.out(Easing.cubic))
      }
    >
      <Pressable
        onPress={() => onPress(unit.id)}
        className={`min-h-12 flex-row items-center gap-3 rounded-lg px-3 py-2 active:opacity-70 ${
          isExpanded ? "bg-sage-50" : ""
        }`}
        accessibilityRole="button"
        accessibilityState={{ expanded: isExpanded }}
        accessibilityLabel={`${unit.title}, ${formatCount(unit.lessons.length, "lesson")}`}
      >
        <View className="flex-1 gap-0.5">
          <Text variant="label-bold" color={isExpanded ? "sage" : "ink"}>
            {unit.title}
          </Text>
          <Text variant="caption-muted">
            {formatCount(unit.lessons.length, "lesson")}
          </Text>
        </View>
        <DisclosureChevron
          isExpanded={isExpanded}
          isReducedMotion={isReducedMotion}
        />
      </Pressable>

      {isExpanded ? (
        <Animated.View
          entering={isReducedMotion ? undefined : FadeIn.duration(160)}
          className="pb-2 pl-4"
        >
          {unit.lessons.map((lesson) => (
            <View
              key={lesson.id}
              className="min-h-11 flex-row items-center gap-3 py-2 pr-3"
            >
              <View className="h-1.5 w-1.5 rounded-full bg-sage-300" />
              <Text variant="label" className="flex-1">
                {lesson.title}
              </Text>
              {lesson.estimatedMinutes > 0 ? (
                <Text variant="caption-muted">
                  {lesson.estimatedMinutes} min
                </Text>
              ) : null}
            </View>
          ))}
        </Animated.View>
      ) : null}
    </Animated.View>
  );
}

function DisclosureChevron({
  isExpanded,
  isReducedMotion,
}: {
  isExpanded: boolean;
  isReducedMotion: boolean;
}): React.JSX.Element {
  const rotation = useSharedValue(isExpanded ? 1 : 0);

  useEffect(() => {
    rotation.value = withTiming(isExpanded ? 1 : 0, {
      duration: isReducedMotion ? 0 : 180,
      easing: Easing.out(Easing.cubic),
    });
  }, [isExpanded, isReducedMotion, rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value * 90}deg` }],
  }));

  return (
    <Animated.View className="h-11 w-8 items-center justify-center" style={animatedStyle}>
      <HugeiconsIcon icon={ArrowRight01Icon} size={17} color={isExpanded ? SAGE[500] : INK_MUTED} />
    </Animated.View>
  );
}

function formatCount(value: number, singular: string): string {
  return `${value} ${value === 1 ? singular : `${singular}s`}`;
}

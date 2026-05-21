import React, { useCallback } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Cancel01Icon } from "@hugeicons/core-free-icons";

import { Text } from "@/components/ui/text";
import JourneyUnitIcon from "@/src/components/journey/JourneyUnitIcon";
import type { SectionOverviewItem } from "@/src/types/journey/sectionMap";

const PALETTE = {
  cream: "#FAF6ED",
  warmWhite: "#FFFCF5",
  sage50: "#F4F1EA",
  sage100: "#E8E2D2",
  sage200: "#D4CCB5",
  sage300: "#A8B89A",
  sage500: "#5A7A56",
  sage600: "#3F5A3D",
  sage700: "#2A3F2A",
  ink: "#1A2A1A",
  inkSoft: "#4A5A4A",
  inkMuted: "#7A8A7A",
} as const;

const FONTS = {
  body: "GeistRegular",
  bodyBold: "GeistBold",
  heading: "FrauncesSemiBold",
} as const;

export interface SectionOverviewSheetProps {
  onClose: () => void;
  sections: SectionOverviewItem[];
  onPreviewSection: (sectionId: string) => void;
  journeyTitle: string;
}

interface SectionCardProps {
  section: SectionOverviewItem;
  onPress: (sectionId: string) => void;
}

function SectionCard({
  section,
  onPress,
}: SectionCardProps): React.JSX.Element {
  const unitRangeLabel = `Section ${section.sectionNumber}${
    section.unitCount > 0
      ? ` • ${section.unitCount} ${section.unitCount === 1 ? "unit" : "units"}`
      : ""
  }`;
  const isComplete = section.progressPercent >= 100;
  const cardStateClassName = section.isCurrent
    ? "border-sage-500 border-b-sage-600 bg-[#EEF2E8]"
    : isComplete
      ? "border-[#D8F3DD] border-b-[#C4E9CB] bg-warm-white"
      : "border-sage-100 border-b-sage-100 bg-warm-white";

  return (
    <Pressable
      className={`rounded-[20px] border-2 border-b-[5px] p-[14px] ${
        section.isUnlocked ? "opacity-100" : "opacity-60"
      } ${cardStateClassName}`}
      accessibilityRole="button"
      accessibilityLabel={`${section.title}, Section ${section.sectionNumber}, ${section.progressPercent}% complete`}
      onPress={() => onPress(section.id)}
    >
      <View className="gap-4 rounded-2xl bg-warm-white p-[18px]">
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1 gap-1.5 pr-2">
            <Text
              className="text-[27px] leading-8 text-ink"
              style={{ fontFamily: FONTS.heading }}
            >
              {section.title}
            </Text>
            <Text
              className="text-[15px] text-ink-muted"
              style={{ fontFamily: FONTS.bodyBold }}
            >
              {unitRangeLabel}
            </Text>
          </View>

          {section.isCurrent ? (
            <View className="rounded-full bg-sage-100 px-[14px] py-1.5">
              <Text
                className="text-xs uppercase tracking-[1.4px] text-sage-700"
                style={{ fontFamily: FONTS.bodyBold }}
              >
                Current
              </Text>
            </View>
          ) : null}
        </View>

        {section.unitTitles.length > 0 ? (
          <View className="flex-row flex-wrap gap-2.5">
            {section.unitTitles.map((unitTitle, index) => (
              <View
                key={`${section.id}-${unitTitle}-${index}`}
                className="flex-row items-center rounded-full bg-sage-50 px-3 py-2"
              >
                <JourneyUnitIcon
                  iconKey={section.unitIconKeys[index]}
                  size={14}
                  color={PALETTE.ink}
                  backgroundColor={PALETTE.warmWhite}
                />
                <Text
                  className="ml-2 text-[13px] text-ink"
                  style={{ fontFamily: FONTS.bodyBold }}
                >
                  Unit {index + 1}
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        <View className="mb-3 h-2.5 w-full overflow-hidden rounded-full bg-sage-100">
          <View
            className="h-full rounded-full"
            style={{
              width: `${section.progressPercent}%`,
              backgroundColor: section.isCurrent ? PALETTE.sage500 : PALETTE.sage300,
            }}
          />
        </View>

        <View className="flex-row items-center justify-between">
          <Text
            className="text-[15px] text-ink-soft"
            style={{ fontFamily: FONTS.body }}
          >
            {section.completedNodes}/{section.totalNodes} complete
          </Text>

          {!section.isCurrent ? (
            <Text
              className="text-sm uppercase tracking-[0.8px] text-sage-500"
              style={{ fontFamily: FONTS.bodyBold }}
            >
              Preview
            </Text>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

export function SectionOverviewSheet({
  onClose,
  sections,
  onPreviewSection,
  journeyTitle,
}: SectionOverviewSheetProps): React.JSX.Element {
  const handlePreviewAndClose = useCallback(
    (sectionId: string): void => {
      onPreviewSection(sectionId);
      onClose();
    },
    [onClose, onPreviewSection],
  );

  return (
    <View className="flex-1 bg-cream">
      <View className="flex-row items-start justify-between border-b-2 border-sage-100 bg-cream px-6 pb-5 pt-5">
        <View>
          <Text
            className="text-xs uppercase tracking-[1.6px] text-sage-500"
            style={{ fontFamily: FONTS.bodyBold }}
          >
            Journey Map
          </Text>
          <Text
            className="text-[30px] leading-[34px] text-ink"
            style={{ fontFamily: FONTS.heading }}
          >
            {journeyTitle}
          </Text>
          <Text
            className="mt-1 text-base text-ink-muted"
            style={{ fontFamily: FONTS.body }}
          >
            {sections.length} {sections.length === 1 ? "section" : "sections"}
          </Text>
        </View>
        <Pressable
          onPress={onClose}
          className="h-11 w-11 items-center justify-center rounded-[22px] border-2 border-b-4 border-sage-100 border-b-sage-200 bg-warm-white"
          accessibilityRole="button"
          accessibilityLabel="Close section overview"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={20} color={PALETTE.sage600} />
        </Pressable>
      </View>

      <ScrollView
        className="flex-1 bg-cream"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerClassName="gap-[18px] px-5 pb-8 pt-5"
        showsVerticalScrollIndicator={false}
      >
        {sections.length === 0 ? (
          <View className="items-center justify-center px-6 py-12">
            <Text
              className="text-center text-[15px] text-ink-muted"
              style={{ fontFamily: FONTS.body }}
            >
              No sections available. Check your connection and try again.
            </Text>
          </View>
        ) : (
          sections.map((section) => (
            <SectionCard
              key={section.id}
              section={section}
              onPress={handlePreviewAndClose}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

export default React.memo(SectionOverviewSheet);

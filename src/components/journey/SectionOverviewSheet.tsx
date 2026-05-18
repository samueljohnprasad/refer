import React, { useCallback, useMemo } from "react";
import { Pressable, ScrollView, View } from "react-native";

import { Text } from "@/components/ui/text";
import JourneyUnitIcon from "@/src/components/journey/JourneyUnitIcon";
import type { SectionListItem } from "@/src/types/journey/sectionMap";

export interface SectionCardData {
  id: string;
  sectionNumber: number;
  title: string;
  unitRangeLabel: string;
  cardBackgroundColor: string;
  progressPercent: number;
  totalNodes: number;
  completedNodes: number;
  isUnlocked: boolean;
  isCurrent: boolean;
  unitTitles: string[];
  unitIconKeys: Array<string | null | undefined>;
}

export interface SectionOverviewSheetProps {
  onClose: () => void;
  unitCompletedCounts: Record<string, number>;
  sectionList: SectionListItem[];
  currentSectionUnitNumber: number;
  onJumpToSection: (unitNumber: number) => void;
  journeyTitle: string;
}

interface SectionCardProps {
  section: SectionCardData;
  onJump: (unitNumber: number) => void;
}

function SectionCard({
  section,
  onJump,
}: SectionCardProps): React.JSX.Element {
  return (
    <Pressable
      className="overflow-hidden rounded-2xl"
      style={{
        backgroundColor: section.cardBackgroundColor,
        opacity: section.isUnlocked ? 1 : 0.6,
      }}
      accessibilityRole="button"
      accessibilityLabel={`${section.title}, Section ${section.sectionNumber}, ${section.progressPercent}% complete`}
      onPress={() => onJump(section.sectionNumber)}
    >
      <View className="m-3 rounded-xl bg-white px-4 py-4">
        <View className="mb-3 flex-row items-start justify-between">
          <View className="flex-1 pr-3">
            <Text className="text-xl font-extrabold" style={{ color: "#1A202C" }}>
              {section.title}
            </Text>
            <Text className="mt-1 text-sm font-semibold" style={{ color: "#718096" }}>
              {section.unitRangeLabel}
            </Text>
          </View>

          {section.isCurrent ? (
            <View
              className="rounded-full px-3 py-1"
              style={{ backgroundColor: `${section.cardBackgroundColor}CC` }}
            >
              <Text
                className="text-xs font-extrabold uppercase tracking-wide"
                style={{ color: "#1A202C" }}
              >
                Current
              </Text>
            </View>
          ) : null}
        </View>

        {section.unitTitles.length > 0 ? (
          <View className="mb-3 flex-row flex-wrap" style={{ gap: 8 }}>
            {section.unitTitles.map((unitTitle, index) => (
              <View
                key={`${section.id}-${unitTitle}-${index}`}
                className="flex-row items-center rounded-full bg-black/5 px-3 py-2"
              >
                <JourneyUnitIcon
                  iconKey={section.unitIconKeys[index]}
                  size={14}
                  color="#1A202C"
                  backgroundColor="rgba(255,255,255,0.78)"
                />
                <Text className="ml-2 text-xs font-semibold" style={{ color: "#1A202C" }}>
                  Unit {index + 1}
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        <View
          className="mb-2 h-2.5 w-full overflow-hidden rounded-full"
          style={{ backgroundColor: "#E2E8F0" }}
        >
          <View
            className="h-full rounded-full"
            style={{
              width: `${section.progressPercent}%`,
              backgroundColor: section.isCurrent
                ? section.cardBackgroundColor
                : "#A0AEC0",
            }}
          />
        </View>

        <View className="flex-row items-center justify-between">
          <Text className="text-sm font-medium" style={{ color: "#4A5568" }}>
            {section.completedNodes}/{section.totalNodes} complete
          </Text>

          {!section.isCurrent && section.isUnlocked ? (
            <Text
              className="text-sm font-extrabold uppercase tracking-wide"
              style={{ color: section.cardBackgroundColor }}
            >
              Jump Here
            </Text>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

export function SectionOverviewSheet({
  onClose,
  unitCompletedCounts,
  sectionList,
  currentSectionUnitNumber,
  onJumpToSection,
  journeyTitle,
}: SectionOverviewSheetProps): React.JSX.Element {
  const handleJumpAndClose = useCallback(
    (unitNumber: number): void => {
      onJumpToSection(unitNumber);
      onClose();
    },
    [onClose, onJumpToSection],
  );

  const sectionCards = useMemo(
    () =>
      sectionList.map((section): SectionCardData => {
        const totalNodes = section.nodeCount;
        const isCurrent = section.unitNumber === currentSectionUnitNumber;
        const isUnlocked = section.unitNumber <= currentSectionUnitNumber;
        const completedNodes =
          unitCompletedCounts[`section_${section.unitNumber}`] ?? 0;
        const progressPercent =
          totalNodes > 0 ? Math.round((completedNodes / totalNodes) * 100) : 0;
        const unitCount = section.unitCount ?? section.unitTitles?.length ?? 0;
        const colorMap: Record<string, string> = {
          blue: "#E0F2FE",
          purple: "#F3E8FF",
          green: "#DCFCE7",
          orange: "#FFF7ED",
          pink: "#FCE7F3",
          teal: "#CCFBF1",
          rose: "#FFE4E6",
          indigo: "#E0E7FF",
        };

        return {
          id: `section_${section.unitNumber}`,
          sectionNumber: section.unitNumber,
          title: section.title,
          unitRangeLabel: `Section ${section.unitNumber}${
            unitCount > 0
              ? ` • ${unitCount} ${unitCount === 1 ? "unit" : "units"}`
              : ""
          }`,
          cardBackgroundColor: colorMap[section.colorScheme] ?? "#E0F2FE",
          progressPercent,
          totalNodes,
          completedNodes,
          isUnlocked,
          isCurrent,
          unitTitles: section.unitTitles ?? [],
          unitIconKeys: section.unitIconKeys ?? [],
        };
      }),
    [currentSectionUnitNumber, sectionList, unitCompletedCounts],
  );

  return (
    <View className="flex-1">
      <View className="mb-4 flex-row items-center justify-between border-b border-gray-100 pb-4">
        <View>
          <Text className="text-xl font-bold text-gray-900">
            {journeyTitle}
          </Text>
          <Text className="text-sm text-gray-500">
            {sectionCards.length}{" "}
            {sectionCards.length === 1 ? "section" : "sections"}
          </Text>
        </View>
        <Pressable onPress={onClose} className="rounded-full bg-gray-100 p-2">
          <Text className="text-lg" style={{ color: "#4A5568" }}>
            ✕
          </Text>
        </Pressable>
      </View>

      <ScrollView
        className="flex-1"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ gap: 16, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {sectionCards.length === 0 ? (
          <View className="items-center justify-center px-6 py-12">
            <Text className="text-center text-base text-gray-400">
              No sections available. Check your connection and try again.
            </Text>
          </View>
        ) : (
          sectionCards.map((section) => (
            <SectionCard
              key={section.id}
              section={section}
              onJump={handleJumpAndClose}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

export default React.memo(SectionOverviewSheet);

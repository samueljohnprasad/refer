import React, { useCallback } from "react";
import { Pressable, ScrollView, View } from "react-native";

import { Text } from "@/components/ui/text";
import JourneyUnitIcon from "@/src/components/journey/JourneyUnitIcon";
import type { SectionOverviewItem } from "@/src/types/journey/sectionMap";

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
  const cardBackgroundColor = colorMap[section.colorScheme] ?? "#E0F2FE";

  return (
    <Pressable
      className="overflow-hidden rounded-2xl"
      style={{
        backgroundColor: cardBackgroundColor,
        opacity: section.isUnlocked ? 1 : 0.6,
      }}
      accessibilityRole="button"
      accessibilityLabel={`${section.title}, Section ${section.sectionNumber}, ${section.progressPercent}% complete`}
      onPress={() => onPress(section.id)}
    >
      <View className="m-3 rounded-xl bg-white px-4 py-4">
        <View className="mb-3 flex-row items-start justify-between">
          <View className="flex-1 pr-3">
            <Text className="text-xl font-extrabold" style={{ color: "#1A202C" }}>
              {section.title}
            </Text>
            <Text className="mt-1 text-sm font-semibold" style={{ color: "#718096" }}>
              {unitRangeLabel}
            </Text>
          </View>

          {section.isCurrent ? (
            <View
              className="rounded-full px-3 py-1"
              style={{ backgroundColor: `${cardBackgroundColor}CC` }}
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
                ? cardBackgroundColor
                : "#A0AEC0",
            }}
          />
        </View>

        <View className="flex-row items-center justify-between">
          <Text className="text-sm font-medium" style={{ color: "#4A5568" }}>
            {section.completedNodes}/{section.totalNodes} complete
          </Text>

          {!section.isCurrent ? (
            <Text
              className="text-sm font-extrabold uppercase tracking-wide"
              style={{ color: cardBackgroundColor }}
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
    <View className="flex-1">
      <View className="mb-4 flex-row items-center justify-between border-b border-gray-100 pb-4">
        <View>
          <Text className="text-xl font-bold text-gray-900">
            {journeyTitle}
          </Text>
          <Text className="text-sm text-gray-500">
            {sections.length} {sections.length === 1 ? "section" : "sections"}
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
        {sections.length === 0 ? (
          <View className="items-center justify-center px-6 py-12">
            <Text className="text-center text-base text-gray-400">
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

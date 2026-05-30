import React, { useCallback } from "react";
import { ScrollView, View } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Cancel01Icon, LockIcon } from "@hugeicons/core-free-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Card } from "@/src/components/ui/Card";
import { Text } from "@/src/components/ui/Text";
import { PressableScale } from "@/src/components/ui/PressableScale";
import JourneyUnitIcon from "@/src/components/journey/JourneyUnitIcon";
import StageProgressBar from "@/src/components/ui/StageProgressBar";
import type { SectionOverviewItem } from "@/src/types/journey/sectionMap";

const PALETTE = {
  cream: "#FFFFFF",
  warmWhite: "#FFFFFF",
  sage50: "#F8FBF6",
  sage100: "#E5EDE1",
  sage200: "#D3E0CD",
  sage300: "#ABC0A2",
  sage500: "#5F7F58",
  sage600: "#44633F",
  sage700: "#29452A",
  ink: "#142414",
  inkSoft: "#4F604F",
  inkMuted: "#7D8D7B",
} as const;

export interface SectionOverviewSheetProps {
  sections: SectionOverviewItem[];
  onPreviewSection: (sectionId: string) => void;
  onClose: () => void;
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
  const unitRangeLabel = `Section ${section.sectionNumber}${section.unitCount > 0
    ? ` • ${section.unitCount} ${section.unitCount === 1 ? "unit" : "units"}`
    : ""
    }`;
  const isComplete = section.progressPercent >= 100;

  // Resolve standard Card variant based on section state
  const cardVariant = section.isCurrent ? "answer-selected" : "answer";

  return (
    <Card
      variant={cardVariant}
      radius="xl"
      onPress={() => onPress(section.id)}
      disabled={false}
      className={`mb-4 ${section.isUnlocked ? "opacity-100" : "opacity-80"}`}
      contentClassName="gap-4 p-5"
    >
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1 gap-1 pr-1">
          <Text variant="h2" className="text-[25px] leading-8 text-ink">
            {section.title}
          </Text>
          <Text variant="overline" color="muted" className="text-xs uppercase tracking-[1px]">
            {unitRangeLabel}
          </Text>
        </View>

        {section.isCurrent ? (
          <View className="rounded-full bg-sage-500 px-3 py-1">
            <Text variant="chip" color="surface" className="text-[10px] uppercase tracking-[1px]">
              Current
            </Text>
          </View>
        ) : isComplete ? (
          <View className="rounded-full bg-sage-100 px-3 py-1">
            <Text variant="chip" color="sage" className="text-[10px] uppercase tracking-[1px]">
              Done
            </Text>
          </View>
        ) : null}
      </View>

      {section.unitTitles.length > 0 ? (
        <View className="flex-row flex-wrap gap-2">
          {section.unitTitles.map((unitTitle, index) => (
            <View
              key={`${section.id}-${unitTitle}-${index}`}
              className="flex-row items-center rounded-full bg-brand-canvas px-3 py-1.5"
              style={{ borderWidth: 1, borderColor: "rgba(213, 228, 207, 0.7)" }}
            >
              <JourneyUnitIcon
                iconKey={section.unitIconKeys[index]}
                size={13}
                color={PALETTE.sage600}
                backgroundColor={PALETTE.cream}
              />
              <Text variant="chip" color="soft" className="ml-1.5">
                Unit {index + 1}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      <View className="gap-2 mt-1">
        <StageProgressBar
          progress={section.progressPercent}
          height={8}
          showGlow={section.isCurrent}
          fillColor={section.isCurrent ? PALETTE.sage500 : PALETTE.sage300}
          trackColor="#E5EAE2"
        />

        <View className="flex-row items-center justify-between mt-1">
          <Text variant="caption" color="soft">
            {section.completedNodes}/{section.totalNodes} complete
          </Text>

          {!section.isCurrent ? (
            <View className="flex-row items-center gap-1.5">
              {!section.isUnlocked && (
                <HugeiconsIcon icon={LockIcon} size={14} color={PALETTE.sage500} />
              )}
              <Text variant="label-bold" color="sage" className="text-xs uppercase tracking-[0.8px]">
                Preview →
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </Card>
  );
}

export function SectionOverviewSheet({
  sections,
  onPreviewSection,
  onClose,
  journeyTitle,
}: SectionOverviewSheetProps): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const handlePreviewAndClose = useCallback(
    (sectionId: string): void => {
      onPreviewSection(sectionId);
    },
    [onPreviewSection],
  );

  return (
    <View className="flex-1 happy-brand-screen">
      <View
        className="flex-row items-start justify-between happy-brand-screen px-6 pb-5"
        style={{
          paddingTop: Math.max(18, insets.top),
          borderBottomWidth: 1,
          borderBottomColor: "#E5EDE1",
        }}
      >
        <View className="flex-1 pr-4">
          <Text variant="eyebrow">
            Journey Map
          </Text>
          <Text variant="display" className="text-[30px] leading-[34px] text-ink">
            {journeyTitle}
          </Text>
          <Text variant="body" color="muted" className="mt-1 text-base">
            {sections.length} {sections.length === 1 ? "section" : "sections"}
          </Text>
        </View>

        <PressableScale
          onPress={onClose}
          scale={0.9}
          hapticStyle="light"
          accessibilityRole="button"
          accessibilityLabel="Close sections"
        >
          <View
            className="w-9 h-9 rounded-full items-center justify-center"
            style={{ backgroundColor: "#EAF0E7" }}
          >
            <HugeiconsIcon icon={Cancel01Icon} size={18} color="#5F7F58" />
          </View>
        </PressableScale>
      </View>

      <ScrollView
        className="flex-1 happy-brand-screen"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerClassName="gap-[18px] px-5 pb-12 pt-5"
        showsVerticalScrollIndicator={false}
      >
        {sections.length === 0 ? (
          <View className="items-center justify-center px-6 py-12">
            <Text variant="body" color="muted" className="text-center">
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

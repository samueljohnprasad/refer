import React, { useCallback } from "react";
import { ScrollView, View } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Cancel01Icon, LockIcon } from "@hugeicons/core-free-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Card } from "@/src/components/ui/Card";
import { Text } from "@/src/components/ui/Text";
import { PressableScale } from "@/src/components/ui/PressableScale";
import StageProgressBar from "@/src/components/ui/StageProgressBar";
import type { SectionOverviewItem } from "@/src/types/journey/sectionMap";

import { SAGE } from "@/lib/tokens";
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
  const lockStatusStr = !section.isUnlocked ? "Locked" : isComplete ? "Completed" : "Available";

  return (
    <Card
      variant={cardVariant}
      radius="xl"
      onPress={() => onPress(section.id)}
      disabled={false}
      accessibilityLabel={`${section.title}, ${unitRangeLabel}. Status: ${lockStatusStr}.`}
      accessibilityState={{ disabled: !section.isUnlocked }}
      className={`mb-4 ${section.isUnlocked ? "opacity-100" : "opacity-80"}`}
      contentClassName="gap-4 p-5"
    >
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1 gap-1 pr-1">
          <Text variant="h2" className="text-2xl leading-8 text-ink" numberOfLines={2} adjustsFontSizeToFit>
            {section.title}
          </Text>
          <Text variant="overline" color="muted" className="text-xs uppercase tracking-widest">
            {unitRangeLabel}
          </Text>
        </View>

        {section.isCurrent ? (
          <View className="rounded-full bg-sage-500 px-3 py-1">
            <Text variant="chip" color="surface" className="text-xs uppercase tracking-widest">
              Current
            </Text>
          </View>
        ) : isComplete ? (
          <View className="rounded-full bg-sage-100 px-3 py-1">
            <Text variant="chip" color="sage" className="text-xs uppercase tracking-widest">
              Done
            </Text>
          </View>
        ) : null}
      </View>


      <View className="gap-2 mt-1">
        <StageProgressBar
          progress={section.progressPercent}
          height={8}
          showGlow={section.isCurrent}
          fillColor={section.isCurrent ? SAGE[500] : SAGE[300]}
          trackColor={SAGE[100]}
        />

        <View className="flex-row items-center justify-between mt-1">
          <Text variant="caption" color="soft">
            {section.completedNodes}/{section.totalNodes} complete
          </Text>

          {!section.isCurrent ? (
            <View className="flex-row items-center gap-1.5">
              {!section.isUnlocked && (
                <HugeiconsIcon icon={LockIcon} size={14} color={SAGE[500]} />
              )}
              <Text variant="label-bold" color="sage" className="text-xs uppercase tracking-widest">
                {!section.isUnlocked ? "Unlock" : isComplete ? "Review" : "Enter"} →
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
      onClose();
    },
    [onPreviewSection, onClose],
  );

  return (
    <View className="flex-1 happy-brand-screen">
      <View
        className="flex-row items-start justify-between happy-brand-screen border-b border-sage-100 px-6 pb-5"
        style={{ paddingTop: Math.max(18, insets.top) }}
      >
        <View className="flex-1 pr-4">
          <Text variant="eyebrow">
            Journey Map
          </Text>
          <Text variant="display" className="text-3xl leading-snug text-ink" numberOfLines={2} adjustsFontSizeToFit>
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
          <View className="w-9 h-9 rounded-full items-center justify-center bg-sage-pill">
            <HugeiconsIcon icon={Cancel01Icon} size={18} color={SAGE[500]} />
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

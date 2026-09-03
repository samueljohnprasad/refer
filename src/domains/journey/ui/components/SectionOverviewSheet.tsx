import React from "react";
import { ScrollView, View } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Cancel01Icon, LockIcon } from "@hugeicons/core-free-icons";
import { Card } from "@/src/components/ui/Card";
import { Text } from "@/src/components/ui/Text";
import { PressableScale } from "@/src/components/ui/PressableScale";
import StageProgressBar from "@/src/components/ui/StageProgressBar";
import type { SectionOverviewItem } from "@/src/types/journey/sectionMap";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { RADIUS } from "@/src/theme/radius";
import {
  useSectionOverviewViewModel,
  type SectionOverviewSheetProps,
} from "../hooks/useSectionOverviewViewModel";

interface SectionCardProps {
  section: SectionOverviewItem;
  onPress: (sectionId: string) => void;
}

function SectionCard({
  section,
  onPress,
}: SectionCardProps): React.JSX.Element {
  const unitRangeLabel = `Section ${section.sectionNumber}`;
  const isComplete = section.progressPercent >= 100;

  const cardVariant = "answer";
  const lockStatusStr = !section.isUnlocked
    ? "Locked"
    : isComplete
    ? "Completed"
    : "Available";

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
          <Text
            variant="h2"
            className="text-2xl leading-8 text-ink"
            numberOfLines={2}
            adjustsFontSizeToFit
          >
            {section.title}
          </Text>
          <Text
            variant="body"
            color="muted"
            className="text-sm"
          >
            {unitRangeLabel}
          </Text>
        </View>

        {section.isCurrent ? (
          <View className="rounded-full bg-sage-500 px-3 py-1">
            <Text
              variant="chip"
              color="surface"
              className="text-xs uppercase tracking-widest"
            >
              Current
            </Text>
          </View>
        ) : null}
      </View>

      <View className="gap-2 mt-1">
        <StageProgressBar
          progress={section.progressPercent}
          height={8}
          showGlow={section.isCurrent}
          fillColor={section.isCurrent ? SEMANTIC_COLORS.brand.primary : SEMANTIC_COLORS.border.selected}
          trackColor={SEMANTIC_COLORS.brand.soft}
        />

        <View className="flex-row items-center justify-end mt-1">
          {!section.isCurrent ? (
            <View className="flex-row items-center gap-1.5">
              {!section.isUnlocked && (
                <HugeiconsIcon icon={LockIcon} size={14} color={SEMANTIC_COLORS.brand.primary} />
              )}
              <Text
                variant="label-bold"
                color="sage"
                className="text-xs uppercase tracking-widest"
              >
                {!section.isUnlocked ? "Unlock" : isComplete ? "Review" : "Enter"}{" "}
                →
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </Card>
  );
}

export interface SectionOverviewSheetViewProps
  extends ReturnType<typeof useSectionOverviewViewModel> {}

/**
 * Presentational View for SectionOverviewSheet.
 * Consists strictly of JSX code without internal hooks.
 */
export const SectionOverviewSheetView = React.memo(
  function SectionOverviewSheetView({
    insets,
    handlePreviewAndClose,
    sections,
    onClose,
    journeyTitle,
  }: SectionOverviewSheetViewProps): React.JSX.Element {
    return (
      <View className="flex-1 happy-brand-screen">
        <View className="flex-row items-start justify-between happy-brand-screen border-b border-sage-100 px-6 pt-5 pb-5">
          <View className="flex-1 pr-4">
            <Text variant="eyebrow">Journey Map</Text>
            <Text
              variant="display"
              className="text-3xl leading-snug text-ink"
              numberOfLines={2}
              adjustsFontSizeToFit
            >
              {journeyTitle}
            </Text>
          </View>
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
  },
);

/**
 * Container component for SectionOverviewSheet.
 */
export function SectionOverviewSheet(
  props: SectionOverviewSheetProps,
): React.JSX.Element {
  const viewModel = useSectionOverviewViewModel(props);
  return <SectionOverviewSheetView {...viewModel} />;
}

export default React.memo(SectionOverviewSheet);
export type { SectionOverviewSheetProps };

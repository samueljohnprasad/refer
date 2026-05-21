import React, { useCallback } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
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
  const cardBackgroundColor = section.isCurrent ? "#EEF2E8" : PALETTE.warmWhite;
  const borderColor = section.isCurrent
    ? PALETTE.sage500
    : isComplete
      ? "#D8F3DD"
      : PALETTE.sage100;
  const borderBottomColor = section.isCurrent
    ? PALETTE.sage600
    : isComplete
      ? "#C4E9CB"
      : PALETTE.sage100;

  return (
    <Pressable
      style={[
        styles.sectionCard,
        {
          backgroundColor: cardBackgroundColor,
          borderColor,
          borderBottomColor,
          opacity: section.isUnlocked ? 1 : 0.6,
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${section.title}, Section ${section.sectionNumber}, ${section.progressPercent}% complete`}
      onPress={() => onPress(section.id)}
    >
      <View style={styles.sectionCardInner}>
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionTitleColumn}>
            <Text style={styles.sectionTitle}>
              {section.title}
            </Text>
            <Text style={styles.sectionMeta}>
              {unitRangeLabel}
            </Text>
          </View>

          {section.isCurrent ? (
            <View style={styles.currentBadge}>
              <Text style={styles.currentBadgeText}>
                Current
              </Text>
            </View>
          ) : null}
        </View>

        {section.unitTitles.length > 0 ? (
          <View style={styles.unitPillList}>
            {section.unitTitles.map((unitTitle, index) => (
              <View
                key={`${section.id}-${unitTitle}-${index}`}
                style={styles.unitPill}
              >
                <JourneyUnitIcon
                  iconKey={section.unitIconKeys[index]}
                  size={14}
                  color={PALETTE.ink}
                  backgroundColor={PALETTE.warmWhite}
                />
                <Text style={styles.unitPillText}>
                  Unit {index + 1}
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        <View style={styles.progressTrack}>
          <View
            style={{
              height: "100%",
              width: `${section.progressPercent}%`,
              borderRadius: 999,
              backgroundColor: section.isCurrent ? PALETTE.sage500 : PALETTE.sage300,
            }}
          />
        </View>

        <View style={styles.cardFooterRow}>
          <Text style={styles.completionText}>
            {section.completedNodes}/{section.totalNodes} complete
          </Text>

          {!section.isCurrent ? (
            <Text style={styles.previewLabel}>
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
    <View style={styles.root}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>Journey Map</Text>
          <Text style={styles.title}>
            {journeyTitle}
          </Text>
          <Text style={styles.subtitle}>
            {sections.length} {sections.length === 1 ? "section" : "sections"}
          </Text>
        </View>
        <Pressable
          onPress={onClose}
          style={styles.closeButton}
          accessibilityRole="button"
          accessibilityLabel="Close section overview"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={20} color={PALETTE.sage600} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {sections.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
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

const styles = StyleSheet.create({
  cardFooterRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  closeButton: {
    alignItems: "center",
    backgroundColor: PALETTE.warmWhite,
    borderColor: PALETTE.sage100,
    borderBottomColor: PALETTE.sage200,
    borderBottomWidth: 4,
    borderRadius: 22,
    borderWidth: 2,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  completionText: {
    color: PALETTE.inkSoft,
    fontFamily: FONTS.body,
    fontSize: 15,
  },
  currentBadge: {
    backgroundColor: PALETTE.sage100,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  currentBadgeText: {
    color: PALETTE.sage700,
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  emptyText: {
    color: PALETTE.inkMuted,
    fontFamily: FONTS.body,
    fontSize: 15,
    textAlign: "center",
  },
  eyebrow: {
    color: PALETTE.sage500,
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },
  header: {
    alignItems: "flex-start",
    backgroundColor: PALETTE.cream,
    borderBottomColor: PALETTE.sage100,
    borderBottomWidth: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 20,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  previewLabel: {
    color: PALETTE.sage500,
    fontFamily: FONTS.bodyBold,
    fontSize: 14,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  progressTrack: {
    backgroundColor: PALETTE.sage100,
    borderRadius: 999,
    height: 10,
    marginBottom: 12,
    overflow: "hidden",
    width: "100%",
  },
  root: {
    backgroundColor: PALETTE.cream,
    flex: 1,
  },
  scrollContent: {
    gap: 18,
    paddingBottom: 32,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  scrollView: {
    backgroundColor: PALETTE.cream,
    flex: 1,
  },
  sectionCard: {
    borderBottomWidth: 5,
    borderRadius: 20,
    borderWidth: 2,
    padding: 14,
  },
  sectionCardInner: {
    backgroundColor: PALETTE.warmWhite,
    borderRadius: 16,
    gap: 16,
    padding: 18,
  },
  sectionHeaderRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  sectionMeta: {
    color: PALETTE.inkMuted,
    fontFamily: FONTS.bodyBold,
    fontSize: 15,
  },
  sectionTitle: {
    color: PALETTE.ink,
    fontFamily: FONTS.heading,
    fontSize: 27,
    lineHeight: 32,
  },
  sectionTitleColumn: {
    flex: 1,
    gap: 6,
    paddingRight: 8,
  },
  subtitle: {
    color: PALETTE.inkMuted,
    fontFamily: FONTS.body,
    fontSize: 16,
    marginTop: 4,
  },
  title: {
    color: PALETTE.ink,
    fontFamily: FONTS.heading,
    fontSize: 30,
    lineHeight: 34,
  },
  unitPill: {
    alignItems: "center",
    backgroundColor: PALETTE.sage50,
    borderRadius: 999,
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  unitPillList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  unitPillText: {
    color: PALETTE.ink,
    fontFamily: FONTS.bodyBold,
    fontSize: 13,
    marginLeft: 8,
  },
});

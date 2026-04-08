import React, { useMemo, useCallback, useRef, useEffect } from "react";
import { View, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import {
    BottomSheetModal,
    BottomSheetScrollView,
    BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import type { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import { SvgXml } from "react-native-svg";
import { getMascotSvg } from "@/src/data/journey";

import { useJourneyConfig } from "@/src/context/JourneyConfigContext";
import type { JourneyConfig } from "@/src/types/journey";
import type { SectionListItem } from "@/src/types/journey/sectionMap";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SectionCardData {
    id: string;
    sectionNumber: number;
    title: string;
    unitRangeLabel: string;
    cardBackgroundColor: string;
    mascotMessage: string;
    mascotSide: "left" | "right";
    mascotImageKey: string;
    progressPercent: number;
    totalNodes: number;
    completedNodes: number;
    isUnlocked: boolean;
    isCurrent: boolean;
}

export interface SectionOverviewSheetProps {
    /** Whether the sheet is open */
    isOpen: boolean;
    /** Close handler */
    onClose: () => void;
    /** Current unit index */
    currentUnitIndex: number;
    /** Per-unit completed node counts */
    unitCompletedCounts: Record<string, number>;
    /** Server-provided section list (from useSectionData) */
    sectionList: SectionListItem[];
    /** Current section's unit number (from sectionMap) */
    currentSectionUnitNumber: number;
    /** Jump to section handler — receives unitNumber */
    onJumpToSection: (unitNumber: number) => void;
    /** Journey title */
    journeyTitle: string;
}

// ---------------------------------------------------------------------------
// Helper: resolve mascot message from config
// ---------------------------------------------------------------------------

function resolveMascotMessage(
    messageKey: string,
    messages: Record<string, string>,
): string {
    return messages[messageKey] ?? messageKey;
}

// ---------------------------------------------------------------------------
// SectionCard sub-component
// ---------------------------------------------------------------------------

interface SectionCardProps {
    section: SectionCardData;
    onJump: (unitNumber: number) => void;
}

function SectionCard({ section, onJump }: SectionCardProps): React.JSX.Element {
    const isMascotRight: boolean = section.mascotSide === "right";

    return (
        <Pressable
            className="rounded-2xl mx-4 mb-4 overflow-hidden"
            style={{
                backgroundColor: section.cardBackgroundColor,
                opacity: section.isUnlocked ? 1 : 0.6,
            }}
            accessibilityRole="button"
            accessibilityLabel={`${section.title}, Section ${section.sectionNumber}, ${section.progressPercent}% complete`}
            onPress={() => onJump(section.sectionNumber)}
        >
            {/* Speech bubble + mascot area */}
            <View className="p-5 pb-3">
                <View
                    className={`flex-row items-end ${isMascotRight ? "" : "flex-row-reverse"}`}
                >
                    {/* Speech bubble */}
                    <View className="flex-1 mr-3">
                        <View
                            className="bg-white rounded-2xl px-4 py-3 mb-2"
                            style={{
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 0.05,
                                shadowRadius: 2,
                                elevation: 1,
                            }}
                        >
                            <Text
                                className="text-base font-medium"
                                style={{ color: "#1A202C" }}
                            >
                                {section.mascotMessage}
                            </Text>
                        </View>
                    </View>

                    {/* Mascot SVG from registry */}
                    <View className="items-center justify-center mb-2">
                        {(() => {
                            const xml: string | undefined = getMascotSvg(
                                section.mascotImageKey,
                            );
                            if (xml) {
                                return (
                                    <SvgXml
                                        xml={xml}
                                        width={64}
                                        height={64}
                                        accessibilityLabel="Mascot"
                                    />
                                );
                            }
                            return <Text className="text-5xl">🦉</Text>;
                        })()}
                    </View>
                </View>
            </View>

            {/* Section info bar */}
            <View className="bg-white mx-3 mb-3 rounded-xl px-4 py-3">
                <View className="flex-row items-center justify-between mb-2">
                    <Text
                        className="text-xl font-extrabold"
                        style={{ color: "#1A202C" }}
                    >
                        {section.title}
                    </Text>
                    <Text
                        className="text-sm font-semibold"
                        style={{ color: "#718096" }}
                    >
                        {section.unitRangeLabel}
                    </Text>
                </View>

                {/* Progress bar */}
                <View
                    className="w-full h-2.5 rounded-full overflow-hidden mb-2"
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

                {/* Jump here link for non-current sections */}
                {!section.isCurrent && section.isUnlocked && (
                    <Pressable
                        onPress={() => onJump(section.sectionNumber)}
                        accessibilityRole="button"
                        accessibilityLabel={`Jump to ${section.title}`}
                        className="mt-1 active:opacity-75"
                    >
                        <Text
                            className="text-sm font-extrabold uppercase tracking-wide"
                            style={{ color: section.cardBackgroundColor }}
                        >
                            JUMP HERE
                        </Text>
                    </Pressable>
                )}
            </View>
        </Pressable>
    );
}

// ---------------------------------------------------------------------------
// SectionOverviewSheet
// ---------------------------------------------------------------------------

export function SectionOverviewSheet({
    isOpen,
    onClose,
    currentUnitIndex,
    unitCompletedCounts,
    sectionList,
    currentSectionUnitNumber,
    onJumpToSection,
    journeyTitle,
}: SectionOverviewSheetProps): React.JSX.Element {
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ["90%"], []);
    const config: JourneyConfig = useJourneyConfig();

    // Present/dismiss based on isOpen prop
    useEffect(() => {
        if (isOpen) {
            bottomSheetRef.current?.present();
        } else {
            bottomSheetRef.current?.dismiss();
        }
    }, [isOpen]);

    const renderBackdrop = useCallback(
        (props: BottomSheetBackdropProps) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
                opacity={0.5}
                pressBehavior="close"
            />
        ),
        [],
    );

    const handleSheetChanges = useCallback(
        (index: number): void => {
            if (index === -1) {
                onClose();
            }
        },
        [onClose],
    );

    const handleJumpAndClose = useCallback(
        (unitNumber: number): void => {
            onJumpToSection(unitNumber);
            onClose();
        },
        [onJumpToSection, onClose],
    );

    const sectionCards: SectionCardData[] = useMemo(() => {
        // Derive card data from server-provided sectionList instead of deprecated config
        return sectionList.map((section: SectionListItem) => {
            const totalNodes: number = section.nodeCount;
            const isCurrent: boolean =
                section.unitNumber === currentSectionUnitNumber;
            // Sections up to and including current are unlocked
            const isUnlocked: boolean =
                section.unitNumber <= currentSectionUnitNumber;

            // Use the mascot messages from config (still client-side)
            const mascotMessageKey: string = `section_${section.unitNumber}_intro`;
            const mascotMessage: string = resolveMascotMessage(
                mascotMessageKey,
                config.mascotMessages,
            );

            // Derive completed node count from unitCompletedCounts
            // The key may be the section ID or unit number — check both
            const completedNodes: number =
                unitCompletedCounts[`section_${section.unitNumber}`] ?? 0;

            const progressPercent: number =
                totalNodes > 0 ? Math.round((completedNodes / totalNodes) * 100) : 0;

            // Map colorScheme to card background colors
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
                unitRangeLabel: `Section ${section.unitNumber}`,
                cardBackgroundColor: colorMap[section.colorScheme] ?? "#E0F2FE",
                mascotMessage,
                mascotSide:
                    section.unitNumber % 2 === 0 ? ("left" as const) : ("right" as const),
                mascotImageKey: isCurrent ? "owl_excited" : "owl_default",
                progressPercent,
                totalNodes,
                completedNodes,
                isUnlocked,
                isCurrent,
            };
        });
    }, [
        sectionList,
        currentSectionUnitNumber,
        unitCompletedCounts,
        config.mascotMessages,
    ]);

    return (
        <BottomSheetModal
            ref={bottomSheetRef}
            index={0}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
            backdropComponent={renderBackdrop}
            enablePanDownToClose
            backgroundStyle={{ backgroundColor: "white" }}
            handleIndicatorStyle={{ backgroundColor: "#E2E8F0" }}
        >
            {/* Header */}
            <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-100">
                <View>
                    <Text className="text-xl font-bold text-gray-900">
                        {journeyTitle}
                    </Text>
                    <Text className="text-sm text-gray-500">
                        {sectionCards.length}{" "}
                        {sectionCards.length === 1 ? "section" : "sections"}
                    </Text>
                </View>
                <Pressable
                    onPress={onClose}
                    className="p-2 rounded-full bg-gray-100"
                >
                    <Text
                        className="text-lg"
                        style={{ color: "#4A5568" }}
                    >
                        ✕
                    </Text>
                </Pressable>
            </View>

            {/* Content */}
            <BottomSheetScrollView
                className="flex-1"
                contentContainerClassName="py-4"
                showsVerticalScrollIndicator={false}
            >
                {sectionCards.length === 0 ? (
                    <View className="items-center justify-center py-12 px-6">
                        <Text className="text-gray-400 text-base text-center">
                            No sections available. Check your connection and try again.
                        </Text>
                    </View>
                ) : (
                    sectionCards.map((section: SectionCardData) => (
                        <SectionCard
                            key={section.id}
                            section={section}
                            onJump={handleJumpAndClose}
                        />
                    ))
                )}
            </BottomSheetScrollView>
        </BottomSheetModal>
    );
}

export default React.memo(SectionOverviewSheet);

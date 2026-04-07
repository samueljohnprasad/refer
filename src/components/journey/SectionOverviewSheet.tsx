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
import { JourneyConfig, SectionConfig, UnitConfig } from "@/src/types/journey";

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
    /** Jump to section handler */
    onJumpToSection: (sectionId: string) => void;
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
    onJump: (sectionId: string) => void;
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
            accessibilityLabel={`${section.title}, ${section.unitRangeLabel}, ${section.progressPercent}% complete`}
            onPress={() => onJump(section.id)}
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
                            backgroundColor: section.isCurrent ? section.cardBackgroundColor : "#A0AEC0",
                        }}
                    />
                </View>

                {/* Jump here link for non-current sections */}
                {!section.isCurrent && section.isUnlocked && (
                    <Pressable
                        onPress={() => onJump(section.id)}
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
        (sectionId: string): void => {
            onJumpToSection(sectionId);
            onClose();
        },
        [onJumpToSection, onClose],
    );

    const sectionCards: SectionCardData[] = useMemo(() => {
        return config.sections.map((section: SectionConfig) => {
            const sectionUnits: UnitConfig[] = section.unitIds
                .map((uid: string) =>
                    config.units.find((u: UnitConfig) => u.id === uid),
                )
                .filter(
                    (u: UnitConfig | undefined): u is UnitConfig => u !== undefined,
                );

            let totalNodes: number = 0;
            let completedNodes: number = 0;
            let isUnlocked: boolean = false;
            let isCurrent: boolean = false;

            sectionUnits.forEach((unit: UnitConfig) => {
                const unitIndex: number = config.units.findIndex(
                    (u: UnitConfig) => u.id === unit.id,
                );
                const nodeCount: number = unit.nodes.length;
                const completed: number = unitCompletedCounts[unit.id] ?? 0;

                totalNodes += nodeCount;
                completedNodes += completed;

                if (unitIndex <= currentUnitIndex) {
                    isUnlocked = true;
                }
                if (unitIndex === currentUnitIndex) {
                    isCurrent = true;
                }
            });

            const progressPercent: number =
                totalNodes > 0 ? Math.round((completedNodes / totalNodes) * 100) : 0;

            const mascotMessage: string = resolveMascotMessage(
                section.mascot.message,
                config.mascotMessages,
            );

            return {
                id: section.id,
                sectionNumber: section.sectionNumber,
                title: section.title,
                unitRangeLabel: section.unitRangeLabel,
                cardBackgroundColor: section.cardBackgroundColor,
                mascotMessage,
                mascotSide: section.mascot.side,
                mascotImageKey: section.mascot.imageKey,
                progressPercent,
                totalNodes,
                completedNodes,
                isUnlocked,
                isCurrent,
            };
        });
    }, [config, currentUnitIndex, unitCompletedCounts]);

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
                        {sectionCards.length} {sectionCards.length === 1 ? "section" : "sections"}
                    </Text>
                </View>
                <Pressable
                    onPress={onClose}
                    className="p-2 rounded-full bg-gray-100"
                >
                    <Text className="text-lg" style={{ color: "#4A5568" }}>✕</Text>
                </Pressable>
            </View>

            {/* Content */}
            <BottomSheetScrollView
                className="flex-1"
                contentContainerClassName="py-4"
                showsVerticalScrollIndicator={false}
            >
                {sectionCards.map((section: SectionCardData) => (
                    <SectionCard
                        key={section.id}
                        section={section}
                        onJump={handleJumpAndClose}
                    />
                ))}
            </BottomSheetScrollView>
        </BottomSheetModal>
    );
}

export default React.memo(SectionOverviewSheet);

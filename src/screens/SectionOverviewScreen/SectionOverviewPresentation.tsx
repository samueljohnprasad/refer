/**
 * SectionOverviewPresentation (Task 8)
 * Pure presentational component for the section overview screen.
 *
 * Matches Duolingo reference (Image 2):
 * - Scrollable list of section cards
 * - Each card: colored background, mascot image, speech bubble, title,
 *   unit range, progress bar, "JUMP HERE" link
 * - Close button header
 *
 * All data received via props — no context or state access.
 */

import React from "react";
import { View, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { SvgXml } from "react-native-svg";
import { getMascotSvg } from "@/src/data/journey";

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
    /** Mascot image key for SVG lookup */
    mascotImageKey: string;
    /** 0–100 progress percentage */
    progressPercent: number;
    /** Total nodes in this section */
    totalNodes: number;
    /** Completed nodes in this section */
    completedNodes: number;
    /** Whether user has reached this section */
    isUnlocked: boolean;
    /** Whether this is the user's current section */
    isCurrent: boolean;
}

export interface SectionOverviewPresentationProps {
    /** Journey title for the header */
    journeyTitle: string;
    /** Section cards data */
    sections: SectionCardData[];
    /** Close button handler */
    onClose: () => void;
    /** Jump to section handler */
    onJumpToSection: (sectionId: string) => void;
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
        <View
            className="rounded-2xl mx-4 mb-4 overflow-hidden"
            style={{
                backgroundColor: section.cardBackgroundColor,
                opacity: section.isUnlocked ? 1 : 0.6,
            }}
            accessibilityRole="summary"
            accessibilityLabel={`${section.title}, ${section.unitRangeLabel}, ${section.progressPercent}% complete`}
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
                                className="text-base"
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
                            backgroundColor: section.isCurrent ? "#58CC02" : "#A0AEC0",
                        }}
                    />
                </View>

                {/* Jump here link for non-current sections */}
                {!section.isCurrent && section.isUnlocked && (
                    <Pressable
                        onPress={() => onJump(section.id)}
                        accessibilityRole="button"
                        accessibilityLabel={`Jump to ${section.title}`}
                    >
                        <Text
                            className="text-sm font-bold uppercase tracking-wider"
                            style={{ color: "#1CB0F6" }}
                        >
                            JUMP HERE
                        </Text>
                    </Pressable>
                )}
            </View>
        </View>
    );
}

// ---------------------------------------------------------------------------
// SectionOverviewPresentation
// ---------------------------------------------------------------------------

function SectionOverviewPresentation({
    journeyTitle,
    sections,
    onClose,
    onJumpToSection,
}: SectionOverviewPresentationProps): React.JSX.Element {
    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
                <Pressable
                    onPress={onClose}
                    accessibilityRole="button"
                    accessibilityLabel="Close section overview"
                    className="p-2"
                >
                    <Text
                        className="text-2xl"
                        style={{ color: "#4A5568" }}
                    >
                        ✕
                    </Text>
                </Pressable>
                <Text
                    className="text-lg font-bold"
                    style={{ color: "#1A202C" }}
                >
                    {journeyTitle}
                </Text>
                <View className="w-10" />
            </View>

            {/* Section cards list */}
            <ScrollView
                className="flex-1"
                contentContainerClassName="py-4"
                showsVerticalScrollIndicator={false}
            >
                {sections.map((section: SectionCardData) => (
                    <SectionCard
                        key={section.id}
                        section={section}
                        onJump={onJumpToSection}
                    />
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

export default React.memo(SectionOverviewPresentation);

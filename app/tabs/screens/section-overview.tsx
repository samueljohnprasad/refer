/**
 * Section Overview Screen Route
 * Accessible from the guide-book button in the sticky unit header.
 * Wrapped in JourneyConfigProvider so config context is available.
 *
 * Lazy-loads SectionOverviewContainer to reduce initial JS bundle parse time
 * (~50-100KB of SVG strings deferred until first navigation).
 */

import React, { Suspense, useCallback } from "react";
import { ActivityIndicator, View } from "react-native";
import { useAtomValue } from "jotai";
import { router } from "expo-router";
import { JourneyConfigProvider } from "@/src/context/JourneyConfigContext";

const SectionOverviewContainer = React.lazy(
    () => import("@/src/screens/SectionOverviewScreen/SectionOverviewContainer"),
);
import { journeyStateAtom, journeyStatsAtom } from "@/src/store/journeyStore";
import type { JourneyState, UnitData } from "@/src/types/journey";
import { NodeStatus } from "@/src/types/journey";

export default function SectionOverviewRoute(): React.JSX.Element {
    const journeyState: JourneyState | null = useAtomValue(journeyStateAtom);

    const currentUnitIndex: number = journeyState?.currentUnit ?? 0;

    /** Compute completed node counts per unit from runtime state */
    const unitCompletedCounts: Record<string, number> = React.useMemo(() => {
        const counts: Record<string, number> = {};
        if (!journeyState?.units) return counts;

        journeyState.units.forEach((unit: UnitData) => {
            counts[unit.id] = unit.nodes.filter(
                (n) => n.status === NodeStatus.COMPLETED,
            ).length;
        });
        return counts;
    }, [journeyState?.units]);

    const handleClose = useCallback((): void => {
        router.back();
    }, []);

    const handleJumpToSection = useCallback((sectionId: string): void => {
        // Navigate back to journey map with the jumpToSection param
        router.navigate({
            pathname: "/tabs/(tabs)/insights",
            params: { jumpToSection: sectionId },
        });
    }, []);

    return (
        <JourneyConfigProvider>
            <Suspense
                fallback={
                    <View className="flex-1 items-center justify-center bg-gray-50">
                        <ActivityIndicator size="large" />
                    </View>
                }
            >
                <SectionOverviewContainer
                    currentUnitIndex={currentUnitIndex}
                    unitCompletedCounts={unitCompletedCounts}
                    onClose={handleClose}
                    onJumpToSection={handleJumpToSection}
                />
            </Suspense>
        </JourneyConfigProvider>
    );
}

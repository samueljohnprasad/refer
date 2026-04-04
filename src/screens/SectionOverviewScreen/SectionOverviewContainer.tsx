/**
 * SectionOverviewContainer (Task 8)
 * Container component — loads sections from config, computes progress,
 * and passes data to the presentation layer.
 *
 * Follows container/presentation pattern per coding standards.
 */

import React, { useMemo, useCallback } from 'react';
import { useJourneyConfig, useMascotMessage } from '@/src/context/JourneyConfigContext';
import SectionOverviewPresentation, { SectionCardData } from './SectionOverviewPresentation';
import { JourneyConfig, SectionConfig, UnitConfig } from '@/src/types/journey';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface SectionOverviewContainerProps {
    /** Current unit index the user is on (0-based) */
    currentUnitIndex: number;
    /** Per-unit completed node counts */
    unitCompletedCounts: Record<string, number>;
    /** Close handler */
    onClose: () => void;
    /** Jump to section handler */
    onJumpToSection: (sectionId: string) => void;
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
// Container
// ---------------------------------------------------------------------------

function SectionOverviewContainer({
    currentUnitIndex,
    unitCompletedCounts,
    onClose,
    onJumpToSection,
}: SectionOverviewContainerProps): React.JSX.Element {
    const config: JourneyConfig = useJourneyConfig();

    const sectionCards: SectionCardData[] = useMemo(() => {
        return config.sections.map((section: SectionConfig) => {
            const sectionUnits: UnitConfig[] = section.unitIds
                .map((uid: string) => config.units.find((u: UnitConfig) => u.id === uid))
                .filter((u: UnitConfig | undefined): u is UnitConfig => u !== undefined);

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
                progressPercent,
                totalNodes,
                completedNodes,
                isUnlocked,
                isCurrent,
            };
        });
    }, [config, currentUnitIndex, unitCompletedCounts]);

    const handleJump = useCallback(
        (sectionId: string): void => {
            onJumpToSection(sectionId);
        },
        [onJumpToSection],
    );

    return (
        <SectionOverviewPresentation
            journeyTitle="Wellness Journey"
            sections={sectionCards}
            onClose={onClose}
            onJumpToSection={handleJump}
        />
    );
}

export default React.memo(SectionOverviewContainer);

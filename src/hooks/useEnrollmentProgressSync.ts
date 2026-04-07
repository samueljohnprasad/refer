/**
 * useEnrollmentProgressSync
 * Watches journeyStateAtom for node completion changes and syncs
 * the progress back to the multi-journey enrollment store.
 *
 * This ensures the journey switcher always shows accurate progress
 * without requiring a server round-trip.
 *
 * Performance:
 * - Uses a selectAtom to derive a lightweight "completion signature"
 *   (completedNodes + totalNodes + currentUnit index) so the effect
 *   only fires on actual completion changes — NOT on every progress
 *   tick (0→0.1→0.2) or scroll event.
 *
 * Should be mounted once in JourneyMapContainer.
 */

import { useEffect, useRef } from "react";
import { useAtomValue, useAtom } from "jotai";
import { selectAtom } from "jotai/utils";

import type { JourneyState, UnitData } from "@/src/types/journey";
import type { JourneyEnrollment } from "@/src/types/journey";
import { NodeStatus } from "@/src/types/journey";
import {
    journeyStateAtom,
    activeJourneySlugAtom,
    journeyEnrollmentsAtom,
    saveMultiJourneyState,
} from "@/src/store/journeyStore";

// ---------------------------------------------------------------------------
// Lightweight completion signature derived from journeyStateAtom
// ---------------------------------------------------------------------------

/** Shape of the derived completion data — only changes on actual completions */
interface CompletionSignature {
    completedNodes: number;
    totalNodes: number;
    currentUnitIndex: number;
    currentUnitTitle: string | null;
}

/** Selector that extracts only completion-relevant data from journeyState */
function selectCompletionSignature(state: JourneyState): CompletionSignature {
    let completedNodes: number = 0;
    let totalNodes: number = 0;

    for (const unit of state.units) {
        totalNodes += unit.nodes.length;
        for (const node of unit.nodes) {
            if (node.status === NodeStatus.COMPLETED) {
                completedNodes++;
            }
        }
    }

    const currentUnitIndex: number = state.currentUnit;
    const currentUnit: UnitData | undefined = state.units[currentUnitIndex];
    const currentUnitTitle: string | null = currentUnit?.title ?? null;

    return { completedNodes, totalNodes, currentUnitIndex, currentUnitTitle };
}

/** Equality check — prevents re-render when signature hasn't changed */
function signaturesEqual(
    a: CompletionSignature,
    b: CompletionSignature,
): boolean {
    return (
        a.completedNodes === b.completedNodes &&
        a.totalNodes === b.totalNodes &&
        a.currentUnitIndex === b.currentUnitIndex &&
        a.currentUnitTitle === b.currentUnitTitle
    );
}

// ---------------------------------------------------------------------------
// Stable derived atom (created once, not per-render)
// ---------------------------------------------------------------------------

const completionSignatureAtom = selectAtom(
    journeyStateAtom,
    selectCompletionSignature,
    signaturesEqual,
);

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useEnrollmentProgressSync(): void {
    const signature: CompletionSignature = useAtomValue(completionSignatureAtom);
    const activeSlug: string | null = useAtomValue(activeJourneySlugAtom);
    const [enrollments, setEnrollments] = useAtom(journeyEnrollmentsAtom);

    // Track previous completed count to avoid unnecessary updates
    const prevCompletedRef = useRef<number>(-1);

    useEffect(() => {
        if (!activeSlug) return;

        const { completedNodes, totalNodes, currentUnitTitle } = signature;

        // Skip if nothing changed
        if (completedNodes === prevCompletedRef.current) return;
        prevCompletedRef.current = completedNodes;

        const progressPercent: number =
            totalNodes > 0 ? Math.round((completedNodes / totalNodes) * 100) : 0;

        // Check if this enrollment's progress actually differs
        const currentEnrollment: JourneyEnrollment | undefined = enrollments.find(
            (e: JourneyEnrollment) => e.slug === activeSlug,
        );
        if (
            currentEnrollment &&
            currentEnrollment.completedNodes === completedNodes &&
            currentEnrollment.currentUnitTitle === currentUnitTitle
        ) {
            return;
        }

        // Determine if journey is now completed
        const isCompleted: boolean = completedNodes >= totalNodes && totalNodes > 0;

        const updatedEnrollments: JourneyEnrollment[] = enrollments.map(
            (e: JourneyEnrollment): JourneyEnrollment => {
                if (e.slug !== activeSlug) return e;
                return {
                    ...e,
                    completedNodes,
                    totalNodes,
                    progressPercent,
                    currentUnitTitle,
                    status: isCompleted ? "completed" : e.status,
                };
            },
        );

        setEnrollments(updatedEnrollments);

        // Persist async (fire-and-forget)
        saveMultiJourneyState({
            activeJourneySlug: activeSlug,
            enrollments: updatedEnrollments,
        });
    }, [signature, activeSlug, enrollments, setEnrollments]);
}

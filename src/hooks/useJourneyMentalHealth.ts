/**
 * useJourneyMentalHealth
 * Primary hook for the mental health journey feature.
 *
 * Orchestrates the full data pipeline:
 * 1. Fetch MH journey template (with content JSONB) from Supabase
 * 2. Fetch user progress (reuses existing enrollment/progress system)
 * 3. Fetch streak + Insight Points
 * 4. Derive node statuses (LOCKED / ACTIVE / COMPLETED)
 * 5. Expose actions: startJourney, getNodeContent
 *
 * Designed to work alongside the existing useJourneyData hook.
 * This hook focuses on mental health content; the existing hook handles
 * the journey map rendering state (Jotai atoms, PathNodeData, etc.).
 */

import { useCallback, useEffect, useMemo, useState } from 'react';

import type {
    MentalHealthTemplateNode,
    UserStreak,
    IPTotals,
    NodeContent,
    UserNodeCompletion,
} from '@/src/types/journey/mentalHealth';
import type { UserJourneyProgress } from '@/src/types/journey/progress';
import { NodeStatus } from '@/src/types/journey/enums';
import {
    fetchMHJourneyTemplate,
    fetchMHJourneyCatalog,
    fetchUserStreak,
    fetchIPTotals,
    fetchJourneyCompletions,
    type MHJourneyTemplate,
    type MHTemplateUnit,
} from '@/src/lib/api/mentalHealthJourneyApi';
import { fetchUserProgress, enrollInJourney } from '@/src/lib/api/journeyApi';
import { useNetworkStatus } from '@/src/hooks/useNetworkStatus';

// ============================================================================
// Types
// ============================================================================

/** Status of a node derived from user progress */
export type DerivedNodeStatus = 'locked' | 'active' | 'completed';

/** A node with its derived status and content — ready for renderers */
export interface MHNodeWithStatus {
    /** The full template node data including content JSONB */
    node: MentalHealthTemplateNode;
    /** Derived status from user progress */
    status: DerivedNodeStatus;
    /** Whether this is the first incomplete node (the "current" node) */
    isCurrent: boolean;
    /** Section (unit) this node belongs to */
    sectionId: string;
    /** Section title */
    sectionTitle: string;
}

/** A section with its nodes and completion info */
export interface MHSectionWithProgress {
    id: string;
    unitNumber: number;
    title: string;
    description: string;
    colorScheme: string;
    unlockRule: string;
    nodes: MHNodeWithStatus[];
    completedCount: number;
    totalCount: number;
    isLocked: boolean;
    isComplete: boolean;
}

/** Return type for the hook */
export interface UseJourneyMentalHealthReturn {
    /** Whether initial data is loading */
    isLoading: boolean;
    /** Error message (null if no error) */
    error: string | null;
    /** The full journey template with content */
    template: MHJourneyTemplate | null;
    /** Sections with derived node statuses */
    sections: MHSectionWithProgress[];
    /** All nodes in a flat list with statuses */
    allNodes: MHNodeWithStatus[];
    /** The current active node (first incomplete) */
    currentNode: MHNodeWithStatus | null;
    /** Journey progress stats */
    progress: {
        completedNodes: number;
        totalNodes: number;
        progressPercent: number;
        currentSectionIndex: number;
    };
    /** User's streak data */
    streak: UserStreak | null;
    /** Insight Points totals */
    ipTotals: IPTotals;
    /** Node completions for this journey (for mood comparison, etc.) */
    completions: UserNodeCompletion[];
    /** Enrollment ID (needed for node completion API) */
    enrollmentId: string | null;
    /** Journey ID */
    journeyId: string | null;
    /** Start the journey (enroll if not enrolled) */
    startJourney: () => Promise<boolean>;
    /** Get content for a specific node by ID */
    getNodeContent: (nodeId: string) => NodeContent | null;
    /** Get a node with status by ID */
    getNodeById: (nodeId: string) => MHNodeWithStatus | null;
    /** Refresh all data */
    refresh: () => Promise<void>;
}

// ============================================================================
// Defaults
// ============================================================================

const DEFAULT_IP_TOTALS: IPTotals = { totalIp: 0, todayIp: 0, weekIp: 0 };

const DEFAULT_PROGRESS = {
    completedNodes: 0,
    totalNodes: 0,
    progressPercent: 0,
    currentSectionIndex: 0,
};

// ============================================================================
// Helpers
// ============================================================================

/**
 * Derive node statuses from user progress data.
 * Uses the sparse storage semantics from the existing system:
 * - Node with progress row 'completed' → COMPLETED
 * - Node with progress row 'active' → ACTIVE
 * - Node with no row → LOCKED
 */
function deriveNodeStatuses(
    template: MHJourneyTemplate,
    userProgress: UserJourneyProgress | null,
): MHSectionWithProgress[] {
    // Build lookup: nodeId → status from user progress
    const nodeStatusMap: Map<string, string> = new Map();
    if (userProgress) {
        for (const np of userProgress.nodeProgress) {
            nodeStatusMap.set(np.nodeId, np.status);
        }
    }

    const currentUnitNumber: number = userProgress?.enrollment.currentUnitNumber ?? 1;
    let foundCurrentNode: boolean = false;

    return template.units.map((unit: MHTemplateUnit): MHSectionWithProgress => {
        const isUnitLocked: boolean = unit.unitNumber > currentUnitNumber;

        const nodesWithStatus: MHNodeWithStatus[] = unit.nodes.map(
            (node: MentalHealthTemplateNode): MHNodeWithStatus => {
                let status: DerivedNodeStatus = 'locked';

                if (isUnitLocked) {
                    status = 'locked';
                } else {
                    const progressStatus: string | undefined = nodeStatusMap.get(node.id);
                    if (progressStatus === NodeStatus.COMPLETED || progressStatus === 'completed') {
                        status = 'completed';
                    } else if (progressStatus === NodeStatus.ACTIVE || progressStatus === 'active') {
                        status = 'active';
                    } else if (!foundCurrentNode && !isUnitLocked) {
                        // First node without progress in an unlocked unit = active
                        status = 'active';
                    }
                }

                const isCurrent: boolean = status === 'active' && !foundCurrentNode;
                if (isCurrent) {
                    foundCurrentNode = true;
                }

                return {
                    node,
                    status,
                    isCurrent,
                    sectionId: unit.id,
                    sectionTitle: unit.title,
                };
            },
        );

        const completedCount: number = nodesWithStatus.filter(
            (n: MHNodeWithStatus) => n.status === 'completed',
        ).length;

        return {
            id: unit.id,
            unitNumber: unit.unitNumber,
            title: unit.title,
            description: unit.description,
            colorScheme: unit.colorScheme,
            unlockRule: unit.unlockRule,
            nodes: nodesWithStatus,
            completedCount,
            totalCount: unit.nodes.length,
            isLocked: isUnitLocked,
            isComplete: completedCount === unit.nodes.length,
        };
    });
}

// ============================================================================
// Hook
// ============================================================================

export function useJourneyMentalHealth(
    slug: string | null,
): UseJourneyMentalHealthReturn {
    // ── State ──
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [template, setTemplate] = useState<MHJourneyTemplate | null>(null);
    const [userProgress, setUserProgress] = useState<UserJourneyProgress | null>(null);
    const [streak, setStreak] = useState<UserStreak | null>(null);
    const [ipTotals, setIpTotals] = useState<IPTotals>(DEFAULT_IP_TOTALS);
    const [completions, setCompletions] = useState<UserNodeCompletion[]>([]);
    const [enrollmentId, setEnrollmentId] = useState<string | null>(null);

    const { isOnline } = useNetworkStatus();

    // ── Derived: sections with node statuses ──
    const sections: MHSectionWithProgress[] = useMemo(() => {
        if (!template) return [];
        return deriveNodeStatuses(template, userProgress);
    }, [template, userProgress]);

    // ── Derived: flat list of all nodes ──
    const allNodes: MHNodeWithStatus[] = useMemo(() => {
        return sections.flatMap((s: MHSectionWithProgress) => s.nodes);
    }, [sections]);

    // ── Derived: current active node ──
    const currentNode: MHNodeWithStatus | null = useMemo(() => {
        return allNodes.find((n: MHNodeWithStatus) => n.isCurrent) ?? null;
    }, [allNodes]);

    // ── Derived: progress stats ──
    const progress = useMemo(() => {
        if (!template) return DEFAULT_PROGRESS;

        const completedNodes: number = allNodes.filter(
            (n: MHNodeWithStatus) => n.status === 'completed',
        ).length;
        const totalNodes: number = allNodes.length;
        const progressPercent: number = totalNodes > 0
            ? Math.round((completedNodes / totalNodes) * 100)
            : 0;
        const currentSectionIndex: number = sections.findIndex(
            (s: MHSectionWithProgress) => !s.isComplete && !s.isLocked,
        );

        return {
            completedNodes,
            totalNodes,
            progressPercent,
            currentSectionIndex: currentSectionIndex >= 0 ? currentSectionIndex : 0,
        };
    }, [template, allNodes, sections]);

    // ── Core data fetch ──
    const loadData = useCallback(
        async (journeySlug: string): Promise<void> => {
            setIsLoading(true);
            setError(null);

            try {
                // 1. Fetch template
                const templateRes = await fetchMHJourneyTemplate(journeySlug);
                if (!templateRes.success || !templateRes.data) {
                    setError(templateRes.error ?? 'Failed to load journey');
                    setIsLoading(false);
                    return;
                }

                const fetchedTemplate: MHJourneyTemplate = templateRes.data;
                setTemplate(fetchedTemplate);

                // 2. Fetch user progress (uses existing RPC)
                if (isOnline) {
                    const progressRes = await fetchUserProgress(fetchedTemplate.id);
                    if (progressRes.success && progressRes.data) {
                        setUserProgress(progressRes.data);
                        setEnrollmentId(progressRes.data.enrollment.id);
                    }
                }

                // 3. Fetch streak + IP totals in parallel
                const [streakRes, ipRes] = await Promise.all([
                    fetchUserStreak(),
                    fetchIPTotals(),
                ]);

                if (streakRes.success && streakRes.data) {
                    setStreak(streakRes.data);
                }
                if (ipRes.success) {
                    setIpTotals(ipRes.data);
                }

                // 4. Fetch completions for this journey
                const completionsRes = await fetchJourneyCompletions(fetchedTemplate.id);
                if (completionsRes.success) {
                    setCompletions(completionsRes.data);
                }
            } catch (err) {
                console.error('[useJourneyMentalHealth] Unexpected error:', err);
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setIsLoading(false);
            }
        },
        [isOnline],
    );

    // ── Auto-load on slug change ──
    useEffect(() => {
        if (slug) {
            loadData(slug);
        }
    }, [slug, loadData]);

    // ── Actions ──

    /** Start (enroll in) the journey */
    const startJourney = useCallback(async (): Promise<boolean> => {
        if (!template || !isOnline) return false;

        const firstNodeId: string | undefined = template.units[0]?.nodes[0]?.id;
        if (!firstNodeId) return false;

        try {
            const enrollRes = await enrollInJourney({
                journeyId: template.id,
                templateVersion: template.version,
                firstNodeId,
            });

            if (enrollRes.success && enrollRes.data) {
                setUserProgress(enrollRes.data);
                setEnrollmentId(enrollRes.data.enrollment.id);
                return true;
            }

            console.warn('[useJourneyMentalHealth] Enrollment failed:', enrollRes.error);
            return false;
        } catch (err) {
            console.error('[useJourneyMentalHealth] startJourney error:', err);
            return false;
        }
    }, [template, isOnline]);

    /** Get content JSONB for a node by ID */
    const getNodeContent = useCallback(
        (nodeId: string): NodeContent | null => {
            if (!template) return null;

            for (const unit of template.units) {
                const found: MentalHealthTemplateNode | undefined = unit.nodes.find(
                    (n: MentalHealthTemplateNode) => n.id === nodeId,
                );
                if (found) return found.content;
            }
            return null;
        },
        [template],
    );

    /** Get a node with status by ID */
    const getNodeById = useCallback(
        (nodeId: string): MHNodeWithStatus | null => {
            return allNodes.find((n: MHNodeWithStatus) => n.node.id === nodeId) ?? null;
        },
        [allNodes],
    );

    /** Refresh all data */
    const refresh = useCallback(async (): Promise<void> => {
        if (slug) await loadData(slug);
    }, [slug, loadData]);

    return {
        isLoading,
        error,
        template,
        sections,
        allNodes,
        currentNode,
        progress,
        streak,
        ipTotals,
        completions,
        enrollmentId,
        journeyId: template?.id ?? null,
        startJourney,
        getNodeContent,
        getNodeById,
        refresh,
    };
}

// ============================================================================
// Re-export the catalog hook for convenience
// ============================================================================

export { fetchMHJourneyCatalog };

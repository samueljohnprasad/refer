/**
 * useJourneyMapDataAdapter (P1.4.3)
 *
 * Transforms relational DB data (MentalHealthTemplateNode[]) into the
 * PathNodeData[] + UnitConfig[] shape that MultiUnitPresentation consumes.
 *
 * Input:  { journey, sections, nodes, userNodeCompletions } from useJourney
 * Output: PathNodeData[] compatible with MultiUnitPresentation / JourneyMapContainer
 *
 * For each node, computes:
 * - id, type, status (LOCKED/ACTIVE/COMPLETED), icon, label, progress
 * - Groups nodes by section for UnitConfig[] generation
 * - Adds section divider data between sections
 * - Handles daily bonus node injection at map top (placeholder)
 */

import { useMemo } from 'react';

import { NodeStatus, NodeType, NodeIcon, JourneyRewardType, UnitColorScheme } from '@/src/types/journey/enums';
import type { PathNodeData, JourneyReward } from '@/src/types/journey/node';
import type { UnitData, MascotPlacement } from '@/src/types/journey/unit';
import type { UnitConfig, UnitDividerConfig, UnitNodeConfig } from '@/src/types/journey/config';
import type {
    MentalHealthTemplateNode,
    NodeContent,
    UserNodeCompletion,
} from '@/src/types/journey/mentalHealth';
import {
    resolveNodeMapping,
    resolveVariantKey,
    resolveColorThemeKey,
    resolveNodeType,
    resolveNodeIcon,
} from '@/src/lib/journey/mentalHealthNodeMapping';
import type { MentalHealthNodeMapping } from '@/src/lib/journey/mentalHealthNodeMapping';

// ============================================================================
// Types
// ============================================================================

/** A section grouping as returned by the mental health DB schema */
export interface MentalHealthSection {
    id: string;
    sectionNumber: number;
    title: string;
    description: string;
    colorThemeKey: string;
}

/** Input data for the adapter */
export interface JourneyMapAdapterInput {
    /** Journey ID */
    journeyId: string;
    /** Journey title */
    journeyTitle: string;
    /** Sections in display order */
    sections: MentalHealthSection[];
    /** All nodes in the journey, in order */
    nodes: MentalHealthTemplateNode[];
    /** User's node completions (sparse — locked nodes absent) */
    completions: UserNodeCompletion[];
    /** ID of the currently active node (derived from enrollment state) */
    activeNodeId: string | null;
    /** Color theme key from the journey template */
    journeyColorThemeKey?: string;
}

/** Output data from the adapter */
export interface JourneyMapAdapterOutput {
    /** Runtime unit data for the scroll map */
    units: UnitData[];
    /** Static unit configs for ConfigDrivenNode rendering */
    unitConfigs: UnitConfig[];
    /** Map of nodeId → full MentalHealthTemplateNode (for opening renderers) */
    nodeContentMap: Map<string, MentalHealthTemplateNode>;
    /** The daily bonus node (if injected) */
    dailyBonusNode: PathNodeData | null;
}

// ============================================================================
// Constants
// ============================================================================

const DAILY_BONUS_NODE_ID = '__daily_bonus__';
const DAILY_BONUS_XP = 15;

/** Color theme key → UnitColorScheme mapping */
const THEME_TO_COLOR_SCHEME: Record<string, UnitColorScheme> = {
    green: UnitColorScheme.GREEN,
    blue: UnitColorScheme.BLUE,
    purple: UnitColorScheme.PURPLE,
    orange: UnitColorScheme.ORANGE,
    pink: UnitColorScheme.PINK,
    indigo: UnitColorScheme.PURPLE,
    teal: UnitColorScheme.GREEN,
    rose: UnitColorScheme.PINK,
};

// ============================================================================
// Pure helper functions
// ============================================================================

/** Determine node status from completions + active node ID */
function resolveStatus(
    nodeId: string,
    activeNodeId: string | null,
    completionMap: Map<string, UserNodeCompletion>,
): NodeStatus {
    if (completionMap.has(nodeId)) {
        return NodeStatus.COMPLETED;
    }
    if (nodeId === activeNodeId) {
        return NodeStatus.ACTIVE;
    }
    return NodeStatus.LOCKED;
}

/** Convert a MentalHealthTemplateNode → PathNodeData */
function toPathNodeData(
    node: MentalHealthTemplateNode,
    index: number,
    status: NodeStatus,
): PathNodeData {
    const mapping: MentalHealthNodeMapping = resolveNodeMapping(node.nodeType);

    const rewards: JourneyReward[] = node.rewards.map((r) => ({
        type: r.type as JourneyRewardType,
        amount: r.amount,
        icon: r.icon,
    }));

    return {
        id: node.id,
        index,
        type: mapping.nodeType,
        status,
        icon: mapping.nodeIcon,
        progress: status === NodeStatus.ACTIVE ? 0 : undefined,
        label: node.title ?? mapping.label,
        taskId: node.taskId,
        rewards,
    };
}

/** Convert a MentalHealthTemplateNode → UnitNodeConfig */
function toUnitNodeConfig(node: MentalHealthTemplateNode): UnitNodeConfig {
    return {
        variantKey: resolveVariantKey(node.nodeType, node.variantKey),
        taskId: node.taskId,
        taskType: node.nodeType,
        label: node.title ?? undefined,
    };
}

/** Create the daily bonus PathNodeData placeholder */
function createDailyBonusNode(): PathNodeData {
    return {
        id: DAILY_BONUS_NODE_ID,
        index: 0,
        type: NodeType.LESSON,
        status: NodeStatus.ACTIVE,
        icon: NodeIcon.STAR,
        label: '✨ Daily Practice',
        taskId: DAILY_BONUS_NODE_ID,
        rewards: [{ type: JourneyRewardType.XP, amount: DAILY_BONUS_XP, icon: '⚡' }],
    };
}

/** Group nodes by section based on node ordering and section boundaries */
function groupNodesBySection(
    nodes: MentalHealthTemplateNode[],
    sections: MentalHealthSection[],
): Map<string, MentalHealthTemplateNode[]> {
    const groups: Map<string, MentalHealthTemplateNode[]> = new Map();

    // Initialize groups for each section
    for (const section of sections) {
        groups.set(section.id, []);
    }

    // Distribute nodes across sections evenly if no explicit section assignment
    // In the real DB schema, nodes belong to units which belong to sections.
    // For now, distribute proportionally.
    if (sections.length === 0) return groups;

    const nodesPerSection: number = Math.ceil(nodes.length / sections.length);
    for (let i = 0; i < nodes.length; i++) {
        const sectionIdx: number = Math.min(
            Math.floor(i / nodesPerSection),
            sections.length - 1,
        );
        const sectionId: string = sections[sectionIdx].id;
        const group: MentalHealthTemplateNode[] | undefined = groups.get(sectionId);
        if (group) {
            group.push(nodes[i]);
        }
    }

    return groups;
}

// ============================================================================
// Hook
// ============================================================================

/**
 * Transform mental health journey DB data into the format
 * MultiUnitPresentation expects.
 */
export function useJourneyMapDataAdapter(
    input: JourneyMapAdapterInput | null,
): JourneyMapAdapterOutput {
    return useMemo<JourneyMapAdapterOutput>(() => {
        if (!input) {
            return {
                units: [],
                unitConfigs: [],
                nodeContentMap: new Map(),
                dailyBonusNode: null,
            };
        }

        const {
            journeyId,
            sections,
            nodes,
            completions,
            activeNodeId,
            journeyColorThemeKey,
        } = input;

        // ── Build completion lookup map ──
        const completionMap: Map<string, UserNodeCompletion> = new Map(
            completions.map((c: UserNodeCompletion) => [c.nodeId, c]),
        );

        // ── Build node content map (for opening renderers on press) ──
        const nodeContentMap: Map<string, MentalHealthTemplateNode> = new Map(
            nodes.map((n: MentalHealthTemplateNode) => [n.id, n]),
        );

        // ── Group nodes by section ──
        const nodeGroups: Map<string, MentalHealthTemplateNode[]> = groupNodesBySection(
            nodes,
            sections,
        );

        // ── Build UnitData[] and UnitConfig[] ──
        const units: UnitData[] = [];
        const unitConfigs: UnitConfig[] = [];

        for (const section of sections) {
            const sectionNodes: MentalHealthTemplateNode[] = nodeGroups.get(section.id) ?? [];
            if (sectionNodes.length === 0) continue;

            const colorThemeKey: string = resolveColorThemeKey(
                sectionNodes[0]?.nodeType ?? 'learn',
                section.colorThemeKey || journeyColorThemeKey,
            );
            const colorScheme: UnitColorScheme =
                THEME_TO_COLOR_SCHEME[colorThemeKey] ?? UnitColorScheme.GREEN;

            // Build PathNodeData[] for this section
            const pathNodes: PathNodeData[] = sectionNodes.map(
                (node: MentalHealthTemplateNode, idx: number) => {
                    const status: NodeStatus = resolveStatus(node.id, activeNodeId, completionMap);
                    return toPathNodeData(node, idx, status);
                },
            );

            // Build UnitNodeConfig[] for this section
            const unitNodeConfigs: UnitNodeConfig[] = sectionNodes.map(toUnitNodeConfig);

            // Count completed in section
            const completedCount: number = pathNodes.filter(
                (n: PathNodeData) => n.status === NodeStatus.COMPLETED,
            ).length;

            const unitId: string = `unit_${section.id}`;

            const unitData: UnitData = {
                id: unitId,
                sectionId: section.id,
                sectionNumber: section.sectionNumber,
                globalUnitNumber: section.sectionNumber,
                unitNumber: section.sectionNumber,
                title: section.title,
                description: section.description,
                iconKey: 'unit-icon',
                colorScheme,
                nodes: pathNodes,
                mascotPlacements: [],
            };

            // Build UnitConfig
            const divider: UnitDividerConfig = {
                title: section.title,
            };

            const unitConfig: UnitConfig = {
                id: unitId,
                unitNumber: section.sectionNumber,
                title: section.title,
                description: section.description,
                colorThemeKey,
                sectionId: section.id,
                nodes: unitNodeConfigs,
                mascotPlacements: [],
                divider,
            };

            units.push(unitData);
            unitConfigs.push(unitConfig);
        }

        // ── Daily bonus node ──
        const dailyBonusNode: PathNodeData = createDailyBonusNode();

        return {
            units,
            unitConfigs,
            nodeContentMap,
            dailyBonusNode,
        };
    }, [input]);
}

export default useJourneyMapDataAdapter;

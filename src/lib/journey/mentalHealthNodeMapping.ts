/**
 * Mental Health Node Mapping (P1.4.2)
 *
 * Maps `MentalHealthNodeType` → config-driven node properties.
 * Bridges the mental health content system with the existing
 * `ConfigDrivenNode` / `PathNodeData` journey map infrastructure.
 *
 * Pure functions — no React hooks, no side effects.
 */

import { NodeType, NodeIcon, NodeStatus, JourneyRewardType } from '@/src/types/journey/enums';
import { MentalHealthNodeType } from '@/src/types/journey/mentalHealth';
import type { MentalHealthTemplateNode, NodeContent } from '@/src/types/journey/mentalHealth';
import type { UnitNodeConfig, NodeIconConfig, NodeColorConfig } from '@/src/types/journey/config';
import type { PathNodeData, JourneyReward } from '@/src/types/journey/node';

// ============================================================================
// Types
// ============================================================================

/** Resolved mapping for a single mental health node type */
export interface MentalHealthNodeMapping {
    /** Key into NODE_VARIANT_REGISTRY (e.g., 'learn', 'exercise') */
    variantKey: string;
    /** Default color theme key (e.g., 'blue', 'green', 'purple') */
    defaultColorTheme: string;
    /** Mapped to existing NodeType for PathNodeData.type */
    nodeType: NodeType;
    /** Default icon for PathNodeData.icon */
    nodeIcon: NodeIcon;
    /** Emoji for display in renderers and labels */
    emoji: string;
    /** Human-readable label */
    label: string;
}

// ============================================================================
// Constants
// ============================================================================

/**
 * Master mapping table: MentalHealthNodeType → config-driven properties.
 * Adding a new node type = one entry here + one NodeVariantConfig in journeyConfig.ts.
 */
const NODE_TYPE_MAP: Record<string, MentalHealthNodeMapping> = {
    [MentalHealthNodeType.LEARN]: {
        variantKey: 'learn',
        defaultColorTheme: 'blue',
        nodeType: NodeType.LESSON,
        nodeIcon: NodeIcon.BOOK,
        emoji: '📖',
        label: 'Learn',
    },
    [MentalHealthNodeType.EXERCISE]: {
        variantKey: 'exercise',
        defaultColorTheme: 'green',
        nodeType: NodeType.LESSON,
        nodeIcon: NodeIcon.BRAIN,
        emoji: '🏋️',
        label: 'Exercise',
    },
    [MentalHealthNodeType.JOURNAL]: {
        variantKey: 'journal',
        defaultColorTheme: 'purple',
        nodeType: NodeType.LESSON,
        nodeIcon: NodeIcon.JOURNAL,
        emoji: '✍️',
        label: 'Journal',
    },
    [MentalHealthNodeType.QUIZ]: {
        variantKey: 'quiz',
        defaultColorTheme: 'orange',
        nodeType: NodeType.LESSON,
        nodeIcon: NodeIcon.QUIZ,
        emoji: '❓',
        label: 'Quiz',
    },
    [MentalHealthNodeType.MOOD_CHECK]: {
        variantKey: 'mood_check',
        defaultColorTheme: 'teal',
        nodeType: NodeType.LESSON,
        nodeIcon: NodeIcon.MOOD_CHECK,
        emoji: '🪞',
        label: 'Mood Check',
    },
    [MentalHealthNodeType.CHECKPOINT]: {
        variantKey: 'checkpoint',
        defaultColorTheme: 'indigo',
        nodeType: NodeType.CHECKPOINT,
        nodeIcon: NodeIcon.CHECKPOINT,
        emoji: '⭐',
        label: 'Checkpoint',
    },
    [MentalHealthNodeType.CHEST]: {
        variantKey: 'chest',
        defaultColorTheme: 'orange',
        nodeType: NodeType.CHEST,
        nodeIcon: NodeIcon.CHEST,
        emoji: '🎁',
        label: 'Treasure Chest',
    },
    [MentalHealthNodeType.TROPHY]: {
        variantKey: 'trophy',
        defaultColorTheme: 'orange',
        nodeType: NodeType.TROPHY,
        nodeIcon: NodeIcon.STAR, // We can reuse star icon or create a new one, but trophy uses emoji
        emoji: '🏆',
        label: 'Unit Trophy',
    },
    [MentalHealthNodeType.PRACTICE]: {
        variantKey: 'exercise',
        defaultColorTheme: 'green',
        nodeType: NodeType.LESSON,
        nodeIcon: NodeIcon.PRACTICE,
        emoji: '🔄',
        label: 'Practice',
    },
    [MentalHealthNodeType.AI_INSIGHT]: {
        variantKey: 'star',
        defaultColorTheme: 'purple',
        nodeType: NodeType.LESSON,
        nodeIcon: NodeIcon.STAR,
        emoji: '🤖',
        label: 'AI Insight',
    },
    [MentalHealthNodeType.LESSON]: {
        variantKey: 'star',
        defaultColorTheme: 'green',
        nodeType: NodeType.LESSON,
        nodeIcon: NodeIcon.BOOK,
        emoji: '📖',
        label: 'Lesson',
    },
};

/** Fallback mapping for unknown node types */
const FALLBACK_MAPPING: MentalHealthNodeMapping = {
    variantKey: 'star',
    defaultColorTheme: 'green',
    nodeType: NodeType.LESSON,
    nodeIcon: NodeIcon.BOOK,
    emoji: '📚',
    label: 'Activity',
};

// ============================================================================
// Pure mapping functions
// ============================================================================

/**
 * Resolve the full mapping for a given node type string.
 * Falls back gracefully for unknown types.
 */
export function resolveNodeMapping(nodeType: string): MentalHealthNodeMapping {
    return NODE_TYPE_MAP[nodeType] ?? FALLBACK_MAPPING;
}

/**
 * Get the variant key for a node type.
 * If the node has a custom `variantKey`, use that; otherwise derive from nodeType.
 */
export function resolveVariantKey(
    nodeType: string,
    customVariantKey?: string | null,
): string {
    if (customVariantKey && customVariantKey.length > 0) {
        return customVariantKey;
    }
    return resolveNodeMapping(nodeType).variantKey;
}

/**
 * Get the color theme key for a node type.
 * If the node has a custom `colorThemeKey`, use that; otherwise derive from nodeType.
 */
export function resolveColorThemeKey(
    nodeType: string,
    customColorThemeKey?: string | null,
): string {
    if (customColorThemeKey && customColorThemeKey.length > 0) {
        return customColorThemeKey;
    }
    return resolveNodeMapping(nodeType).defaultColorTheme;
}

/**
 * Map MentalHealthNodeType string → existing NodeType enum.
 * Used when building PathNodeData for the scroll map.
 */
export function resolveNodeType(nodeType: string): NodeType {
    return resolveNodeMapping(nodeType).nodeType;
}

/**
 * Map MentalHealthNodeType string → NodeIcon enum.
 */
export function resolveNodeIcon(nodeType: string): NodeIcon {
    return resolveNodeMapping(nodeType).nodeIcon;
}

/**
 * Get the display emoji for a node type.
 */
export function resolveNodeEmoji(nodeType: string): string {
    return resolveNodeMapping(nodeType).emoji;
}

/**
 * Get the human-readable label for a node type.
 */
export function resolveNodeLabel(nodeType: string): string {
    return resolveNodeMapping(nodeType).label;
}

// ============================================================================
// Template node → Config node conversion
// ============================================================================

/**
 * Convert a MentalHealthTemplateNode into a UnitNodeConfig
 * for the config-driven journey map system.
 */
export function templateNodeToUnitNodeConfig(
    node: MentalHealthTemplateNode,
): UnitNodeConfig {
    const variantKey: string = resolveVariantKey(node.nodeType, node.variantKey);

    return {
        variantKey,
        taskId: node.taskId,
        taskType: node.nodeType,
        label: node.title ?? undefined,
        rewardOverrides: node.rewards.length > 0
            ? node.rewards.map((r) => ({
                type: r.type as JourneyRewardType,
                amount: r.amount,
                icon: r.icon,
            }))
            : undefined,
    };
}

/**
 * Convert a MentalHealthTemplateNode into a PathNodeData
 * for the runtime map scroll view.
 *
 * Status must be determined externally (from user_node_completions).
 */
export function templateNodeToPathNodeData(
    node: MentalHealthTemplateNode,
    index: number,
    status: NodeStatus,
    progress?: number,
): PathNodeData {
    const mapping: MentalHealthNodeMapping = resolveNodeMapping(node.nodeType);

    return {
        id: node.id,
        index,
        type: mapping.nodeType,
        status,
        icon: mapping.nodeIcon,
        progress: status === NodeStatus.ACTIVE ? (progress ?? 0) : undefined,
        label: node.title ?? mapping.label,
        taskId: node.taskId,
        rewards: node.rewards.map((r) => ({
            type: r.type as JourneyRewardType,
            amount: r.amount,
            icon: r.icon,
        })),
    };
}

/**
 * Batch convert an array of template nodes into PathNodeData[].
 * Requires a status resolver function that determines each node's status.
 */
export function templateNodesToPathNodes(
    nodes: MentalHealthTemplateNode[],
    statusResolver: (nodeId: string) => NodeStatus,
    progressResolver?: (nodeId: string) => number | undefined,
): PathNodeData[] {
    return nodes.map((node: MentalHealthTemplateNode, index: number) => {
        const status: NodeStatus = statusResolver(node.id);
        const progress: number | undefined = progressResolver
            ? progressResolver(node.id)
            : undefined;
        return templateNodeToPathNodeData(node, index, status, progress);
    });
}

/**
 * Check if a node type uses a special renderer (Chest uses ChestNode component).
 * Returns true for node types that need special rendering treatment on the map.
 */
export function isSpecialRendererNode(nodeType: string): boolean {
    return nodeType === MentalHealthNodeType.CHEST;
}

/**
 * Check if a node type is a checkpoint (uses ⭐ variant with section celebration).
 */
export function isCheckpointNode(nodeType: string): boolean {
    return nodeType === MentalHealthNodeType.CHECKPOINT;
}

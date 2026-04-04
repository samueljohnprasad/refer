/**
 * Config Resolver
 * Transforms static JourneyConfig + user progress into the runtime
 * UnitData / PathNodeData shapes that existing UI components consume.
 *
 * This is the bridge between:
 * - Config layer (UnitConfig, NodeVariantConfig) — what nodes LOOK like
 * - Progress layer (completedCount per unit) — which nodes are done
 * - Runtime layer (UnitData, PathNodeData) — what components render
 *
 * Pure functions only — no side effects, no hooks.
 */


import type {
    PathNodeData,
    JourneyReward,
    UnitData,
    MascotPlacement,
    NodeVariantConfig,
    UnitNodeConfig,
    UnitConfig,
    JourneyConfig,
    MascotPlacementConfig,
} from '@/src/types/journey';
import {
    NodeStatus,
    NodeType,
    NodeIcon,
    MascotSide,
    UnitColorScheme,
} from '@/src/types/journey/enums';

// ---------------------------------------------------------------------------
// Variant key → NodeType mapping
// ---------------------------------------------------------------------------

/** Maps variant keys to the NodeType enum for backward compatibility */
const VARIANT_TO_NODE_TYPE: Record<string, NodeType> = {
    star: NodeType.LESSON,
    checkpoint: NodeType.CHECKPOINT,
    chest: NodeType.CHEST,
    microphone: NodeType.LESSON,
    video: NodeType.LESSON,
    gamepad: NodeType.LESSON,
    headphones: NodeType.LESSON,
};

/** Maps variant key + status to NodeIcon for backward compatibility */
function resolveNodeIcon(variantKey: string, status: NodeStatus): NodeIcon {
    if (status === NodeStatus.LOCKED) return NodeIcon.LOCK;
    if (status === NodeStatus.COMPLETED) return NodeIcon.CHECKMARK;
    if (variantKey === 'chest') return NodeIcon.CHEST;
    if (variantKey === 'checkpoint') return NodeIcon.BOOK;
    return NodeIcon.STAR;
}

/** Maps color theme key to UnitColorScheme enum for backward compatibility */
function resolveColorScheme(themeKey: string): UnitColorScheme {
    const map: Record<string, UnitColorScheme> = {
        green: UnitColorScheme.GREEN,
        blue: UnitColorScheme.BLUE,
        purple: UnitColorScheme.PURPLE,
        orange: UnitColorScheme.ORANGE,
    };
    return map[themeKey] ?? UnitColorScheme.GREEN;
}

/** Maps side string to MascotSide enum */
function resolveMascotSide(side: 'left' | 'right'): MascotSide {
    return side === 'left' ? MascotSide.LEFT : MascotSide.RIGHT;
}

// ---------------------------------------------------------------------------
// Node resolver
// ---------------------------------------------------------------------------

/**
 * Resolve a single UnitNodeConfig + variant + status into a runtime PathNodeData.
 * Pure function — no conditionals on variant key for visuals.
 */
export function resolveNode(
    nodeConfig: UnitNodeConfig,
    variant: NodeVariantConfig,
    status: NodeStatus,
    index: number,
    progress?: number,
): PathNodeData {
    const rewards: JourneyReward[] =
        nodeConfig.rewardOverrides ?? variant.rewards;

    const label: string | undefined =
        status === NodeStatus.ACTIVE
            ? (nodeConfig.label ?? 'START')
            : nodeConfig.label;

    return {
        id: `node_${index}`,
        index,
        type: VARIANT_TO_NODE_TYPE[variant.key] ?? NodeType.LESSON,
        status,
        icon: resolveNodeIcon(variant.key, status),
        progress: status === NodeStatus.ACTIVE ? (progress ?? 0) : undefined,
        label: status === NodeStatus.ACTIVE ? label : undefined,
        taskId: nodeConfig.taskId,
        rewards,
    };
}

// ---------------------------------------------------------------------------
// Unit resolver
// ---------------------------------------------------------------------------

/** Per-unit progress: how many nodes are completed */
export interface UnitProgress {
    unitId: string;
    completedCount: number;
    /** Optional per-node progress overrides (active node progress 0–1) */
    activeNodeProgress?: number;
}

/**
 * Resolve a UnitConfig into a runtime UnitData using progress data.
 * Node statuses derived from completedCount — no hardcoded status in config.
 */
export function resolveUnit(
    unitConfig: UnitConfig,
    config: JourneyConfig,
    progress: UnitProgress,
    isUnitUnlocked: boolean,
): UnitData {
    const nodes: PathNodeData[] = unitConfig.nodes.map(
        (nodeConfig: UnitNodeConfig, index: number) => {
            const variant: NodeVariantConfig | undefined =
                config.nodeVariants[nodeConfig.variantKey];

            if (!variant) {
                throw new Error(
                    `[configResolver] Unknown variant key "${nodeConfig.variantKey}" in unit "${unitConfig.id}"`,
                );
            }

            let status: NodeStatus;
            if (!isUnitUnlocked) {
                status = NodeStatus.LOCKED;
            } else if (index < progress.completedCount) {
                status = NodeStatus.COMPLETED;
            } else if (index === progress.completedCount) {
                status = NodeStatus.ACTIVE;
            } else {
                status = NodeStatus.LOCKED;
            }

            return resolveNode(
                nodeConfig,
                variant,
                status,
                index,
                index === progress.completedCount
                    ? progress.activeNodeProgress
                    : undefined,
            );
        },
    );

    const mascotPlacements: MascotPlacement[] = unitConfig.mascotPlacements.map(
        (mp: MascotPlacementConfig) => ({
            afterNodeIndex: mp.afterNodeIndex,
            position: resolveMascotSide(mp.side),
            message: config.mascotMessages[mp.messageKey] ?? mp.messageKey,
        }),
    );

    return {
        id: unitConfig.id,
        unitNumber: unitConfig.unitNumber,
        title: unitConfig.title,
        description: unitConfig.description,
        colorScheme: resolveColorScheme(unitConfig.colorThemeKey),
        nodes,
        mascotPlacements,
    };
}

// ---------------------------------------------------------------------------
// Full journey resolver
// ---------------------------------------------------------------------------

/** Progress for the entire journey */
export interface JourneyProgress {
    /** Which unit index (0-based) the user is currently on */
    currentUnitIndex: number;
    /** Per-unit progress */
    unitProgress: UnitProgress[];
}

/**
 * Resolve all units from config + progress into runtime UnitData[].
 * Units before currentUnitIndex are unlocked. Unit at index is active.
 * Units after are locked (all nodes locked).
 */
export function resolveAllUnits(
    config: JourneyConfig,
    progress: JourneyProgress,
): UnitData[] {
    return config.units.map((unitConfig: UnitConfig, index: number) => {
        const isUnitUnlocked: boolean = index <= progress.currentUnitIndex;

        const unitProg: UnitProgress = progress.unitProgress.find(
            (p: UnitProgress) => p.unitId === unitConfig.id,
        ) ?? {
            unitId: unitConfig.id,
            completedCount: 0,
        };

        return resolveUnit(unitConfig, config, unitProg, isUnitUnlocked);
    });
}

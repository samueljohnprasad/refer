/**
 * sectionMapBridge
 * Converts SectionMapResponse (from get_section_map RPC) into the
 * JourneyState / UnitData / PathNodeData shapes that the existing
 * UI components, FlashList pipeline, and config system already consume.
 *
 * This is the key bridge that lets us swap the data source (Phase C)
 * without touching any presentation components.
 */

import type {
    SectionMapResponse,
    NodeStub,
    SectionNodeProgress,
} from "@/src/types/journey/sectionMap";
import type {
    JourneyState,
    JourneyStats,
    PathNodeData,
    UnitData,
    MascotPlacement,
} from "@/src/types/journey";
import {
    NodeStatus,
    NodeType,
    NodeIcon,
    MascotSide,
} from "@/src/types/journey/enums";

// ---------------------------------------------------------------------------
// Icon resolution (mirrors mergeJourneyState.ts logic)
// ---------------------------------------------------------------------------

const COMPLETED_ICON_MAP: Record<string, NodeIcon> = {
    [NodeType.LESSON]: NodeIcon.CHECKMARK,
    [NodeType.CHECKPOINT]: NodeIcon.CHECKMARK,
    [NodeType.CHEST]: NodeIcon.CHEST,
};

const ACTIVE_ICON_MAP: Record<string, NodeIcon> = {
    [NodeType.LESSON]: NodeIcon.STAR,
    [NodeType.CHECKPOINT]: NodeIcon.BOOK,
    [NodeType.CHEST]: NodeIcon.CHEST,
};

function resolveIcon(nodeType: string, status: NodeStatus): NodeIcon {
    if (status === NodeStatus.LOCKED) return NodeIcon.LOCK;
    if (status === NodeStatus.COMPLETED) {
        return COMPLETED_ICON_MAP[nodeType] ?? NodeIcon.CHECKMARK;
    }
    return ACTIVE_ICON_MAP[nodeType] ?? NodeIcon.STAR;
}

// ---------------------------------------------------------------------------
// Node stub → PathNodeData
// ---------------------------------------------------------------------------

/**
 * Convert a NodeStub + optional progress into a PathNodeData.
 * Handles the canInteract flag: nodes in non-interactive sections
 * are rendered as LOCKED regardless of their actual progress.
 */
function nodeStubToPathNode(
    stub: NodeStub,
    progress: SectionNodeProgress | undefined,
): PathNodeData {
    // If this section is not interactive (preview mode), force LOCKED
    const rawStatus: NodeStatus = progress?.status
        ? (progress.status as NodeStatus)
        : NodeStatus.LOCKED;

    const effectiveStatus: NodeStatus = stub.canInteract
        ? rawStatus
        : NodeStatus.LOCKED;

    return {
        id: stub.id,
        index: stub.nodeIndex,
        type: stub.nodeType as NodeType,
        status: effectiveStatus,
        icon: resolveIcon(stub.nodeType, effectiveStatus),
        progress:
            effectiveStatus === NodeStatus.ACTIVE
                ? (progress?.progress ?? 0)
                : effectiveStatus === NodeStatus.COMPLETED
                    ? 1
                    : undefined,
        label: effectiveStatus === NodeStatus.ACTIVE ? "START" : undefined,
        taskId: stub.taskId,
        rewards: stub.rewards ?? [],
    };
}

// ---------------------------------------------------------------------------
// SectionMapResponse → UnitData (single section = single UnitData)
// ---------------------------------------------------------------------------

/**
 * Convert a SectionMapResponse into a UnitData array (always 1 element for now).
 * The section becomes a single UnitData with merged PathNodeData[].
 */
export function sectionMapToUnitData(response: SectionMapResponse): UnitData {
    const { section, progress } = response;

    // Build progress lookup map for O(1) access
    const progressMap = new Map<string, SectionNodeProgress>(
        progress.map((p: SectionNodeProgress) => [p.nodeId, p]),
    );

    // Convert node stubs → PathNodeData
    const nodes: PathNodeData[] = section.nodes.map(
        (stub: NodeStub): PathNodeData =>
            nodeStubToPathNode(stub, progressMap.get(stub.id)),
    );

    // Convert mascot placements
    const mascotPlacements: MascotPlacement[] = Array.isArray(
        section.mascotPlacements,
    )
        ? section.mascotPlacements.map((raw: unknown): MascotPlacement => {
            const mp = raw as Record<string, unknown>;
            return {
                afterNodeIndex: (mp.afterNodeIndex as number) ?? 0,
                position: (mp.position as MascotSide) ?? MascotSide.LEFT,
                message: (mp.message as string) ?? undefined,
            };
        })
        : [];

    return {
        id: section.id,
        unitNumber: section.unitNumber,
        title: section.title,
        description: section.description,
        colorScheme: section.colorScheme,
        nodes,
        mascotPlacements,
    };
}

// ---------------------------------------------------------------------------
// SectionMapResponse → JourneyState (full bridge)
// ---------------------------------------------------------------------------

/**
 * Convert a SectionMapResponse into a complete JourneyState.
 * This produces a single-unit JourneyState (the current section).
 * Stats are passed externally since they come from a different source.
 */
export function sectionMapToJourneyState(
    response: SectionMapResponse,
    stats: JourneyStats,
): JourneyState {
    const unitData: UnitData = sectionMapToUnitData(response);

    // Find the active node ID for lastActiveNodeId
    const activeNode: PathNodeData | undefined = unitData.nodes.find(
        (n: PathNodeData) => n.status === NodeStatus.ACTIVE,
    );

    return {
        currentUnit: 0, // Always index 0 since we only have the active section
        units: [unitData],
        lastActiveNodeId: activeNode?.id ?? "",
        stats,
    };
}

// ---------------------------------------------------------------------------

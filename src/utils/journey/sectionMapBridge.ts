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
    SectionUnitData,
    SectionViewMode,
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
import {
    resolveNodeType,
} from "@/src/lib/journey/mentalHealthNodeMapping";

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
    isFallbackActive: boolean,
    viewMode: SectionViewMode,
): PathNodeData {
    const resolvedType: NodeType = resolveNodeType(stub.nodeType);

    // First-time / guest preview mode has no progress rows yet.
    // In that case, expose the first node as ACTIVE so the journey can start.
    const rawStatus: NodeStatus = progress?.status
        ? (progress.status as NodeStatus)
        : viewMode === "completed" && stub.canInteract
            ? NodeStatus.COMPLETED
            : isFallbackActive
                ? NodeStatus.ACTIVE
                : NodeStatus.LOCKED;

    const effectiveStatus: NodeStatus = stub.canInteract
        ? rawStatus
        : NodeStatus.LOCKED;

    return {
        id: stub.id,
        index: stub.nodeIndex,
        type: resolvedType,
        status: effectiveStatus,
        icon: resolveIcon(resolvedType, effectiveStatus),
        variantKey: stub.variantKey,
        taskType: stub.nodeType,
        title: stub.title,
        iconKey: stub.iconKey,
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
// SectionMapResponse → UnitData[]
// ---------------------------------------------------------------------------

/**
 * Convert a SectionMapResponse into runtime UnitData[] for the current section.
 */
export function sectionMapToUnitData(response: SectionMapResponse): UnitData[] {
    const { section, progress } = response;

    // Build progress lookup map for O(1) access
    const progressMap = new Map<string, SectionNodeProgress>(
        progress.map((p: SectionNodeProgress) => [p.nodeId, p]),
    );

    const sectionUnits: SectionUnitData[] =
        Array.isArray(section.units) && section.units.length > 0
            ? section.units
            : [
                  {
                      id: section.id,
                      sectionId: section.id,
                      sectionNumber: section.sectionNumber ?? section.unitNumber,
                      unitNumber: 1,
                      globalUnitNumber: section.unitNumber,
                      title: section.title,
                      description: section.description,
                      colorScheme: section.colorScheme,
                      mascotPlacements: section.mascotPlacements ?? [],
                      unlockRule: section.unlockRule,
                      nodes: section.nodes ?? [],
                  },
              ];

    const hasExplicitActiveNode: boolean = progress.some(
        (row: SectionNodeProgress) => row.status === NodeStatus.ACTIVE,
    );
    const fallbackActiveUnitNumber: number =
        response.enrollment?.currentSectionUnitNumber ?? 1;
    const shouldUseFallbackActive: boolean = response.viewMode !== "completed";

    return sectionUnits.map((unit: SectionUnitData): UnitData => {
        const nodes: PathNodeData[] = unit.nodes.map(
            (stub: NodeStub): PathNodeData =>
                nodeStubToPathNode(
                    stub,
                    progressMap.get(stub.id),
                    shouldUseFallbackActive &&
                        !hasExplicitActiveNode &&
                        stub.canInteract &&
                        unit.unitNumber === fallbackActiveUnitNumber &&
                        stub.nodeIndex === 0,
                    response.viewMode,
                ),
        );

        const mascotPlacements: MascotPlacement[] = Array.isArray(
            unit.mascotPlacements,
        )
            ? unit.mascotPlacements.map((raw: unknown): MascotPlacement => {
                const mp = raw as Record<string, unknown>;
                return {
                    afterNodeIndex: (mp.afterNodeIndex as number) ?? 0,
                    position: (mp.position as MascotSide) ?? MascotSide.LEFT,
                    message: (mp.message as string) ?? undefined,
                    imageKey: (mp.imageKey as string) ?? undefined,
                    avatarSize: (mp.avatarSize as number) ?? undefined,
                    offsetY: (mp.offsetY as number) ?? undefined,
                    offsetX: (mp.offsetX as number) ?? undefined,
                };
            })
            : [];

        return {
            id: unit.id,
            sectionId: unit.sectionId,
            sectionNumber: unit.sectionNumber,
            unitNumber: unit.unitNumber,
            globalUnitNumber: unit.globalUnitNumber,
            title: unit.title,
            description: unit.description,
            colorScheme: unit.colorScheme,
            nodes,
            mascotPlacements,
        };
    });
}

// ---------------------------------------------------------------------------
// SectionMapResponse → JourneyState (full bridge)
// ---------------------------------------------------------------------------

/**
 * Convert a SectionMapResponse into a complete JourneyState.
 * This produces a multi-unit JourneyState for the currently loaded section.
 * Stats are passed externally since they come from a different source.
 */
export function sectionMapToJourneyState(
    response: SectionMapResponse,
    stats: JourneyStats,
): JourneyState {
    const units: UnitData[] = sectionMapToUnitData(response);
    const focusNodeId: string = response.focusNodeId ?? "";

    const activeUnitIndex: number = units.findIndex((unit: UnitData) =>
        unit.nodes.some((n: PathNodeData) => n.status === NodeStatus.ACTIVE),
    );
    const activeNode: PathNodeData | undefined =
        activeUnitIndex >= 0
            ? units[activeUnitIndex].nodes.find(
                (n: PathNodeData) => n.status === NodeStatus.ACTIVE,
            )
            : undefined;
    const fallbackCurrentUnitIndex: number =
        response.viewMode === "completed"
            ? 0
            : Math.max(0, (response.enrollment?.currentSectionUnitNumber ?? 1) - 1);
    const focusUnitIndex: number = focusNodeId
        ? units.findIndex((unit: UnitData) =>
            unit.nodes.some((node: PathNodeData) => node.id === focusNodeId),
        )
        : -1;

    return {
        currentUnit:
            activeUnitIndex >= 0
                ? activeUnitIndex
                : focusUnitIndex >= 0
                    ? focusUnitIndex
                : Math.min(fallbackCurrentUnitIndex, Math.max(units.length - 1, 0)),
        units,
        lastActiveNodeId: activeNode?.id ?? focusNodeId,
        stats,
    };
}

// ---------------------------------------------------------------------------

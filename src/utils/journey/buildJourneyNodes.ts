/**
 * buildJourneyNodes — Pure Function
 * Pre-computes the flat JourneyFlashListItem[] array for FlashList rendering.
 *
 * Runs ONCE at startup (outside React render cycle). The result is stored
 * in a Jotai atom and never mutated after init. This eliminates all
 * per-frame layout computation.
 *
 * Each node gets:
 * - x, y: absolute screen coordinates (zig-zag pattern)
 * - cellHeight: vertical gap to the next node (variable)
 * - segmentD: pre-built SVG cubic bezier path in LOCAL cell coordinates (0 → cellHeight)
 * - All config keys for rendering (variantKey, colorThemeKey, etc.)
 *
 * Mascot bubbles and unit dividers are interleaved as separate list items.
 */

import { path as d3Path } from 'd3-path';

import type { UnitData, PathNodeData } from '@/src/types/journey';
import { NodeStatus, NodeType, NodeIcon } from '@/src/types/journey';
import type {
    JourneyNode,
    JourneyDividerItem,
    JourneyMascotItem,
    JourneyFlashListItem,
} from '@/src/types/journey';
import type {
    UnitConfig,
    UnitNodeConfig,
    MascotPlacementConfig,
    ColorThemeConfig,
    JourneySettingsConfig,
} from '@/src/types/journey';
import { getNodePosition } from './positionCalculator';
import { MASCOT_SIZE } from '@/src/data/journey/constants';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Default cell height for unit dividers */
const DIVIDER_CELL_HEIGHT: number = 200;

/** Default cell height for mascot bubble rows */
const MASCOT_CELL_HEIGHT: number = 80;

/** Minimum cell height between nodes (prevents zero-height cells) */
const MIN_NODE_CELL_HEIGHT: number = 80;

// ---------------------------------------------------------------------------
// Segment path builder (local cell coordinates)
// ---------------------------------------------------------------------------

/**
 * Build a cubic bezier SVG `d` string from (prevX, 0) to (thisX, cellHeight).
 * Uses local cell coordinates — each cell's SVG is height={cellHeight} with
 * y values from 0 to cellHeight. This is the key insight from the PRD:
 * no global canvas coordinates in the SVG.
 *
 * Control points sit at the vertical midpoint for natural S-curves:
 *   CP1 = (prevX, cellHeight/2)
 *   CP2 = (thisX, cellHeight/2)
 */
function buildSegmentD(
    prevX: number,
    thisX: number,
    cellHeight: number,
    screenWidth: number,
): string {
    if (cellHeight <= 0) return '';

    const p = d3Path();
    const midY: number = cellHeight / 2;

    p.moveTo(prevX, 0);
    p.bezierCurveTo(prevX, midY, thisX, midY, thisX, cellHeight);

    return p.toString();
}

// ---------------------------------------------------------------------------
// Main builder
// ---------------------------------------------------------------------------

/** Input config for buildJourneyNodes */
export interface BuildJourneyNodesInput {
    /** Runtime unit data with node statuses */
    units: UnitData[];
    /** Static unit configs (keyed by unit ID for O(1) lookup) */
    unitConfigMap: Map<string, UnitConfig>;
    /** Color theme registry */
    colorThemes: Record<string, ColorThemeConfig>;
    /** Global journey settings */
    settings: JourneySettingsConfig;
    /** Current screen width in dp */
    screenWidth: number;
    /** Mascot message registry for resolving message keys */
    mascotMessages: Record<string, string>;
    /** Optional: IDs of units to include (for section filtering). All if omitted. */
    unitFilter?: string[];
}

/**
 * Build the flat FlashList data array from units + config.
 * Runs once, outside React. Result is stored in Jotai atom.
 *
 * @returns Pre-computed JourneyFlashListItem[] ready for FlashList consumption
 */
export function buildJourneyNodes(input: BuildJourneyNodesInput): JourneyFlashListItem[] {
    const {
        units,
        unitConfigMap,
        colorThemes,
        settings,
        screenWidth,
        mascotMessages,
        unitFilter,
    } = input;

    const filteredUnits: UnitData[] = unitFilter
        ? units.filter((u: UnitData) => unitFilter.includes(u.id))
        : units;

    const items: JourneyFlashListItem[] = [];
    let globalIndex: number = 0;
    let prevX: number = screenWidth / 2; // first node's segment starts from center
    let cumulativeY: number = settings.topPadding;

    filteredUnits.forEach((unit: UnitData, unitIndex: number) => {
        const unitConfig: UnitConfig | undefined = unitConfigMap.get(unit.id);
        if (!unitConfig) return;

        const colorThemeKey: string = unitConfig.colorThemeKey;
        const themeConfig: ColorThemeConfig | undefined = colorThemes[colorThemeKey];

        // ── Insert unit divider (skip for first unit) ──
        if (unitIndex > 0) {
            const dividerId: string = `divider_${unit.id}`;
            const dividerItem: JourneyDividerItem = {
                id: dividerId,
                itemType: 'divider',
                cellHeight: DIVIDER_CELL_HEIGHT,
                title: unitConfig.divider.title,
                showJumpHere: unitConfig.divider.showJumpHere,
                accentColor: themeConfig?.dividerColor,
                targetUnitId: unit.id,
            };
            items.push(dividerItem);
            cumulativeY += DIVIDER_CELL_HEIGHT;
        }

        // ── Track mascot placements for this unit (sorted by afterNodeIndex) ──
        const mascotPlacements: MascotPlacementConfig[] = [
            ...(unitConfig.mascotPlacements ?? []),
        ].sort(
            (a: MascotPlacementConfig, b: MascotPlacementConfig) =>
                a.afterNodeIndex - b.afterNodeIndex,
        );
        let nextMascotIdx: number = 0;

        // ── Process each node in the unit ──
        unit.nodes.forEach((node: PathNodeData, nodeIndex: number) => {
            const nodeConfig: UnitNodeConfig | undefined = unitConfig.nodes[nodeIndex];
            const variantKey: string = nodeConfig?.variantKey ?? 'star';
            const taskType: string = nodeConfig?.taskType ?? 'lesson';

            // Compute position using existing sine-wave calculator
            const position = getNodePosition(nodeIndex, screenWidth, {
                topPadding: 0,
                pathGeometry: unitConfig.pathGeometry,
            });

            const nodeX: number = position.x;
            const nodeY: number = cumulativeY + position.y;

            // Cell height = vertical gap (variable support — use settings.verticalGap as base)
            const cellHeight: number = Math.max(MIN_NODE_CELL_HEIGHT, settings.verticalGap);

            // Build SVG segment in LOCAL cell coordinates
            // Only build segment if it's NOT the first node in the unit
            const segmentD: string = nodeIndex === 0 
                ? '' 
                : buildSegmentD(prevX, nodeX, cellHeight, screenWidth);

            const journeyNode: JourneyNode = {
                id: node.id,
                itemType: 'node',
                globalIndex,
                label: node.label,
                x: nodeX,
                y: nodeY,
                cellHeight,
                segmentD,
                status: node.status,
                progress: node.progress,
                variantKey,
                colorThemeKey,
                taskId: node.taskId,
                taskType,
                type: node.type,
                icon: node.icon,
                rewards: node.rewards,
                unitId: unit.id,
                prevX,
            };

            items.push(journeyNode);
            globalIndex++;
            prevX = nodeX;

            // ── Insert mascot bubbles after configured node indices ──
            while (
                nextMascotIdx < mascotPlacements.length &&
                mascotPlacements[nextMascotIdx].afterNodeIndex === nodeIndex
            ) {
                const mp: MascotPlacementConfig = mascotPlacements[nextMascotIdx];
                const messageText: string =
                    mascotMessages[mp.messageKey] ?? mp.messageKey;

                const mascotX: number = mp.side === 'right'
                    ? nodeX + MASCOT_SIZE.horizontalOffset + 200
                    : nodeX - MASCOT_SIZE.horizontalOffset - 200;

                const mascotItem: JourneyMascotItem = {
                    id: `mascot_${unit.id}_${nodeIndex}_${nextMascotIdx}`,
                    itemType: 'mascot',
                    cellHeight: MASCOT_CELL_HEIGHT,
                    x: mascotX,
                    side: mp.side,
                    message: messageText,
                };

                items.push(mascotItem);
                cumulativeY += MASCOT_CELL_HEIGHT;
                nextMascotIdx++;
            }
        });

        // Advance cumulative Y past all nodes in this unit
        cumulativeY += unit.nodes.length * settings.verticalGap;
    });

    return items;
}

/**
 * Find the index of the currently active node in the flat list.
 * Returns -1 if no active node found.
 */
export function findActiveNodeIndex(items: JourneyFlashListItem[]): number {
    return items.findIndex(
        (item: JourneyFlashListItem) =>
            item.itemType === 'node' && (item as JourneyNode).status === NodeStatus.ACTIVE,
    );
}

/**
 * Update a single node's status in the flat array (immutable).
 * Returns a new array with the updated node. O(n) copy but only
 * runs on completion events — not per-frame.
 */
export function updateNodeStatus(
    items: JourneyFlashListItem[],
    nodeId: string,
    newStatus: NodeStatus,
): JourneyFlashListItem[] {
    return items.map((item: JourneyFlashListItem): JourneyFlashListItem => {
        if (item.itemType !== 'node') return item;
        const node = item as JourneyNode;
        if (node.id !== nodeId) return item;
        return { ...node, status: newStatus };
    });
}

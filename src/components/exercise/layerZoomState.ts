import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import type { LayerZoomContent } from "./layerZoomContent";

const FORMAT = CourseExerciseCategoryEnum.LayerZoom;

export interface LayerZoomResponse extends Record<string, unknown> {
  format: CourseExerciseCategoryEnum.LayerZoom;
  phase: "active" | "complete";
  stageIndex: number;
  isCorrect: boolean;
  revealedLayerIds: string[];
}

export function createLayerZoomResponse(content: LayerZoomContent, saved: Record<string, unknown> | null = null): LayerZoomResponse {
  const prefix = readPrefix(saved?.format === FORMAT ? saved.revealedLayerIds : null, content);
  const revealedLayerIds = prefix.length ? prefix : [content.layers[0].id];
  const complete = revealedLayerIds.length === content.layers.length;
  return response(complete ? "complete" : "active", revealedLayerIds);
}

export function advanceLayerZoom(content: LayerZoomContent, value: LayerZoomResponse): LayerZoomResponse {
  if (value.phase === "complete") return value;
  const next = content.layers[value.revealedLayerIds.length];
  if (!next) return value;
  const revealedLayerIds = [...value.revealedLayerIds, next.id];
  return response(revealedLayerIds.length === content.layers.length ? "complete" : "active", revealedLayerIds);
}

function readPrefix(value: unknown, content: LayerZoomContent): string[] {
  if (!Array.isArray(value)) return [];
  const prefix: string[] = [];
  for (const layer of content.layers) {
    if (value[prefix.length] !== layer.id) break;
    prefix.push(layer.id);
  }
  return prefix;
}

function response(phase: "active" | "complete", revealedLayerIds: string[]): LayerZoomResponse {
  return { format: FORMAT, phase, stageIndex: revealedLayerIds.length - 1, isCorrect: phase === "complete", revealedLayerIds };
}

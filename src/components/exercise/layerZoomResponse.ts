import type { LayerZoomResponse } from "./layerZoomState";

const RESPONSE_KEYS = ["format", "phase", "stageIndex", "isCorrect", "revealedLayerIds"];

export function hasSameLayerZoomResponse(saved: Record<string, unknown>, response: LayerZoomResponse): boolean {
  const keys = Object.keys(saved);
  return keys.length === RESPONSE_KEYS.length && keys.every((key) => RESPONSE_KEYS.includes(key)) &&
    saved.format === response.format && saved.phase === response.phase &&
    saved.stageIndex === response.stageIndex && saved.isCorrect === response.isCorrect &&
    Array.isArray(saved.revealedLayerIds) && saved.revealedLayerIds.length === response.revealedLayerIds.length &&
    saved.revealedLayerIds.every((id, index) => id === response.revealedLayerIds[index]);
}

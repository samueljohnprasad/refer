import { readLayerZoomContent } from "@/src/components/exercise/layerZoomContent";
import { hasSameLayerZoomResponse } from "@/src/components/exercise/layerZoomResponse";
import { advanceLayerZoom, createLayerZoomResponse } from "@/src/components/exercise/layerZoomState";
import type { Exercise } from "@/src/types/journeyV5";
import type { CoursePrimaryTransition } from "./courseExercisePrimaryTransition";

export function getLayerZoomPrimaryLabel(exercise: Exercise, saved: Record<string, unknown>): string {
  const content = readLayerZoomContent(exercise.content);
  return !content || createLayerZoomResponse(content, saved).phase === "active" ? "Zoom in" : "Continue";
}

export function getNextLayerZoomState(exercise: Exercise, saved: Record<string, unknown>): CoursePrimaryTransition | undefined {
  const content = readLayerZoomContent(exercise.content);
  if (!content) return undefined;
  const response = createLayerZoomResponse(content, saved);
  if (!hasSameLayerZoomResponse(saved, response)) return { kind: "response", ready: true, response };
  return response.phase === "active" ? { kind: "response", ready: true, response: advanceLayerZoom(content, response) } : undefined;
}

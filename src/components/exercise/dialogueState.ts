import type { DialogueContent, DialogueDecisionBeat } from "./dialogueContent";
import type { DialogueResponse } from "./dialogueResponse";

// ponytail: single state helper that repairs/restores saved response
export function createDialogueResponse(
  content: DialogueContent | null | undefined,
  savedResponse: any,
): DialogueResponse {
  const defaultResponse: DialogueResponse = {
    format: "dialogue",
    phase: "active",
    beatIndex: 0,
    selectedOptionIds: {},
    isCorrect: true,
  };

  if (!content || !content.beats || content.beats.length < 2) {
    return defaultResponse;
  }

  if (savedResponse && savedResponse.format === "dialogue") {
    let index = typeof savedResponse.beatIndex === "number" ? savedResponse.beatIndex : 0;
    
    // Clamp to valid range
    if (index >= content.beats.length) {
      index = content.beats.length - 1;
    } else if (index < 0) {
      index = 0;
    }

    let phase = savedResponse.phase === "complete" ? "complete" : "active";
    // Repair: can't be complete if we haven't reached the end
    if (phase === "complete" && index < content.beats.length - 1) {
      phase = "active";
      index = content.beats.length - 1;
    }

    // Clean up selections to only known decision beats
    const selectedOptionIds: Record<string, string> = {};
    if (savedResponse.selectedOptionIds) {
      content.beats.forEach((beat) => {
        if (beat.type === "decision") {
          const savedOpt = savedResponse.selectedOptionIds[beat.id];
          if (typeof savedOpt === "string" && beat.options.some((o: any) => o.id === savedOpt)) {
            selectedOptionIds[beat.id] = savedOpt;
          }
        }
      });
    }

    return {
      format: "dialogue",
      phase: phase as "active" | "complete",
      beatIndex: index,
      selectedOptionIds,
      isCorrect: true,
    } as DialogueResponse;
  }

  return defaultResponse;
}

// ponytail: check if decision is pending on current beat
export function isPendingDecision(content: DialogueContent, response: DialogueResponse): boolean {
  if (response.phase === "complete") return false;
  
  const currentBeat = content.beats[response.beatIndex];
  if (!currentBeat || currentBeat.type !== "decision") return false;
  
  return !response.selectedOptionIds[currentBeat.id];
}

// ponytail: mutate selected option
export function selectDialogueOption(
  response: DialogueResponse,
  beatId: string,
  optionId: string
): DialogueResponse {
  return {
    ...response,
    selectedOptionIds: {
      ...response.selectedOptionIds,
      [beatId]: optionId,
    },
  };
}

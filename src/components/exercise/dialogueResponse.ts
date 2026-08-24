// ponytail: strict response types for Dialogue
export interface DialogueResponse {
  format: "dialogue";
  phase: "active" | "complete";
  beatIndex: number;
  selectedOptionIds: Record<string, string>; // beatId -> optionId
  isCorrect: true;
  [key: string]: unknown;
}

export function hasSameDialogueResponse(a: DialogueResponse | null | undefined, b: DialogueResponse | null | undefined): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  if (a.format !== b.format) return false;
  if (a.phase !== b.phase) return false;
  if (a.beatIndex !== b.beatIndex) return false;
  
  const aKeys = Object.keys(a.selectedOptionIds);
  const bKeys = Object.keys(b.selectedOptionIds);
  if (aKeys.length !== bKeys.length) return false;
  
  for (const key of aKeys) {
    if (a.selectedOptionIds[key] !== b.selectedOptionIds[key]) return false;
  }
  
  return true;
}

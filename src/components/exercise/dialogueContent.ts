import type { MicrolearningContentIssue } from "./microlearning/microlearningTypes";

// ponytail: strict content types for Dialogue redesign
export interface DialogueOption {
  id: string;
  label: string;
  feedback: string;
}

export interface DialoguePassiveBeat {
  id: string;
  type: "passive";
  speaker: string;
  side: "left" | "right";
  message: string;
  historySummary: string;
}

export interface DialogueDecisionBeat {
  id: string;
  type: "decision";
  speaker: string;
  side: "left" | "right";
  message: string;
  historySummary: string;
  options: DialogueOption[];
}

export type DialogueBeat = DialoguePassiveBeat | DialogueDecisionBeat;

export interface DialogueContent {
  title: string;
  instruction: string;
  beats: DialogueBeat[];
  insight: string;
}

export function validateDialogueContent(content: any): MicrolearningContentIssue[] {
  const issues: MicrolearningContentIssue[] = [];

  if (!content || typeof content !== "object") {
    return [{ path: "content", message: "Content must be an object." }];
  }

  if (!Array.isArray(content.beats)) {
    return [{ path: "beats", message: "Dialogue must have a beats array." }];
  }

  const beats = content.beats as any[];
  if (beats.length < 2) {
    issues.push({ path: "beats", message: "Dialogue must have at least 2 beats." });
  }
  if (beats.length > 4) {
    issues.push({ path: "beats", message: "Dialogue must have at most 4 beats." });
  }

  let decisionBeatCount = 0;
  const beatIds = new Set<string>();

  beats.forEach((beat, index) => {
    if (!beat.id || typeof beat.id !== "string") {
      issues.push({ path: `beats[${index}].id`, message: "Beat id must be a non-empty string." });
    } else {
      if (beatIds.has(beat.id)) {
        issues.push({ path: `beats[${index}].id`, message: `Duplicate beat id "${beat.id}".` });
      }
      beatIds.add(beat.id);
    }

    if (!beat.historySummary || typeof beat.historySummary !== "string") {
      issues.push({ path: `beats[${index}].historySummary`, message: "Beat historySummary must be a non-empty string." });
    }

    if (beat.type === "decision") {
      decisionBeatCount++;
      if (!Array.isArray(beat.options)) {
        issues.push({ path: `beats[${index}].options`, message: "Decision beat must have options array." });
      } else {
        if (beat.options.length < 2) {
          issues.push({ path: `beats[${index}].options`, message: "Decision beat must have at least 2 options." });
        }
        if (beat.options.length > 3) {
          issues.push({ path: `beats[${index}].options`, message: "Decision beat must have at most 3 options." });
        }
        const optionIds = new Set<string>();
        beat.options.forEach((opt: any, optIndex: number) => {
          if (!opt.id) {
            issues.push({ path: `beats[${index}].options[${optIndex}].id`, message: "Option id must be non-empty." });
          } else if (optionIds.has(opt.id)) {
            issues.push({ path: `beats[${index}].options[${optIndex}].id`, message: `Duplicate option id "${opt.id}" in beat "${beat.id}".` });
          }
          optionIds.add(opt.id);
        });
      }
    }
  });

  if (decisionBeatCount > 2) {
    issues.push({ path: "beats", message: "Dialogue must have at most 2 decision beats." });
  }

  return issues;
}

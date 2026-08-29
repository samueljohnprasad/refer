import type { MicrolearningContentIssue } from "@/src/components/exercise/microlearning/microlearningTypes";
import { validateArrayCount, readRequiredPath, validateUniqueIds } from "@/src/components/exercise/microlearning/microlearningContentValidation";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function validateRecallWarmupContent(content: unknown): MicrolearningContentIssue[] {
  const issues: MicrolearningContentIssue[] = [];
  
  if (!isRecord(content)) {
    return [{ path: "content", message: "Content must be an object." }];
  }

  const cards = validateArrayCount(content, "cards", 2, 3, issues);
  
  if (cards) {
    validateUniqueIds(cards, "cards", issues);
    
    cards.forEach((card, index) => {
      const p = `cards[${index}]`;
      if (!isRecord(card)) {
         issues.push({ path: p, message: "Card must be an object." });
         return;
      }
      
      const conceptId = card.conceptId;
      if (typeof conceptId !== "string" || !conceptId.trim()) {
        issues.push({ path: `${p}.conceptId`, message: "Must be a non-empty string." });
      }
      
      const question = card.question;
      if (typeof question !== "string" || !question.trim()) {
        issues.push({ path: `${p}.question`, message: "Must be a non-empty string." });
      }
      
      const answer = card.answer;
      if (typeof answer !== "string" || !answer.trim()) {
        issues.push({ path: `${p}.answer`, message: "Must be a non-empty string." });
      }
    });
  }
  
  return issues;
}

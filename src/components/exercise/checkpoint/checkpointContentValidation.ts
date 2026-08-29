import type { MicrolearningContentIssue } from "../microlearning/microlearningTypes";
import { validateArrayCount, validateStringBudget, validateUniqueIds, readRequiredPath } from "../microlearning/microlearningContentValidation";

export function validateCheckpointContent(content: unknown): MicrolearningContentIssue[] {
  const issues: MicrolearningContentIssue[] = [];
  validateStringBudget(content, "intro.title", 10, issues);
  validateStringBudget(content, "intro.subtitle", 20, issues);
  const items = validateArrayCount(content, "items", 3, 5, issues);
  if (items) {
    validateUniqueIds(items, "items", issues);
    items.forEach((item, i) => {
      const type = readRequiredPath(item, `type`, issues);
      if (type === "single_choice" || type === "ordering" || type === "matching" || type === "recall") {
        validateStringBudget(content, `items.${i}.conceptId`, 10, issues);
      } else {
        issues.push({ path: `items.${i}.type`, message: "Unknown item type" });
      }
    });
  }
  validateStringBudget(content, "summary.title", 10, issues);
  validateStringBudget(content, "summary.subtitle", 20, issues);
  return issues;
}

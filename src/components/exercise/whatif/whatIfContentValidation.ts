import type { MicrolearningContentIssue } from "../microlearning/microlearningTypes";
import { validateArrayCount, validateStringBudget, validateUniqueIds } from "../microlearning/microlearningContentValidation";

export function validateWhatIfContent(content: unknown): MicrolearningContentIssue[] {
  const issues: MicrolearningContentIssue[] = [];
  const predictions = validateArrayCount(content, "predictions", 2, 3, issues);
  if (predictions) {
    validateUniqueIds(predictions, "predictions", issues);
    predictions.forEach((_, i) => validateStringBudget(content, `predictions.${i}.text`, 20, issues));
  }
  const consequences = validateArrayCount(content, "consequences", 2, 4, issues);
  if (consequences) {
    validateUniqueIds(consequences, "consequences", issues);
    consequences.forEach((_, i) => validateStringBudget(content, `consequences.${i}.text`, 30, issues));
  }
  validateStringBudget(content, "finalComparison.heading", 10, issues);
  validateStringBudget(content, "finalComparison.description", 40, issues);
  return issues;
}

import type { MicrolearningContentIssue } from "../microlearning/microlearningTypes";
import { validateArrayCount, countWords } from "../microlearning/microlearningContentValidation";

export function validateWhatIfContent(content: unknown): MicrolearningContentIssue[] {
  const issues: MicrolearningContentIssue[] = [];
  const options = validateArrayCount(content, "options", 2, 4, issues);
  if (options) {
    options.forEach((opt, i) => {
      if (typeof opt === "string") {
        const count = countWords(opt);
        if (count > 20) issues.push({ path: `options.${i}`, message: `Must be 20 words or fewer; found ${count}.` });
        if (!opt.trim()) issues.push({ path: `options.${i}`, message: "Must be a non-empty string." });
      } else {
        if (!opt || typeof (opt as any).id !== "string") issues.push({ path: `options.${i}.id`, message: "Required value is missing." });
        const labelOrText = (opt as any).label || (opt as any).text;
        if (typeof labelOrText !== "string") issues.push({ path: `options.${i}.label`, message: "Required value is missing." });
      }
    });
  }
  const steps = validateArrayCount(content, "steps", 1, 5, issues);
  if (steps) {
    steps.forEach((step, i) => {
      if (typeof step === "string") {
        const count = countWords(step);
        if (count > 30) issues.push({ path: `steps.${i}`, message: `Must be 30 words or fewer; found ${count}.` });
        if (!step.trim()) issues.push({ path: `steps.${i}`, message: "Must be a non-empty string." });
      } else {
        if (!step || typeof (step as any).body !== "string") issues.push({ path: `steps.${i}.body`, message: "Required value is missing." });
      }
    });
  }
  return issues;
}

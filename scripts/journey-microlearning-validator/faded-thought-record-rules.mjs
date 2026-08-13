const ROOT_KEYS = ["title", "instruction", "fields", "examples", "completionInsight"];
const FIELD_KEYS = ["id", "label"];
const EXAMPLE_KEYS = ["id", "label", "context", "prefills", "tasks", "activeFieldOrder"];
const PREFILL_KEYS = ["fieldId", "value"];
const TASK_KEYS = ["fieldId", "prompt", "clue", "options"];
const OPTION_KEYS = ["id", "label", "isSupported", "feedback"];

export function validateFadedThoughtRecord(content, issues) {
  if (!isRecord(content)) {
    issues.push({ path: "content", message: "Must be an object." });
    return;
  }
  validateExactKeys(content, ROOT_KEYS, "content", issues);
  validateText(content.title, "title", 7, issues);
  validateText(content.instruction, "instruction", 12, issues);
  validateSentence(content.completionInsight, "completionInsight", issues);
  const fields = readExactArray(content.fields, "fields", 3, 5, issues);
  const examples = readExactArray(content.examples, "examples", 2, 2, issues);
  const ids = new Set();
  const fieldIds = new Set();
  fields?.forEach((field, index) => {
    const path = `fields[${index}]`;
    if (!isRecord(field)) return pushObjectIssue(path, issues);
    validateExactKeys(field, FIELD_KEYS, path, issues);
    if (validateId(field.id, `${path}.id`, ids, issues)) fieldIds.add(field.id);
    validateText(field.label, `${path}.label`, 6, issues);
  });
  examples?.forEach((example, index) => {
    validateExample(example, index, fieldIds, ids, issues);
  });
}

function validateExample(value, index, fieldIds, ids, issues) {
  const path = `examples[${index}]`;
  if (!isRecord(value)) return pushObjectIssue(path, issues);
  validateExactKeys(value, EXAMPLE_KEYS, path, issues);
  validateId(value.id, `${path}.id`, ids, issues);
  validateText(value.label, `${path}.label`, 6, issues);
  validateText(value.context, `${path}.context`, 40, issues);
  const taskCount = index === 0 ? 1 : 2;
  const prefillCount = Math.max(fieldIds.size - taskCount, 0);
  const prefills = readExactArray(value.prefills, `${path}.prefills`, prefillCount, prefillCount, issues);
  const tasks = readExactArray(value.tasks, `${path}.tasks`, taskCount, taskCount, issues);
  const order = readExactArray(value.activeFieldOrder, `${path}.activeFieldOrder`, taskCount, taskCount, issues);
  const coverage = new Map();
  prefills?.forEach((prefill, index) => {
    const itemPath = `${path}.prefills[${index}]`;
    if (!isRecord(prefill)) return pushObjectIssue(itemPath, issues);
    validateExactKeys(prefill, PREFILL_KEYS, itemPath, issues);
    validateFieldReference(prefill.fieldId, `${itemPath}.fieldId`, fieldIds, issues);
    addCoverage(prefill.fieldId, coverage);
    validateText(prefill.value, `${itemPath}.value`, 24, issues);
  });
  const taskFieldIds = [];
  tasks?.forEach((task, index) => {
    const itemPath = `${path}.tasks[${index}]`;
    if (!isRecord(task)) return pushObjectIssue(itemPath, issues);
    validateExactKeys(task, TASK_KEYS, itemPath, issues);
    validateFieldReference(task.fieldId, `${itemPath}.fieldId`, fieldIds, issues);
    addCoverage(task.fieldId, coverage);
    if (typeof task.fieldId === "string") taskFieldIds.push(task.fieldId);
    validateText(task.prompt, `${itemPath}.prompt`, 24, issues);
    validateSentence(task.clue, `${itemPath}.clue`, issues);
    validateOptions(task.options, `${itemPath}.options`, ids, issues);
  });
  validateCoverage(fieldIds, coverage, path, issues);
  validateActiveOrder(order, taskFieldIds, prefills, path, issues);
}

function validateOptions(value, path, ids, issues) {
  const options = readExactArray(value, path, 2, 3, issues);
  let supportedCount = 0;
  options?.forEach((option, index) => {
    const itemPath = `${path}[${index}]`;
    if (!isRecord(option)) return pushObjectIssue(itemPath, issues);
    validateExactKeys(option, OPTION_KEYS, itemPath, issues);
    validateId(option.id, `${itemPath}.id`, ids, issues);
    validateText(option.label, `${itemPath}.label`, 12, issues);
    if (typeof option.isSupported !== "boolean") {
      issues.push({ path: `${itemPath}.isSupported`, message: "Must be a boolean." });
    } else if (option.isSupported) supportedCount += 1;
    validateSentence(option.feedback, `${itemPath}.feedback`, issues);
  });
  if (options && supportedCount !== 1) {
    issues.push({ path, message: "Must have exactly one supported option." });
  }
}

function validateActiveOrder(order, taskFieldIds, prefills, path, issues) {
  if (!order) return;
  const prefilled = new Set((prefills ?? []).map((item) => isRecord(item) ? item.fieldId : null));
  const seen = new Set();
  order.forEach((fieldId, index) => {
    const itemPath = `${path}.activeFieldOrder[${index}]`;
    if (typeof fieldId !== "string" || !taskFieldIds.includes(fieldId)) {
      issues.push({ path: itemPath, message: "Must reference a task field." });
    } else if (seen.has(fieldId)) {
      issues.push({ path: itemPath, message: `Duplicate field reference "${fieldId}".` });
    } else seen.add(fieldId);
    if (prefilled.has(fieldId)) {
      issues.push({ path: itemPath, message: "Must not reference a prefilled field." });
    }
  });
  taskFieldIds.forEach((fieldId) => {
    if (!seen.has(fieldId)) {
      issues.push({ path: `${path}.activeFieldOrder`, message: `Missing task field "${fieldId}".` });
    }
  });
}

function validateCoverage(fieldIds, coverage, path, issues) {
  fieldIds.forEach((fieldId) => {
    const count = coverage.get(fieldId) ?? 0;
    if (count !== 1) {
      issues.push({ path, message: `Field "${fieldId}" must appear exactly once; found ${count}.` });
    }
  });
}

function validateFieldReference(value, path, fieldIds, issues) {
  if (typeof value !== "string" || !fieldIds.has(value)) {
    issues.push({ path, message: "Must reference a root field id." });
  }
}

function addCoverage(value, coverage) {
  if (typeof value === "string") coverage.set(value, (coverage.get(value) ?? 0) + 1);
}

function readExactArray(value, path, minimum, maximum, issues) {
  if (!Array.isArray(value)) {
    issues.push({ path, message: "Must be an array." });
    return null;
  }
  if (value.length < minimum || value.length > maximum) {
    const range = minimum === maximum ? `${minimum}` : `${minimum}–${maximum}`;
    issues.push({ path, message: `Must contain ${range} items; found ${value.length}.` });
  }
  return value;
}

function validateExactKeys(value, keys, path, issues) {
  const actual = Object.keys(value);
  if (actual.length !== keys.length || actual.some((key) => !keys.includes(key))) {
    issues.push({ path, message: "Has unsupported or missing fields." });
  }
}

function validateId(value, path, ids, issues) {
  if (typeof value !== "string" || !/^[a-z][a-z0-9-]*$/u.test(value)) {
    issues.push({ path, message: "Must be a stable id." });
    return false;
  }
  if (ids.has(value)) {
    issues.push({ path, message: `Duplicate id "${value}".` });
    return false;
  }
  ids.add(value);
  return true;
}

function validateSentence(value, path, issues) {
  validateText(value, path, 24, issues);
  if (typeof value === "string" && value.trim().split(/[.!?]+/u).filter(Boolean).length !== 1) {
    issues.push({ path, message: "Must be one sentence." });
  }
}

function validateText(value, path, maxWords, issues) {
  if (typeof value !== "string" || !value.trim()) {
    issues.push({ path, message: "Must be a non-empty string." });
  } else if (value.trim().split(/\s+/u).filter(Boolean).length > maxWords) {
    issues.push({ path, message: `Must be ${maxWords} words or fewer.` });
  }
}

function pushObjectIssue(path, issues) {
  issues.push({ path, message: "Must be an object." });
}

function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

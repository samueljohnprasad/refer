const ROOT_KEYS = ["title", "instruction", "original", "moves", "recognition"];
const MOVE_KEYS = ["id", "stepLabel", "result", "changedPhrase", "rationale"];
const RECOGNITION_KEYS = ["prompt", "options"];
const OPTION_KEYS = ["id", "label", "isSupported", "feedback"];

export function validateWorkedRewrite(content, issues) {
  if (!isRecord(content)) return issues.push({ path: "content", message: "Must be an object." });
  validateExactKeys(content, ROOT_KEYS, "content", issues);
  validateText(content.title, "title", 7, issues);
  validateText(content.instruction, "instruction", 12, issues);
  validateText(content.original, "original", 40, issues);
  const ids = new Set();
  const moves = validateArray(content.moves, "moves", 2, 3, issues);
  let preceding = content.original;
  moves?.forEach((move, index) => {
    const path = `moves[${index}]`;
    if (!isRecord(move)) return pushObjectIssue(path, issues);
    validateExactKeys(move, MOVE_KEYS, path, issues);
    validateId(move.id, `${path}.id`, ids, issues);
    validateText(move.stepLabel, `${path}.stepLabel`, 6, issues);
    validateText(move.result, `${path}.result`, 40, issues);
    validateText(move.changedPhrase, `${path}.changedPhrase`, 12, issues);
    validateSentence(move.rationale, `${path}.rationale`, issues);
    if (typeof move.result === "string" && move.result === preceding) {
      issues.push({ path: `${path}.result`, message: "Must differ from the preceding sentence." });
    }
    if (typeof move.result === "string" && typeof move.changedPhrase === "string" && countOccurrences(move.result, move.changedPhrase) !== 1) {
      issues.push({ path: `${path}.changedPhrase`, message: "Must occur exactly once in its result." });
    }
    if (typeof move.result === "string") preceding = move.result;
  });
  validateRecognition(content.recognition, ids, issues);
}

function validateRecognition(value, ids, issues) {
  if (!isRecord(value)) return pushObjectIssue("recognition", issues);
  validateExactKeys(value, RECOGNITION_KEYS, "recognition", issues);
  validateText(value.prompt, "recognition.prompt", 24, issues);
  const options = validateArray(value.options, "recognition.options", 2, 3, issues);
  let supportedCount = 0;
  options?.forEach((option, index) => {
    const path = `recognition.options[${index}]`;
    if (!isRecord(option)) return pushObjectIssue(path, issues);
    validateExactKeys(option, OPTION_KEYS, path, issues);
    validateId(option.id, `${path}.id`, ids, issues);
    validateText(option.label, `${path}.label`, 12, issues);
    if (typeof option.isSupported !== "boolean") issues.push({ path: `${path}.isSupported`, message: "Must be a boolean." });
    else if (option.isSupported) supportedCount += 1;
    validateSentence(option.feedback, `${path}.feedback`, issues);
  });
  if (options && supportedCount !== 1) issues.push({ path: "recognition.options", message: "Must have exactly one supported option." });
}

function validateArray(value, path, minimum, maximum, issues) {
  if (!Array.isArray(value)) {
    issues.push({ path, message: "Must be an array." });
    return null;
  }
  if (value.length < minimum || value.length > maximum) issues.push({ path, message: `Must contain ${minimum}–${maximum} items; found ${value.length}.` });
  return value;
}

function validateExactKeys(value, keys, path, issues) {
  const actual = Object.keys(value);
  if (actual.length !== keys.length || actual.some((key) => !keys.includes(key))) issues.push({ path, message: "Has unsupported or missing fields." });
}

function validateId(value, path, ids, issues) {
  if (typeof value !== "string" || !/^[a-z][a-z0-9-]*$/u.test(value)) issues.push({ path, message: "Must be a stable id." });
  else if (ids.has(value)) issues.push({ path, message: `Duplicate id "${value}".` });
  else ids.add(value);
}

function validateSentence(value, path, issues) {
  validateText(value, path, 24, issues);
  if (typeof value === "string" && value.trim().split(/[.!?]+/u).filter(Boolean).length !== 1) issues.push({ path, message: "Must be one sentence." });
}

function validateText(value, path, maxWords, issues) {
  if (typeof value !== "string" || !value.trim()) issues.push({ path, message: "Must be a non-empty string." });
  else if (value.trim().split(/\s+/u).filter(Boolean).length > maxWords) issues.push({ path, message: `Must be ${maxWords} words or fewer.` });
}

function countOccurrences(value, phrase) {
  return phrase ? value.split(phrase).length - 1 : 0;
}

function pushObjectIssue(path, issues) {
  issues.push({ path, message: "Must be an object." });
}

function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

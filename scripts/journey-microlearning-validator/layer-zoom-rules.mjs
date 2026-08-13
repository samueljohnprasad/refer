const ROOT_KEYS = ["title", "instruction", "layers", "insight", "image"];
const REQUIRED_ROOT_KEYS = ["title", "instruction", "layers", "insight"];
const LAYER_KEYS = ["id", "label", "title", "body"];
const IMAGE_KEYS = ["uri", "accessibilityDescription", "caption"];

export function validateLayerZoom(content, issues) {
  if (!isRecord(content)) return issues.push({ path: "content", message: "Must be an object." });
  validateExactKeys(content, ROOT_KEYS, REQUIRED_ROOT_KEYS, "content", issues);
  validateText(content.title, "title", 7, issues);
  validateText(content.instruction, "instruction", 12, issues);
  validateSentence(content.insight, "insight", issues);
  const layers = validateArray(content.layers, "layers", 2, 4, issues);
  const ids = new Set();
  layers?.forEach((layer, index) => validateLayer(layer, index, ids, issues));
  if (content.image !== undefined) validateImage(content.image, issues);
}

function validateLayer(value, index, ids, issues) {
  const path = `layers[${index}]`;
  if (!isRecord(value)) return pushObjectIssue(path, issues);
  validateExactKeys(value, LAYER_KEYS, LAYER_KEYS, path, issues);
  validateId(value.id, `${path}.id`, ids, issues);
  validateText(value.label, `${path}.label`, 6, issues);
  validateText(value.title, `${path}.title`, 12, issues);
  validateText(value.body, `${path}.body`, 40, issues);
}

function validateImage(value, issues) {
  if (!isRecord(value)) return pushObjectIssue("image", issues);
  validateExactKeys(value, IMAGE_KEYS, ["uri", "accessibilityDescription"], "image", issues);
  validateText(value.uri, "image.uri", Infinity, issues);
  validateText(value.accessibilityDescription, "image.accessibilityDescription", 24, issues);
  if (value.caption !== undefined) validateText(value.caption, "image.caption", 12, issues);
}

function validateArray(value, path, minimum, maximum, issues) {
  if (!Array.isArray(value)) { issues.push({ path, message: "Must be an array." }); return null; }
  if (value.length < minimum || value.length > maximum) issues.push({ path, message: `Must contain ${minimum}–${maximum} items; found ${value.length}.` });
  return value;
}

function validateExactKeys(value, allowed, required, path, issues) {
  const keys = Object.keys(value);
  if (keys.some((key) => !allowed.includes(key)) || required.some((key) => !keys.includes(key))) issues.push({ path, message: "Has unsupported or missing fields." });
}

function validateId(value, path, ids, issues) {
  if (typeof value !== "string" || !/^[a-z][a-z0-9-]*$/u.test(value)) issues.push({ path, message: "Must be a stable id." });
  else if (ids.has(value)) issues.push({ path, message: `Duplicate id \"${value}\".` });
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

function pushObjectIssue(path, issues) { issues.push({ path, message: "Must be an object." }); }
function isRecord(value) { return Boolean(value) && typeof value === "object" && !Array.isArray(value); }

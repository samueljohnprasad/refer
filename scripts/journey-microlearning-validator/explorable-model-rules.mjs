const ROOT_KEYS = ["title", "instruction", "setup", "model", "chartAccessibilityLabel", "initialValues", "stages", "sandboxPrompt"];
const VALUE_KEYS = ["load", "walk", "replay", "coffee"];
const STAGE_KEYS = ["id", "prompt", "summaryLabel", "control"];
const SLIDER_KEYS = ["type", "input", "label", "accessibilityLabel", "min", "max", "step"];
const TOGGLE_KEYS = ["type", "input", "label", "accessibilityLabel", "onLabel", "offLabel"];
const TOGGLE_INPUTS = new Set(["walk", "replay", "coffee"]);

export function validateExplorableModel(content, issues) {
  if (!isRecord(content)) {
    issues.push({ path: "content", message: "Must be an object." });
    return;
  }
  validateExactKeys(content, ROOT_KEYS, "content", issues);
  validateText(content.title, "title", 7, issues);
  validateText(content.instruction, "instruction", 12, issues);
  validateText(content.setup, "setup", 40, issues);
  validateText(content.chartAccessibilityLabel, "chartAccessibilityLabel", 12, issues);
  validateText(content.sandboxPrompt, "sandboxPrompt", 24, issues);
  if (content.model !== "maya_alarm") issues.push({ path: "model", message: "Must be maya_alarm." });

  const initialValues = validateInitialValues(content.initialValues, issues);
  if (!Array.isArray(content.stages)) {
    issues.push({ path: "stages", message: "Must be an array." });
    return;
  }
  if (content.stages.length < 2 || content.stages.length > 3) {
    issues.push({ path: "stages", message: `Must contain 2–3 items; found ${content.stages.length}.` });
  }
  const stageIds = new Set();
  const inputs = new Set();
  let slider = null;
  content.stages.forEach((stage, index) => {
    const path = `stages[${index}]`;
    if (!isRecord(stage)) {
      issues.push({ path, message: "Must be an object." });
      return;
    }
    validateExactKeys(stage, STAGE_KEYS, path, issues);
    validateStableId(stage.id, `${path}.id`, stageIds, issues);
    validateText(stage.prompt, `${path}.prompt`, 24, issues);
    validateText(stage.summaryLabel, `${path}.summaryLabel`, 12, issues);
    const control = validateControl(stage.control, `${path}.control`, inputs, issues);
    if (control?.type === "slider") slider = control;
  });
  validateInitialSliderValue(initialValues, slider, issues);
}

function validateInitialValues(value, issues) {
  if (!isRecord(value)) {
    issues.push({ path: "initialValues", message: "Must be an object." });
    return null;
  }
  validateExactKeys(value, VALUE_KEYS, "initialValues", issues);
  if (!isDomainInteger(value.load)) {
    issues.push({ path: "initialValues.load", message: "Must be an integer from 0 to 100." });
  }
  for (const input of ["walk", "replay", "coffee"]) {
    if (typeof value[input] !== "boolean") {
      issues.push({ path: `initialValues.${input}`, message: "Must be a boolean." });
    }
  }
  return isDomainInteger(value.load) && typeof value.walk === "boolean" &&
    typeof value.replay === "boolean" && typeof value.coffee === "boolean" ? value : null;
}

function validateControl(value, path, inputs, issues) {
  if (!isRecord(value)) {
    issues.push({ path, message: "Must be an object." });
    return null;
  }
  if (value.type === "slider") {
    validateExactKeys(value, SLIDER_KEYS, path, issues);
    if (value.input !== "load") issues.push({ path: `${path}.input`, message: "Slider input must be load." });
    validateSliderNumbers(value, path, issues);
  } else if (value.type === "toggle") {
    validateExactKeys(value, TOGGLE_KEYS, path, issues);
    if (typeof value.input !== "string" || !TOGGLE_INPUTS.has(value.input)) {
      issues.push({ path: `${path}.input`, message: "Toggle input must be walk, replay, or coffee." });
    }
    validateText(value.onLabel, `${path}.onLabel`, 12, issues);
    validateText(value.offLabel, `${path}.offLabel`, 12, issues);
  } else issues.push({ path: `${path}.type`, message: "Must be slider or toggle." });
  validateText(value.label, `${path}.label`, 12, issues);
  validateText(value.accessibilityLabel, `${path}.accessibilityLabel`, 12, issues);
  if (typeof value.input === "string") {
    if (inputs.has(value.input)) issues.push({ path: `${path}.input`, message: `Duplicate control input "${value.input}".` });
    else inputs.add(value.input);
  }
  return value;
}

function validateSliderNumbers(value, path, issues) {
  for (const key of ["min", "max", "step"]) {
    if (!Number.isInteger(value[key])) issues.push({ path: `${path}.${key}`, message: "Must be a finite integer." });
  }
  if (!(Number.isInteger(value.min) && Number.isInteger(value.max) &&
    value.min >= 0 && value.max <= 100 && value.min < value.max)) {
    issues.push({ path, message: "Slider range must satisfy 0 <= min < max <= 100." });
  }
  if (!Number.isInteger(value.step) || value.step <= 0) {
    issues.push({ path: `${path}.step`, message: "Must be positive." });
  }
}

function validateInitialSliderValue(initialValues, slider, issues) {
  if (!initialValues || !slider || !Number.isInteger(slider.min) ||
    !Number.isInteger(slider.max) || !Number.isInteger(slider.step) || slider.step <= 0) return;
  if (initialValues.load < slider.min || initialValues.load > slider.max ||
    !isStepAligned(initialValues.load, slider.min, slider.step)) {
    issues.push({ path: "initialValues.load", message: "Must be inside and aligned to the authored slider range." });
  }
}

function validateExactKeys(value, keys, path, issues) {
  const actual = Object.keys(value);
  if (actual.length !== keys.length || actual.some((key) => !keys.includes(key))) {
    issues.push({ path, message: "Has unsupported or missing fields." });
  }
}

function validateStableId(value, path, ids, issues) {
  if (typeof value !== "string" || !/^[a-z][a-z0-9-]*$/u.test(value)) {
    issues.push({ path, message: "Must be a stable id." });
  } else if (ids.has(value)) issues.push({ path, message: `Duplicate id "${value}".` });
  else ids.add(value);
}

function validateText(value, path, maxWords, issues) {
  if (typeof value !== "string" || !value.trim()) issues.push({ path, message: "Must be a non-empty string." });
  else if (value.trim().split(/\s+/u).filter(Boolean).length > maxWords) {
    issues.push({ path, message: `Must be ${maxWords} words or fewer.` });
  }
}

function isDomainInteger(value) {
  return Number.isInteger(value) && value >= 0 && value <= 100;
}

function isStepAligned(value, min, step) {
  return Math.abs((value - min) / step - Math.round((value - min) / step)) < 1e-9;
}

function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

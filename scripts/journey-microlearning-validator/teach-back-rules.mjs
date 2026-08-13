export function validateTeachBackChain(content, issues) {
  if (!hasOnlyKeys(content, ["title", "instruction", "message", "steps", "transfer"])) {
    issues.push({ path: "content", message: "Must use only title, instruction, message, steps, and transfer." });
  }
  validateText(content?.title, "title", 7, issues);
  validateText(content?.instruction, "instruction", 12, issues);
  validateText(content?.message, "message", 40, issues);
  const steps = readArray(content?.steps, "steps", 3, 4, issues);
  const ids = new Set();
  if (steps) validateSteps(steps, ids, issues);
  validateTransfer(content?.transfer, ids, issues);
}

function validateSteps(steps, ids, issues) {
  const orders = [];
  steps.forEach((step, index) => {
    const path = `steps[${index}]`;
    if (!hasOnlyKeys(step, ["id", "label", "order"])) {
      issues.push({ path, message: "Must use only id, label, and order." });
      return;
    }
    validateGlobalId(step.id, `${path}.id`, ids, issues);
    validateText(step.label, `${path}.label`, 12, issues);
    if (!Number.isInteger(step.order)) {
      issues.push({ path: `${path}.order`, message: "Must be an integer." });
    } else {
      orders.push(step.order);
    }
  });
  if (!hasContiguousOrders(orders, steps.length)) {
    issues.push({ path: "steps", message: "Order must be contiguous from 1." });
  }
}

function validateTransfer(value, ids, issues) {
  if (!hasOnlyKeys(value, ["prompt", "options"])) {
    issues.push({ path: "transfer", message: "Must use only prompt and options." });
    return;
  }
  validateText(value.prompt, "transfer.prompt", 24, issues);
  const options = readArray(value.options, "transfer.options", 2, 3, issues);
  if (!options) return;
  let supportedCount = 0;
  options.forEach((option, index) => {
    const path = `transfer.options[${index}]`;
    if (!hasOnlyKeys(option, ["id", "label", "isSupported", "response", "takeaway"])) {
      issues.push({ path, message: "Must use only id, label, isSupported, response, and takeaway." });
      return;
    }
    validateGlobalId(option.id, `${path}.id`, ids, issues);
    validateText(option.label, `${path}.label`, 12, issues);
    if (typeof option.isSupported !== "boolean") {
      issues.push({ path: `${path}.isSupported`, message: "Must be a boolean." });
    } else if (option.isSupported) {
      supportedCount += 1;
    }
    validateSentence(option.response, `${path}.response`, issues);
    validateSentence(option.takeaway, `${path}.takeaway`, issues);
  });
  if (supportedCount !== 1) {
    issues.push({ path: "transfer.options", message: "Must have exactly one supported option." });
  }
}

function readArray(value, path, minimum, maximum, issues) {
  if (!Array.isArray(value)) {
    issues.push({ path, message: "Must be an array." });
    return null;
  }
  if (value.length < minimum || value.length > maximum) {
    issues.push({ path, message: `Must contain ${minimum}–${maximum} items; found ${value.length}.` });
  }
  return value;
}

function validateGlobalId(value, path, ids, issues) {
  if (typeof value !== "string" || !/^[a-z][a-z0-9-]*$/.test(value)) {
    issues.push({ path, message: "Must be a stable id." });
  } else if (ids.has(value)) {
    issues.push({ path, message: `Duplicate id "${value}".` });
  } else {
    ids.add(value);
  }
}

function validateText(value, path, maxWords, issues) {
  if (typeof value !== "string" || !value.trim()) {
    issues.push({ path, message: "Must be a non-empty string." });
  } else if (countWords(value) > maxWords) {
    issues.push({ path, message: `Must be ${maxWords} words or fewer; found ${countWords(value)}.` });
  }
}

function validateSentence(value, path, issues) {
  validateText(value, path, 24, issues);
  if (typeof value === "string" && !isSingleSentence(value)) {
    issues.push({ path, message: "Must be one sentence." });
  }
}

function hasContiguousOrders(orders, count) {
  return orders.length === count && orders.sort((left, right) => left - right).every((order, index) => order === index + 1);
}

function hasOnlyKeys(value, keys) {
  return isRecord(value) && Object.keys(value).length === keys.length && keys.every((key) => key in value);
}

function isSingleSentence(value) {
  return value.trim().split(/[.!?]+/u).filter(Boolean).length === 1;
}

function countWords(value) {
  return value.trim().split(/\s+/u).filter(Boolean).length;
}

function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

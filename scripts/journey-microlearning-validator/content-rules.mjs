export function countWords(value) {
  return value.trim().split(/\s+/u).filter(Boolean).length;
}

export function validateStringBudget(root, path, maxWords, issues) {
  const value = readRequiredPath(root, path, issues);
  if (value === undefined) return;
  if (typeof value !== "string" || value.trim().length === 0) {
    issues.push({ path, message: "Must be a non-empty string." });
    return;
  }
  const count = countWords(value);
  if (count > maxWords) {
    issues.push({ path, message: `Must be ${maxWords} words or fewer; found ${count}.` });
  }
}

export function validateArrayCount(root, path, minimum, maximum, issues) {
  const value = readRequiredPath(root, path, issues);
  if (value === undefined) return null;
  if (!Array.isArray(value)) {
    issues.push({ path, message: "Must be an array." });
    return null;
  }
  if (value.length < minimum || value.length > maximum) {
    issues.push({
      path,
      message: `Must contain ${minimum}–${maximum} items; found ${value.length}.`,
    });
  }
  return value;
}

export function validateUniqueIds(items, path, issues) {
  const ids = new Set();
  items.forEach((item, index) => {
    const itemPath = `${path}[${index}].id`;
    if (!isRecord(item) || typeof item.id !== "string" || !item.id.trim()) {
      issues.push({ path: itemPath, message: "Must be a non-empty string." });
    } else if (ids.has(item.id)) {
      issues.push({ path: itemPath, message: `Duplicate id \"${item.id}\".` });
    } else {
      ids.add(item.id);
    }
  });
  return ids;
}

export function validateReferences(references, validIds, path, issues) {
  references.forEach((reference, index) => {
    if (typeof reference !== "string" || !validIds.has(reference)) {
      issues.push({
        path: `${path}[${index}]`,
        message: `Must reference an authored id; found ${JSON.stringify(reference)}.`,
      });
    }
  });
}

export function readRequiredPath(root, path, issues) {
  let current = root;
  for (const segment of path.split(".")) {
    if (!isRecord(current) || !(segment in current)) {
      issues.push({ path, message: "Required value is missing." });
      return undefined;
    }
    current = current[segment];
  }
  return current;
}

export function validateGuidedDiscoveryTrail(content, issues) {
  const questions = validateArrayCount(content, "questions", 3, 4, issues);
  validateStringBudget(content, "stamp", 24, issues);
  if (!questions) return;

  const ids = new Set();
  questions.forEach((question, questionIndex) => {
    const path = `questions[${questionIndex}]`;
    if (!hasOnlyKeys(question, ["id", "prompt", "summary", "options"])) {
      issues.push({ path, message: "Must use only id, prompt, summary, and options." });
      return;
    }
    validateGlobalId(question.id, `${path}.id`, ids, issues);
    validateText(question.prompt, `${path}.prompt`, 24, issues);
    validateText(question.summary, `${path}.summary`, 12, issues);
    const options = readArray(question.options, `${path}.options`, 2, 3, issues);
    if (!options) return;
    options.forEach((option, optionIndex) => {
      const optionPath = `${path}.options[${optionIndex}]`;
      if (!hasOnlyKeys(option, ["id", "label", "response"])) {
        issues.push({ path: optionPath, message: "Must use only id, label, and response." });
        return;
      }
      validateGlobalId(option.id, `${optionPath}.id`, ids, issues);
      validateText(option.label, `${optionPath}.label`, 12, issues);
      validateText(option.response, `${optionPath}.response`, 24, issues);
      if (typeof option.response === "string" && !isSingleSentence(option.response)) {
        issues.push({ path: `${optionPath}.response`, message: "Must be one sentence." });
      }
    });
  });
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

function validateText(value, path, maxWords, issues) {
  if (typeof value !== "string" || !value.trim()) {
    issues.push({ path, message: "Must be a non-empty string." });
  } else if (countWords(value) > maxWords) {
    issues.push({ path, message: `Must be ${maxWords} words or fewer; found ${countWords(value)}.` });
  }
}

function validateGlobalId(value, path, ids, issues) {
  if (typeof value !== "string" || !value.trim()) {
    issues.push({ path, message: "Must be a non-empty string." });
  } else if (ids.has(value)) {
    issues.push({ path, message: `Duplicate id \"${value}\".` });
  } else {
    ids.add(value);
  }
}

function hasOnlyKeys(value, keys) {
  return (
    isRecord(value) &&
    Object.keys(value).every((key) => keys.includes(key)) &&
    keys.every((key) => key in value)
  );
}

function isSingleSentence(value) {
  return value.trim().split(/[.!?]+/u).filter(Boolean).length === 1;
}

function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

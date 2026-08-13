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

function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

import { parseDocument } from "yaml";
import { parseSqlRecordsets } from "./source-parser.mjs";

export const MICROLEARNING_CATEGORIES = [
  "guided_discovery_trail",
  "reframe_builder",
  "teach_back_chain",
  "explorable_model",
  "faded_thought_record",
  "worked_rewrite",
  "layer_zoom",
  "dialogue",
  "what_if_machine",
  "course_checkpoint",
  "recall_warmup",
];

const CATEGORY_SET = new Set(MICROLEARNING_CATEGORIES);

export function inventorySql(sourceText, file) {
  const parsed = parseSqlRecordsets(sourceText, file);
  const inventory = parsed.recordsets.reduce(
    (result, recordset) =>
      collectCategoryObjects(
        recordset.value,
        file,
        recordset.source,
        "$",
        result,
      ),
    { items: [], issues: [] },
  );
  return {
    issues: [...parsed.issues, ...inventory.issues],
    items: inventory.items,
  };
}

export function inventoryYaml(sourceText, file) {
  const document = parseDocument(sourceText, { prettyErrors: false });
  if (document.errors.length > 0) {
    return {
      items: [],
      issues: document.errors.map((error) => ({
        file,
        category: "unknown",
        source: "yaml",
        path: "$",
        message: `Malformed YAML: ${error.message}`,
      })),
    };
  }
  return collectCategoryObjects(document.toJS(), file, "yaml");
}

function collectCategoryObjects(
  value,
  file,
  source,
  path = "$",
  result = { items: [], issues: [] },
) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      collectCategoryObjects(item, file, source, `${path}[${index}]`, result);
    });
    return result;
  }
  if (!isRecord(value)) return result;

  if (CATEGORY_SET.has(value.type)) {
    addRecognizedContent(result, {
      category: value.type,
      content: value.content,
      file,
      path: `${path}.content`,
      source: readSourceId(value, source),
    });
  }
  if (CATEGORY_SET.has(value.id)) {
    addRecognizedContent(result, {
      category: value.id,
      content: value.content_schema,
      file,
      path: `${path}.content_schema`,
      source: readSourceId(value, source),
    });
  }

  for (const [key, child] of Object.entries(value)) {
    collectCategoryObjects(child, file, source, `${path}.${key}`, result);
  }
  return result;
}

function addRecognizedContent(result, item) {
  if (isRecord(item.content)) {
    result.items.push(item);
    return;
  }
  result.issues.push({
    file: item.file,
    category: item.category,
    source: item.source,
    path: item.path,
    message: "Recognized category content must be an object.",
  });
}

function readSourceId(value, fallback) {
  for (const key of ["source_id", "id", "name"]) {
    if (typeof value[key] === "string" && value[key].length > 0) return value[key];
  }
  return fallback;
}

function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

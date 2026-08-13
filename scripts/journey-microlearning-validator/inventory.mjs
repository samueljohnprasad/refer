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
  return {
    issues: parsed.issues,
    items: parsed.recordsets.flatMap((recordset) =>
      collectCategoryObjects(recordset.value, file, recordset.source),
    ),
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
  return { issues: [], items: collectCategoryObjects(document.toJS(), file, "yaml") };
}

function collectCategoryObjects(value, file, source, path = "$") {
  if (Array.isArray(value)) {
    return value.flatMap((item, index) =>
      collectCategoryObjects(item, file, source, `${path}[${index}]`),
    );
  }
  if (!isRecord(value)) return [];

  const items = [];
  if (CATEGORY_SET.has(value.type) && isRecord(value.content)) {
    items.push({
      file,
      category: value.type,
      source: readSourceId(value, source),
      path: `${path}.content`,
      content: value.content,
    });
  }
  if (CATEGORY_SET.has(value.id) && isRecord(value.content_schema)) {
    items.push({
      file,
      category: value.id,
      source: readSourceId(value, source),
      path: `${path}.content_schema`,
      content: value.content_schema,
    });
  }

  for (const [key, child] of Object.entries(value)) {
    items.push(...collectCategoryObjects(child, file, source, `${path}.${key}`));
  }
  return items;
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

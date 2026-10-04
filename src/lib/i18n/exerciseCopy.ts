export type ExerciseCopyTranslator = (
  sourceText: string,
  values?: Record<string, string | number>,
) => string;

const COPY_FIELDS = new Set([
  "title",
  "subtitle",
  "label",
  "placeholder",
  "helperText",
  "requirementText",
  "statusText",
  "tipText",
  "validationMessage",
  "minLabel",
  "midLabel",
  "maxLabel",
  "anchorLabel",
  "contextLabel",
  "contextText",
  "psychoeducationText",
  "bulletPoints",
  "options",
  "pairs",
  "leftTitle",
  "rightTitle",
  "rule",
  "text",
  "why",
  "coach",
  "description",
  "prompt",
  "reveal",
  "alternateReveal",
  "revealTitle",
  "scoreLabel",
  "keyTakeawayLabel",
  "aiLoadingMessage",
  "fields",
  "items",
  "areas",
  "examples",
  "affirmation",
  "instructions",
  "instruction",
  "kicker",
  "feedback",
  "detail",
  "next",
  "waitingPrimaryLabel",
  "successPrimaryLabel",
  "feedbackTitle",
  "feedbackTakeaway",
  "feedback_correct",
  "feedback_incorrect",
  "workedExample",
  "workedAnswer",
  "minText",
  "maxText",
  "note",
  "body",
  "content",
  "choices",
  "steps",
  "timerConfig",
  "nextLabel",
  "secondaryLabel",
  "helpText",
  "actionLabel",
  "callToAction",
  "leftLabel",
  "rightLabel",
  "centerLabel",
]);

const NON_COPY_CONTAINERS = new Set(["colors", "style", "styles"]);
const NON_COPY_FIELDS = new Set([
  "id",
  "key",
  "value",
  "type",
  "fieldKey",
  "icon",
  "iconKey",
  "visual",
  "component",
]);

export function exerciseCopyKey(sourceText: string): string {
  const slug = sourceText
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 48) || "text";
  let hash = 2166136261;
  for (let index = 0; index < sourceText.length; index += 1) {
    hash = Math.imul(hash ^ sourceText.charCodeAt(index), 16777619);
  }
  return `flow.ui.copy.${slug}_${(hash >>> 0).toString(36)}`;
}

export function translateStepCopyProps<T>(
  value: T,
  translate: ExerciseCopyTranslator,
): T {
  return mapCopyValue(value, translate, false) as T;
}

function mapCopyValue(
  value: unknown,
  translate: ExerciseCopyTranslator,
  isCopyField: boolean,
): unknown {
  if (typeof value === "string") {
    return isCopyField ? translate(value) : value;
  }
  if (Array.isArray(value)) {
    return value.map((item) => mapCopyValue(item, translate, isCopyField));
  }
  if (!value || typeof value !== "object") return value;

  return Object.fromEntries(
    Object.entries(value).map(([field, fieldValue]) => {
      if (NON_COPY_CONTAINERS.has(field) || NON_COPY_FIELDS.has(field)) {
        return [field, fieldValue];
      }
      return [
        field,
        mapCopyValue(fieldValue, translate, COPY_FIELDS.has(field)),
      ];
    }),
  );
}

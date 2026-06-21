/**
 * Schema → System Prompt Converter
 *
 * Converts a JSON Schema object (as used in exercise configs) into a
 * human-readable system prompt that instructs a local LLM to return
 * valid JSON in the expected shape.
 *
 * Small models respond best to concrete examples rather than abstract
 * schema definitions, so we render the schema as a TypeScript-like
 * type annotation that the model can directly imitate.
 */

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Build a system prompt from a JSON Schema that instructs the model
 * to return ONLY valid JSON matching the schema.
 *
 * @param schema - A JSON Schema object (the same format used in AIStepConfig.responseSchema)
 * @returns A system prompt string
 *
 * @example
 * ```ts
 * const schema = {
 *   type: "array",
 *   items: {
 *     type: "object",
 *     properties: { text: { type: "string" }, emoji: { type: "string" } },
 *     required: ["text", "emoji"],
 *   },
 * };
 * schemaToSystemPrompt(schema);
 * // →
 * // Return ONLY valid JSON. No markdown, no explanation, no extra text.
 * //
 * // Expected JSON format:
 * // [
 * //   { "text": string, "emoji": string }
 * // ]
 * ```
 */
export function schemaToSystemPrompt(
  schema: Record<string, unknown>,
): string {
  const example: string = renderSchemaExample(schema, 0);

  return [
    'Return ONLY valid JSON. No markdown, no explanation, no extra text.',
    '',
    'Expected JSON format:',
    example,
  ].join('\n');
}

// ─── Internal Rendering ─────────────────────────────────────────────────────

/**
 * Recursively renders a JSON Schema into a human-readable example string.
 */
function renderSchemaExample(
  schema: Record<string, unknown>,
  indent: number,
): string {
  const pad: string = '  '.repeat(indent);
  const type: string = (schema.type as string) ?? 'object';

  switch (type) {
    case 'array':
      return renderArrayExample(schema, indent, pad);

    case 'object':
      return renderObjectExample(schema, indent, pad);

    case 'string':
      return 'string';

    case 'number':
    case 'integer':
      return 'number';

    case 'boolean':
      return 'boolean';

    default:
      return 'any';
  }
}

/**
 * Renders a JSON Schema array as a readable example.
 */
function renderArrayExample(
  schema: Record<string, unknown>,
  indent: number,
  pad: string,
): string {
  const items: Record<string, unknown> | undefined =
    schema.items as Record<string, unknown> | undefined;

  if (!items) {
    return `${pad}[]`;
  }

  const itemExample: string = renderSchemaExample(items, indent + 1);

  // For simple types, keep it compact: [string]
  if (typeof items.type === 'string' && items.type !== 'object' && items.type !== 'array') {
    return `${pad}[${itemExample}]`;
  }

  return [
    `${pad}[`,
    `${itemExample}`,
    `${pad}]`,
  ].join('\n');
}

/**
 * Renders a JSON Schema object as a readable example.
 */
function renderObjectExample(
  schema: Record<string, unknown>,
  indent: number,
  pad: string,
): string {
  const properties: Record<string, Record<string, unknown>> | undefined =
    schema.properties as Record<string, Record<string, unknown>> | undefined;

  if (!properties) {
    return `${pad}{}`;
  }

  const innerPad: string = '  '.repeat(indent + 1);
  const entries: string[] = Object.entries(properties).map(
    ([key, propSchema]: [string, Record<string, unknown>]) => {
      const valueExample: string = renderSchemaExample(propSchema, indent + 1);
      return `${innerPad}"${key}": ${valueExample}`;
    },
  );

  return [
    `${pad}{`,
    entries.join(',\n'),
    `${pad}}`,
  ].join('\n');
}

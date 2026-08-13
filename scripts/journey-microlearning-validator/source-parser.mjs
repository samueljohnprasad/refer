const RECORDSET_MARKER = /jsonb_to_recordset\s*\(/giu;

export function parseSqlRecordsets(sourceText, file) {
  const recordsets = [];
  const issues = [];
  let match;
  while ((match = RECORDSET_MARKER.exec(sourceText)) !== null) {
    const start = skipWhitespace(sourceText, match.index + match[0].length);
    const source = `jsonb_to_recordset@${lineNumber(sourceText, match.index)}`;
    const quoted = readQuotedSqlValue(sourceText, start);
    if (!quoted.ok) {
      issues.push({ file, category: "unknown", source, path: "$", message: quoted.message });
      RECORDSET_MARKER.lastIndex = Math.max(RECORDSET_MARKER.lastIndex, start + 1);
      continue;
    }

    try {
      const value = JSON.parse(quoted.value);
      if (!Array.isArray(value)) {
        issues.push({
          file,
          category: "unknown",
          source,
          path: "$",
          message: "Recordset JSON must be an array.",
        });
      } else {
        recordsets.push({ file, source, value });
      }
    } catch (error) {
      issues.push({
        file,
        category: "unknown",
        source,
        path: "$",
        message: `Malformed recordset JSON: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
    RECORDSET_MARKER.lastIndex = Math.max(RECORDSET_MARKER.lastIndex, quoted.end);
  }
  return { recordsets, issues };
}

function readQuotedSqlValue(source, start) {
  if (source[start] === "'") return readSingleQuotedValue(source, start);
  if (source[start] === "$") return readDollarQuotedValue(source, start);
  return {
    ok: false,
    message: "Matched recordset does not start with a supported SQL string quote.",
  };
}

function readSingleQuotedValue(source, start) {
  let value = "";
  for (let index = start + 1; index < source.length; index += 1) {
    if (source[index] !== "'") {
      value += source[index];
      continue;
    }
    if (source[index + 1] === "'") {
      value += "'";
      index += 1;
      continue;
    }
    return { ok: true, value, end: index + 1 };
  }
  return { ok: false, message: "Unterminated single-quoted recordset." };
}

function readDollarQuotedValue(source, start) {
  const opener = source.slice(start).match(/^\$(?:[A-Za-z_][A-Za-z0-9_]*)?\$/u)?.[0];
  if (!opener) return { ok: false, message: "Malformed dollar-quote opener." };
  const valueStart = start + opener.length;
  const end = source.indexOf(opener, valueStart);
  if (end < 0) return { ok: false, message: `Unterminated ${opener} recordset.` };
  return { ok: true, value: source.slice(valueStart, end), end: end + opener.length };
}

function skipWhitespace(source, start) {
  let index = start;
  while (/\s/u.test(source[index] ?? "")) index += 1;
  return index;
}

function lineNumber(source, index) {
  return source.slice(0, index).split("\n").length;
}

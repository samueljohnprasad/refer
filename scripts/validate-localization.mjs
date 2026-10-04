// ponytail: read-only checks for bundled translations and app-owned copy
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';

const ROOT = process.cwd();
const LOCALES = path.join(ROOT, 'src/locales');
const SOURCE_DIRS = ['app', 'src', 'components', 'hooks'];
const EXCLUDED_PATHS = [
  /(^|\/)(?:__tests__|__mocks__|dev|debug|storybook)(\/|$)/,
  /(?:\.test|\.spec)\.[cm]?[jt]sx?$/,
  /^app\/tabs\/screens\/\(tracking\)\/test-charts\.tsx$/,
  /^app\/\+html\.tsx$/,
  /^src\/locales\//,
  /^src\/types\//,
];
const COPY_PROPERTIES = new Set([
  'title', 'subtitle', 'label', 'description', 'message', 'text', 'content',
  'placeholder', 'accessibilityLabel', 'accessibilityHint', 'aria-label',
  'helperText', 'buttonText', 'emptyText', 'errorMessage', 'successMessage', 'headerBackTitle',
  'prompt', 'question', 'instruction', 'hint', 'feedback', 'explanation',
  'summary', 'body', 'notificationTitle', 'notificationBody', 'permissionMessage',
]);
const COPY_CALLS = new Set(['alert', 'confirm', 'prompt', 'showToast', 'toast', 'notify']);
const APPROVED_ENGLISH = new Set(['Happy', 'Happy Premium', 'CBT', 'AI', 'XP']);
const PLACEHOLDER = /\{\{\s*([\w.]+)(?:\s*,[^{}]+)?\s*\}\}/g;
const LETTER = /\p{L}/u;
const EMPTY_OBJECT = Symbol('empty object');
const EMPTY_ARRAY = Symbol('empty array');

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? listFiles(fullPath) : [fullPath];
  }));
  return files.flat().sort();
}

function flattenStrings(value, prefix = '') {
  if (Array.isArray(value)) {
    if (value.length === 0) return [[prefix, EMPTY_ARRAY]];
    return value.flatMap((child, index) => flattenStrings(child, `${prefix}.${index}`));
  }
  if (value === null || typeof value !== 'object') {
    return [[prefix, value]];
  }
  if (Object.keys(value).length === 0) return [[prefix, EMPTY_OBJECT]];
  return Object.entries(value).flatMap(([key, child]) =>
    flattenStrings(child, prefix ? `${prefix}.${key}` : key));
}

function placeholders(value) {
  return [...new Set([...value.matchAll(PLACEHOLDER)].map((match) => match[1]))].sort();
}

function pluralBase(key) {
  return key.replace(/_(?:zero|one|two|few|many|other)$/, '');
}

function groupPluralKeys(entries) {
  const groups = new Map();
  for (const [key, value] of entries) {
    const base = pluralBase(key);
    const group = groups.get(base) ?? [];
    group.push(value);
    groups.set(base, group);
  }
  return groups;
}

async function readNamespace(file, errors) {
  try {
    const content = JSON.parse(await readFile(file, 'utf8'));
    return new Map(flattenStrings(content));
  } catch (error) {
    errors.push(`JSON syntax/shape: ${path.relative(ROOT, file)}: ${error.message}`);
    return undefined;
  }
}

async function validateLocales(errors) {
  const locales = (await readdir(LOCALES, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
  const englishFiles = (await readdir(path.join(LOCALES, 'en')))
    .filter((name) => name.endsWith('.json')).sort();
  const english = new Map();
  for (const name of englishFiles) {
    const keys = await readNamespace(path.join(LOCALES, 'en', name), errors);
    if (keys) english.set(name, keys);
  }
  for (const locale of locales.filter((name) => name !== 'en')) {
    const namespaceFiles = (await readdir(path.join(LOCALES, locale)))
      .filter((name) => name.endsWith('.json')).sort();
    for (const name of englishFiles.filter((file) => !namespaceFiles.includes(file))) {
      errors.push(`Missing namespace: ${locale}/${name}`);
    }
    for (const name of namespaceFiles.filter((file) => !englishFiles.includes(file))) {
      errors.push(`Extra namespace: ${locale}/${name}`);
      await readNamespace(path.join(LOCALES, locale, name), errors);
    }
    for (const name of namespaceFiles.filter((file) => english.has(file))) {
      const translated = await readNamespace(path.join(LOCALES, locale, name), errors);
      if (translated) compareNamespace(locale, name, english.get(name), translated, errors);
    }
  }
  console.log(`Locales: ${locales.join(', ')}; English namespaces: ${englishFiles.join(', ')}`);
}

function compareNamespace(locale, name, english, translated, errors) {
  const sourceGroups = groupPluralKeys(english);
  const translatedGroups = groupPluralKeys(translated);
  for (const [key, sourceValues] of sourceGroups) {
    const translatedValues = translatedGroups.get(key);
    if (!translatedValues) {
      errors.push(`Missing key: ${locale}/${name}:${key}`);
      continue;
    }
    const source = sourceValues[0];
    const target = translatedValues[0];
    if (typeof source !== typeof target || (typeof source === 'symbol' && source !== target)) {
      errors.push(`Value type drift: ${locale}/${name}:${key} expected ${valueKind(source)} got ${valueKind(target)}`);
      continue;
    }
    if (typeof source !== 'string') continue;
    const expected = [...new Set(sourceValues.flatMap((value) =>
      typeof value === 'string' ? placeholders(value) : []))].sort();
    const actual = [...new Set(translatedValues.flatMap((value) =>
      typeof value === 'string' ? placeholders(value) : []))].sort();
    if (expected.join(',') !== actual.join(',')) {
      errors.push(`Placeholder drift: ${locale}/${name}:${key} expected [${expected}] got [${actual}]`);
    }
  }
  for (const key of translatedGroups.keys()) {
    if (!sourceGroups.has(key)) errors.push(`Extra key: ${locale}/${name}:${key}`);
  }
}

function valueKind(value) {
  if (value === EMPTY_OBJECT) return 'empty object';
  if (value === EMPTY_ARRAY) return 'empty array';
  return value === null ? 'null' : typeof value;
}

function literalText(node) {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text.trim();
  if (ts.isJsxText(node)) return node.getText().trim().replace(/\s+/g, ' ');
  if (ts.isTemplateExpression(node)) return node.head.text.trim();
  return '';
}

function isTranslationKey(node, value) {
  if (!/^[\w.-]+$/.test(value)) return false;
  let current = node;
  while (current.parent) {
    const parent = current.parent;
    if (ts.isCallExpression(parent) && parent.arguments[0] === current) {
      const method = parent.expression.getText().split('.').at(-1);
      return method === 't';
    }
    if (ts.isParenthesizedExpression(parent)) {
      current = parent;
      continue;
    }
    return false;
  }
  return false;
}

function copyContext(node) {
  const parent = node.parent;
  if (ts.isJsxText(node)) return 'JSX text';
  if (!parent) return '';
  const jsxContext = renderedJsxContext(node);
  if (jsxContext) return jsxContext;
  if (ts.isJsxAttribute(parent)) return COPY_PROPERTIES.has(parent.name.text) ? 'string prop' : '';
  if (ts.isPropertyAssignment(parent)) {
    const name = parent.name.getText().replace(/^['"]|['"]$/g, '');
    return COPY_PROPERTIES.has(name) ? 'config/copy field' : '';
  }
  if (ts.isCallExpression(parent)) {
    const call = parent.expression.getText();
    const method = call.split('.').at(-1);
    if (COPY_CALLS.has(method) || call === 'Alert.alert') return 'alert/toast';
  }
  return '';
}

function renderedJsxContext(node) {
  let expression = node;
  while (expression.parent) {
    const parent = expression.parent;
    if (ts.isParenthesizedExpression(parent)) {
      expression = parent;
      continue;
    }
    if (ts.isBinaryExpression(parent) && parent.right === expression
      && ['??', '||', '&&'].includes(parent.operatorToken.getText())) {
      expression = parent;
      continue;
    }
    if (ts.isConditionalExpression(parent)
      && (parent.whenTrue === expression || parent.whenFalse === expression)) {
      expression = parent;
      continue;
    }
    if (!ts.isJsxExpression(parent)) return '';
    const attribute = parent.parent;
    if (ts.isJsxAttribute(attribute)) {
      return COPY_PROPERTIES.has(attribute.name.text) ? 'string prop' : '';
    }
    return 'JSX expression';
  }
  return '';
}

function isHumanCopy(value) {
  return LETTER.test(value) && !APPROVED_ENGLISH.has(value)
    && !/^(?:https?:|[@./#])/.test(value);
}

function collectLiterals(file, content) {
  const source = ts.createSourceFile(file, content, ts.ScriptTarget.Latest, true,
    file.endsWith('.tsx') || file.endsWith('.jsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const found = [];
  function visit(node) {
    const context = copyContext(node);
    const value = literalText(node);
    if (context && !isTranslationKey(node, value) && isHumanCopy(value)) {
      const line = source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1;
      found.push({ file: path.relative(ROOT, file), line, context, value: value.slice(0, 90) });
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
  return found;
}

async function validateSourceLiterals() {
  const allFiles = (await Promise.all(SOURCE_DIRS.map((name) => listFiles(path.join(ROOT, name))))).flat();
  const files = allFiles.filter((file) => {
    const relative = path.relative(ROOT, file);
    return /\.[jt]sx?$/.test(file) && !EXCLUDED_PATHS.some((pattern) => pattern.test(relative));
  });
  const findings = (await Promise.all(files.map(async (file) =>
    collectLiterals(file, await readFile(file, 'utf8'))))).flat();
  const byFile = new Map();
  for (const finding of findings) {
    const current = byFile.get(finding.file) ?? [];
    current.push(finding);
    byFile.set(finding.file, current);
  }
  console.log(`App-owned literal candidates: ${findings.length} in ${byFile.size} of ${files.length} production source files`);
  const inventory = process.argv.includes('--inventory');
  const inventoryFiles = process.argv.includes('--inventory-files');
  for (const [file, entries] of byFile) {
    if (inventory || inventoryFiles) console.log(`${file}: ${entries.length} (${[...new Set(entries.map((entry) => entry.context))].join(', ')})`);
  }
  const examples = inventory ? findings : inventoryFiles ? [] : findings.slice(0, 30);
  for (const entry of examples) console.log(`Unapproved literal: ${entry.file}:${entry.line} [${entry.context}] ${JSON.stringify(entry.value)}`);
  if (!inventory && findings.length > examples.length) {
    console.log(`... ${findings.length - examples.length} more; use --inventory for all locations`);
  }
  return findings.length;
}

async function main() {
  const errors = [];
  await validateLocales(errors);
  const literalCount = await validateSourceLiterals();
  for (const error of errors) console.error(error);
  console.log(`Locale issues: ${errors.length}; unapproved literal candidates: ${literalCount}`);
  if (errors.length || literalCount) process.exitCode = 1;
}

main().catch((error) => {
  console.error(`Localization validation failed: ${error.message}`);
  process.exitCode = 1;
});

#!/usr/bin/env node
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import {
  validateGuidedDiscoveryTrail,
  validateReframeBuilder,
  validateStringBudget,
  validateTeachBackChain,
} from "./journey-microlearning-validator/content-rules.mjs";
import {
  inventorySql,
  inventoryYaml,
  MICROLEARNING_CATEGORIES,
} from "./journey-microlearning-validator/inventory.mjs";

const IGNORED_DIRECTORIES = new Set([
  ".agents",
  ".claude",
  ".expo",
  ".git",
  "node_modules",
]);

export async function validateJourneyMicrolearningContent(rootDirectory) {
  const files = await findAuthoringFiles(rootDirectory);
  const items = [];
  const issues = [];
  for (const absoluteFile of files) {
    const file = path.relative(rootDirectory, absoluteFile);
    const sourceText = await readFile(absoluteFile, "utf8");
    const inventory = file.endsWith(".sql")
      ? inventorySql(sourceText, file)
      : inventoryYaml(sourceText, file);
    items.push(...inventory.items);
    issues.push(...inventory.issues);
  }

  for (const item of items) {
    const contentIssues = [];
    if (item.category === "teach_back_chain") {
      validateTeachBackChain(item.content, contentIssues);
    } else {
      validateStringBudget(item.content, "title", 7, contentIssues);
      validateStringBudget(item.content, "instruction", 12, contentIssues);
    }
    if (item.category === "guided_discovery_trail") {
      validateGuidedDiscoveryTrail(item.content, contentIssues);
    }
    if (item.category === "reframe_builder") {
      validateReframeBuilder(item.content, contentIssues);
    }
    issues.push(
      ...contentIssues.map((issue) => ({
        file: item.file,
        category: item.category,
        source: item.source,
        path: `${item.path}.${issue.path}`,
        message: issue.message,
      })),
    );
  }

  const counts = Object.fromEntries(
    MICROLEARNING_CATEGORIES.map((category) => [
      category,
      items.filter((item) => item.category === category).length,
    ]),
  );
  return { counts, filesScanned: files.length, issues, items };
}

async function findAuthoringFiles(rootDirectory) {
  const files = [];
  async function visit(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      if (entry.isDirectory() && IGNORED_DIRECTORIES.has(entry.name)) continue;
      const absolutePath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        await visit(absolutePath);
      } else if (
        entry.name.endsWith(".sql") ||
        (/\.ya?ml$/u.test(entry.name) &&
          absolutePath.includes(`${path.sep}src${path.sep}docs${path.sep}exercises${path.sep}`))
      ) {
        files.push(absolutePath);
      }
    }
  }
  await visit(rootDirectory);
  return files.sort();
}

async function main() {
  const rootDirectory = path.resolve(process.argv[2] ?? process.cwd());
  const result = await validateJourneyMicrolearningContent(rootDirectory);
  console.log(`Scanned ${result.filesScanned} SQL/YAML files.`);
  for (const category of MICROLEARNING_CATEGORIES) {
    console.log(`${category}: ${result.counts[category]} objects`);
  }
  for (const issue of result.issues) {
    console.error(
      `${issue.file} | ${issue.category} | ${issue.source} | ${issue.path} | ${issue.message}`,
    );
  }
  if (result.issues.length > 0) {
    console.error(`Validation failed with ${result.issues.length} issue(s).`);
    process.exitCode = 1;
  } else {
    console.log(`Validation passed for ${result.items.length} inventoried objects.`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}

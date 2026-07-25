import {
  SYSTEM_PROMPT,
  RULES,
  TONE,
  STRUCTURED_MEMORY_GUIDE,
  EXAMPLES,
  OUTPUT_SCHEMA,
  LEVEL_PROMPTS,
} from "../../prompts/prompts.ts";

const promptCache = new Map<string, string>();

export class PromptLoader {
  /**
   * Loads a markdown file from the filesystem with fallback to bundled constants.
   * // ponytail: hybrid approach keeps dynamic local .md edits while preventing edge runtime NotFound errors.
   */
  private async readFile(path: string, fallback = ""): Promise<string> {
    try {
      const decoder = new TextDecoder("utf-8");
      const data = await Deno.readFile(path);
      return decoder.decode(data);
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        return fallback;
      }
      console.error(`Failed to load prompt file: ${path}`, error);
      return fallback;
    }
  }

  /**
   * Assembles the full prompt by stitching the system files and the level-specific prompt.
   */
  public async loadPrompt(level: string): Promise<string> {
    if (promptCache.has(level)) {
      return promptCache.get(level)!;
    }

    // Resolve prompt directory relative to this module so it works regardless of Deno cwd
    const basePath = new URL("../../prompts", import.meta.url).pathname;

    // Load System Components with bundled fallback
    const systemPrompt = await this.readFile(`${basePath}/system/system-prompt.md`, SYSTEM_PROMPT);
    const rules = await this.readFile(`${basePath}/system/rules.md`, RULES);
    const tone = await this.readFile(`${basePath}/system/tone.md`, TONE);
    const examples = await this.readFile(`${basePath}/system/examples.md`, EXAMPLES);
    const structuredMemoryGuide = await this.readFile(`${basePath}/system/structured-memory-guide.md`, STRUCTURED_MEMORY_GUIDE);
    const language = await this.readFile(`${basePath}/system/language.md`, "");
    const outputSchema = await this.readFile(`${basePath}/system/output-schema.md`, OUTPUT_SCHEMA);

    // Validate critical components
    if (!systemPrompt) {
      throw new Error(`Critical prompt component missing: system/system-prompt.md`);
    }
    if (!rules) {
      throw new Error(`Critical prompt component missing: system/rules.md`);
    }
    if (!outputSchema) {
      throw new Error(`Critical prompt component missing: system/output-schema.md`);
    }

    // Load Level-Specific Prompt with bundled fallback
    const fallbackLevel = LEVEL_PROMPTS[level] ?? "";
    const levelPrompt = await this.readFile(`${basePath}/${level}/prompt.md`, fallbackLevel);
    if (!levelPrompt) {
      throw new Error(`Level prompt missing for: ${level}`);
    }

    // Stitch them together
    const assembled = `
${systemPrompt}

${rules}

${tone}

${structuredMemoryGuide}

${examples}

${outputSchema}

${language}

${levelPrompt}

### CONTEXT DATA
\`\`\`json
{{CONTEXT}}
\`\`\`

### PRIOR REFLECTION
{{PRIOR_REFLECTION}}
`.trim();

    promptCache.set(level, assembled);
    return assembled;
  }

  /** Clears the prompt cache. Useful for testing or hot-reload scenarios. */
  public clearCache(): void {
    promptCache.clear();
  }
}

export const promptLoader = new PromptLoader();

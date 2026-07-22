const promptCache = new Map<string, string>();

export class PromptLoader {
  /**
   * Loads a markdown file from the filesystem.
   */
  private async readFile(path: string): Promise<string> {
    try {
      const decoder = new TextDecoder("utf-8");
      const data = await Deno.readFile(path);
      return decoder.decode(data);
    } catch (error) {
      console.error(`Failed to load prompt file: ${path}`, error);
      return ""; // Return empty string so missing optional pieces don't crash
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

    // Load System Components
    const systemPrompt = await this.readFile(`${basePath}/system/system-prompt.md`);
    const rules = await this.readFile(`${basePath}/system/rules.md`);
    const tone = await this.readFile(`${basePath}/system/tone.md`);
    const examples = await this.readFile(`${basePath}/system/examples.md`);
    const structuredMemoryGuide = await this.readFile(`${basePath}/system/structured-memory-guide.md`);
    const language = await this.readFile(`${basePath}/system/language.md`);
    const outputSchema = await this.readFile(`${basePath}/system/output-schema.md`);

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

    // Load Level-Specific Prompt (e.g. journal/prompt.md, daily/prompt.md)
    const levelPrompt = await this.readFile(`${basePath}/${level}/prompt.md`);
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

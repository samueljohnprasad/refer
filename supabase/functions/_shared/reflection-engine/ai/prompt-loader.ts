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
    const basePath = `./supabase/functions/_shared/prompts`;
    
    // Load System Components
    const systemPrompt = await this.readFile(`${basePath}/system/system-prompt.md`);
    const rules = await this.readFile(`${basePath}/system/rules.md`);
    const language = await this.readFile(`${basePath}/system/language.md`);
    const outputSchema = await this.readFile(`${basePath}/system/output-schema.md`);
    
    // Load Level-Specific Prompt (e.g. journal/prompt.md, daily/prompt.md)
    const levelPrompt = await this.readFile(`${basePath}/${level}/prompt.md`);

    // Stitch them together
    return `
${systemPrompt}

${rules}

${outputSchema}

${levelPrompt}
`.trim();
  }
}

export const promptLoader = new PromptLoader();
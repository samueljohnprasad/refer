/**
 * Global Configuration for AI Features
 */
export const GLOBAL_AI_CONFIG = {
  /**
   * Set to `true` to force the app to use the downloaded local LLM (e.g., Llama/Qwen)
   * even on devices that natively support Apple Intelligence.
   *
   * This is useful for testing the local model fallback behavior on an iPhone 15 Pro
   * or a newer Apple AI-enabled device.
   */
  FORCE_LOCAL_LLM: true,

  /**
   * The HuggingFace ID or URL for the Llama model to download/use as a fallback.
   * Qwen2.5-3B is highly capable and heavily optimized for instruction following.
   */
  LLAMA_MODEL_URL: "LiquidAI/LFM2.5-VL-450M-GGUF/LFM2.5-VL-450M-Q4_0.gguf",
  /**
   * Timeout in milliseconds for AI generation requests to allow for large model downloads
   * on the first run.
   */
  TIMEOUT_MS: 300_000,

  /**
   * Temperature for structured JSON generation with local LLMs.
   * Lower values produce more deterministic, schema-compliant output.
   * Range: 0.0 (deterministic) to 1.0 (creative).
   */
  STRUCTURED_TEMPERATURE: 0.3,
};

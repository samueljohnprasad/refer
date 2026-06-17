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
  LLAMA_MODEL_URL: 'Qwen/Qwen2.5-3B-Instruct-GGUF/qwen2.5-3b-instruct-q3_k_m.gguf',

  /**
   * Timeout in milliseconds for AI generation requests to allow for large model downloads
   * on the first run.
   */
  TIMEOUT_MS: 300_000,
};

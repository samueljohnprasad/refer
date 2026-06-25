/**
 * useActiveModel — Model Lifecycle Hook
 *
 * Manages the AI model lifecycle (download, prepare, cache) and exposes
 * the active model + provider type. The structured prompt logic has moved
 * to the AI provider layer (`src/services/ai/`).
 */

import { useRef, useCallback, useState, useEffect } from "react";
import { Platform } from "react-native";
import { apple } from "@react-native-ai/apple";
import { llama, downloadModel } from "@react-native-ai/llama";
import { GLOBAL_AI_CONFIG } from "@/src/constants/ai";
import type { AIProviderType } from "@/src/services/ai";
import { useLocalModelSetting } from "./useLocalModelSetting";

export interface UseActiveModelReturn {
  /** Downloads (if needed) and returns the active model instance. */
  readonly getActiveModel: () => Promise<unknown>;
  /** Whether the device supports Apple Intelligence (and it's not force-overridden). */
  readonly isAppleAIAvailable: boolean;
  /** The provider type to use with `createAIProvider()`. */
  readonly providerType: AIProviderType;
  /** Download progress (0–100) for local LLM model. */
  readonly downloadProgress: number;
}

export function useActiveModel(): UseActiveModelReturn {
  const llamaModelRef = useRef<unknown>(null);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const { modelUrl, isLoading } = useLocalModelSetting();
  console.log("modelUrl", modelUrl);

  // Keep track of the currently loaded model URL to invalidate the ref if it changes
  const loadedModelUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (loadedModelUrlRef.current && loadedModelUrlRef.current !== modelUrl) {
      // Model changed, invalidate the cached instance
      llamaModelRef.current = null;
    }
  }, [modelUrl]);

  const isAppleAIAvailable: boolean =
    !GLOBAL_AI_CONFIG.FORCE_LOCAL_LLM &&
    Platform.OS === "ios" &&
    typeof apple.isAvailable === "function"
      ? apple.isAvailable()
      : false;

  const providerType: AIProviderType = isAppleAIAvailable
    ? "apple"
    : "local-llm";

  const getActiveModel = useCallback(async (): Promise<unknown> => {
    if (isAppleAIAvailable) {
      return apple();
    }

    // Wait for the setting to load
    if (isLoading) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    if (!llamaModelRef.current) {
      const modelPath: string = await downloadModel(
        modelUrl,
        (progress: { percentage: number }) =>
          setDownloadProgress(progress.percentage),
      );
      const model = llama.languageModel(modelPath);
      await (model as unknown as { prepare: () => Promise<void> }).prepare();
      llamaModelRef.current = model;
      loadedModelUrlRef.current = modelUrl;
    }

    return llamaModelRef.current;
  }, [isAppleAIAvailable, modelUrl, isLoading]);

  return { getActiveModel, isAppleAIAvailable, providerType, downloadProgress };
}

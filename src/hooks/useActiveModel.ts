/**
 * useActiveModel — Model Lifecycle Hook
 *
 * Manages the AI model lifecycle and exposes the active model + provider type.
 */

import { useCallback, useState } from "react";
import { Platform } from "react-native";
import { apple } from "@react-native-ai/apple";
import { GLOBAL_AI_CONFIG } from "@/src/constants/ai";
import type { AIProviderType } from "@/src/services/ai";

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
  const [downloadProgress] = useState<number>(0);

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
    throw new Error("Local LLM (llama) is not available. Apple Intelligence or cloud provider required.");
  }, [isAppleAIAvailable]);

  return { getActiveModel, isAppleAIAvailable, providerType, downloadProgress };
}

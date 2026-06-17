import { useRef, useCallback, useState } from 'react';
import { Platform } from 'react-native';
import { apple } from '@react-native-ai/apple';
import { llama, downloadModel } from '@react-native-ai/llama';
import { GLOBAL_AI_CONFIG } from '@/src/constants/ai';

export function useActiveModel() {
  const llamaModelRef = useRef<any>(null);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);

  const isAppleAIAvailable =
    !GLOBAL_AI_CONFIG.FORCE_LOCAL_LLM &&
    Platform.OS === 'ios' &&
    typeof apple.isAvailable === 'function'
      ? apple.isAvailable()
      : false;

  const getActiveModel = useCallback(async () => {
    if (isAppleAIAvailable) {
      return apple();
    }
    if (!llamaModelRef.current) {
      const modelPath = await downloadModel(
        GLOBAL_AI_CONFIG.LLAMA_MODEL_URL,
        (progress) => setDownloadProgress(progress.percentage)
      );
      llamaModelRef.current = llama.languageModel(modelPath);
      await llamaModelRef.current.prepare();
    }
    return llamaModelRef.current;
  }, [isAppleAIAvailable]);

  const getStructuredPrompt = useCallback(
    (basePrompt: string) => {
      if (isAppleAIAvailable) return basePrompt;
      return `${basePrompt}\n\nIMPORTANT: Return ONLY valid JSON matching the exact schema provided. Do not include markdown code blocks, conversational text, or any formatting outside the JSON structure.`;
    },
    [isAppleAIAvailable]
  );

  return { getActiveModel, getStructuredPrompt, isAppleAIAvailable, downloadProgress };
}

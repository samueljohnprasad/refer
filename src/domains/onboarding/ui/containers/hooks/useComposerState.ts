// ponytail: text composer state for custom thoughts
import { useState, useCallback } from 'react';

export interface UseComposerStateReturn {
  text: string;
  setText: (text: string) => void;
  applyStarter: (starter: string) => void;
  clearText: () => void;
}

export function useComposerState(): UseComposerStateReturn {
  const [text, setText] = useState<string>('');

  const applyStarter = useCallback((starter: string): void => {
    setText(starter);
  }, []);

  const clearText = useCallback((): void => {
    setText('');
  }, []);

  return { text, setText, applyStarter, clearText };
}

// ponytail: container for the crisis path (.agents/abc-analysis.html's crisisCheck): a matching phrase opens
// the help sheet once, never blocks or discards text, and Happi steps aside for the rest of the run.
import { useCallback, useEffect, useRef, useState } from 'react';
import { matchesCrisis } from '@/src/domains/onboarding/domain/crisis';
import type { StepProps } from '@/src/types/exerciseFlow';

let crisisSeen = false;
export const isAbcCrisisSeen = (): boolean => crisisSeen;
export const resetAbcCrisis = (): void => { crisisSeen = false; };

const PAUSE_MS = 1500;

export function useAbcCrisisGuard(text: string, step: Pick<StepProps, 'isValid' | 'onNext' | 'setPrimaryOverride'>) {
  const [helpOpen, setHelpOpen] = useState(false);
  const shown = useRef(false);

  const open = useCallback(() => {
    shown.current = true;
    crisisSeen = true;
    setHelpOpen(true);
  }, []);

  useEffect(() => {
    if (shown.current || !matchesCrisis(text)) return;
    const t = setTimeout(open, PAUSE_MS);
    return () => clearTimeout(t);
  }, [text, open]);

  const { isValid, onNext, setPrimaryOverride } = step;
  useEffect(() => {
    if (!setPrimaryOverride) return;
    setPrimaryOverride({
      label: 'Continue',
      disabled: !isValid,
      action: () => (!shown.current && matchesCrisis(text) ? open() : onNext()),
    });
    return () => setPrimaryOverride(null);
  }, [setPrimaryOverride, isValid, onNext, text, open]);

  return { helpOpen, closeHelp: useCallback(() => setHelpOpen(false), []), openHelp: open };
}

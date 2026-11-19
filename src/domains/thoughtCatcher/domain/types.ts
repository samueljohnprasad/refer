// ponytail: typed draft for .agents/thought-catcher.html's step wizard, independent of onboarding's
// conversational ReflectionData shape — mapped into it only at save time (see data/saveReflection.ts).
import type { TrapChoice } from '@/src/domains/exercises/domain/trap';

export type IsTrueAnswer = 'YES' | 'NOT SURE' | 'NO';

export interface ThoughtCatcherDraft {
  situation: string;
  thought: string;
  trap: TrapChoice | null;
  intensity: number; // 0-10, believability before
  post: number | null; // 0-10, believability after
  isTrue: IsTrueAnswer | null;
  balanced: string;
  checked: boolean;
  cardSaved: boolean;
  helpShown: boolean;
}

export function freshDraft(): ThoughtCatcherDraft {
  return {
    situation: '', thought: '', trap: null, intensity: 5, post: null, isTrue: null,
    balanced: '', checked: false, cardSaved: false, helpShown: false,
  };
}

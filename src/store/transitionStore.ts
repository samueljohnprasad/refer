import { atom } from 'jotai';

export type TransitionState = {
  isActive: boolean;
  cx: number;
  cy: number;
  color: string;
  duration?: number;
  onComplete: (() => void) | null;
};

const initialState: TransitionState = {
  isActive: false,
  cx: 0,
  cy: 0,
  color: '#000000',
  duration: undefined,
  onComplete: null,
};

// The core atom holding the transition state
export const transitionAtom = atom<TransitionState>(initialState);

// Helper atom for easily triggering the transition
export const startTransitionAtom = atom(
  null,
  (get, set, payload: Omit<TransitionState, 'isActive'>) => {
    set(transitionAtom, {
      ...payload,
      isActive: true,
    });
  }
);

// Helper atom for ending the transition (resetting state)
export const endTransitionAtom = atom(
  null,
  (get, set) => {
    set(transitionAtom, initialState);
  }
);

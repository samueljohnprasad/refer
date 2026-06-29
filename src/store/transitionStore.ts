import { atom } from 'jotai';

export type TransitionState = {
  isActive: boolean;
  cx: number;
  cy: number;
  color: string;
  duration?: number;
  isReversing?: boolean;
  onComplete: (() => void) | null;
};

const initialState: TransitionState = {
  isActive: false,
  cx: 0,
  cy: 0,
  color: '#000000',
  duration: undefined,
  isReversing: false,
  onComplete: null,
};

// The core atom holding the transition state
export const transitionAtom = atom<TransitionState>(initialState);

// Stores the origin info from the last forward transition
export const lastTransitionInfoAtom = atom<{ cx: number; cy: number; color: string } | null>(null);

// Helper atom for easily triggering the transition
export const startTransitionAtom = atom(
  null,
  (get, set, payload: Omit<TransitionState, 'isActive'>) => {
    if (!payload.isReversing) {
      set(lastTransitionInfoAtom, {
        cx: payload.cx,
        cy: payload.cy,
        color: payload.color,
      });
    }
    
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

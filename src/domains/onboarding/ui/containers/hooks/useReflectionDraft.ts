// ponytail: reflection draft state machine
import { useState, useCallback } from 'react';
import type { GoalDefinition, ReflectionData } from '../../../domain/types';
import type { ReminderPreset } from '../../../domain/enums';

const INITIAL_REFLECTION: ReflectionData = {
  goal: null, source: 'example', situation: '', thought: '', why: '', fair: '', before: null, after: null, reminder: null,
};

export interface UseReflectionDraftReturn {
  reflection: ReflectionData;
  applyGoal: (g: GoalDefinition) => void;
  setBeliefRating: (rating: number, isAfter: boolean) => void;
  startPersonal: () => void;
  setPersonalSituation: (text: string) => void;
  setPersonalThought: (text: string) => void;
  setPersonalFair: (text: string) => void;
  setReminder: (time: ReminderPreset | string) => void;
}

export function useReflectionDraft(): UseReflectionDraftReturn {
  const [reflection, setReflection] = useState<ReflectionData>(INITIAL_REFLECTION);

  const applyGoal = useCallback((g: GoalDefinition): void => {
    setReflection((prev) => ({
      ...prev,
      goal: g.id,
      source: 'example',
      art: g.id,
      situation: g.scene,
      thought: g.thought,
      trap: g.trap,
      why: g.why,
      fair: g.fair,
      before: null,
      after: null,
    }));
  }, []);

  const setBeliefRating = useCallback((rating: number, isAfter: boolean): void => {
    setReflection((prev) => (isAfter ? { ...prev, after: rating } : { ...prev, before: rating }));
  }, []);

  // personal practice never carries over a worked example's trap/why label
  const startPersonal = useCallback((): void => {
    setReflection((prev) => ({ ...prev, source: 'personal', trap: undefined, why: '', before: null, after: null }));
  }, []);

  const setPersonalSituation = useCallback((text: string): void => {
    setReflection((prev) => ({ ...prev, situation: text }));
  }, []);

  const setPersonalThought = useCallback((text: string): void => {
    setReflection((prev) => ({ ...prev, thought: text }));
  }, []);

  const setPersonalFair = useCallback((text: string): void => {
    setReflection((prev) => ({ ...prev, fair: text }));
  }, []);

  const setReminder = useCallback((time: ReminderPreset | string): void => {
    setReflection((prev) => ({ ...prev, reminder: time }));
  }, []);

  return {
    reflection, applyGoal, setBeliefRating, startPersonal,
    setPersonalSituation, setPersonalThought, setPersonalFair, setReminder,
  };
}

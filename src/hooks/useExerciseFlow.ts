import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import type {
  ExerciseConfig,
  ExerciseEntry,
  ExerciseStepDef,
  ExerciseSavePayload,
  ExerciseStatus,
} from "@/src/types/exerciseFlow";
import { formateDate_y_m_d } from "@/src/utils/date";

// ─── Return type ────────────────────────────────────────────────────────────

export interface UseExerciseFlowReturn<T> {
  currentStepIndex: number;
  currentStepDef: ExerciseStepDef<T>;
  response: T;
  completedSteps: string[];
  stepTimings: Record<string, number>;
  isCurrentStepValid: boolean;
  progress: number;
  canGoBack: boolean;
  isIntro: boolean;
  isSummary: boolean;
  totalSteps: number;
  goNext: () => void;
  goBack: () => void;
  updateResponse: (partial: Partial<T>) => void;
  jumpToStep: (stepId: string) => void;
  reset: () => void;
  getSavePayload: (status?: ExerciseStatus) => ExerciseSavePayload;
}

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useExerciseFlow<T extends Record<string, any>>(
  config: ExerciseConfig<T>,
  existingEntry?: ExerciseEntry | null,
  readOnly: boolean = false,
): UseExerciseFlowReturn<T> {
  const { steps, initialResponse, schemaVersion, type: exerciseType } = config;

  // ── Restore from existing entry (resume) ──────────────────────────────

  const restoredResponse = useMemo<T>(() => {
    if (!existingEntry) return initialResponse;

    let restored = existingEntry.response as T;

    // Schema migration if version mismatch
    if (existingEntry.schema_version < schemaVersion && config.migrate) {
      restored = config.migrate(restored, existingEntry.schema_version);
    }

    return { ...initialResponse, ...restored };
  }, [existingEntry, initialResponse, schemaVersion, config]);

  const restoredStepIndex = useMemo<number>(() => {
    if (!existingEntry) return 0;
    if (readOnly) return steps.length - 1; // Force summary screen for read-only completed exercises

    // Try to find step by current_step id
    const idx = steps.findIndex((s) => s.id === existingEntry.current_step);
    return idx >= 0 ? idx : (existingEntry.step_index ?? 0);
  }, [existingEntry, steps, readOnly]);

  const restoredCompletedSteps = useMemo<string[]>(() => {
    if (!existingEntry) return [];
    return Array.isArray(existingEntry.completed_steps)
      ? existingEntry.completed_steps
      : [];
  }, [existingEntry]);

  const restoredTimings = useMemo<Record<string, number>>(() => {
    if (!existingEntry) return {};
    return (existingEntry.step_timings as Record<string, number>) ?? {};
  }, [existingEntry]);

  // ── State ─────────────────────────────────────────────────────────────

  const [currentStepIndex, setCurrentStepIndex] =
    useState<number>(restoredStepIndex);
  const [response, setResponse] = useState<T>(restoredResponse);
  const [completedSteps, setCompletedSteps] = useState<string[]>(
    restoredCompletedSteps,
  );
  const [stepTimings, setStepTimings] =
    useState<Record<string, number>>(restoredTimings);
  const stepStartTimeRef = useRef<number>(Date.now());

  // Reset step start time when step changes
  useEffect(() => {
    stepStartTimeRef.current = Date.now();
  }, [currentStepIndex]);

  // ── Derived ───────────────────────────────────────────────────────────

  const currentStepDef = steps[currentStepIndex];

  const isCurrentStepValid = useMemo<boolean>(
    () => currentStepDef.validate(response),
    [currentStepDef, response],
  );

  const progress = useMemo<number>(() => {
    if (steps.length <= 1) return 1;
    // Count non-excluded steps for progress calculation
    const countableSteps = steps.filter((s) => !s.excludeFromProgress);
    const currentCountableIndex = countableSteps.findIndex(
      (s) => s.id === currentStepDef.id,
    );
    if (currentCountableIndex < 0) {
      return Math.max(0.08, currentStepIndex / (steps.length - 1));
    }
    return Math.max(0.08, currentCountableIndex / (countableSteps.length - 1));
  }, [steps, currentStepIndex, currentStepDef]);

  const canGoBack = readOnly ? false : currentStepIndex > 0;
  const isIntro = currentStepIndex === 0;
  const isSummary = currentStepIndex === steps.length - 1;
  const totalSteps = steps.length;

  // ── Actions ───────────────────────────────────────────────────────────

  const recordTiming = useCallback(() => {
    const elapsed = Date.now() - stepStartTimeRef.current;
    setStepTimings((prev) => ({
      ...prev,
      [currentStepDef.id]: (prev[currentStepDef.id] ?? 0) + elapsed,
    }));
  }, [currentStepDef]);

  const goNext = useCallback(() => {
    if (currentStepIndex >= steps.length - 1) return;

    // Record timing for current step
    recordTiming();

    // Add to completedSteps
    setCompletedSteps((prev) =>
      prev.includes(currentStepDef.id) ? prev : [...prev, currentStepDef.id],
    );

    // Check for branching via step.next()
    if (currentStepDef.next) {
      const nextStepId = currentStepDef.next(response);
      if (nextStepId) {
        const targetIdx = steps.findIndex((s) => s.id === nextStepId);
        if (targetIdx >= 0) {
          setCurrentStepIndex(targetIdx);
          return;
        }
      }
    }

    // Linear advance
    setCurrentStepIndex((prev) => prev + 1);
  }, [currentStepIndex, currentStepDef, steps, response, recordTiming]);

  const goBack = useCallback(() => {
    if (currentStepIndex <= 0) return;

    recordTiming();

    // Remove future steps from completedSteps (invalidate)
    const prevStepId = steps[currentStepIndex - 1]?.id;
    if (prevStepId) {
      setCompletedSteps((prev) => {
        const prevIdx = prev.indexOf(prevStepId);
        // Keep everything up to and including the step we're going back to
        return prevIdx >= 0 ? prev.slice(0, prevIdx + 1) : prev;
      });
    }

    setCurrentStepIndex((prev) => prev - 1);
  }, [currentStepIndex, steps, recordTiming]);

  const updateResponse = useCallback((partial: Partial<T>) => {
    setResponse((prev) => ({ ...prev, ...partial }));
  }, []);

  const jumpToStep = useCallback(
    (stepId: string) => {
      const idx = steps.findIndex((s) => s.id === stepId);
      if (idx >= 0) {
        recordTiming();
        setCurrentStepIndex(idx);
      }
    },
    [steps, recordTiming],
  );

  const reset = useCallback(() => {
    setCurrentStepIndex(0);
    setResponse(initialResponse);
    setCompletedSteps([]);
    setStepTimings({});
  }, [initialResponse]);

  const getSavePayload = useCallback(
    (status: ExerciseStatus = "in_progress"): ExerciseSavePayload => ({
      exercise_type: exerciseType,
      schema_version: schemaVersion,
      status,
      current_step: currentStepDef.id,
      completed_steps: completedSteps,
      step_index: currentStepIndex,
      response: response as Record<string, any>,
      step_timings: stepTimings,
      selected_date: formateDate_y_m_d(new Date()),
    }),
    [
      exerciseType,
      schemaVersion,
      currentStepDef,
      completedSteps,
      currentStepIndex,
      response,
      stepTimings,
    ],
  );

  return {
    currentStepIndex,
    currentStepDef,
    response,
    completedSteps,
    stepTimings,
    isCurrentStepValid,
    progress,
    canGoBack,
    isIntro,
    isSummary,
    totalSteps,
    goNext,
    goBack,
    updateResponse,
    jumpToStep,
    reset,
    getSavePayload,
  };
}

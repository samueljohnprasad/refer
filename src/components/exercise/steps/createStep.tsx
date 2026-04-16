import React from "react";
import type { StepProps } from "@/src/types/exerciseFlow";

/**
 * Factory: binds extra props to a step primitive, returning a component
 * that only needs StepProps<T> — compatible with ExerciseStepDef.component.
 *
 * Step primitives use `StepProps` (defaults to Record<string, any>) internally
 * since they access response via fieldKey. The cast is safe because the config
 * ensures the correct response shape at the ExerciseConfig<T> level.
 *
 * Usage:
 *   component: createStep(TextInputStep, { title: '...', fieldKey: '...' })
 */
export function createStep<Extra extends Record<string, any>>(
  Component: React.ComponentType<StepProps & Extra>,
  extraProps: Extra,
): React.ComponentType<StepProps<any>> {
  const Wrapped: React.FC<StepProps<any>> = (stepProps) => (
    <Component
      {...(stepProps as any)}
      {...extraProps}
    />
  );
  Wrapped.displayName = `Step(${(Component as any).displayName ?? "Anonymous"})`;
  return React.memo(Wrapped) as React.ComponentType<StepProps<any>>;
}

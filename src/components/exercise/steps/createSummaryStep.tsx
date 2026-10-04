import React from "react";
import type { StepProps } from "@/src/types/exerciseFlow";
import { SummaryStep } from ".";
import { useExerciseCopy } from "@/src/hooks/useExerciseCopy";

interface FieldDef<T> {
  label: string;
  key: keyof T & string;
}

/**
 * Factory: creates a SummaryStep that dynamically reads fields from the response.
 */
export function createSummaryStep<T extends Record<string, any>>(
  fieldDefs: FieldDef<T>[],
  opts?: {
    title?: string;
    exerciseType?: string;
    icon?: string;
    saveLabel?: string;
  },
): React.ComponentType<StepProps<any>> {
  const Wrapped: React.FC<StepProps<any>> = (stepProps) => {
    const translate = useExerciseCopy();
    const fields = fieldDefs.map((fd) => ({
      label: translate(fd.label),
      value: (stepProps.response as any)[fd.key],
    }));

    return (
      <SummaryStep
        {...(stepProps as any)}
        title={opts?.title ? translate(opts.title) : undefined}
        exerciseType={opts?.exerciseType}
        saveLabel={opts?.saveLabel ? translate(opts.saveLabel) : undefined}
        fields={fields}
        onSave={stepProps.onNext}
      />
    );
  };
  Wrapped.displayName = "SummaryStep(Dynamic)";
  return React.memo(Wrapped) as React.ComponentType<StepProps<any>>;
}

import React from "react";
import type { StepProps } from "@/src/types/exerciseFlow";
import { SummaryStep } from ".";

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
    const fields = fieldDefs.map((fd) => ({
      label: fd.label,
      value: (stepProps.response as any)[fd.key],
    }));

    return (
      <SummaryStep
        {...(stepProps as any)}
        title={opts?.title}
        exerciseType={opts?.exerciseType}
        saveLabel={opts?.saveLabel}
        fields={fields}
        onSave={stepProps.onNext}
      />
    );
  };
  Wrapped.displayName = "SummaryStep(Dynamic)";
  return React.memo(Wrapped) as React.ComponentType<StepProps<any>>;
}

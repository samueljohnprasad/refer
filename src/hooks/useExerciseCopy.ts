import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { exerciseCopyKey } from "@/src/lib/i18n/exerciseCopy";

export function useExerciseCopy() {
  const { t } = useTranslation("exercises");

  return useCallback(
    (sourceText: string, values?: Record<string, string | number>) => {
      const translate = t as unknown as (
        key: string,
        options: { defaultValue: string; [key: string]: string | number },
      ) => string;
      return translate(exerciseCopyKey(sourceText), {
        defaultValue: sourceText,
        ...values,
      });
    },
    [t],
  );
}

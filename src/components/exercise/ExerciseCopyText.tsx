import React from "react";
import { Text as BaseText } from "@/src/components/ui/Text";
import { useExerciseCopy } from "@/src/hooks/useExerciseCopy";

type ExerciseCopyTextProps = React.ComponentProps<typeof BaseText>;

export function ExerciseCopyText({
  children,
  ...props
}: ExerciseCopyTextProps) {
  const translateCopy = useExerciseCopy();
  const translatedChildren = React.Children.map(children, (child) =>
    typeof child === "string" && child.trim()
      ? translateCopy(child.trim().replace(/\s+/g, " "))
      : child,
  );

  return <BaseText {...props}>{translatedChildren}</BaseText>;
}

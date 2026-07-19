import * as SystemUI from "expo-system-ui";
import { useEffect } from "react";
import { useCSSVariable } from "uniwind";

/**
 * Syncs the iOS root UIWindow / system background color with CSS --app-background variable.
 * Prevents white flash when closing stack modals or sheets on iOS.
 */
export function useSystemBackgroundColor(): void {
  const color = useCSSVariable("--app-background");
  useEffect(() => {
    if (color) {
      SystemUI.setBackgroundColorAsync(color as unknown as string).catch(() => {});
    }
  }, [color]);
}

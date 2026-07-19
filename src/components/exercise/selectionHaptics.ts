import * as Haptics from "expo-haptics";

export function triggerSelectionHaptic(): void {
  void Haptics.selectionAsync().catch(() => {});
}

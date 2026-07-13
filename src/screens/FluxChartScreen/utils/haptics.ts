import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

const isNative = Platform.OS === "ios" || Platform.OS === "android";

export function lightImpact() {
  if (!isNative) return;
  Haptics.selectionAsync().catch(() => {});
}

export function selection() {
  if (!isNative) return;
  Haptics.selectionAsync().catch(() => {});
}

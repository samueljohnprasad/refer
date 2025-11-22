import { Enums } from "@/types/types";
import { Platform } from "react-native";

export const getMoodScore = (mood?: Enums<"mood"> | null): number => {
  switch (mood) {
    case "terrible":
      return 1;
    case "bad":
      return 2;
    case "fine":
      return 3;
    case "good":
      return 4;
    case "great":
      return 5;
    default:
      return 3;
  }
};

export const isIOS = Platform.OS === "ios";
export const isAndroid = Platform.OS === "android";

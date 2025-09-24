import type { ImageSourcePropType } from "react-native";

import bad from "./bad.png";
import fine from "./fine.png";
import good from "./good.png";
import great from "./great.png";
import terrible from "./terrible.png";

export enum Emotion {
  Great = "great",
  Good = "good",
  Fine = "fine",
  Bad = "bad",
  Terrible = "terrible",
}

export const emotions: Record<Emotion, ImageSourcePropType> = {
  bad,
  fine,
  good,
  great,
  terrible,
};

export { bad, fine, good, great, terrible };

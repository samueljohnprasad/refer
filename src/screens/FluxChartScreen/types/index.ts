import { SharedValue } from "react-native-reanimated";

export type Cursor = { x: number; y: number; value: number };

export type CursorPoint = {
  x: number;
  y: number;
  value: number;
};

export type CursorAnimated = {
  x: SharedValue<number>;
  y: SharedValue<number>;
  value: SharedValue<number>;
  isCursorVisible: SharedValue<number>;
};

export type AnimatedTextProps = {
  value: number;
  fontSize?: number;
  fontWeight?: "normal" | "bold" | "600" | "700";
  style?: object;
};

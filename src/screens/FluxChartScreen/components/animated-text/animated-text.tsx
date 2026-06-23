import React from "react";
import { Text } from "react-native";
import type { AnimatedTextProps } from "../../types";

export default function AnimatedText({
  value,
  fontSize = 52,
  fontWeight = "700",
}: AnimatedTextProps) {
  return <Text style={{ fontSize, fontWeight }}>{value}</Text>;
}

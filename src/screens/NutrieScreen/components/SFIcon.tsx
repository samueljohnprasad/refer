import { Platform, View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { SymbolView } from "expo-symbols";
import type { SFSymbol } from "sf-symbols-typescript";
import type { ComponentProps } from "react";

type FeatherName = ComponentProps<typeof Feather>["name"];

type SFIconProps = {
  name: SFSymbol;
  fallback: FeatherName;
  size?: number;
  color?: string;
  weight?:
    | "ultraLight"
    | "thin"
    | "light"
    | "regular"
    | "medium"
    | "semibold"
    | "bold";
};

export const SFIcon = ({
  name,
  fallback,
  size = 14,
  color = "#000",
  weight = "medium",
}: SFIconProps) => {
  if (Platform.OS === "ios") {
    return (
      <SymbolView
        name={name}
        size={size}
        tintColor={color}
        weight={weight}
        style={{ width: size, height: size }}
      />
    );
  }

  return <Feather name={fallback} size={size} color={color} />;
};

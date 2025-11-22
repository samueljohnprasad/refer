import { useState, useRef } from "react";
import { Animated } from "react-native";

export const useSettingsAnimation = () => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [upgradeY, setUpgradeY] = useState<number | null>(null);

  return {
    scrollY,
    upgradeY,
    setUpgradeY,
  };
};

import React from "react";
import { View } from "react-native";
import WelcomeHeroVisual from "../components/WelcomeHeroVisual";

const WelcomeStep: React.FC = () => {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <WelcomeHeroVisual />
    </View>
  );
};

export default React.memo(WelcomeStep);

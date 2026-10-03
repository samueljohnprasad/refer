// ponytail: native vector welcome hero visual replacing static welcome.png
import React from "react";
import { View } from "react-native";
import { WelcomeHeroCanvas } from "./welcome-hero/WelcomeHeroCanvas";

export const WelcomeHeroVisual: React.FC = () => {
  return (
    <View className="flex-1 w-full h-full items-center justify-start">
      <WelcomeHeroCanvas />
    </View>
  );
};

export default React.memo(WelcomeHeroVisual);

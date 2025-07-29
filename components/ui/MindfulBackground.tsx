import React, { useRef, useEffect } from "react";
import { View, Animated, Dimensions } from "react-native";
import { useSeasonalTheme } from "../../hooks/useSeasonalTheme";
import AnimatedLinearGradient from "@/screens/components/AnimatedLinearGradient";
import DropletsParticles from "./DropletsParticles";
import FirefliesParticles from "./FirefliesParticles";
import RosePetalParticles from "./RosePetalParticles";
import ButterflyRelease from "./ButterflyRelease";

interface MindfulBackgroundProps {
  children: React.ReactNode;
  particlesType?: "drops" | "fireflies" | "rose" | "butterfly";
}

const particles = {
  drops: <DropletsParticles particleCount={32} />,
  fireflies: <FirefliesParticles fireflyCount={32} />,
  rose: <RosePetalParticles petalCount={32} />,
  butterfly: <ButterflyRelease isActive={true} butterflyCount={32} />,
};
const MindfulBackground: React.FC<MindfulBackgroundProps> = ({
  children,
  particlesType,
}) => {
  // Get theme colors using reusable hook
  const seasonalTheme = useSeasonalTheme();
  console.log("sdfsd", particlesType);

  return (
    <AnimatedLinearGradient colors={seasonalTheme.gradient} style={{ flex: 1 }}>
      {particlesType && particles[particlesType]}
      {children}
    </AnimatedLinearGradient>
  );
};

export default MindfulBackground;

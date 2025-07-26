import EditScreenInfo from "@/components/EditScreenInfo";
import { Center } from "@/components/ui/center";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { useSeasonalTheme } from "@/hooks/useSeasonalTheme";
import RosePetalParticles from "@/components/ui/RosePetalParticles";
import { View } from "@/components/Themed";
import SnowflakesParticles from "@/components/ui/SnowflakesParticles";
import { LinearGradient } from "expo-linear-gradient";
import HomeScreen from "@/screens/home";

export default function Home() {
  const activeTheme = useSeasonalTheme();
  return (
    <LinearGradient colors={activeTheme.gradient} style={{ flex: 1 }}>
      <SnowflakesParticles winterOnly={false} />
      <HomeScreen />
    </LinearGradient>
  );
}

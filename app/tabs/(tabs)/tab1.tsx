import EditScreenInfo from "@/components/EditScreenInfo";
import { View } from "@/components/Themed";
import { Center } from "@/components/ui/center";
import { Divider } from "@/components/ui/divider";
import FirefliesParticles from "@/components/ui/FirefliesParticles";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { useSeasonalTheme } from "@/hooks/useSeasonalTheme";
import { LinearGradient } from "expo-linear-gradient";

export default function Tab2() {
  const activeTheme = useSeasonalTheme();
  return (
    <View style={{ flex: 1 }}>
      <FirefliesParticles fireflyCount={20} />
    </View>
  );
}

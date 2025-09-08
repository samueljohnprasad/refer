import VoiceRecorderScreen from "@/app/voice-recorder";
import TestMike from "@/components/custom/TestMike";
import EditScreenInfo from "@/components/EditScreenInfo";
import { View } from "@/components/Themed";
import { Center } from "@/components/ui/center";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AudioRecorderProvider } from "@siteed/expo-audio-studio";
import MindfulBackground from "@/components/ui/MindfulBackground";
import DiscoveryScreen from "@/screens/DiscoveryScreen/DiscoveryScreen";

export default function Tab2() {
  return (
    <MindfulBackground>
      <AudioRecorderProvider>
        <DiscoveryScreen />
      </AudioRecorderProvider>
    </MindfulBackground>
  );
}

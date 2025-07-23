import VoiceRecorderScreen from "@/app/voice-recorder";
import EditScreenInfo from "@/components/EditScreenInfo";
import { Center } from "@/components/ui/center";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

export default function Tab2() {
  return (
    <Center className="flex-1">
      <VoiceRecorderScreen />
    </Center>
  );
}

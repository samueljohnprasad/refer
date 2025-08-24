import { View, Text } from "react-native";
import React from "react";
import MindfulGradient, {
  GradientPosition,
} from "@/screens/components/MindfulGradient";
import { Button, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";

const index = () => {
  const [position, setPosition] = React.useState<GradientPosition>("top");
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  return (
    <>
      <MindfulGradient position={position} isSpeaking={isSpeaking} />
      <Center className="flex-1 justify-end mb-20 flex-row items-end">
        <Button onPress={() => setPosition("center")}>
          <ButtonText>Center</ButtonText>
        </Button>
        <Button onPress={() => setPosition("bottom")}>
          <ButtonText>Bottom</ButtonText>
        </Button>
        <Button onPress={() => setPosition("top")}>
          <ButtonText>Top</ButtonText>
        </Button>
        <Button onPress={() => setIsSpeaking(!isSpeaking)}>
          <ButtonText>{isSpeaking ? "Stop" : "Start"}</ButtonText>
        </Button>
      </Center>
      <Text>index</Text>
    </>
  );
};

export default index;

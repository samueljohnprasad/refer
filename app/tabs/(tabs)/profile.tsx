import React from "react";
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import ButterflyRelease from "@/components/ui/ButterflyRelease";

const Tab4Screen = () => {
  return (
    <Center className="flex-1">
      <ButterflyRelease isActive />
      <Heading className="font-bold text-2xl">Tab 4</Heading>
      <Text className="text-center mt-4">
        Placeholder content for the fourth tab.
      </Text>
    </Center>
  );
};

export default Tab4Screen;

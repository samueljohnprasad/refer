import React from "react";
import { Image } from "expo-image";
import { TouchableOpacity, Text, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BeginButton from "@/src/components/BeginButton";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";
import {
  journeyStepScreenConfig,
  type JourneyStepScreenName,
} from "@/src/components/journey/journeyStepScreenConfig";

type JourneyStepScreenProps = {
  name: JourneyStepScreenName;
};

export default function JourneyStepScreen({
  name,
}: JourneyStepScreenProps): React.JSX.Element {
  const { height } = useWindowDimensions();
  const content = journeyStepScreenConfig[name];
  const cardHeight = Math.min(height * 0.62, 540);
  const cardWidth = cardHeight * content.imageAspectRatio;

  return (
    <View className="relative flex-1 px-6 pb-6">
      <View className="flex-1 items-center justify-center">
        <View className="w-full items-center justify-center overflow-visible">
          <Image
            source={content.image}
            style={{
              width: cardWidth,
              height: cardHeight,
              aspectRatio: content.imageAspectRatio,
            }}
            contentFit="contain"
          />
        </View>

        <View className="mt-0.5 items-center px-3">
          <Text className="text-center text-[52px] leading-[56px] tracking-[-1.5px] text-[#171717] font-extrabold">
            {content.title}
          </Text>
          <Text className="mt-3.5 max-w-[320px] text-center text-[22px] font-normal leading-[30px] text-[#A3A3A3]">
            {content.subtitle}
          </Text>
        </View>
      </View>
    </View>
  );
}

import React from "react";
import { Image as ExpoImage } from "expo-image";
import { Text, View } from "react-native";
import { withUniwind } from "uniwind";
import {
  journeyStepScreenConfig,
  type JourneyStepScreenName,
} from "@/src/components/journey/journeyStepScreenConfig";

type JourneyStepScreenProps = {
  name: JourneyStepScreenName;
};

const JourneyStepImage = withUniwind(ExpoImage);

export default function JourneyStepScreen({
  name,
}: JourneyStepScreenProps): React.JSX.Element {
  const content = journeyStepScreenConfig[name];

  return (
    <View className="relative flex-1 px-5 pb-4 phone:px-6 phone:pb-6 phablet:px-7 phablet:pb-8">
      <View className="flex-1 items-center pt-4 phone:pt-6 phablet:pt-8">
        <View className="w-full items-center justify-center overflow-visible">
          <View className="h-[278px] w-[220px] phone:h-[354px] phone:w-[280px] phablet:h-[392px] phablet:w-[310px]">
            <JourneyStepImage
              source={content.image}
              className="h-full w-full"
              contentFit="contain"
            />
          </View>
        </View>

        <View className="mt-5 w-full max-w-[296px] items-center px-2 phone:mt-7 phone:max-w-[320px] phone:px-3 phablet:mt-9 phablet:max-w-[344px] phablet:px-4">
          <Text className="text-center font-extrabold tracking-tight text-[#171717] text-4xl leading-tight phone:text-5xl phone:leading-none phone:tracking-tight phablet:text-6xl phablet:leading-none phablet:tracking-tight">
            {content.title}
          </Text>
          <Text className="mt-2 text-center font-normal text-[#A3A3A3] text-lg leading-normal phone:mt-3 phone:text-xl phone:leading-relaxed phablet:mt-4 phablet:text-2xl phablet:leading-loose">
            {content.subtitle}
          </Text>
        </View>
      </View>
    </View>
  );
}

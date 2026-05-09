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
          <Text className="text-center font-extrabold tracking-[-1.25px] text-[#171717] text-[42px] leading-[46px] phone:text-[50px] phone:leading-[54px] phone:tracking-[-1.5px] phablet:text-[56px] phablet:leading-[60px] phablet:tracking-[-1.8px]">
            {content.title}
          </Text>
          <Text className="mt-2 text-center font-normal text-[#A3A3A3] text-[18px] leading-[26px] phone:mt-3 phone:text-[21px] phone:leading-[29px] phablet:mt-4 phablet:text-[23px] phablet:leading-[32px]">
            {content.subtitle}
          </Text>
        </View>
      </View>
    </View>
  );
}

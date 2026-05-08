import React from "react";
import { Image } from "expo-image";
import { Text, View, useWindowDimensions, type LayoutChangeEvent } from "react-native";
import {
  journeyStepScreenConfig,
  type JourneyStepScreenName,
} from "@/src/components/journey/journeyStepScreenConfig";
import { getJourneyStepScreenLayout } from "@/src/components/journey/journeyStepScreenLayout";

type JourneyStepScreenProps = {
  name: JourneyStepScreenName;
};

export default function JourneyStepScreen({
  name,
}: JourneyStepScreenProps): React.JSX.Element {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const content = journeyStepScreenConfig[name];
  const [containerHeight, setContainerHeight] = React.useState<number>(0);
  const availableHeight = containerHeight || windowHeight;
  const layout = getJourneyStepScreenLayout({
    availableHeight,
    windowWidth,
    imageAspectRatio: content.imageAspectRatio,
  });
  const handleLayout = React.useCallback((event: LayoutChangeEvent): void => {
    setContainerHeight(event.nativeEvent.layout.height);
  }, []);
  const containerClassName = `relative flex-1 px-6 ${layout.isCompactScreen ? "pb-4" : "pb-6"}`;
  const contentClassName = `flex-1 items-center ${layout.isCompactScreen ? "pt-5" : "pt-7"}`;
  const copyClassName = `items-center px-3 ${layout.isCompactScreen ? "mt-6" : "mt-8"}`;
  const titleClassName = `text-center font-extrabold tracking-[-1.5px] text-[#171717] ${layout.isCompactScreen ? "text-[46px] leading-[50px]" : "text-[52px] leading-[56px]"
    }`;
  const subtitleClassName = `max-w-[320px] text-center font-normal text-[#A3A3A3] ${layout.isCompactScreen ? "mt-2.5 text-[19px] leading-[27px]" : "mt-3.5 text-[22px] leading-[30px]"
    }`;

  return (
    <View className={containerClassName} onLayout={handleLayout}>
      <View className={contentClassName}>
        <View className="w-full items-center justify-center overflow-visible">
          <Image
            source={content.image}
            style={{
              width: layout.imageWidth,
              height: layout.imageHeight,
              aspectRatio: content.imageAspectRatio,
            }}
            contentFit="contain"
          />
        </View>

        <View className={copyClassName} style={{ maxWidth: layout.copyMaxWidth }}>
          <Text className={titleClassName}>{content.title}</Text>
          <Text className={subtitleClassName}>{content.subtitle}</Text>
        </View>
      </View>
    </View>
  );
}

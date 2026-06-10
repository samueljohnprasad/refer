import React, { useEffect, useRef } from "react";
import { Text, useWindowDimensions, View } from "react-native";
import * as Haptics from "expo-haptics";
import { SvgAppButton } from "./svg-app-button";
import JourneyUnitIcon from "@/src/components/journey/JourneyUnitIcon";

type HomeMainButtonProps = {
  unitLabel: string;
  unitTitle: string;
  faceColor: string;
  rimColor: string;
  unitIconKey?: string | null;
  onPress: () => void;
};

export const HomeMainButton = ({
  unitLabel,
  unitTitle,
  faceColor,
  rimColor,
  unitIconKey,
  onPress,
}: HomeMainButtonProps) => {
  const { width } = useWindowDimensions();
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    // Provide a nice light haptic click when the user scrolls into a new section
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [faceColor]);

  return (
    <View className="flex-row items-center self-center">
      <SvgAppButton
        width={width * 0.8}
        height={78}
        color={faceColor}
        backgroundColor={rimColor}
        leftRadius={13}
        rightRadius={0}
        strokeRightWidth={1}
        strokeRightPressedWidth={5}
        strokeRightColor={rimColor}
        pressDepth={4}
        onPress={onPress}
        contentContainerStyle={{
          justifyContent: "center",
          paddingHorizontal: 16,
        }}
      >
        <Text
          style={{ fontFamily: "FrauncesRegular" }}
          className="text-sm text-white/80"
        >
          {unitLabel}
        </Text>
        <Text
          style={{ fontFamily: "FrauncesSemiBold" }}
          className="text-[18px] text-white"
        >
          {unitTitle}
        </Text>
      </SvgAppButton>
      <SvgAppButton
        width={55}
        height={78}
        color={faceColor}
        backgroundColor={rimColor}
        leftRadius={0}
        rightRadius={13}
        strokeLeftPressedWidth={5}
        strokeLeftWidth={1}
        strokeLeftColor={rimColor}
        pressDepth={4}
        onPress={onPress}
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <JourneyUnitIcon iconKey={unitIconKey} size={22} color="#FFFFFF" />
      </SvgAppButton>
    </View>
  );
};

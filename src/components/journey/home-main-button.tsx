import { Text, useWindowDimensions, View } from "react-native";
import { SvgAppButton } from "./svg-app-button";
import { Flag } from "@/assets/icons";

type HomeMainButtonProps = {
  unitLabel: string;
  unitTitle: string;
  faceColor: string;
  rimColor: string;
  onPress: () => void;
};

export const HomeMainButton = ({
  unitLabel,
  unitTitle,
  faceColor,
  rimColor,
  onPress,
}: HomeMainButtonProps) => {
  const { width } = useWindowDimensions();
  return (
    <View className="flex-row  items-center self-center">
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
        <Text className="text-lg font-rd-medium" style={{ color: "#ecffde" }}>
          {unitLabel}
        </Text>
        <Text className="text-white text-xl font-bold">{unitTitle}</Text>
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
        <Flag width={22} height={22} />
      </SvgAppButton>
    </View>
  );
};

import React from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { Text } from "@/src/components/ui/Text";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import HappiMascot from "@/src/screens/OnboardingScreen/components/HappiMascot";

/**
 * Animated header section with motivational text
 */
export const NotificationHeader: React.FC = () => {
  const { t } = useTranslation("settings");
  const headerOpacity = useSharedValue(0);

  React.useEffect(() => {
    headerOpacity.value = 0;
    headerOpacity.value = withDelay(100, withTiming(1, { duration: 600 }));
  }, []);

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));

  return (
    <Animated.View style={headerAnimatedStyle} className="mt-4 mb-4 items-center">
      {/* ponytail: Happi gentle reminder bell mascot anchors daily notification routine */}
      <View className="mb-3 items-center justify-center">
        <HappiMascot expression="bell" size={110} />
      </View>
      <Text className="happy-font-body-medium text-center text-ink-muted text-[15px] leading-6 px-6">
        {t("reminders.description")}
      </Text>
    </Animated.View>
  );
};

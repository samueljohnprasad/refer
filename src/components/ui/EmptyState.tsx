import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Mascot, MascotState } from "./Mascot";
import { BRAND_SURFACE } from "@/lib/tokens";

interface EmptyStateProps {
  mascotState: MascotState;
  buttonText: string;
  onButtonPress: () => void;
  buttonIcon?: any;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  mascotState,
  buttonText,
  onButtonPress,
  buttonIcon,
}) => {
  return (
    <View className="items-center pt-36 pb-12">
      <View className="happy-mascot-stage h-44 w-44 items-center justify-center rounded-[44px] border-0">
        <Mascot state={mascotState} size={156} />
      </View>
      <TouchableOpacity
        onPress={onButtonPress}
        className="happy-brand-primary-cta mt-7 min-h-[56px] flex-row items-center gap-2 rounded-[22px] px-7"
        activeOpacity={0.7}
      >
        {buttonIcon && (
          <HugeiconsIcon icon={buttonIcon} size={18} color={BRAND_SURFACE} />
        )}
        <Text className="happy-font-body-bold text-[16px] text-white">
          {buttonText}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

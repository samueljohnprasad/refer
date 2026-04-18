import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Mascot, MascotState } from "./Mascot";

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
    <View className="items-center pt-40 pb-10">
      <Mascot state={mascotState} size={156} />
      <TouchableOpacity
        onPress={onButtonPress}
        className="mt-6 bg-gray-800 px-6 py-3 rounded-xl flex-row items-center gap-2"
        activeOpacity={0.7}
      >
        {buttonIcon && (
          <HugeiconsIcon icon={buttonIcon} size={18} color="white" />
        )}
        <Text className="text-white font-medium">{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
};

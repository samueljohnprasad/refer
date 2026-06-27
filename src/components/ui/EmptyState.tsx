import React from "react";
import { View } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Mascot, MascotState } from "./Mascot";
import { Button } from "@/src/components/ui/Button";
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
      <View className="h-44 w-44 items-center justify-center rounded-[44px] border-0">
        <Mascot state={mascotState} size={156} />
      </View>
      <View className="mt-7 px-12 self-stretch">
        <Button
          label={buttonText}
          variant="primary"
          size="lg"
          onPress={onButtonPress}
          leftIcon={
            buttonIcon ? (
              <HugeiconsIcon icon={buttonIcon} size={18} color={BRAND_SURFACE} />
            ) : undefined
          }
        />
      </View>
    </View>
  );
};

import React from "react";
import { View } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Mascot, MascotState } from "./Mascot";
import { Button } from "@/src/components/ui/Button";
import { BRAND_SURFACE } from "@/lib/tokens";

interface EmptyStateProps {
  mascotState: MascotState;
  buttonText: string;
  onButtonPress: () => void;
  buttonIcon?: any;
  title?: string;
  description?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  mascotState,
  buttonText,
  onButtonPress,
  buttonIcon,
  title,
  description,
}) => {
  return (
    <View className="flex-1 items-center justify-center py-12 min-h-[400px]">
      <View className="h-44 w-44 items-center justify-center rounded-[44px] border-0 mb-4">
        <Mascot state={mascotState} size={156} />
      </View>
      
      {title && (
        <Text className="happy-font-heading-bold text-xl text-ink text-center mb-2 px-6">
          {title}
        </Text>
      )}
      
      {description && (
        <Text className="happy-font-body text-sm text-ink-muted text-center px-10 mb-8 leading-relaxed">
          {description}
        </Text>
      )}

      <View className="px-12 self-stretch w-full max-w-sm">
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

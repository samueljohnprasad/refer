import React from "react";
import { View } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Mascot, MascotState } from "./Mascot";
import { Button } from "@/src/components/ui/Button";
import { BRAND_SURFACE } from "@/lib/tokens";

interface EmptyStateProps {
  mascotState: MascotState;
  buttonText?: string;
  onButtonPress?: () => void;
  buttonIcon?: any;
  buttonLoading?: boolean;
  title?: string;
  description?: string;
  secondaryButtonText?: string;
  onSecondaryButtonPress?: () => void;
  secondaryButtonIcon?: any;
  secondaryButtonLoading?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  mascotState,
  buttonText,
  onButtonPress,
  buttonIcon,
  buttonLoading,
  title,
  description,
  secondaryButtonText,
  onSecondaryButtonPress,
  secondaryButtonIcon,
  secondaryButtonLoading,
}) => {
  return (
    <View className="flex-1 items-center justify-center py-12 min-h-[400px]">
      <View className="h-44 w-44 items-center justify-center rounded-[44px] border-0 mb-4">
        <Mascot state={mascotState} size={156} />
      </View>
      
      {title && (
        <Text variant="h1" className="text-center mb-3 px-6">
          {title}
        </Text>
      )}
      
      {description && (
        <Text variant="body" color="ink" className="text-center px-8 mb-8 opacity-80">
          {description}
        </Text>
      )}

      <View className="px-8 self-stretch w-full max-w-sm flex-col gap-3 justify-center">
        {secondaryButtonText && onSecondaryButtonPress ? (
          <>
            <Button
              label={buttonText}
              variant="primary"
              size="lg"
              className="w-full"
              onPress={onButtonPress}
              loading={buttonLoading}
              leftIcon={
                buttonIcon ? (
                  <HugeiconsIcon icon={buttonIcon} size={18} color="white" />
                ) : undefined
              }
            />
            <Button
              label={secondaryButtonText}
              variant="secondary"
              size="lg"
              className="w-full"
              onPress={onSecondaryButtonPress}
              loading={secondaryButtonLoading}
              leftIcon={
                secondaryButtonIcon ? (
                  <HugeiconsIcon icon={secondaryButtonIcon} size={18} color="#142414" />
                ) : undefined
              }
            />
          </>
        ) : (
          <Button
            label={buttonText}
            variant="primary"
            size="lg"
            className="w-full"
            onPress={onButtonPress}
            leftIcon={
              buttonIcon ? (
                <HugeiconsIcon icon={buttonIcon} size={18} color={BRAND_SURFACE} />
              ) : undefined
            }
          />
        )}
      </View>
    </View>
  );
};

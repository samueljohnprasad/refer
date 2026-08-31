import React from "react";
import { View } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Mascot, MascotState } from "./Mascot";
import { Button } from "@/src/components/ui/Button";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { RADIUS } from "@/src/theme/radius";
import { StaggeredText } from "@/src/components/staggered-text";
import { APP_FONT_ASSETS } from "@/src/theme/typography";

interface EmptyStateProps {
  mascotState: MascotState;
  buttonText?: string;
  onButtonPress?: () => void;
  buttonIcon?: any;
  buttonLoading?: boolean;
  title?: string | string[];
  description?: string;
  secondaryButtonText?: string;
  onSecondaryButtonPress?: () => void;
  secondaryButtonIcon?: any;
  secondaryButtonLoading?: boolean;
  containerClassName?: string;
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
  containerClassName = "",
}) => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const titles = Array.isArray(title) ? title : title ? [title] : [];

  React.useEffect(() => {
    if (titles.length > 1) {
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % titles.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [titles.length]);

  return (
    <View
      className={`flex-1 items-center justify-center py-8 min-h-[400px] ${containerClassName}`}
    >
      <View className="mb-8 items-center justify-center">
        <Mascot state={mascotState} size={140} />
      </View>

      {titles.length > 0 && (
        <View className="mb-2 w-full justify-center items-center h-[40px]">
          <StaggeredText
            texts={titles}
            activeIndex={activeIndex}
            fontSize={28}
            color={SEMANTIC_COLORS.brand.onSoft}
            fontPath={APP_FONT_ASSETS.extraBold}
            staggerFrom="leading"
            height={40}
            animationConfig={{
              duration: 800,
              characterDelay: 30,
            }}
          />
        </View>
      )}

      {description && (
        <Text variant="body" color="soft" className="text-center px-8 mb-8">
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
                  <HugeiconsIcon
                    icon={buttonIcon}
                    size={18}
                    color={SEMANTIC_COLORS.surface.primary}
                  />
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
                  <HugeiconsIcon
                    icon={secondaryButtonIcon}
                    size={18}
                    color="#142414"
                  />
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
                <HugeiconsIcon
                  icon={buttonIcon}
                  size={18}
                  color={SEMANTIC_COLORS.surface.primary}
                />
              ) : undefined
            }
          />
        )}
      </View>
    </View>
  );
};

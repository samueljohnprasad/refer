import React from "react";
import { Pressable, Text, View } from "react-native";
import { CourseExercisePrimaryButton } from "@/src/components/exercise/CourseExerciseShell";
import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import { SEMANTIC_COLORS } from "@/src/theme/colors";

interface TactileButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
  leftIcon?: React.ReactElement;
  rightIcon?: React.ReactElement;
  height?: number;
  fontSize?: number;
  pressDepth?: number;
}

const TactileButton: React.FC<TactileButtonProps> = ({
  label,
  onPress,
  disabled = false,
  variant = "primary",
  leftIcon,
  rightIcon,
  height = 60,
  fontSize,
  pressDepth = 6,
}) => {
  // ponytail: secondary variant remains accessible plain text action
  if (variant === "secondary") {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={label}
        className="w-full min-h-[48px] items-center justify-center active:opacity-60"
      >
        <View className="flex-row items-center justify-center gap-1.5">
          {leftIcon}
          <Text
            style={{
              fontFamily: APP_FONT_FAMILIES.bold,
              color: SEMANTIC_COLORS.text.secondary as string,
              fontSize: 16,
            }}
          >
            {label}
          </Text>
          {rightIcon}
        </View>
      </Pressable>
    );
  }

  // ponytail: exact lesson footer 3D tactile button with SVG depth and haptics
  return (
    <CourseExercisePrimaryButton
      label={label}
      onPress={onPress}
      disabled={disabled}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
      height={height}
      fontSize={fontSize}
      pressDepth={pressDepth}
    />
  );
};

export default React.memo(TactileButton);

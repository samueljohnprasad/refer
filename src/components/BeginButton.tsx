import React, { type ReactNode } from "react";
import {
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { CourseExercisePrimaryButton } from "@/src/components/exercise/CourseExerciseShell";

type BeginButtonProps = {
  onPress: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  name?: string;
  disabled?: boolean;
  showIcon?: boolean;
  activeOpacity?: number;
  accessibilityLabel?: string;
  leadingIcon?: ReactNode;
};

export default function BeginButton({
  onPress,
  name = "Begin",
  disabled = false,
  showIcon = true,
  accessibilityLabel,
  leadingIcon,
}: BeginButtonProps): React.JSX.Element {
  return (
    <CourseExercisePrimaryButton
      label={name}
      disabled={disabled}
      onPress={onPress}
      leftIcon={leadingIcon}
      rightIcon={
        showIcon ? (
          <HugeiconsIcon
            icon={ArrowRight02Icon}
            size={22}
            color="#FFFFFF"
          />
        ) : undefined
      }
      height={64}
      fontSize={19}
    />
  );
}

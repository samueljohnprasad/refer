import React, { type ReactNode } from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { RADIUS } from "@/src/theme/radius";

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
  onPressIn,
  onPressOut,
  style,
  labelStyle,
  name = "Begin",
  disabled = false,
  showIcon = true,
  activeOpacity = 1,
  accessibilityLabel,
  leadingIcon,
}: BeginButtonProps): React.JSX.Element {
  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      activeOpacity={activeOpacity}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? name}
      accessibilityState={{ disabled }}
      style={[styles.button, disabled && styles.disabledButton, style]}
    >
      <View style={styles.content}>
        {leadingIcon}
        <Text
          style={[styles.label, disabled && styles.disabledLabel, labelStyle]}
        >
          {name}
        </Text>
        {showIcon ? (
          <HugeiconsIcon
            icon={ArrowRight02Icon}
            size={24}
            color={disabled ? SEMANTIC_COLORS.text.secondary : "#FFFFFF"}
          />
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 74,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 36,
    backgroundColor: "#111111",
  },
  disabledButton: {
    backgroundColor: "#D1D5DB",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  label: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  disabledLabel: {
    color: SEMANTIC_COLORS.text.secondary,
  },
});

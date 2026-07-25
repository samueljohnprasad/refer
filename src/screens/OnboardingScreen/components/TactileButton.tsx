import React from "react";
import { Button } from "@/src/components/ui/Button";

interface TactileButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
  leftIcon?: React.ReactElement;
  rightIcon?: React.ReactElement;
}

const TactileButton: React.FC<TactileButtonProps> = ({
  label,
  onPress,
  disabled = false,
  variant = "primary",
  leftIcon,
  rightIcon,
}) => {
  return (
    <Button
      label={label}
      onPress={onPress}
      disabled={disabled}
      variant={variant === "secondary" ? "ghost" : "primary"}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
      fullWidth
    />
  );
};

export default React.memo(TactileButton);

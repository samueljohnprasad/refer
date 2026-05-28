import React from "react";
import { Button } from "@/src/components/ui/Button";

interface TactileButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
}

const TactileButton: React.FC<TactileButtonProps> = ({
  label,
  onPress,
  disabled = false,
  variant = "primary",
}) => {
  return (
    <Button
      label={label}
      onPress={onPress}
      disabled={disabled}
      variant={variant === "secondary" ? "ghost" : "primary"}
      fullWidth
    />
  );
};

export default React.memo(TactileButton);

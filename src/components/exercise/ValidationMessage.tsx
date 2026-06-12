import React from "react";
import { View } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Leaf01Icon } from "@hugeicons/core-free-icons";
import { FadeInItem } from "@/src/components/ui/FadeInItem";
import { SAGE } from "@/lib/tokens";

interface ValidationMessageProps {
  message: string;
  visible: boolean;
  className?: string;
}

export const ValidationMessage: React.FC<ValidationMessageProps> = ({
  message,
  visible,
  className = "",
}) => {
  if (!visible || !message) return null;

  return (
    <FadeInItem index={0} className={className}>
      <View className="rounded-2xl p-4 mb-4 flex-row items-start bg-sage-50 border border-sage-200/50">
        <View className="h-8 w-8 rounded-xl bg-sage-100 items-center justify-center mr-3 mt-0.5 shrink-0">
          <HugeiconsIcon
            icon={Leaf01Icon}
            size={16}
            color={SAGE[500]}
            strokeWidth={2}
          />
        </View>
        <Text
          variant="body"
          className="text-[14px] leading-relaxed flex-1 font-medium text-sage-700"
        >
          {message}
        </Text>
      </View>
    </FadeInItem>
  );
};

ValidationMessage.displayName = "ValidationMessage";

import React, { useState, useCallback } from "react";
import {
  View,
  Pressable,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { Text } from "@/src/components/ui/Text";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  Idea01Icon,
  ArrowDown01Icon,
  ArrowUp01Icon,
} from "@hugeicons/core-free-icons";
import { SAGE } from "@/lib/tokens";
import { triggerSelectionHaptic } from "@/src/components/exercise/selectionHaptics";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface PsychoeducationCardProps {
  content: string;
  className?: string;
}

export const PsychoeducationCard: React.FC<PsychoeducationCardProps> = ({
  content,
  className = "",
}) => {
  const [expanded, setExpanded] = useState(false);

  const toggle = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    triggerSelectionHaptic();
    setExpanded((prev) => !prev);
  }, []);

  if (!content) return null;

  return (
    <View className={`mb-4 ${className}`}>
      {!expanded ? (
        <Pressable
          onPress={toggle}
          accessibilityRole="button"
          accessibilityHint="Expand to learn why this step helps"
          accessibilityLabel="Why this helps"
          hitSlop={8}
          className="flex-row items-center self-start active:opacity-60"
        >
          <Text className="text-[13px] font-semibold text-sage-600 mr-1">
            Why this helps
          </Text>
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            size={14}
            color={SAGE[600]}
            strokeWidth={2}
          />
        </Pressable>
      ) : (
        <View className="rounded-xl p-4 bg-sage-50 border border-sage-200/50">
          <View className="flex-row items-start">
            <View className="h-7 w-7 rounded-lg bg-sage-100 items-center justify-center mr-3 mt-0.5 shrink-0">
              <HugeiconsIcon
                icon={Idea01Icon}
                size={14}
                color={SAGE[500]}
                strokeWidth={2}
              />
            </View>
            <Text className="text-[13.5px] leading-relaxed flex-1 font-medium text-sage-700">
              {content}
            </Text>
          </View>

          <Pressable
            onPress={toggle}
            accessibilityRole="button"
            accessibilityLabel="Collapse"
            hitSlop={8}
            className="flex-row items-center self-end mt-3 active:opacity-60"
          >
            <Text className="text-[12px] font-semibold text-sage-500 mr-1">
              Less
            </Text>
            <HugeiconsIcon
              icon={ArrowUp01Icon}
              size={13}
              color={SAGE[500]}
              strokeWidth={2}
            />
          </Pressable>
        </View>
      )}
    </View>
  );
};

PsychoeducationCard.displayName = "PsychoeducationCard";

import React from "react";
import { View, ScrollView, Pressable } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Text } from "@/components/ui/text";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  Tick02Icon,
  Target03Icon,
  Rocket01Icon,
  SmileIcon,
  Plant01Icon,
  FavouriteIcon,
  SparklesIcon,
  BrushIcon,
  BrainIcon,
  MoreHorizontalIcon,
} from "@hugeicons/core-free-icons";
type JournalOptionsProps = {
  reasons: string[];
  /** Max height for the internal scroll container. Default: 280 */
  maxHeight?: number;
  /** Optional title above the list */
  title?: string;
  /** Optional helper text under title */
  helperText?: string;
  /** Show selected count pill when multiple */
  showCount?: boolean;
  /** Prefix each reason with an emoji icon */
  showIcons?: boolean;
  selectedReasons: string[];
  onChangeSelected: (reasons: string[]) => void;
};

export const JournalOptions: React.FC<JournalOptionsProps> = (
  props: JournalOptionsProps
) => {
  const {
    reasons,
    title,
    helperText,
    showCount,
    showIcons,
    selectedReasons,
    onChangeSelected,
  } = props;

  const selectedSet = new Set(selectedReasons);

  const handleToggle = (reason: string): void => {
    const next = new Set(selectedReasons);
    if (next.has(reason)) next.delete(reason);
    else next.add(reason);
    onChangeSelected(Array.from(next));
  };

  const getIconForReason = (reason: string): any => {
    const map: Record<string, any> = {
      "Track my daily emotions": Target03Icon,
      "Build better habits": Rocket01Icon,
      "Reduce stress & anxiety": SmileIcon,
      "Personal growth": Plant01Icon,
      "Improve relationships": FavouriteIcon,
      "Practice gratitude": SparklesIcon,
      "Boost creativity": BrushIcon,
      "Improve mental health": BrainIcon,
      Other: MoreHorizontalIcon,
    };
    return map[reason] ?? MoreHorizontalIcon;
  };

  const getColorForReason = (
    reason: string
  ): { bg: string; border: string; text: string; icon: string } => {
    const colorMap: Record<
      string,
      { bg: string; border: string; text: string; icon: string }
    > = {
      "Track my daily emotions": {
        bg: "#FEF3C7",
        border: "#F59E0B",
        text: "#92400E",
        icon: "#D97706",
      },
      "Build better habits": {
        bg: "#F3E8FF",
        border: "#A855F7",
        text: "#6B21A8",
        icon: "#9333EA",
      },
      "Reduce stress & anxiety": {
        bg: "#DBEAFE",
        border: "#3B82F6",
        text: "#1E3A8A",
        icon: "#2563EB",
      },
      "Personal growth": {
        bg: "#D1FAE5",
        border: "#10B981",
        text: "#064E3B",
        icon: "#059669",
      },
      "Improve relationships": {
        bg: "#FEE2E2",
        border: "#EF4444",
        text: "#991B1B",
        icon: "#DC2626",
      },
      "Practice gratitude": {
        bg: "#FCE7F3",
        border: "#EC4899",
        text: "#831843",
        icon: "#DB2777",
      },
      "Boost creativity": {
        bg: "#FEF3C7",
        border: "#F59E0B",
        text: "#92400E",
        icon: "#D97706",
      },
      "Improve mental health": {
        bg: "#F3F4F6",
        border: "#6B7280",
        text: "#374151",
        icon: "#4B5563",
      },
      Other: {
        bg: "#F3E8FF",
        border: "#A855F7",
        text: "#581C87",
        icon: "#9333EA",
      },
    };
    return (
      colorMap[reason] ?? {
        bg: "#F9FAFB",
        border: "#9CA3AF",
        text: "#4B5563",
        icon: "#6B7280",
      }
    );
  };

  return (
    <View className="w-full flex-1 px-4">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Clean Header */}
        {(title || helperText) && (
          <Animated.View
            entering={FadeInDown.duration(400)}
            className="mb-8 mt-4"
          >
            {title && (
              <Text className="text-4xl text-gray-900 dark:text-white mb-3 font-cormorantSemiBold leading-tight">
                {title}
              </Text>
            )}
            {helperText && (
              <Text className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
                {helperText}
              </Text>
            )}
          </Animated.View>
        )}

        {/* Premium Selected Count Badge */}
        {showCount && selectedSet.size > 0 && (
          <Animated.View
            entering={FadeIn.duration(300)}
            className="absolute top-1 right-6 z-10"
          >
            <View
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor: "#7B61FF",
                borderWidth: 1.5,
                borderColor: "rgba(255, 255, 255, 0.3)",
              }}
            >
              <Text className="text-sm font-bold text-white">
                ✓ {selectedSet.size} selected
              </Text>
            </View>
          </Animated.View>
        )}

        <View className="gap-3 mt-8">
          {reasons.map((reason: string, index: number) => {
            const selected: boolean = selectedSet.has(reason);
            return (
              <OptionCard
                key={reason}
                reason={reason}
                icon={getIconForReason(reason)}
                colors={getColorForReason(reason)}
                selected={selected}
                index={index}
                onToggle={() => handleToggle(reason)}
                showIcon={showIcons ?? true}
              />
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

// Modern Clean Option Card Component
const OptionCard: React.FC<{
  reason: string;
  icon: any;
  colors: { bg: string; border: string; text: string; icon: string };
  selected: boolean;
  index: number;
  onToggle: () => void;
  showIcon?: boolean;
}> = ({ reason, icon, colors, selected, index, onToggle, showIcon }) => {
  const scale = useSharedValue(1);

  React.useEffect(() => {
    scale.value = withSpring(selected ? 1.02 : 1, {
      damping: 15,
      stiffness: 100,
    });
  }, [selected]);

  return (
    <Animated.View
      entering={FadeInDown.duration(400)
        .delay(index * 50)
        .springify()}
    >
      <Pressable
        onPress={onToggle}
        className="active:opacity-80"
        style={{
          paddingHorizontal: 20,
          paddingVertical: 18,
          borderRadius: 20,
          backgroundColor: selected ? colors.bg : "#FFFFFF",
        }}
      >
        <View className="flex-row items-center">
          {/* Modern Icon Container */}
          {showIcon && (
            <View
              style={{
                backgroundColor: selected
                  ? "rgba(255, 255, 255, 0.6)"
                  : "#F9FAFB",
                width: 52,
                height: 52,
                borderRadius: 16,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 16,
              }}
            >
              <HugeiconsIcon
                icon={icon}
                size={28}
                color={selected ? colors.icon : "#6B7280"}
              />
            </View>
          )}

          {/* Option Text */}
          <View className="flex-1">
            <Text
              style={{
                fontSize: 18,
                fontFamily: "CormorantSemiBold",
                color: selected ? colors.text : "#1F2937",
                marginBottom: 2,
              }}
            >
              {reason}
            </Text>
          </View>

          {/* Modern Checkbox */}
          <View
            style={{
              width: 26,
              height: 26,
              borderRadius: 13,
              backgroundColor: selected ? colors.border : "#FFFFFF",
              borderWidth: 2,
              borderColor: selected ? colors.border : "#D1D5DB",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: 12,
            }}
          >
            {selected && (
              <Animated.View entering={FadeIn.duration(200)}>
                <HugeiconsIcon icon={Tick02Icon} size={14} color="white" />
              </Animated.View>
            )}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

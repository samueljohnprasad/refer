import React from "react";
import { View, ScrollView, Pressable } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Text } from "@/components/ui/text";

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

  const getEmojiForReason = (reason: string): string => {
    const map: Record<string, string> = {
      "Track my daily emotions": "🎯",
      "Build better habits": "🚀",
      "Reduce stress & anxiety": "🥸",
      "Personal growth": "🌱",
      "Improve relationships": "💞",
      "Practice gratitude": "✨",
      "Boost creativity": "🎨",
      "Improve mental health": "🧠",
      Other: "🎆",
    };
    return map[reason] ?? "🎆";
  };

  const getColorForReason = (
    reason: string
  ): { bg: string; border: string; text: string } => {
    const colorMap: Record<
      string,
      { bg: string; border: string; text: string }
    > = {
      "Track my daily emotions": {
        bg: "#FEF3C7",
        border: "#FCD34D",
        text: "#92400E",
      },
      "Build better habits": {
        bg: "#E9D5FF",
        border: "#C084FC",
        text: "#6B21A8",
      },
      "Reduce stress & anxiety": {
        bg: "#DBEAFE",
        border: "#93C5FD",
        text: "#1E3A8A",
      },
      "Personal growth": { bg: "#D1FAE5", border: "#6EE7B7", text: "#064E3B" },
      "Improve relationships": {
        bg: "#FEE2E2",
        border: "#FCA5A5",
        text: "#991B1B",
      },
      "Practice gratitude": {
        bg: "#FCE7F3",
        border: "#F9A8D4",
        text: "#831843",
      },
      "Boost creativity": { bg: "#FEF3C7", border: "#FCD34D", text: "#92400E" },
      "Improve mental health": {
        bg: "#E5E7EB",
        border: "#9CA3AF",
        text: "#374151",
      },
      Other: { bg: "#F3E8FF", border: "#E9D5FF", text: "#581C87" },
    };
    return (
      colorMap[reason] ?? { bg: "#F3F4F6", border: "#E5E7EB", text: "#4B5563" }
    );
  };

  return (
    <View className="w-full flex-1 px-4">
      <ScrollView
        showsVerticalScrollIndicator={true}
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

        {/* Premium Selected Count Badge with Pulse */}
        {showCount && selectedSet.size > 0 && (
          <Animated.View
            entering={FadeIn.duration(300)}
            className="absolute top-1 right-6 z-10"
          >
            <View
              style={{
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor: "#7C3AED",
                shadowColor: "#7C3AED",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 5,
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
                emoji={getEmojiForReason(reason)}
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

// Premium Option Card Component
const OptionCard: React.FC<{
  reason: string;
  emoji: string;
  colors: { bg: string; border: string; text: string };
  selected: boolean;
  index: number;
  onToggle: () => void;
  showIcon?: boolean;
}> = ({ reason, emoji, colors, selected, index, onToggle, showIcon }) => {
  const scale = useSharedValue(1);
  const backgroundColor = useSharedValue(0);
  const borderWidth = useSharedValue(2);

  React.useEffect(() => {
    backgroundColor.value = withTiming(selected ? 1 : 0, { duration: 300 });
    scale.value = withSpring(selected ? 1.03 : 1, {
      damping: 12,
      stiffness: 90,
    });
    borderWidth.value = withSpring(selected ? 3 : 2, {
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
        style={{
          paddingHorizontal: 20,
          paddingVertical: 18,
          borderRadius: 20,
          backgroundColor: selected ? colors.bg : "rgba(255, 255, 255, 0.95)",
          borderColor: selected ? colors.border : "rgba(229, 231, 235, 0.6)",
          shadowColor: selected ? colors.border : "#000",
          shadowOffset: { width: 0, height: selected ? 6 : 2 },
          shadowOpacity: selected ? 0.25 : 0.08,
          shadowRadius: selected ? 16 : 8,
          elevation: selected ? 6 : 2,
        }}
      >
        <View className="flex-row items-center">
          {/* Premium Animated Checkbox */}
          <View
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: selected ? colors.border : "rgba(0, 0, 0, 0.05)",
              borderWidth: 2,
              borderColor: selected ? colors.border : "rgba(0, 0, 0, 0.1)",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 14,
            }}
          >
            {selected && (
              <Animated.Text
                entering={FadeIn.duration(200)}
                style={{
                  color: "white",
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                ✓
              </Animated.Text>
            )}
          </View>

          {/* Premium Emoji Container */}
          {showIcon && (
            <View
              style={{
                backgroundColor: selected
                  ? "rgba(255, 255, 255, 0.5)"
                  : "rgba(0, 0, 0, 0.03)",
                width: 48,
                height: 48,
                borderRadius: 16,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 14,
              }}
            >
              <Text className="text-3xl">{emoji}</Text>
            </View>
          )}

          {/* Premium Option Text */}
          <View className="flex-1">
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: selected ? colors.text : "#374151",
                letterSpacing: 0.2,
                marginBottom: 2,
              }}
            >
              {reason}
            </Text>
            {selected && (
              <Text
                style={{
                  fontSize: 12,
                  color: colors.text,
                  opacity: 0.7,
                  fontWeight: "500",
                }}
              >
                Great choice!
              </Text>
            )}
          </View>

          {/* Premium Selection Sparkle */}
          {selected && (
            <Animated.View entering={FadeIn.duration(300)} className="ml-2">
              <Text className="text-2xl">💫</Text>
            </Animated.View>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
};

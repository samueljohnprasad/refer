import React, { useCallback } from "react";
import { Pressable, Text, View } from "react-native";
import { SymbolView } from "expo-symbols";
import * as Haptics from "expo-haptics";
import type { StarterPathV1 } from "@/src/domains/journey/model/starterPath";

interface StarterPathGoalOptionProps {
  path: StarterPathV1;
  selected: boolean;
  translate: (key: string) => string;
  onSelect: () => void;
}

// ponytail: benchmark tactile choice card with Apple continuous squircle, 3D rim and aligned badge
export function StarterPathGoalOption({
  path,
  selected,
  translate,
  onSelect,
}: StarterPathGoalOptionProps): React.JSX.Element {
  const copy = path.copyKeys.goal;
  const isAnxiety = path.pathId === "understand_anxious_thoughts";

  const handlePress = useCallback((): void => {
    void Haptics.selectionAsync();
    onSelect();
  }, [onSelect]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={translate(copy.choice)}
      accessibilityState={{ selected }}
      onPress={handlePress}
      className={`flex-row items-center gap-4 rounded-3xl border-2 p-5 ${
        selected
          ? "border-sage-500 border-b-[5px] border-b-sage-700 bg-sage-50"
          : "border-brand-border border-b-[5px] border-b-brand-border-strong bg-brand-surface"
      }`}
      style={({ pressed }) => [
        { borderCurve: "continuous" },
        pressed ? { transform: [{ translateY: 2.5 }] } : undefined,
      ]}
    >
      {/* Icon Squircle Badge */}
      <View
        className={`h-[52px] w-[52px] items-center justify-center rounded-2xl border ${
          selected
            ? "border-sage-600 bg-sage-500"
            : "border-sage-200/80 bg-sage-100/80"
        }`}
        style={{ borderCurve: "continuous" }}
      >
        <SymbolView
          name={isAnxiety ? "water.waves" : "leaf.fill"}
          size={25}
          tintColor={selected ? "#FFFFFF" : "#44633F"}
          weight={selected ? "bold" : "semibold"}
        />
      </View>

      {/* Choice Copy */}
      <View className="min-w-0 flex-1 gap-1">
        <Text
          className={`text-[18px] leading-6 text-ink ${
            selected ? "happy-font-body-extrabold" : "happy-font-body-bold"
          }`}
        >
          {translate(copy.choice)}
        </Text>
        <Text className="text-[14px] leading-5 text-ink-soft happy-font-body-medium">
          {translate(copy.choiceDescription)}
        </Text>
      </View>

      {/* Aligned Right Selection Container */}
      <View className="h-7 w-7 items-center justify-center">
        {selected ? (
          <View className="h-7 w-7 items-center justify-center rounded-full border border-sage-700 bg-sage-600 shadow-xs">
            <SymbolView
              name="checkmark"
              size={13}
              tintColor="#FFFFFF"
              weight="heavy"
            />
          </View>
        ) : (
          <View className="h-6 w-6 rounded-full border-2 border-brand-border-strong bg-brand-surface-soft/60" />
        )}
      </View>
    </Pressable>
  );
}

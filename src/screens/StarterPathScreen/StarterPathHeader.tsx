import React from "react";
import { Pressable, View } from "react-native";
import { SymbolView } from "expo-symbols";
import { ScreenLayout } from "@/src/components/ui/ScreenLayout";

import type { StarterPathV1 } from "@/src/domains/journey/model/starterPath";

export type StarterStep = "goal" | "lesson" | "practice";

interface StarterPathHeaderProps {
  step: StarterStep;
  path?: StarterPathV1;
  translate: (key: string) => string;
  onBack: () => void;
}

// ponytail: benchmark progress bar header with back arrow matching Duolingo / Finch
export function StarterPathHeader({
  step,
  translate,
  onBack,
}: StarterPathHeaderProps): React.JSX.Element {
  const progressPercent = step === "goal" ? 33 : step === "lesson" ? 66 : 100;

  return (
    <ScreenLayout.Header className="bg-brand-surface border-b border-brand-border/40">
      <View className="flex-row items-center gap-3 py-1">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={translate("starter_path.back")}
          onPress={onBack}
          className="h-9 w-9 items-center justify-center rounded-full bg-black/[0.04] active:bg-black/[0.08]"
          hitSlop={8}
        >
          <SymbolView
            name="arrow.left"
            size={18}
            tintColor="#4F604F"
            weight="semibold"
          />
        </Pressable>

        <View className="h-2.5 flex-1 rounded-full bg-stone-200/70 overflow-hidden">
          <View
            className="h-full rounded-full bg-sage-500"
            style={{ width: `${progressPercent}%` }}
          />
        </View>

        <View className="w-9" />
      </View>
    </ScreenLayout.Header>
  );
}

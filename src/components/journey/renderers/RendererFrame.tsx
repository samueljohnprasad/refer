import React from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { SAGE, TERRACOTTA } from "@/lib/tokens";
import { PressableScale } from "@/src/components/ui/PressableScale";
import StageProgressBar from "@/src/components/ui/StageProgressBar";
import { Button } from "@/src/components/ui/Button";

export function getDisplayXp(xpReward?: number): number {
  return xpReward && xpReward > 0 ? xpReward : 10;
}

export function RendererTopProgress({
  progress,
  xpReward,
  onClose,
}: {
  progress: number;
  xpReward?: number;
  onClose: () => void;
}): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const clampedProgress = Math.max(0, Math.min(1, progress));

  return (
    <View
      className="flex-row items-center gap-3 px-7 pb-4"
      style={{ paddingTop: Math.max(insets.top + 20, 56) }}
    >
      <PressableScale
        onPress={onClose}
        scale={0.9}
        hapticStyle="light"
        style={{
          minHeight: 44,
          minWidth: 44,
          alignItems: "center",
          justifyContent: "center",
        }}
        accessibilityLabel="Close activity"
        accessibilityRole="button"
      >
        <Text className="happy-font-body-bold text-[20px] text-sage-700">
          X
        </Text>
      </PressableScale>

      <View className="flex-1">
        <StageProgressBar
          progress={clampedProgress}
          fillColor={TERRACOTTA}
          trackColor={SAGE[100]}
        />
      </View>

      <Text className="happy-font-body-bold min-w-[54px] text-right text-[14px] text-terracotta">
        +{getDisplayXp(xpReward)} XP
      </Text>
    </View>
  );
}

export function RendererTitleBlock({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}): React.JSX.Element {
  return (
    <View className="px-8 pb-4 pt-1">
      <Text className="happy-brand-eyebrow mb-2 text-center text-[11px]">
        {eyebrow}
      </Text>
      <Text className="happy-font-heading-bold text-[26px] leading-[32px] text-ink">
        {title}
      </Text>
      {subtitle ? (
        <Text className="happy-font-body-medium mt-3 text-[15px] leading-[22px] text-ink-soft">
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

export function RendererSectionCard({
  eyebrow,
  children,
  className = "",
}: {
  eyebrow?: string;
  children: React.ReactNode;
  className?: string;
}): React.JSX.Element {
  return (
    <View className={`happy-brand-preview-tile rounded-[28px] p-4 ${className}`}>
      {eyebrow ? <Text className="happy-brand-eyebrow mb-4">{eyebrow}</Text> : null}
      {children}
    </View>
  );
}

export function RendererPrimaryCTA({
  label,
  onPress,
  disabled = false,
  tone = "sage",
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  tone?: "sage" | "terracotta";
}): React.JSX.Element {
  return (
    <Button
      label={label}
      onPress={onPress}
      disabled={disabled}
      variant={tone === "terracotta" ? "incorrect" : "primary"}
      fullWidth
    />
  );
}

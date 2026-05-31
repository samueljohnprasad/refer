import React from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { SAGE, TERRACOTTA } from "@/lib/tokens";
import { PressableScale } from "@/src/components/ui/PressableScale";
import { LessonHeader } from "@/src/components/ui/LessonHeader";
import { Button } from "@/src/components/ui/Button";
import { Card } from "@/src/components/ui/Card";

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
    <View style={{ paddingTop: Math.max(insets.top + 8, 48) }}>
      <LessonHeader
        onClose={onClose}
        progress={clampedProgress}
        trailingLabel={`+${getDisplayXp(xpReward)} XP`}
        style={{ paddingHorizontal: 28 }}
      />
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
    <Card
      variant="tile"
      radius="xl"
      showDepth={false}
      className={className}
      contentClassName="p-4"
    >
      {eyebrow ? <Text className="happy-brand-eyebrow mb-4">{eyebrow}</Text> : null}
      {children}
    </Card>
  );
}

export function RendererPrimaryCTA({
  label,
  onPress,
  disabled = false,
  loading = false,
  tone = "sage",
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  tone?: "sage" | "terracotta";
}): React.JSX.Element {
  return (
    <Button
      label={label}
      onPress={onPress}
      disabled={disabled}
      loading={loading}
      variant={tone === "terracotta" ? "incorrect" : "primary"}
      fullWidth
    />
  );
}

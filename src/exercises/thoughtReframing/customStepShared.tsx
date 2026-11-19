// ponytail: every step opens the same way (.agents/thought-reframing.html `head()`): Happi, and the one
// question in her bubble with a plain line under it. The flow runner owns the footer and scrolling.
import React from "react";
import { View } from "react-native";
import { StepHappiTitle } from "@/src/components/exercise/steps/StepHappiTitle";

function StepShell({ children }: { children: React.ReactNode }) {
  return <View className="flex-1">{children}</View>;
}

function StepTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return <StepHappiTitle title={title} subtitle={subtitle || undefined} />;
}

export { StepShell, StepTitle };

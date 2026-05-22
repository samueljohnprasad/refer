import React from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

export function Section({ title, children }: SectionProps) {
  return (
    <View className="px-5 mt-8">
      <Text className="happy-brand-eyebrow mb-3">{title}</Text>
      <View className="happy-brand-card rounded-2xl p-4">{children}</View>
    </View>
  );
}

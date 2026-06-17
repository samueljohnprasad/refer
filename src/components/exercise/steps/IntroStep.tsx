import React from "react";
import { View, ScrollView, Pressable } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { Mascot } from "@/src/components/ui/Mascot";
import { Button } from "@/src/components/ui/Button";
import { FadeInItem } from "@/src/components/ui/FadeInItem";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Timer01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { INK_MUTED, SAGE } from "@/lib/tokens";
import type { StepProps } from "@/src/types/exerciseFlow";

interface IntroStepProps extends StepProps {
  title: string;
  subtitle: string;
  exerciseType?: string;
  icon?: string;
  duration: string;
  bulletPoints?: string[];
}

export const IntroStep: React.FC<IntroStepProps> = React.memo(
  ({ title, subtitle, duration, bulletPoints, onNext, onClose }) => {
    return (
      <View className="flex-1 items-center pt-4 pb-4">
          {onClose && (
            <Pressable
              onPress={onClose}
              className="absolute top-2 right-4 z-50 h-10 w-10 items-center justify-center rounded-full bg-brand-surface/80"
              accessibilityRole="button"
              accessibilityLabel="Close"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={24} color={INK_MUTED} />
            </Pressable>
          )}
          {/* Brand Mascot illustration replacing generic blue icon wells */}
          <FadeInItem index={0}>
            <View className="items-center justify-center mb-3">
              <Mascot state="panda-happy" size={90} />
            </View>
          </FadeInItem>

          <FadeInItem index={1}>
            <Text variant="h1" className="text-center mb-1.5">
              {title}
            </Text>
          </FadeInItem>

          <FadeInItem index={2}>
            <Text variant="body" color="soft" className="text-center mb-4 leading-relaxed">
              {subtitle}
            </Text>
          </FadeInItem>

          <FadeInItem index={3}>
            <View className="bg-sage-pill rounded-full px-4 py-1.5 mb-4 flex-row items-center">
              <HugeiconsIcon
                icon={Timer01Icon}
                size={14}
                color={SAGE[600]}
                strokeWidth={2}
              />
              <Text variant="chip" color="sage" className="ml-1.5 uppercase tracking-widest happy-font-body-bold">
                {duration}
              </Text>
            </View>
          </FadeInItem>

          {bulletPoints && bulletPoints.length > 0 && (
            <View className="w-full">
              {bulletPoints.map((point: string, i: number) => (
                <FadeInItem key={i} index={4 + i} delayPerItem={60}>
                  <View className="flex-row items-center mb-2 px-4 py-3 bg-brand-surface border border-brand-border/60 rounded-2xl shadow-sm">
                    <View className="w-2 h-2 rounded-full bg-sage-500 mr-3.5" />
                    <Text variant="body-bold" color="ink" className="flex-1 leading-normal text-[14px]">
                      {point}
                    </Text>
                  </View>
                </FadeInItem>
              ))}
            </View>
          )}
      </View>
    );
  },
);

IntroStep.displayName = "IntroStep";

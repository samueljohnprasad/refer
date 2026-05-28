import React from "react";
import { View, ScrollView } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { Mascot } from "@/src/components/ui/Mascot";
import { Button } from "@/src/components/ui/Button";
import { FadeInItem } from "@/src/components/ui/FadeInItem";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Timer01Icon } from "@hugeicons/core-free-icons";
import { SAGE } from "@/lib/tokens";
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
  ({ title, subtitle, duration, bulletPoints, onNext }) => {
    return (
      <View className="flex-1 w-full justify-between">
        {/* Scrollable Upper Body — keeps content beautifully scrollable on smaller screens */}
        <ScrollView
          className="flex-1 w-full"
          contentContainerStyle={{
            alignItems: "center",
            paddingHorizontal: 4,
            paddingBottom: 24,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Brand Mascot illustration replacing generic blue icon wells */}
          <FadeInItem index={0}>
            <View className="items-center justify-center mt-2 mb-6">
              <Mascot state="panda-happy" size={110} />
            </View>
          </FadeInItem>

          <FadeInItem index={1}>
            <Text variant="h1" className="text-center mb-2.5">
              {title}
            </Text>
          </FadeInItem>

          <FadeInItem index={2}>
            <Text variant="body" color="soft" className="text-center mb-6 leading-relaxed">
              {subtitle}
            </Text>
          </FadeInItem>

          <FadeInItem index={3}>
            <View className="bg-sage-pill rounded-full px-4 py-1.5 mb-6 flex-row items-center">
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
                  <View className="flex-row items-center mb-3 px-4 py-3.5 bg-brand-surface border border-brand-border/60 rounded-2xl shadow-sm">
                    <View className="w-2 h-2 rounded-full bg-sage-500 mr-3.5" />
                    <Text variant="body-bold" color="ink" className="flex-1 leading-normal text-[15px]">
                      {point}
                    </Text>
                  </View>
                </FadeInItem>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Pinned Bottom primary CTA — GUARANTEED to be visible and never pushed off-screen */}
        <FadeInItem index={4 + (bulletPoints?.length ?? 0)} className="w-full pt-3 pb-2 bg-[#F8FAF7]">
          <Button
            label="Let's Go"
            variant="primary"
            size="lg"
            onPress={onNext}
            className="w-full"
          />
        </FadeInItem>
      </View>
    );
  },
);

IntroStep.displayName = "IntroStep";

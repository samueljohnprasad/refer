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
      <View className="flex-1 items-center pt-4 pb-4 w-full relative">


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
            <View className="bg-transparent rounded-full px-4 py-1.5 mb-4 flex-row items-center">
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
            <View className="w-full mt-4 px-10">
              {bulletPoints.map((point: string, i: number) => {
                const isLast = i === bulletPoints.length - 1;
                return (
                  <FadeInItem key={i} index={4 + i} delayPerItem={90}>
                    <View className="flex-row items-start">
                      {/* Timeline column */}
                      <View className="items-center mr-5">
                        {/* Node */}
                        <View className="w-6 h-6 rounded-full bg-sage-100 border-2 border-sage-500 items-center justify-center z-10 mt-0.5">
                          <Text variant="chip" className="text-[10px] font-bold text-sage-800" style={{ lineHeight: 12 }}>
                            {i + 1}
                          </Text>
                        </View>
                        {/* Connecting Line */}
                        {!isLast && (
                          <View className="w-px h-8 bg-sage-200 mt-1.5 mb-1.5" />
                        )}
                      </View>
                      
                      {/* Content column */}
                      <View className="flex-1 pb-2">
                        <Text variant="body-bold" color="ink" className="leading-relaxed text-[15px] mt-0.5">
                          {point}
                        </Text>
                      </View>
                    </View>
                  </FadeInItem>
                );
              })}
            </View>
          )}
      </View>
    );
  },
);

IntroStep.displayName = "IntroStep";

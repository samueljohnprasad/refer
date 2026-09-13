import React from "react";
import { Pressable, Text, View } from "react-native";
import type { TeachBackStep } from "./teachBackChainContent";

// ponytail: quiet reference block with learner-facing accent and tight vertical footprint
export function ReferenceBlock({ message }: { message: string }) {
  return (
    <View className="mb-3 border-l-[3px] border-[#5F7F58] py-0 pl-2.5">
      <Text className="happy-font-body-bold text-[10.5px] uppercase tracking-[0.5px] text-[#5F7F58]">
        REMEMBER
      </Text>
      <Text className="happy-font-body mt-0.5 text-[13.5px] leading-[19px] text-[#554E44]">
        {message}
      </Text>
    </View>
  );
}

// ponytail: single transforming chain card that reveals BREAK THE LOOP without spawning duplicate cards
export function EvolvingChainCard({
  completedSteps,
  breakTheLoopText = null,
}: {
  completedSteps: TeachBackStep[];
  breakTheLoopText?: string | null;
}) {
  if (completedSteps.length === 0) return null;

  return (
    <View className="mb-5 rounded-[24px] border border-[#EAE2D5] bg-[#FBF8F2] p-4.5">
      <Text className="happy-font-body-bold mb-3 text-[11px] uppercase tracking-[0.55px] text-[#82796A]">
        THE WORRY LOOP
      </Text>
      <View className="gap-2">
        {completedSteps.map((step, index) => (
          <React.Fragment key={step.id}>
            {index > 0 ? (
              <View className="items-center py-0.5">
                <Text className="happy-font-body-bold text-xs text-[#829A78]">
                  ↓
                </Text>
              </View>
            ) : null}
            <View className="flex-row items-center gap-3">
              <View className="h-6 w-6 items-center justify-center rounded-full bg-[#EAE2D5]">
                <Text className="happy-font-body-bold text-xs text-[#554E44]">
                  {index + 1}
                </Text>
              </View>
              <Text className="happy-font-body-semibold flex-1 text-[14.5px] leading-5 text-[#201E1D]">
                {step.label}
              </Text>
            </View>
          </React.Fragment>
        ))}
      </View>

      {breakTheLoopText ? (
        <>
          <View className="my-3.5 h-px bg-[#EAE2D5]" />
          <Text className="happy-font-body-bold text-[11px] uppercase tracking-[0.55px] text-[#29452A]">
            BREAK THE LOOP
          </Text>
          <Text className="happy-font-heading-bold mt-1 text-[15px] leading-[21px] text-[#201E1D]">
            {breakTheLoopText}
          </Text>
        </>
      ) : null}
    </View>
  );
}

interface TactileChoiceButtonProps {
  label: string;
  isCorrectBriefly?: boolean;
  isIncorrect?: boolean;
  feedbackText?: string | null;
  disabled?: boolean;
  onPress: () => void;
}

// ponytail: secondary tactile button with lightweight warm inline annotation
export function TactileChoiceButton({
  label,
  isCorrectBriefly = false,
  isIncorrect = false,
  feedbackText = null,
  disabled = false,
  onPress,
}: TactileChoiceButtonProps) {
  let shelfColor = "#D8CEBF";
  let borderStyle = "border-[#E2DAD0]";
  let bgStyle = "bg-white";
  let textColor = "text-[#201E1D]";

  if (isCorrectBriefly) {
    shelfColor = "#8FA885";
    borderStyle = "border-[#ABC0A2]";
    bgStyle = "bg-[#F2F8EF]";
    textColor = "text-[#1B3B2B]";
  } else if (isIncorrect) {
    shelfColor = "#C98F80";
    borderStyle = "border-[#D9A394]";
    bgStyle = "bg-[#FDF9F6]";
    textColor = "text-[#3D2C28]";
  }

  return (
    <View className="gap-1">
      <View className="relative w-full pb-[3px]">
        <View
          style={{ backgroundColor: shelfColor }}
          className="absolute inset-x-0 bottom-0 top-[3px] rounded-[18px]"
        />
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled }}
          disabled={disabled}
          onPress={onPress}
          className={`min-h-[56px] justify-center rounded-[18px] border-[1.5px] ${borderStyle} ${bgStyle} px-4 py-3.5 active:translate-y-[3px]`}
        >
          <Text className={`happy-font-body-bold text-[15px] leading-[21px] ${textColor}`}>
            {label}
          </Text>
        </Pressable>
      </View>
      {isIncorrect && feedbackText ? (
        <View className="mt-1 border-l-[3px] border-[#D9A394] py-1 pl-3">
          <Text className="happy-font-body-bold text-[10.5px] uppercase tracking-[0.5px] text-[#A85848]">
            NOT YET
          </Text>
          <Text className="happy-font-body mt-0.5 text-[13px] leading-[18px] text-[#554E44]">
            {feedbackText}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

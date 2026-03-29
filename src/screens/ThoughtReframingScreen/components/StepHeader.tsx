import React from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";

interface StepHeaderProps {
  title: string;
  subtitle: string;
  progress: number;
  stepNumber: number;
  totalSteps: number;
  /** Accent color for the progress bar fill. Defaults to Duolingo-green. */
  accentColor?: string;
}

export const StepHeader: React.FC<StepHeaderProps> = React.memo(
  ({
    title,
    subtitle,
    progress,
    stepNumber,
    totalSteps,
    accentColor = "#58CC02",
  }) => {
    const pct: number = Math.round(progress * 100);

    return (
      <View className="mb-6">
        {/* ── Duolingo-style thick progress bar ── */}
        <View className="flex-row items-center mb-2">
          <View className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <View
              className="h-full rounded-full"
              style={{ width: `${pct}%`, backgroundColor: accentColor }}
            />
          </View>
          <Text className="text-xs font-bold text-slate-500 ml-3 min-w-[32px] text-right">
            {pct}%
          </Text>
        </View>

        {/* Step indicator dots */}
        <View className="flex-row items-center justify-center mb-5 gap-1.5">
          {Array.from({ length: totalSteps }, (_, i: number) => (
            <View
              key={i}
              className={`rounded-full ${i + 1 < stepNumber
                ? "h-2 w-2"
                : i + 1 === stepNumber
                  ? "h-2.5 w-2.5"
                  : "h-2 w-2"
                }`}
              style={{
                backgroundColor:
                  i + 1 < stepNumber
                    ? accentColor
                    : i + 1 === stepNumber
                      ? accentColor
                      : "#E2E8F0",
                opacity:
                  i + 1 === stepNumber ? 1 : i + 1 < stepNumber ? 0.6 : 0.4,
              }}
            />
          ))}
        </View>

        {/* Title — bigger, bolder */}
        <Text className="text-[26px] font-extrabold text-slate-900 mb-1.5 leading-tight">
          {title}
        </Text>

        {/* Subtitle */}
        <Text className="text-[15px] text-slate-500 leading-relaxed">
          {subtitle}
        </Text>
      </View>
    );
  },
);

StepHeader.displayName = "StepHeader";

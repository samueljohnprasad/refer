import React from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/Text";
import type { EmotionRating } from "../types";
import { EMOTION_OPTIONS, type EmotionOption } from "../data/emotions";

interface EmotionShiftBarProps {
  emotions: EmotionRating[];
}

/**
 * Displays before → after emotion intensity comparison bars.
 */
export const EmotionShiftBar: React.FC<EmotionShiftBarProps> = React.memo(
  ({ emotions }) => {
    return (
      <View className="gap-3">
        {emotions.map((emotion: EmotionRating) => {
          const option: EmotionOption | undefined = EMOTION_OPTIONS.find(
            (e) => e.name === emotion.name,
          );
          const label: string = option?.label ?? emotion.name;
          const emoji: string = option?.emoji ?? "😶";
          const shift: number =
            emotion.initial_intensity - emotion.final_intensity;
          const isReduced: boolean = shift > 0;
          const isIncreased: boolean = shift < 0;

          return (
            <View
              key={emotion.name}
              className="bg-white rounded-2xl p-4"
              style={{ borderWidth: 2, borderColor: "#E2E8F0" }}
            >
              {/* Emotion label row */}
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center">
                  <Text className="text-xl mr-2">{emoji}</Text>
                  <Text className="text-[15px] font-bold text-slate-700">
                    {label}
                  </Text>
                </View>
                <View
                  className="px-2.5 py-1 rounded-full"
                  style={{
                    backgroundColor: isReduced
                      ? "#D1FAE5"
                      : isIncreased
                        ? "#FEE2E2"
                        : "#F1F5F9",
                  }}
                >
                  <Text
                    className="text-xs font-extrabold"
                    style={{
                      color: isReduced
                        ? "#047857"
                        : isIncreased
                          ? "#DC2626"
                          : "#64748B",
                    }}
                  >
                    {isReduced
                      ? `−${shift}`
                      : isIncreased
                        ? `+${Math.abs(shift)}`
                        : "No change"}
                  </Text>
                </View>
              </View>

              {/* Before bar */}
              <View className="mb-3">
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                    Before
                  </Text>
                  <Text className="text-xs font-bold text-slate-500">
                    {emotion.initial_intensity ?? 0}/10
                  </Text>
                </View>
                <View className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <View
                    className="h-full bg-slate-400 rounded-full"
                    style={{
                      width: `${(emotion.initial_intensity ?? 0) * 10}%`,
                    }}
                  />
                </View>
              </View>

              {/* After bar */}
              <View>
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                    After
                  </Text>
                  <Text className="text-xs font-bold text-slate-500">
                    {emotion.final_intensity ?? 0}/10
                  </Text>
                </View>
                <View className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <View
                    className="h-full rounded-full"
                    style={{
                      width: `${(emotion.final_intensity ?? 0) * 10}%`,
                      backgroundColor: isReduced ? "#22C55E" : "#94A3B8",
                    }}
                  />
                </View>
              </View>
            </View>
          );
        })}
      </View>
    );
  },
);

EmotionShiftBar.displayName = "EmotionShiftBar";

import React, { useEffect, useMemo } from "react";
import { Text, View } from "react-native";
import Slider from "@react-native-community/slider";
import { CartesianChart, Line } from "victory-native-v4";
import { Circle, useFont } from "@shopify/react-native-skia";
import { APP_FONT_ASSETS } from "@/src/theme/typography";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import {
  readNumber,
  readRecord,
  readString,
} from "@/src/components/exercise/courseExerciseContent";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

export function SurgeTimerCategoryEngine({
  exercise,
  savedResponse,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  
  const progress = readNumber(saved?.progress) ?? 0;
  const maxProgressReached = readNumber(saved?.maxProgressReached) ?? 0;
  
  const completed = maxProgressReached >= 80;

  const WAVE_DATA = useMemo(() => {
    return Array.from({ length: 141 }).map((_, i) => {
      const realX = i - 30; // realX in [-30, 110]
      let y = 0;
      if (realX >= 0) {
        const t = realX / 10;
        y = 100 * Math.pow(0.5, t / 3);
      } else {
        const t = realX / 10;
        y = 100 * Math.exp(-Math.pow(t, 2) / 2);
      }
      return { x: i, y }; // use index as X so domain is strictly 0 to 140
    });
  }, []);

  useEffect(() => {
    if (!saved) {
      onInteraction(createResponse({ progress: 0, maxProgressReached: 0 }), false);
    }
  }, [onInteraction, saved]);

  const updateProgress = (nextProgress: number) => {
    const nextMax = Math.max(maxProgressReached, nextProgress);
    const isCompleted = nextMax >= 80;
    onInteraction(createResponse({ progress: nextProgress, maxProgressReached: nextMax }), isCompleted);
  };

  const stage = getQualitativeStage(progress);
  const font = useFont(APP_FONT_ASSETS.regular, 12);

  return (
    <View className="px-2 pb-5 pt-1.5">
      <CourseExerciseHeading
        title={readString(content.title) ?? "The alert wave has a timer"}
        instruction={readString(content.instruction) ?? "Drag forward from the peak."}
      />

      <View className="mt-4 pb-2">
        {/* Wave Stage Interpretation */}
        <View className="items-center py-5 min-h-[110px] justify-center">
          <Text className="happy-font-heading-bold text-[22px] tracking-[1px] text-[#29452A] mb-2 uppercase text-center">
             {stage.label}
          </Text>
          <Text className="happy-font-body text-[16px] leading-[22px] text-[#3F3A34] text-center px-4">
             {stage.desc}
          </Text>
        </View>

        {/* Victory Native Chart */}
        <View style={{ width: "100%", height: 120, paddingHorizontal: 4, backgroundColor: "rgba(255,0,0,0.1)" }}>
          {font ? (
          <CartesianChart
            data={WAVE_DATA}
            xKey="x"
            yKeys={["y"]}
            domainPadding={{ left: 20, right: 20, top: 20, bottom: 20 }}
            axisOptions={{
                font,
                tickCount: { x: 0, y: 0 },
            }}
          >
            {({ points }: any) => {
              if (!points || !points.y || !points.y.length) return null;

              // x is exactly i (0 to 140). progress is 0 to 100.
              // We want progress=0 to correspond to the peak which is at realX=0, i.e., i=30.
              const exactIndex = progress + 30; 
              const lower = Math.floor(exactIndex);
              const upper = Math.ceil(exactIndex);
              const weight = exactIndex - lower;

              // Safeguard indexing
              const p1 = points.y[lower] || points.y[points.y.length - 1];
              const p2 = points.y[upper] || p1;

              let markerX = 0;
              let markerY = 0;
              if (p1 && p2) {
                markerX = p1.x + (p2.x - p1.x) * weight;
                markerY = p1.y + (p2.y - p1.y) * weight;
              }

              const isMarkerValid = !Number.isNaN(markerX) && !Number.isNaN(markerY) && p1;

              return (
                <>
                  <Line 
                    points={points.y} 
                    color="#ABC0A2" 
                    strokeWidth={4} 
                    curveType="natural" 
                  />
                  {isMarkerValid && (
                    <Circle cx={markerX} cy={markerY} r={8} color="#29452A" />
                  )}
                </>
              );
            }}
          </CartesianChart>
          ) : null}
        </View>

        {/* Timeline Slider */}
        <View className="w-full px-2 mt-1">
          <Slider
            accessibilityLabel="Elapsed time since peak"
            accessibilityRole="adjustable"
            accessibilityValue={{ min: 0, max: 100, now: progress }}
            minimumValue={0}
            maximumValue={100}
            step={1}
            value={progress}
            onValueChange={updateProgress}
            minimumTrackTintColor="#E8E1D7"
            maximumTrackTintColor="#E8E1D7"
            thumbTintColor="#5F7F58"
            style={{ height: 44, width: "100%" }}
          />
          <View className="flex-row justify-between mt-0.5 px-1">
            <Text className="happy-font-body-bold text-[11px] text-[#82796A] tracking-[0.5px]">PEAK</Text>
            <Text className="happy-font-body-bold text-[11px] text-[#82796A] tracking-[0.5px]">+10 MIN</Text>
          </View>
        </View>
      </View>

      {completed ? (
        <View className="mt-8 mb-2">
          <View className="flex-row items-center justify-center mb-3.5 gap-2">
            <Text className="happy-font-body-bold text-[#185A37] text-[15px]">✓</Text>
            <Text className="happy-font-body-bold text-[11.5px] text-[#82796A] uppercase tracking-[0.7px]">
              YOU WATCHED THE WAVE FALL
            </Text>
          </View>
          
          <View className="rounded-[22px] bg-[#F2F8EF] px-5 py-[18px]">
            <Text className="happy-font-body-bold mb-1.5 text-[11px] tracking-[0.8px] text-[#29452A] uppercase">
              REMEMBER THIS
            </Text>
            <Text className="happy-font-body text-[15px] leading-[22px] text-[#3F4A31]">
              {readString(content.numberToKeep) ?? "The peak does not last forever. The body can begin settling even before you find the perfect technique."}
            </Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}

function createResponse(extra: Record<string, unknown> = {}) {
  return {
    format: CourseExerciseCategoryEnum.SurgeTimer,
    phase: "timer",
    progress: 0,
    maxProgressReached: 0,
    isCorrect: true,
    ...extra,
  };
}

function getQualitativeStage(progress: number) {
  if (progress < 20) return { label: "VERY HIGH", desc: "The surge is still strong." };
  if (progress < 50) return { label: "FADING", desc: "The surge is already coming down." };
  if (progress < 80) return { label: "LOWER", desc: "Your body is beginning to settle." };
  return { label: "MUCH LOWER", desc: "Much of the surge has passed." };
}

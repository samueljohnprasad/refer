import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import Slider from "@react-native-community/slider";
import Svg, { Line, Polyline, Text as SvgText } from "react-native-svg";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import {
  readNumber,
  readRecord,
  readString,
} from "@/src/components/exercise/courseExerciseContent";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

const WAVE_ANIMATION_MS = 1800;
const WAVE_POINT_COUNT = 80;

export function PanicWaveCommitCategoryEngine({
  exercise,
  savedResponse,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const phase = readCommitPhase(saved?.phase);
  const guess = readNumber(saved?.guess) ?? 8;
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    if (!saved) onInteraction(createResponse(), true);
  }, [onInteraction, saved]);

  useEffect(() => {
    if (phase !== "running") return;
    const startedAt = Date.now();
    setAnimationProgress(0);
    const timer = setInterval(() => {
      const progress = Math.min(
        (Date.now() - startedAt) / WAVE_ANIMATION_MS,
        1,
      );
      setAnimationProgress(progress);
      if (progress >= 1) {
        clearInterval(timer);
        onInteraction(createResponse({ phase: "revealed", guess }), true);
      }
    }, 32);
    return () => clearInterval(timer);
  }, [guess, onInteraction, phase]);

  const shownProgress = phase === "revealed" ? 1 : animationProgress;
  const curvePoints = phase === "ready" ? "" : createWavePoints(shownProgress);
  const guessX = minuteToX(Math.min(guess, 20));

  const updateGuess = (nextGuess: number) => {
    if (phase !== "ready") return;
    onInteraction(createResponse({ guess: Math.round(nextGuess) }), true);
  };

  return (
    <View className="flex-1 px-2 pb-3 pt-1.5">
      <CourseExerciseHeading
        title={readString(content.title) ?? "The panic wave: commit your guess"}
        instruction={
          readString(content.instruction) ?? "Commit before the reveal."
        }
      />

      <View className="rounded-[24px] bg-[#F9F4ED] px-3 pb-3 pt-3.5 shadow-md shadow-black/10">
        <Svg
          height={150}
          width="100%"
          viewBox="0 0 300 150"
          accessibilityLabel="A panic wave over twenty minutes"
        >
          <Line
            x1="14"
            y1="132"
            x2="292"
            y2="132"
            stroke="#DCD3C4"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {phase !== "ready" ? (
            <>
              <Line
                x1={guessX}
                y1="18"
                x2={guessX}
                y2="136"
                stroke="#7A8A5E"
                strokeWidth="2"
                strokeDasharray="4 4"
                strokeLinecap="round"
              />
              <SvgText
                x={guessX}
                y="12"
                fill="#56633F"
                fontSize="9"
                fontWeight="700"
                textAnchor="middle"
              >
                {guess >= 21 ? "your guess: never" : "your guess"}
              </SvgText>
            </>
          ) : null}
          <Polyline
            points={curvePoints}
            fill="none"
            stroke="#C67139"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <SvgText x="14" y="146" fill="#82796A" fontSize="9" fontWeight="700">
            0 min
          </SvgText>
          <SvgText
            x="153"
            y="146"
            fill="#82796A"
            fontSize="9"
            fontWeight="700"
            textAnchor="middle"
          >
            10 min
          </SvgText>
          <SvgText
            x="292"
            y="146"
            fill="#82796A"
            fontSize="9"
            fontWeight="700"
            textAnchor="end"
          >
            20 min
          </SvgText>
        </Svg>

        <View className="mt-1 flex-row items-baseline justify-between gap-2 px-1">
          <Text className="happy-font-body-bold text-[13.5px] text-[#201E1D]">
            My guess
          </Text>
          <Text
            className={
              guess >= 21
                ? "happy-font-body-bold text-xs text-[#8C491A]"
                : "happy-font-body-bold text-xs text-[#56633F]"
            }
          >
            {guess >= 21
              ? "it never comes down"
              : `about ${guess} minute${guess > 1 ? "s" : ""}`}
          </Text>
        </View>
        <Slider
          accessibilityLabel="Your guess in minutes; the far right means never"
          disabled={phase !== "ready"}
          minimumTrackTintColor="#C67139"
          maximumTrackTintColor="#DCD3C4"
          minimumValue={1}
          maximumValue={21}
          step={1}
          thumbTintColor="#C67139"
          value={guess}
          onValueChange={updateGuess}
          style={{ height: 40, width: "100%" }}
        />
        <View className="flex-row justify-between px-1">
          <Text className="happy-font-body-bold text-[11px] text-[#82796A]">
            1 min
          </Text>
          <Text className="happy-font-body-bold text-[11px] text-[#82796A]">
            20 min
          </Text>
          <Text className="happy-font-body-bold text-[11px] text-[#8C491A]">
            never
          </Text>
        </View>
      </View>

      {phase === "revealed" ? (
        <View className="mt-3 gap-2 rounded-[24px] bg-[#F9F4ED] px-[22px] py-5 shadow-md shadow-black/10">
          <Text className="happy-font-heading-bold text-xl leading-[26px] text-[#56633F]">
            {readString(content.rule)}
          </Text>
          <Text className="happy-font-body text-sm leading-[22px] text-[#201E1D]">
            {getGuessExplanation(content, guess)}
          </Text>
          <Text className="happy-font-body-bold mt-1 text-[13px] leading-5 text-[#56633F]">
            {readString(content.safetyNote)}
          </Text>
        </View>
      ) : null}

      <Text className="happy-font-body mt-3 text-center text-[12.5px] leading-[18px] text-[#82796A]">
        Committing first — even to “never” — is what makes the answer stick.
      </Text>
    </View>
  );
}

function createResponse(extra: Record<string, unknown> = {}) {
  return {
    format: CourseExerciseCategoryEnum.PanicWaveCommit,
    phase: "ready",
    guess: 8,
    isCorrect: true,
    ...extra,
  };
}

function readCommitPhase(value: unknown): "ready" | "running" | "revealed" {
  return value === "running" || value === "revealed" ? value : "ready";
}

function createWavePoints(progress: number): string {
  const shownPoints = Math.max(1, Math.round(WAVE_POINT_COUNT * progress));
  return Array.from({ length: shownPoints + 1 }, (_, index) => {
    const minute = (index / WAVE_POINT_COUNT) * 20;
    const wave =
      minute < 1.5
        ? 15 + 77 * (minute / 1.5)
        : 15 + 77 * Math.exp(-(minute - 1.5) / 3.5);
    return `${minuteToX(minute).toFixed(1)},${(138 - wave * 1.28).toFixed(1)}`;
  }).join(" ");
}

function minuteToX(minute: number): number {
  return 14 + minute * (278 / 20);
}

function getGuessExplanation(
  content: Record<string, unknown>,
  guess: number,
): string | null {
  if (guess >= 21) return readString(content.neverGuess);
  if (guess <= 3) return readString(content.shortGuess);
  if (guess <= 12) return readString(content.closeGuess);
  return readString(content.longGuess);
}

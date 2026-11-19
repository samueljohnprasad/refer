// ponytail: .agents/thought-reframing.html's belief step — the thought as weather, a big readout and a
// 10-cell scale. The post step keeps where you started visible (a sun-coloured notch) and says, honestly,
// whether it got lighter, stayed, or got heavier. Writes the same fields (`intensity` / `postIntensity`).
import React from "react";
import { View } from "react-native";
import { PrototypeSlider } from "@/src/components/exercise/PrototypeSlider";
import { Text } from "@/src/components/ui/Text";
import { StepLayout } from "@/src/components/exercise/steps/StepLayout";
import { ThoughtSky } from "@/src/domains/exercises/ui/presentation/components/ReframingArt";
import type { StepProps, ThoughtReframingResponse } from "@/src/types/exerciseFlow";

const WORD = (v: number): string => (v === 0 ? "Not at all" : v <= 3 ? "A little" : v <= 6 ? "Partly" : v <= 9 ? "Mostly" : "Completely");

function compare(before: number, after: number): { text: string; good: boolean } {
  const d = before - after;
  if (d > 0) return { text: `Lighter than before: ${before} to ${after}.`, good: true };
  if (d === 0) return { text: `Same as before: ${after}.`, good: false };
  return { text: `Heavier than before: ${before} to ${after}.`, good: false };
}

interface Props extends StepProps {
  fieldKey: "intensity" | "postIntensity";
  title: string;
  subtitle: string;
}

export function TRBeliefSliderStep(p: Props): React.JSX.Element {
  const { onUpdate, fieldKey, title, subtitle } = p;
  const response = p.response as ThoughtReframingResponse;
  const before = response.intensity ?? 5;
  const isPost = fieldKey === "postIntensity";
  // the after-rating starts at the before-rating, so moving nothing reads as "same", never a made-up improvement
  const raw = response[fieldKey];
  const value = Math.min(10, Math.max(0, typeof raw === "number" ? raw : before));
  const cmp = isPost ? compare(before, value) : null;

  return (
    <StepLayout
      title={title}
      subtitle={subtitle}
      progress={p.progress}
      stepIndex={p.stepIndex}
      totalSteps={p.totalSteps}
      canGoBack={p.canGoBack}
      isValid={p.isValid}
      onBack={p.onBack}
      onNext={p.onNext}
      isLoading={p.isSaving}
      showStepCount={false}
    >
      <View className="flex-1 px-2 pt-2">
        {response.automaticThought?.trim() ? (
          <View className="items-end mb-4">
            <Text className="text-t-foot font-semibold text-happy-label-3 mb-1">You thought</Text>
            <View className="max-w-[85%] px-4 py-3 rounded-2xl rounded-br-[4px] bg-happy-ink">
              <Text className="font-semibold text-white">{response.automaticThought.trim()}</Text>
            </View>
          </View>
        ) : null}

        <View className="rounded-[20px] overflow-hidden self-center w-full max-w-[260px]">
          <ThoughtSky value={value} />
        </View>

        <View className="flex-row items-baseline gap-2 mt-4 mb-2">
          <Text className="font-display text-[56px] leading-[52px] text-happy-label">{value}</Text>
          <Text className="text-t-lead font-bold text-happy-label-2">/10</Text>
          <Text className="ml-auto text-t-lead font-extrabold text-happy-label">{WORD(value)}</Text>
        </View>

        <PrototypeSlider
          value={value}
          label={title}
          valueText={WORD(value)}
          onChange={(v) => onUpdate({ [fieldKey]: v } as Partial<ThoughtReframingResponse>)}
        >
          {Array.from({ length: 10 }, (_, i) => (
            <View
              key={i}
              className="flex-1 rounded-lg"
              style={{
                backgroundColor: i < value ? "#5f7f58" : "#f7f7f7",
                borderWidth: i < value ? 0 : 2,
                borderColor: "#e5e5e5",
                borderBottomWidth: i < value ? 4 : 2,
                borderBottomColor: i < value ? "#29452a" : "#e5e5e5",
              }}
            >
              {isPost && i === before - 1 ? (
                <View
                  className="absolute self-center"
                  style={{ top: -10, borderWidth: 6, borderColor: "transparent", borderTopColor: "#e09a24" }}
                />
              ) : null}
            </View>
          ))}
        </PrototypeSlider>

        <View className="flex-row justify-between mt-2">
          <Text className="text-t-foot font-bold text-happy-label-2">Not true</Text>
          <Text className="text-t-foot font-bold text-happy-label-2">Completely true</Text>
        </View>

        {cmp ? (
          <Text className={`mt-2 text-t-foot font-semibold ${cmp.good ? "text-happy-accent" : "text-happy-label-3"}`} accessibilityLiveRegion="polite">
            {cmp.text}
          </Text>
        ) : null}
      </View>
    </StepLayout>
  );
}

import React, { useMemo } from "react";
import { View, ScrollView, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import {
  EMOTION_OPTIONS,
  type EmotionOption,
} from "../../ThoughtReframingScreen/data/emotions";
import type { GratitudeFormState } from "../types";

interface GratitudeSummaryStepProps {
  formState: GratitudeFormState;
  onSave: () => void;
  onDone: () => void;
  isSaving: boolean;
}

interface SectionProps {
  label: string;
  children: React.ReactNode;
}

const ACCENT = "#58CC02";
const XP_EARNED = 10;

const Section: React.FC<SectionProps> = ({ label, children }) => (
  <View className="mb-6">
    <Text className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3">
      {label}
    </Text>
    {children}
  </View>
);

export const GratitudeSummaryStep: React.FC<GratitudeSummaryStepProps> =
  React.memo(({ formState, onSave, onDone, isSaving }) => {
    const emotionOption: EmotionOption | undefined = useMemo(
      () => EMOTION_OPTIONS.find((e) => e.name === formState.currentMood),
      [formState.currentMood],
    );

    const shift: number =
      formState.moodIntensity - formState.finalMoodIntensity;
    const shiftLabel: string =
      shift > 0
        ? `Dropped ${shift} point${shift > 1 ? "s" : ""}`
        : shift < 0
          ? `Rose ${Math.abs(shift)} point${Math.abs(shift) > 1 ? "s" : ""}`
          : "Stayed the same";

    return (
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Duolingo celebration header ── */}
        <View className="items-center mb-8 pt-4">
          <View
            className="h-20 w-20 rounded-full items-center justify-center mb-4"
            style={{ backgroundColor: "#F0FFF0" }}
          >
            <Text className="text-[44px]">�</Text>
          </View>
          <Text className="text-[26px] font-extrabold text-slate-900 text-center mb-1">
            Lesson Complete!
          </Text>
          <Text className="text-[15px] text-slate-500 text-center mb-4">
            Noticing what's good gets easier with practice.
          </Text>

          {/* XP reward badge */}
          <View
            className="flex-row items-center px-5 py-2.5 rounded-full"
            style={{
              backgroundColor: "#FFF3CD",
              borderWidth: 2,
              borderColor: "#FBBF24",
            }}
          >
            <Text className="text-lg mr-1.5">⚡</Text>
            <Text className="text-base font-extrabold text-amber-700">
              +{XP_EARNED} XP earned!
            </Text>
          </View>
        </View>

        {/* Mood shift — Duolingo-style before/after bars */}
        {emotionOption && (
          <Section label="Mood shift">
            <View className="bg-white rounded-2xl p-4 border-2 border-slate-100">
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center">
                  <Text className="text-xl mr-2">{emotionOption.emoji}</Text>
                  <Text className="text-[15px] font-bold text-slate-700">
                    {emotionOption.label}
                  </Text>
                </View>
                <View
                  className="px-2.5 py-1 rounded-full"
                  style={{
                    backgroundColor:
                      shift > 0 ? "#D1FAE5" : shift < 0 ? "#FEF3C7" : "#F1F5F9",
                  }}
                >
                  <Text
                    className="text-xs font-extrabold"
                    style={{
                      color:
                        shift > 0
                          ? "#047857"
                          : shift < 0
                            ? "#B45309"
                            : "#64748B",
                    }}
                  >
                    {shiftLabel}
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
                    {formState.moodIntensity}/10
                  </Text>
                </View>
                <View className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <View
                    className="h-full bg-slate-400 rounded-full"
                    style={{ width: `${formState.moodIntensity * 10}%` }}
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
                    {formState.finalMoodIntensity}/10
                  </Text>
                </View>
                <View className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <View
                    className="h-full rounded-full"
                    style={{
                      width: `${formState.finalMoodIntensity * 10}%`,
                      backgroundColor: shift > 0 ? "#22C55E" : "#94A3B8",
                    }}
                  />
                </View>
              </View>
            </View>
          </Section>
        )}

        {/* Prompt used */}
        {!!formState.selectedPrompt && (
          <Section label="Your prompt">
            <View className="bg-white rounded-2xl p-4 border-2 border-slate-100">
              <Text className="text-sm text-slate-600 italic leading-relaxed">
                "{formState.selectedPrompt}"
              </Text>
            </View>
          </Section>
        )}

        {/* Gratitude entries */}
        {formState.gratitudeEntries.length > 0 && (
          <Section label="Grateful for">
            <View className="bg-white rounded-2xl p-4 border-2 border-slate-100">
              {formState.gratitudeEntries.map((entry: string, i: number) => (
                <View
                  key={`summary-${i}`}
                  className={`flex-row items-start ${i < formState.gratitudeEntries.length - 1 ? "mb-3 pb-3 border-b border-slate-50" : ""}`}
                >
                  <View className="h-8 w-8 rounded-lg bg-green-50 items-center justify-center mr-3">
                    <Text className="text-sm">🌿</Text>
                  </View>
                  <Text className="text-sm text-slate-700 flex-1 leading-relaxed pt-1">
                    {entry}
                  </Text>
                </View>
              ))}
            </View>
          </Section>
        )}

        {/* ── Actions — Duolingo-style CTAs ── */}
        <View className="gap-3 mt-4">
          <Pressable
            onPress={onSave}
            disabled={isSaving}
            accessibilityRole="button"
            accessibilityLabel="Save to journal"
            className="h-14 rounded-2xl items-center justify-center active:opacity-90"
            style={{
              backgroundColor: isSaving ? "#E2E8F0" : ACCENT,
              shadowColor: isSaving ? "#000" : ACCENT,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: isSaving ? 0 : 0.3,
              shadowRadius: 0,
              elevation: isSaving ? 0 : 4,
            }}
          >
            <Text className="text-base font-extrabold text-white uppercase tracking-wider">
              {isSaving ? "Saving…" : "Save to Journal"}
            </Text>
          </Pressable>

          <Pressable
            onPress={onDone}
            accessibilityRole="button"
            accessibilityLabel="Done"
            className="h-11 rounded-2xl items-center justify-center active:bg-slate-100"
          >
            <Text className="text-sm font-bold text-slate-400">Skip</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  });

GratitudeSummaryStep.displayName = "GratitudeSummaryStep";

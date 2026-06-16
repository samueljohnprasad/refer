import React from "react";
import { View, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { LessonScreen } from "@/src/components/ui/LessonScreen";
import { EmotionShiftBar } from "../components/EmotionShiftBar";
import { COGNITIVE_DISTORTIONS } from "../data/cognitiveDistortions";
import type {
  ThoughtReframingFormState,
  CognitiveDistortionKey,
  CognitiveDistortion,
} from "../types";

interface SummaryStepProps {
  formState: ThoughtReframingFormState;
  onSave: () => void;
  onDone: () => void;
  isSaving: boolean;
  onClose?: () => void;
}

interface SectionProps {
  label: string;
  children: React.ReactNode;
}

const ACCENT = "#58CC02";
const XP_EARNED = 15;

const Section: React.FC<SectionProps> = ({ label, children }) => (
  <View className="mb-6">
    <Text className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3">
      {label}
    </Text>
    {children}
  </View>
);

export const SummaryStep: React.FC<SummaryStepProps> = React.memo(
  ({ formState, onSave, onDone, isSaving, onClose }) => {
    const distortionLabels: string[] = formState.selectedDistortions.map(
      (key: CognitiveDistortionKey) => {
        const found: CognitiveDistortion | undefined =
          COGNITIVE_DISTORTIONS.find((d) => d.key === key);
        return found?.label ?? key;
      },
    );

    return (
      <LessonScreen 
        hideHeader 
        onClose={onClose}
        primaryLabel={isSaving ? "Saving…" : "Save to Journal"}
        onPrimaryPress={onSave}
        primaryDisabled={isSaving}
        secondaryLabel="Skip"
        onSecondaryPress={onDone}
      >
        <LessonScreen.Content hasHeader={false} showsVerticalScrollIndicator={false}>
        {/* ── Duolingo celebration header ── */}
        <View className="items-center mb-8 pt-4">
          <View
            className="h-20 w-20 rounded-full items-center justify-center mb-4"
            style={{ backgroundColor: "#F0FFF0" }}
          >
            <Text className="text-[44px]">🎉</Text>
          </View>
          <Text className="text-[26px] font-extrabold text-slate-900 text-center mb-1">
            Lesson Complete!
          </Text>
          <Text className="text-[15px] text-slate-500 text-center mb-4">
            Reframing gets easier with practice.
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

        {/* Situation */}
        {!!formState.situation && (
          <Section label="What happened">
            <View className="bg-white rounded-2xl p-4 border-2 border-slate-100">
              <Text className="text-sm text-slate-600 leading-relaxed">
                {formState.situation}
              </Text>
            </View>
          </Section>
        )}

        {/* Thought shift — Duolingo before/after card */}
        <Section label="Thought shift">
          <View className="bg-white rounded-2xl border-2 border-slate-100 overflow-hidden">
            <View className="p-4 bg-red-50/50">
              <Text className="text-xs font-extrabold text-red-400 uppercase tracking-wider mb-1">
                Before
              </Text>
              <Text className="text-sm text-slate-600 italic leading-relaxed">
                "{formState.automaticThought}"
              </Text>
            </View>
            <View className="h-px bg-slate-100" />
            <View className="p-4 bg-green-50/50">
              <Text className="text-xs font-extrabold text-green-600 uppercase tracking-wider mb-1">
                After
              </Text>
              <Text className="text-sm text-slate-800 font-medium leading-relaxed">
                "{formState.balancedThought}"
              </Text>
            </View>
          </View>
        </Section>

        {/* Evidence */}
        {(formState.evidenceFor.length > 0 ||
          formState.evidenceAgainst.length > 0) && (
            <Section label="Evidence">
              <View className="bg-white rounded-2xl p-4 border-2 border-slate-100">
                {formState.evidenceFor.length > 0 && (
                  <View
                    className={formState.evidenceAgainst.length > 0 ? "mb-4" : ""}
                  >
                    <Text className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                      Supporting
                    </Text>
                    {formState.evidenceFor.map((item: string, i: number) => (
                      <View
                        key={`for-${i}`}
                        className="flex-row mb-1.5"
                      >
                        <Text className="text-red-300 mr-2 text-sm">•</Text>
                        <Text className="text-sm text-slate-600 flex-1 leading-relaxed">
                          {item}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
                {formState.evidenceAgainst.length > 0 && (
                  <View>
                    <Text className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                      Against
                    </Text>
                    {formState.evidenceAgainst.map((item: string, i: number) => (
                      <View
                        key={`against-${i}`}
                        className="flex-row mb-1.5"
                      >
                        <Text className="text-green-400 mr-2 text-sm">•</Text>
                        <Text className="text-sm text-slate-600 flex-1 leading-relaxed">
                          {item}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </Section>
          )}

        {/* Thinking traps */}
        {distortionLabels.length > 0 && (
          <Section label="Thinking traps spotted">
            <View className="flex-row flex-wrap gap-2">
              {distortionLabels.map((label: string) => (
                <View
                  key={label}
                  className="rounded-full px-3.5 py-1.5 border-2 border-slate-200 bg-white"
                >
                  <Text className="text-xs font-bold text-slate-600">
                    {label}
                  </Text>
                </View>
              ))}
            </View>
          </Section>
        )}

        {/* Emotion shift */}
        {formState.selectedEmotions.length > 0 && (
          <Section label="Emotion shift">
            <EmotionShiftBar emotions={formState.selectedEmotions} />
          </Section>
        )}

        {/* ── Actions — Duolingo-style CTAs ── */}
        </LessonScreen.Content>
      </LessonScreen>
    );
  },
);

SummaryStep.displayName = "SummaryStep";

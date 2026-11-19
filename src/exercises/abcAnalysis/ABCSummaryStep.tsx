// ponytail: the summary (.agents/abc-analysis.html's `summary`): Happi's verdict, the keepsake, then the
// record folded away. The one non-prototype action kept is saving the fairer thought as a coping card.
import React, { useCallback, useState } from "react";
import { Pressable, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { Feather } from "@expo/vector-icons";
import type { ABCAnalysisResponse, StepProps } from "@/src/types/exerciseFlow";
import { useCopingCards } from "@/src/hooks/useCopingCards";
import { HappiStage } from "@/src/domains/onboarding/ui/presentation/components/HappiStage";
import { useHappiGuideMotion, ActingPose } from "@/src/domains/onboarding/ui/containers/useHappiGuideMotion";
import { HelpSheetModal } from "@/src/domains/home/ui/containers/HelpRowWithSheet";
import { AbcKeepsake } from "./abcKeepsake";
import { abcChecksSummary, abcStrength, abcVerdict, capitalize } from "./abcDomain";
import { abcFeelPhrase } from "./customStepShared";
import { isAbcCrisisSeen } from "./useAbcCrisisGuard";

const DEFAULT_RATING = 5;

function VerdictHappi({ pose }: { pose: ActingPose }): React.JSX.Element {
  const motion = useHappiGuideMotion();
  React.useEffect(() => { motion.setPose(pose); }, [motion, pose]);
  return <View style={{ width: 72 }}><HappiStage motion={motion} size="scene" width={72} /></View>;
}

function Row({ label, value }: { label: string; value: string }): React.JSX.Element | null {
  if (!value.trim()) return null;
  return (
    <View className="pt-3 border-t border-happy-sep">
      <Text className="text-t-foot font-bold text-happy-label-2">{label}</Text>
      <Text className="mt-1 mb-3 text-t-sub font-medium leading-[21px] text-happy-label">{value}</Text>
    </View>
  );
}

export function ABCSummaryStep({ response, onBack, readOnly }: StepProps<ABCAnalysisResponse>): React.JSX.Element {
  const { saveCard } = useCopingCards();
  const [open, setOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);

  const pre = response.preEmotionalIntensity ?? DEFAULT_RATING;
  const post = response.postEmotionalIntensity ?? pre;
  const { title, sub } = abcVerdict(pre, post);
  const fairer = response.alternativeBelief.trim();
  const feel = capitalize(abcFeelPhrase(response.consequenceEmotion));

  const save = useCallback(async () => {
    if (saved || saving || !fairer) return;
    setSaving(true);
    setSaveError(false);
    try {
      await saveCard({ exercise_type: "abc_analysis", reframe_text: response.alternativeBelief, reframe_label: "More balanced thought" });
      setSaved(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    } catch {
      setSaveError(true);
    } finally {
      setSaving(false);
    }
  }, [saved, saving, fairer, response.alternativeBelief, saveCard]);

  return (
    <View>
      <View className="flex-row items-center gap-3 mb-4">
        {!isAbcCrisisSeen() && <VerdictHappi pose={post <= pre ? ActingPose.Proud : ActingPose.Abc} />}
        <View className="flex-1">
          <Text accessibilityRole="header" className="font-display text-t-h font-bold leading-[28px] text-happy-label">{title}</Text>
          <Text className="mt-1 text-t-sub font-medium leading-[22px] text-happy-label-2">{sub}</Text>
          {post > pre && post >= 7 && (
            <Pressable accessibilityRole="button" onPress={() => setHelpOpen(true)} className="min-h-11 justify-center">
              <Text className="text-t-sub font-semibold text-happy-accent underline">If it feels like too much, you can get help now.</Text>
            </Pressable>
          )}
        </View>
      </View>

      <AbcKeepsake event={response.activatingEvent.trim().replace(/[.!?]+$/, "")} belief={response.belief.trim()} fairer={fairer} pre={pre} post={post} />

      <View className="mt-6 rounded-2xl bg-happy-surface-2">
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded: open }}
          onPress={() => setOpen((v) => !v)}
          className="min-h-[52px] flex-row items-center justify-between px-4"
        >
          <Text className="text-t-body font-bold text-happy-label">See your answers</Text>
          <Feather name={open ? "chevron-up" : "chevron-down"} size={18} color="#142414" />
        </Pressable>
        {open && (
          <View className="px-4 pb-2">
            <Row label="What happened" value={response.activatingEvent.trim()} />
            <Row label="You felt" value={`${feel}. ${abcStrength(pre)}, then ${abcStrength(post).toLowerCase()}.`} />
            <Row label="The thought" value={response.belief.trim()} />
            <Row label="Checking it" value={abcChecksSummary(response.beliefChecks)} />
            <Row label="Fairer thought" value={fairer} />
          </View>
        )}
      </View>

      {!readOnly && (
        <View className="mt-3">
          <Pressable accessibilityRole="button" onPress={onBack} className="min-h-11 self-start justify-center active:opacity-60">
            <Text className="text-t-sub font-semibold text-happy-accent underline">Edit answers</Text>
          </Pressable>
          {!!fairer && (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled: saved || saving, busy: saving }}
              disabled={saved || saving}
              onPress={save}
              className="min-h-11 self-start justify-center active:opacity-60"
            >
              <Text className="text-t-sub font-semibold text-happy-accent underline">
                {saved ? "Saved to coping cards" : saving ? "Saving…" : "Save for a difficult moment"}
              </Text>
            </Pressable>
          )}
          {saveError && <Text className="text-t-foot font-semibold text-[#c9852f]">Could not save this coping card. Try again.</Text>}
        </View>
      )}

      <Text className="mt-6 text-center text-t-foot font-semibold text-happy-label-2">Saving keeps this in your exercise history, in your own words.</Text>
      <HelpSheetModal visible={helpOpen} onClose={() => setHelpOpen(false)} />
    </View>
  );
}

ABCSummaryStep.displayName = "ABCSummaryStep";

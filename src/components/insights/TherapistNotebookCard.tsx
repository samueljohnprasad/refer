import React, { useState } from "react";
import {
  View,
  Pressable,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { Text } from "@/src/components/ui/Text";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  LockIcon,
  ArrowDown01Icon,
  ArrowUp01Icon,
  BookmarkCheck01Icon,
} from "@hugeicons/core-free-icons";
import {
  useTherapistNotebook,
  type TherapistInsight,
} from "@/src/hooks/insights/useTherapistNotebook";
import { useRevenueCat } from "@/src/context/RevenueCatProvider";
import { SAGE, INK_MUTED } from "@/lib/tokens";
import dayjs from "dayjs";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ─── Locked state ────────────────────────────────────────────────────────────

function LockedNotebookCard({ onUnlock }: { onUnlock: () => void }) {
  return (
    <Pressable
      onPress={onUnlock}
      className="happy-brand-card rounded-2xl p-5 mb-4 active:opacity-80"
    >
      <View className="flex-row items-center gap-2 mb-2">
        <Text className="text-[16px]">📓</Text>
        <HugeiconsIcon icon={LockIcon} size={14} color={INK_MUTED} />
        <Text className="happy-font-body-bold text-[14px] text-ink">
          Therapist's Notebook
        </Text>
        <View className="bg-purple-100 px-2 py-0.5 rounded-full">
          <Text className="text-[10px] font-bold text-purple-700">PRO</Text>
        </View>
      </View>
      <Text className="text-[12px] text-ink-muted leading-relaxed">
        Your weekly AI analysis is ready. Unlock to see what patterns a
        therapist would notice across your sessions.
      </Text>
    </Pressable>
  );
}

// ─── Expanded content ────────────────────────────────────────────────────────

function NotebookContent({ insight }: { insight: TherapistInsight }) {
  return (
    <View className="mt-3">
      {/* Core belief */}
      <View className="mb-4">
        <Text className="text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1.5">
          Core belief detected
        </Text>
        <View className="bg-red-50 rounded-xl p-3 border border-red-100">
          <Text className="text-[14px] font-semibold text-red-800 italic leading-relaxed">
            "{insight.coreBeliefIdentified}"
          </Text>
        </View>
      </View>

      {/* Manifestations */}
      <View className="mb-4">
        <Text className="text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-2">
          How it shows up
        </Text>
        {insight.manifestations.slice(0, 3).map((m, i) => (
          <View key={i} className="flex-row items-start mb-2">
            <Text className="text-[12px] text-ink-muted mr-2 mt-0.5">•</Text>
            <View className="flex-1">
              <Text className="text-[13px] text-ink leading-relaxed">
                {m.situation}
              </Text>
              <View className="flex-row gap-1.5 mt-1">
                <View className="bg-slate-100 px-2 py-0.5 rounded-full">
                  <Text className="text-[10px] font-semibold text-ink-muted">
                    {m.distortion}
                  </Text>
                </View>
                <View className="bg-sage-pill px-2 py-0.5 rounded-full">
                  <Text className="text-[10px] font-semibold text-sage-700">
                    {m.exerciseType}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* What's working */}
      <View className="mb-4">
        <Text className="text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1.5">
          What's working
        </Text>
        <Text className="text-[13px] text-ink leading-relaxed">
          {insight.whatIsWorking}
        </Text>
      </View>

      {/* Best evidence — saved as coping card */}
      {insight.bestEvidence && (
        <View className="mb-4">
          <Text className="text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1.5">
            Your strongest evidence
          </Text>
          <View
            className="rounded-xl p-3 border"
            style={{ backgroundColor: SAGE[50], borderColor: SAGE[200] }}
          >
            <Text className="text-[13px] text-sage-800 leading-relaxed italic">
              "{insight.bestEvidence}"
            </Text>
            <View className="flex-row items-center gap-1 mt-2">
              <HugeiconsIcon
                icon={BookmarkCheck01Icon}
                size={12}
                color={SAGE[600]}
              />
              <Text className="text-[11px] font-semibold text-sage-600">
                Saved to Coping Cards
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Suggestion */}
      <View className="bg-sage-pill rounded-xl p-3 border border-sage-200/50">
        <Text className="text-[11px] font-bold text-sage-700 uppercase tracking-wider mb-1">
          Suggestion for this week
        </Text>
        <Text className="text-[13px] text-sage-800 leading-relaxed">
          {insight.suggestion}
        </Text>
      </View>

      {/* Disclaimer */}
      <Text className="text-[10px] text-ink-muted mt-4 leading-relaxed text-center">
        AI-detected patterns from your exercises. Not a clinical assessment.
      </Text>
    </View>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export function TherapistNotebookCard() {
  const { data, isLoading } = useTherapistNotebook();
  const { hasPro, presentPaywall } = useRevenueCat();
  const [expanded, setExpanded] = useState(false);

  if (!hasPro) {
    return <LockedNotebookCard onUnlock={presentPaywall} />;
  }

  if (isLoading || !data) return null;

  const dateLabel = dayjs(data.generatedAt).format("MMM D");

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((p) => !p);
  };

  return (
    <View className="happy-brand-card rounded-2xl p-5 mb-4">
      <Pressable onPress={toggleExpand} className="active:opacity-80">
        <View className="flex-row items-center gap-2 mb-1">
          <Text className="text-[16px]">📓</Text>
          <Text className="happy-font-body-bold text-[14px] text-ink">
            Therapist's Notebook
          </Text>
          <View className="bg-purple-100 px-2 py-0.5 rounded-full">
            <Text className="text-[10px] font-bold text-purple-700">PRO</Text>
          </View>
          <View className="flex-1" />
          <HugeiconsIcon
            icon={expanded ? ArrowUp01Icon : ArrowDown01Icon}
            size={16}
            color={INK_MUTED}
          />
        </View>

        {!expanded && (
          <Text className="text-[12px] text-ink-muted mt-1" numberOfLines={2}>
            "{data.coreBeliefIdentified}" — updated {dateLabel}
          </Text>
        )}
      </Pressable>

      {expanded && <NotebookContent insight={data} />}
    </View>
  );
}

TherapistNotebookCard.displayName = "TherapistNotebookCard";

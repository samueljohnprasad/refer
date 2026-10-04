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
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { RADIUS } from "@/src/theme/radius";
import { useTranslation } from "react-i18next";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ─── Locked state ────────────────────────────────────────────────────────────

function LockedNotebookCard({ onUnlock }: { onUnlock: () => void }) {
  const { t } = useTranslation("insights");
  return (
    <Pressable
      onPress={onUnlock}
      className="happy-brand-card rounded-[24px] p-5 mb-4 active:scale-95 active:opacity-90 transition-transform duration-200"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      <View className="flex-row items-center gap-2 mb-2">
        <Text className="text-[16px]">📓</Text>
        <HugeiconsIcon icon={LockIcon} size={14} color={SEMANTIC_COLORS.text.tertiary} />
        <Text className="happy-font-heading-bold text-[18px] tracking-tight text-ink mb-0">
          {t("therapistNotebook.title")}
        </Text>
        <View className="flex-row items-center gap-1 px-2 py-1 rounded-[10px] border" style={[{ backgroundColor: "#F3E8FF", borderColor: "#D8B4FE" }]}>
          <Text className="text-[11px] font-semibold" style={[{ color: "#7E22CE" }]}>
            {t("shared.proLabel")}
          </Text>
        </View>
      </View>
      <Text className="text-[12px] text-ink-muted leading-relaxed">
        {t("therapistNotebook.lockedDescription")}
      </Text>
    </Pressable>
  );
}

// ─── Expanded content ────────────────────────────────────────────────────────

function NotebookContent({ insight }: { insight: TherapistInsight }) {
  const { t } = useTranslation("insights");
  return (
    <View className="mt-3">
      {/* Core belief */}
      <View className="mb-4">
        <Text className="text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1.5">
          {t("therapistNotebook.coreBeliefDetected")}
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
          {t("therapistNotebook.howItShowsUp")}
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
          {t("therapistNotebook.whatsWorking")}
        </Text>
        <Text className="text-[13px] text-ink leading-relaxed">
          {insight.whatIsWorking}
        </Text>
      </View>

      {/* Best evidence — saved as coping card */}
      {insight.bestEvidence && (
        <View className="mb-4">
          <Text className="text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1.5">
            {t("therapistNotebook.strongestEvidence")}
          </Text>
          <View
            className="rounded-xl p-3 border"
            style={{ backgroundColor: SEMANTIC_COLORS.selection.surface, borderColor: SEMANTIC_COLORS.selection.foreground }}
          >
            <Text className="text-[13px] text-sage-800 leading-relaxed italic">
              "{insight.bestEvidence}"
            </Text>
            <View className="flex-row items-center gap-1 mt-2">
              <HugeiconsIcon
                icon={BookmarkCheck01Icon}
                size={12}
                color={SEMANTIC_COLORS.brand.pressed}
              />
              <Text className="text-[11px] font-semibold text-sage-600">
                {t("therapistNotebook.savedToCopingCards")}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Suggestion */}
      <View className="bg-sage-pill rounded-xl p-3 border border-sage-200/50">
        <Text className="text-[11px] font-bold text-sage-700 uppercase tracking-wider mb-1">
          {t("therapistNotebook.weeklySuggestion")}
        </Text>
        <Text className="text-[13px] text-sage-800 leading-relaxed">
          {insight.suggestion}
        </Text>
      </View>

      {/* Disclaimer */}
      <Text className="text-[10px] text-ink-muted mt-4 leading-relaxed text-center">
        {t("therapistNotebook.disclaimer")}
      </Text>
    </View>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export function TherapistNotebookCard() {
  const { t, i18n } = useTranslation("insights");
  const { data, isLoading } = useTherapistNotebook();
  const { hasPro, presentPaywall } = useRevenueCat();
  const [expanded, setExpanded] = useState(false);

  if (!hasPro) {
    return <LockedNotebookCard onUnlock={presentPaywall} />;
  }

  if (isLoading || !data) return null;

  const dateLabel = new Date(data.generatedAt).toLocaleDateString(
    i18n.resolvedLanguage ?? i18n.language,
    { month: "short", day: "numeric" },
  );

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((p) => !p);
  };

  return (
    <View className="happy-brand-card rounded-[24px] p-5 mb-4" style={{ backgroundColor: "#FFFFFF" }}>
      <Pressable onPress={toggleExpand} className="active:opacity-80">
        <View className="flex-row items-center gap-2 mb-1">
          <Text className="text-[16px]">📓</Text>
          <Text className="happy-font-heading-bold text-[18px] tracking-tight text-ink mb-0">
            {t("therapistNotebook.title")}
          </Text>
          <View className="flex-row items-center gap-1 px-2 py-1 rounded-[10px] border" style={[{ backgroundColor: "#F3E8FF", borderColor: "#D8B4FE" }]}>
            <Text className="text-[11px] font-semibold" style={[{ color: "#7E22CE" }]}>
              {t("shared.proLabel")}
            </Text>
          </View>
          <View className="flex-1" />
          <HugeiconsIcon
            icon={expanded ? ArrowUp01Icon : ArrowDown01Icon}
            size={16}
            color={SEMANTIC_COLORS.text.tertiary}
          />
        </View>

        {!expanded && (
          <Text className="text-[12px] text-ink-muted mt-1" numberOfLines={2}>
          {t("therapistNotebook.updated", {
            date: dateLabel,
            belief: data.coreBeliefIdentified,
          })}
          </Text>
        )}
      </Pressable>

      {expanded && <NotebookContent insight={data} />}
    </View>
  );
}

TherapistNotebookCard.displayName = "TherapistNotebookCard";

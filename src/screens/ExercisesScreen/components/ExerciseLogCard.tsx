import { memo, useCallback, type ReactElement } from "react";
import { Platform, Pressable, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { SymbolView } from "expo-symbols";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Brain01Icon, SparklesIcon } from "@hugeicons/core-free-icons";
import { useTranslation } from "react-i18next";
import { useExerciseCopy } from "@/src/hooks/useExerciseCopy";
import { ExerciseIcon } from "@/src/components/exercise/ExerciseIcon";
import { getExerciseConfig } from "@/src/data/exerciseRegistry";
import { Text } from "@/src/components/ui/Text";
import type { HistoryLogItem } from "../hooks/useCBTHistory";
import { getCategoryBadgeTheme } from "../exerciseScreenUtils";
import { nutrieStyles } from "../ExercisesScreen.styles";

const LEGACY_LOG_META = {
  catcher: { labelKey: "copingCards.exerciseTypes.thought_catcher", icon: Brain01Icon, xp: 10 },
  reframing: { labelKey: "copingCards.exerciseTypes.thought_reframing", icon: Brain01Icon, xp: 15 },
  gratitude: { labelKey: "copingCards.exerciseTypes.gratitude_reframe", icon: SparklesIcon, xp: 10 },
} as const;

function getHistoryXp(item: HistoryLogItem): number {
  if (item.type === "unified" && item.exerciseType) return getExerciseConfig(item.exerciseType)?.xp ?? 0;
  return item.type === "catcher" ? 10 : item.type === "reframing" ? 15 : item.type === "gratitude" ? 10 : 0;
}

function getStatus(item: HistoryLogItem, t: (key: string) => string) {
  if (item.status === "checker_completed" || item.status === "completed" || item.status === "summary") {
    return { label: t("log.completed"), isComplete: true, xpEarned: getHistoryXp(item) };
  }
  if (item.status === "catcher_completed") return { label: t("log.readyToReframe"), isComplete: false, xpEarned: 0 };
  return { label: t("log.resume"), isComplete: false, xpEarned: 0 };
}

function getLogPresentation(item: HistoryLogItem, t: (key: string) => string, translateCopy: (text: string) => string) {
  if (item.type === "unified" && item.exerciseType) {
    const config = getExerciseConfig(item.exerciseType);
    return {
      heading: config ? t(`categories.${config.category}`) : t("log.exercise"),
      title: translateCopy(config?.title ?? item.title ?? "Exercise"),
      icon: <ExerciseIcon type={item.exerciseType} size={22} color={getCategoryBadgeTheme(config?.category ?? "").iconColor} />,
    };
  }

  const legacy = LEGACY_LOG_META[item.type] ?? LEGACY_LOG_META.gratitude;
  return {
    heading: t(legacy.labelKey),
    title: item.title?.trim() || t("log.untitledSession"),
    icon: <HugeiconsIcon icon={legacy.icon} size={22} color="#8E8E93" />,
  };
}

function formatDate(date: string, language: string, withTime = false): string {
  return new Intl.DateTimeFormat(language, withTime
    ? { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }
    : { month: "short", day: "numeric" }).format(new Date(date));
}

interface ExerciseLogCardProps {
  item: HistoryLogItem;
  onPress: (item: HistoryLogItem) => void;
}

export const ExerciseLogCard = memo(function ExerciseLogCard({ item, onPress }: ExerciseLogCardProps): ReactElement {
  const { i18n, t } = useTranslation("exercises");
  const translateCopy = useExerciseCopy();
  const status = getStatus(item, (key) => t(key));
  const presentation = getLogPresentation(item, (key) => t(key), translateCopy);
  const handlePress = useCallback(() => onPress(item), [item, onPress]);
  const statusColor = status.isComplete ? "#22C55E" : "#8E8E93";
  const statusBg = status.isComplete ? "#E8FBF0" : "#F4F4F5";

  return (
    <Pressable onPress={handlePress} style={({ pressed }) => [nutrieStyles.logCard, pressed && { opacity: 0.92, transform: [{ scale: 0.985 }] }]} accessibilityRole="button">
      <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
        <View style={[nutrieStyles.logIconWell, { backgroundColor: statusBg }]}>{presentation.icon}</View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 2 }}>
            <Text style={nutrieStyles.logHeading}>{presentation.heading}</Text>
            <Text style={nutrieStyles.logDate}>{formatDate(item.date, i18n.language)}</Text>
          </View>
          <Text style={nutrieStyles.logTitle} numberOfLines={1}>{presentation.title}</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 8 }}>
            <View style={[nutrieStyles.inlinePill, { backgroundColor: statusBg, borderColor: status.isComplete ? "#C5ECD3" : "#E0E0E2" }]}>
              {Platform.OS === "ios" ? <SymbolView name={(status.isComplete ? "checkmark.circle.fill" : "clock") as any} size={11} tintColor={statusColor} weight="medium" style={{ width: 13, height: 13 }} /> : <Feather name={status.isComplete ? "check-circle" : "clock"} size={11} color={statusColor} />}
              <Text style={[nutrieStyles.inlinePillText, { color: statusColor, fontWeight: "700" }]}>{status.label}</Text>
            </View>
            {status.isComplete && status.xpEarned > 0 ? <View style={[nutrieStyles.inlinePill, { backgroundColor: "#FFF5D6", borderColor: "#F5E6B8" }]}><Text style={[nutrieStyles.inlinePillText, { color: "#A67C00" }]}>+{status.xpEarned} XP</Text></View> : null}
          </View>
        </View>
      </View>
    </Pressable>
  );
});

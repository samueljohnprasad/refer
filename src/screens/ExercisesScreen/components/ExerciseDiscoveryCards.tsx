import { memo, useCallback, type ReactElement } from "react";
import { Dimensions, Platform, Pressable, View } from "react-native";
import { SymbolView } from "expo-symbols";
import { Feather } from "@expo/vector-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ArrowRight01Icon, PlayIcon, ZapIcon } from "@hugeicons/core-free-icons";
import { useTranslation } from "react-i18next";
import { CircularRevealWrapper } from "@/src/components/CircularRevealWrapper";
import { ExerciseIcon } from "@/src/components/exercise/ExerciseIcon";
import { Card } from "@/src/components/ui/Card";
import { Text } from "@/src/components/ui/Text";
import { useExerciseCopy } from "@/src/hooks/useExerciseCopy";
import { useFreemiumGate } from "@/src/hooks/useFreemiumGate";
import type { ExerciseConfig } from "@/src/types/exerciseFlow";
import { buildExerciseRoute, getCategoryBadgeTheme } from "../exerciseScreenUtils";
import { nutrieStyles } from "../ExercisesScreen.styles";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CAROUSEL_PEEK = 20;
const CAROUSEL_GAP = 12;
const SHELF_CARD_WIDTH = (SCREEN_WIDTH - CAROUSEL_PEEK * 2 - CAROUSEL_GAP * 2) / 1.85;

interface ExerciseCardProps {
  exercise: ExerciseConfig<any>;
  onPress: (exercise: ExerciseConfig<any>) => void;
  customSubtitle?: string;
}

function localizeDuration(duration: string, minutesShort: string): string {
  return duration.replace(/\smin$/, ` ${minutesShort}`);
}

export const FeaturedExerciseHero = memo(function FeaturedExerciseHero({
  exercise,
  onPress,
  customSubtitle,
}: ExerciseCardProps): ReactElement {
  const { t } = useTranslation("exercises");
  const translateCopy = useExerciseCopy();
  const { hasPro, requirePro } = useFreemiumGate();
  const isGated = !!exercise.isProOnly && !hasPro;
  const badgeTheme = getCategoryBadgeTheme(exercise.category);
  const title = translateCopy(exercise.title);
  const subtitle = customSubtitle ?? translateCopy(exercise.subtitle);

  const handlePress = useCallback(async () => {
    if (isGated) {
      await requirePro("exercise");
      return;
    }
    onPress(exercise);
  }, [exercise, isGated, onPress, requirePro]);

  return (
    <CircularRevealWrapper href={buildExerciseRoute(exercise.type)} color={badgeTheme.bg} duration={800} disabled={isGated}>
      <Card
        variant="solid"
        radius="lg"
        showDepth
        onPress={handlePress}
        faceStyle={{ backgroundColor: badgeTheme.bg, borderWidth: 2, borderColor: "rgba(0,0,0,0.06)" }}
        rimStyle={{ backgroundColor: badgeTheme.cardRim, top: 4, bottom: -4 }}
        contentClassName="p-4"
        className="mb-4"
      >
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
          <ExerciseIcon type={exercise.type} size={26} color={badgeTheme.iconColor} />
          <View style={{ flex: 1 }} />
          {isGated ? <TextBadge label="PRO" /> : null}
          <DurationBadge duration={exercise.duration} color={badgeTheme.iconColor} minutesShort={t("library.minutesShort")} />
        </View>
        <Text style={[nutrieStyles.exerciseTitle, { fontSize: 18, marginBottom: 4 }]}>{title}</Text>
        <Text style={[nutrieStyles.exerciseSubtitle, { color: "rgba(0,0,0,0.65)", marginBottom: 10 }]} numberOfLines={2}>
          {subtitle}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 4 }}>
          <XpLabel xp={exercise.xp} />
          <View style={{ backgroundColor: badgeTheme.text, flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 9999 }}>
            <HugeiconsIcon icon={PlayIcon} size={12} color="#FFFFFF" />
            <Text style={{ color: "#FFFFFF", fontSize: 12, fontWeight: "800" }}>{t("library.start")}</Text>
          </View>
        </View>
      </Card>
    </CircularRevealWrapper>
  );
});

export const ExerciseShelfCard = memo(function ExerciseShelfCard({ exercise, onPress }: ExerciseCardProps): ReactElement {
  const { t } = useTranslation("exercises");
  const translateCopy = useExerciseCopy();
  const { hasPro, requirePro } = useFreemiumGate();
  const isGated = !!exercise.isProOnly && !hasPro;
  const badgeTheme = getCategoryBadgeTheme(exercise.category);
  const handlePress = useCallback(async () => {
    if (isGated) return requirePro("exercise");
    onPress(exercise);
  }, [exercise, isGated, onPress, requirePro]);

  return (
    <CircularRevealWrapper href={buildExerciseRoute(exercise.type)} color={badgeTheme.bg} duration={800} disabled={isGated}>
      <Card variant="tile" radius="lg" showDepth onPress={handlePress} style={{ width: SHELF_CARD_WIDTH }} rimStyle={{ backgroundColor: "#D4D4D4" }} faceStyle={{ minHeight: 130 }} contentClassName="p-4 justify-between flex-1">
        <View style={{ marginBottom: 10, height: 32, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <ExerciseIcon type={exercise.type} size={24} color={badgeTheme.iconColor} />
          {isGated ? <TextBadge label="PRO" /> : null}
        </View>
        <Text style={nutrieStyles.exerciseTitle} numberOfLines={2}>{translateCopy(exercise.title)}</Text>
        <Text style={[nutrieStyles.exerciseSubtitle, { fontSize: 13, lineHeight: 18 }]} numberOfLines={2}>{translateCopy(exercise.subtitle)}</Text>
        <Text style={nutrieStyles.inlinePillText}>{localizeDuration(exercise.duration, t("library.minutesShort"))}</Text>
      </Card>
    </CircularRevealWrapper>
  );
});

export const CompactExerciseRow = memo(function CompactExerciseRow({ exercise, onPress }: ExerciseCardProps): ReactElement {
  const { t } = useTranslation("exercises");
  const translateCopy = useExerciseCopy();
  const { hasPro, requirePro } = useFreemiumGate();
  const isGated = !!exercise.isProOnly && !hasPro;
  const badgeTheme = getCategoryBadgeTheme(exercise.category);
  const handlePress = useCallback(async () => {
    if (isGated) return requirePro("exercise");
    onPress(exercise);
  }, [exercise, isGated, onPress, requirePro]);

  return (
    <CircularRevealWrapper href={buildExerciseRoute(exercise.type)} color={badgeTheme.bg} duration={800} disabled={isGated}>
      <Pressable onPress={handlePress} style={({ pressed }) => [{ flexDirection: "row", alignItems: "center", paddingVertical: 11, paddingHorizontal: 14, backgroundColor: "#FFFFFF", borderRadius: 16, borderWidth: 1.5, borderColor: "rgba(0,0,0,0.06)", borderBottomWidth: 3, borderBottomColor: "rgba(0,0,0,0.10)", marginBottom: 8 }, pressed && { opacity: 0.85, transform: [{ scale: 0.99 }] }]}>
        <View style={{ backgroundColor: badgeTheme.bg, width: 38, height: 38, borderRadius: 10, alignItems: "center", justifyContent: "center", marginRight: 12 }}>
          <ExerciseIcon type={exercise.type} size={20} color={badgeTheme.iconColor} />
        </View>
        <View style={{ flex: 1, minWidth: 0, justifyContent: "center" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={[nutrieStyles.exerciseTitle, { fontSize: 15, marginBottom: 2, flexShrink: 1 }]} numberOfLines={1}>{translateCopy(exercise.title)}</Text>
            {isGated ? <TextBadge label="PRO" /> : null}
          </View>
          <Text style={[nutrieStyles.exerciseSubtitle, { fontSize: 13 }]} numberOfLines={1}>{localizeDuration(exercise.duration, t("library.minutesShort"))} • +{exercise.xp} XP</Text>
        </View>
        <HugeiconsIcon icon={ArrowRight01Icon} size={16} color="#A1A1AA" />
      </Pressable>
    </CircularRevealWrapper>
  );
});

function TextBadge({ label }: { label: string }) {
  return <View className="bg-amber-500/20 px-2 py-0.5 rounded-full"><Text className="text-[10px] font-bold text-amber-700">{label}</Text></View>;
}

function XpLabel({ xp }: { xp: number }) {
  return <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}><HugeiconsIcon icon={ZapIcon} size={15} color="#C89400" /><Text style={{ fontSize: 13, fontWeight: "800", color: "#A67C00" }}>+{xp} XP</Text></View>;
}

function DurationBadge({ duration, color, minutesShort }: { duration: string; color: string; minutesShort: string }) {
  return <View style={[nutrieStyles.inlinePill, { backgroundColor: "rgba(255,255,255,0.7)", borderWidth: 0 }]}>
    {Platform.OS === "ios" ? <SymbolView name="clock" size={11} tintColor={color} /> : <Feather name="clock" size={11} color={color} />}
    <Text style={[nutrieStyles.inlinePillText, { color, fontWeight: "700" }]}>{localizeDuration(duration, minutesShort)}</Text>
  </View>;
}

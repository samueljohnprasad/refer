import { memo, useMemo, type ReactElement, type ReactNode } from "react";
import { Platform, ScrollView, View } from "react-native";
import { SymbolView } from "expo-symbols";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Text } from "@/src/components/ui/Text";
import { JumpBackInRow } from "./JumpBackInRow";
import { CATEGORY_BLURB } from "@/src/domains/exercises/data/exerciseCopy";
import { useExerciseEntryStatus } from "@/src/domains/exercises/ui/containers/useExerciseEntryStatus";
import { ExerciseTile } from "./ExerciseDiscoveryCards";
import { nutrieStyles } from "../ExercisesScreen.styles";
import { getCategoryBadgeTheme } from "../exerciseScreenUtils";
import type { ExerciseCategory, ExerciseConfig } from "@/src/types/exerciseFlow";
import { SAGE } from "@/src/theme/palette";

interface ExercisePressProps {
  onPress: (exercise: ExerciseConfig<any>) => void;
}

export function JumpBackInShelf({ items, onPress, title }: { items: ExerciseConfig<any>[]; title?: string } & ExercisePressProps) {
  const { t } = useTranslation("exercises");
  const { paused, fearLadderRung } = useExerciseEntryStatus();
  if (items.length === 0) return null;

  return (
    <View style={{ marginBottom: 20 }}>
      <View style={[nutrieStyles.sectionHeader, { paddingTop: 8 }]}>
        <TextLabel>{title ?? t("library.jumpBackIn")}</TextLabel>
      </View>
      <View style={{ marginTop: 10, gap: 8 }}>
        {items.map((item) => (
          <JumpBackInRow key={item.type} exercise={item} paused={paused.has(item.type)} rung={item.type === "fear_ladder" ? fearLadderRung : undefined} onPress={onPress} />
        ))}
      </View>
    </View>
  );
}

interface DiscoverSectionProps extends ExercisePressProps {
  label: string;
  category: ExerciseCategory;
  exercises: ExerciseConfig<any>[];
  excludedExerciseTypes?: ReadonlySet<string>;
  isFirst?: boolean;
}

export const DiscoverSection = memo(function DiscoverSection({
  label,
  category,
  exercises,
  excludedExerciseTypes,
  onPress,
  isFirst = false,
}: DiscoverSectionProps): ReactElement {
  const badgeTheme = getCategoryBadgeTheme(category);
  const availableExercises = useMemo(() => {
    if (!excludedExerciseTypes?.size) return exercises;
    const filtered = exercises.filter((exercise) => !excludedExerciseTypes.has(exercise.type));
    return filtered.length > 0 ? filtered : exercises;
  }, [excludedExerciseTypes, exercises]);
  return (
    <View style={{ marginBottom: 32 }}>
      <View style={[nutrieStyles.sectionHeader, !isFirst && { paddingTop: 16 }]}>
        <View style={[nutrieStyles.categoryBadge, { backgroundColor: "transparent", paddingHorizontal: 0 }]}>
          {Platform.OS === "ios" ? <SymbolView name={badgeTheme.sf as any} size={16} tintColor={SAGE[600]} weight="bold" style={{ width: 18, height: 18 }} /> : <Feather name={badgeTheme.feather as any} size={16} color={SAGE[600]} />}
          <TextLabel color={SAGE[600]}>{label} • {availableExercises.length}</TextLabel>
        </View>
      </View>
      <Text className="happy-font-body-medium text-[13px] leading-[18px] text-happy-label-2 -mt-1">{CATEGORY_BLURB[category]}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20 }} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, gap: 12 }}>
        {availableExercises.map((exercise) => (
          <ExerciseTile key={exercise.type} exercise={exercise} onPress={onPress} />
        ))}
      </ScrollView>
    </View>
  );
});

function TextLabel({ children, color }: { children: ReactNode; color?: string }) {
  return <Text style={[nutrieStyles.cleanSectionTitle, color ? { color } : null]}>{children}</Text>;
}

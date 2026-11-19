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
    <View className="mt-8 mb-3">
      <Text className="happy-font-body-bold text-[20px] leading-[24px] text-happy-label mb-3">
        {title ?? t("library.jumpBackIn")}
      </Text>
      <View className="gap-2">
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
  const availableExercises = useMemo(() => {
    if (!excludedExerciseTypes?.size) return exercises;
    const filtered = exercises.filter((exercise) => !excludedExerciseTypes.has(exercise.type));
    return filtered.length > 0 ? filtered : exercises;
  }, [excludedExerciseTypes, exercises]);

  return (
    <View className={isFirst ? "mt-4" : "mt-6"}>
      <View className="flex-row items-baseline justify-between gap-2">
        <Text className="happy-font-body-bold text-[20px] leading-[24px] text-happy-label">{label}</Text>
        <Text className="happy-font-body-bold text-[13px] text-happy-label-3">{availableExercises.length}</Text>
      </View>
      <Text className="happy-font-body-medium text-[15px] leading-[20px] text-happy-label-2 mt-0.5">{CATEGORY_BLURB[category]}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-4" contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, gap: 12 }}>
        {availableExercises.map((exercise) => (
          <ExerciseTile key={exercise.type} exercise={exercise} onPress={onPress} />
        ))}
      </ScrollView>
    </View>
  );
});

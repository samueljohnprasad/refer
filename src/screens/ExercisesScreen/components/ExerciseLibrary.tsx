import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { Text } from "@/src/components/ui/Text";
import { LibraryFilterChips } from "@/src/domains/exercises/ui/presentation/components/LibraryFilterChips";
import { useExerciseLibrary } from "@/src/domains/exercises/ui/containers/useExerciseLibrary";
import type { ExerciseCategory, ExerciseConfig } from "@/src/types/exerciseFlow";
import { DiscoverSection } from "./ExerciseDiscoverySection";

interface ExerciseLibraryProps {
  groups: { category: ExerciseCategory; exercises: ExerciseConfig<any>[] }[];
  excludedExerciseTypes: ReadonlySet<string>;
  onPress: (exercise: ExerciseConfig<any>) => void;
}

export function ExerciseLibrary({ groups, excludedExerciseTypes, onPress }: ExerciseLibraryProps) {
  const { t } = useTranslation("exercises");
  const { filter, setFilter, visible } = useExerciseLibrary(groups);

  return (
    <View>
      <Text className="happy-font-body-bold text-[20px] leading-[24px] text-happy-label mt-8 mb-3">
        {t("library.allExercises", { defaultValue: "All exercises" })}
      </Text>
      <LibraryFilterChips value={filter} onChange={setFilter} />
      {visible.length === 0 ? (
        <Text className="happy-font-body-semibold text-[15px] text-happy-label-2 py-6">
          Nothing at this length yet. Try another filter.
        </Text>
      ) : (
        visible.map((group, index) => (
          <DiscoverSection
            key={group.category}
            label={t(`categories.${group.category}`)}
            category={group.category}
            exercises={group.exercises}
            excludedExerciseTypes={excludedExerciseTypes}
            onPress={onPress}
            isFirst={index === 0}
          />
        ))
      )}
    </View>
  );
}

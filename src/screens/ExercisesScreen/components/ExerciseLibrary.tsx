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
      <LibraryFilterChips value={filter} onChange={setFilter} />
      {visible.length === 0 ? (
        <Text style={{ fontSize: 15, color: "#4b4b4b", paddingVertical: 24 }}>Nothing at this length yet. Try another filter.</Text>
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

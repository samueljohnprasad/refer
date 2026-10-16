import { memo, useMemo, type ReactElement, type ReactNode } from "react";
import { Platform, ScrollView, View, useWindowDimensions } from "react-native";
import { SymbolView } from "expo-symbols";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Text } from "@/src/components/ui/Text";
import { JumpBackInCard } from "./JumpBackInCard";
import { CompactExerciseRow } from "./ExerciseDiscoveryCards";
import { nutrieStyles } from "../ExercisesScreen.styles";
import { getCategoryBadgeTheme } from "../exerciseScreenUtils";
import type { ExerciseCategory, ExerciseConfig } from "@/src/types/exerciseFlow";
import { SAGE } from "@/src/theme/palette";

const CAROUSEL_PEEK = 20;
const CAROUSEL_GAP = 12;

interface ExercisePressProps {
  onPress: (exercise: ExerciseConfig<any>) => void;
}

export function JumpBackInShelf({ items, onPress, title }: { items: ExerciseConfig<any>[]; title?: string } & ExercisePressProps) {
  const { t } = useTranslation("exercises");
  const { width: screenWidth } = useWindowDimensions();
  if (items.length === 0) return null;
  const cardWidth = screenWidth - CAROUSEL_PEEK * 2 - 20;

  return (
    <View style={{ marginBottom: 20 }}>
      <View style={[nutrieStyles.sectionHeader, { paddingTop: 8 }]}>
        <TextLabel>{title ?? t("library.jumpBackIn")}</TextLabel>
      </View>
      <View style={{ marginHorizontal: -CAROUSEL_PEEK, marginTop: 10 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: CAROUSEL_GAP, paddingHorizontal: CAROUSEL_PEEK, paddingTop: 4, paddingBottom: 8 }} snapToInterval={cardWidth + CAROUSEL_GAP} decelerationRate="fast">
          {items.map((item) => (
            <View key={item.type} style={{ width: cardWidth, paddingBottom: 4 }}>
              <JumpBackInCard exercise={item} width={cardWidth} onPress={onPress} />
            </View>
          ))}
        </ScrollView>
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
      <View style={{ marginTop: 4 }}>
        {availableExercises.map((exercise) => (
          <CompactExerciseRow key={exercise.type} exercise={exercise} onPress={onPress} />
        ))}
      </View>
    </View>
  );
});

function TextLabel({ children, color }: { children: ReactNode; color?: string }) {
  return <Text style={[nutrieStyles.cleanSectionTitle, color ? { color } : null]}>{children}</Text>;
}

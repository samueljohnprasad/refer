import { memo, useMemo, type ReactElement, type ReactNode } from "react";
import { Dimensions, Platform, ScrollView, View } from "react-native";
import { SymbolView } from "expo-symbols";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Text } from "@/src/components/ui/Text";
import { JumpBackInCard } from "./JumpBackInCard";
import { CompactExerciseRow, ExerciseShelfCard, FeaturedExerciseHero } from "./ExerciseDiscoveryCards";
import { nutrieStyles } from "../ExercisesScreen.styles";
import { getCategoryBadgeTheme } from "../exerciseScreenUtils";
import type { ExerciseCategory, ExerciseConfig } from "@/src/types/exerciseFlow";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CAROUSEL_PEEK = 20;
const CAROUSEL_GAP = 12;
const JUMP_BACK_CARD_WIDTH = (SCREEN_WIDTH - CAROUSEL_PEEK * 2) / 2.3;
const SHELF_CARD_WIDTH = (SCREEN_WIDTH - CAROUSEL_PEEK * 2 - CAROUSEL_GAP * 2) / 1.85;

interface ExercisePressProps {
  onPress: (exercise: ExerciseConfig<any>) => void;
}

export function JumpBackInShelf({ items, onPress }: { items: ExerciseConfig<any>[] } & ExercisePressProps) {
  const { t } = useTranslation("exercises");
  if (items.length === 0) return null;

  return (
    <View style={{ marginBottom: 20 }}>
      <View style={[nutrieStyles.sectionHeader, { paddingTop: 8 }]}>
        <TextLabel>{t("library.jumpBackIn")}</TextLabel>
      </View>
      <View style={{ marginHorizontal: -CAROUSEL_PEEK, marginTop: 10 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: CAROUSEL_GAP, paddingHorizontal: CAROUSEL_PEEK, paddingTop: 4, paddingBottom: 8 }} snapToInterval={JUMP_BACK_CARD_WIDTH + CAROUSEL_GAP} decelerationRate="fast">
          {items.map((item) => (
            <View key={item.type} style={{ width: JUMP_BACK_CARD_WIDTH, paddingBottom: 4 }}>
              <JumpBackInCard exercise={item} width={JUMP_BACK_CARD_WIDTH} onPress={onPress} />
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
  const featuredExercise = availableExercises[0];
  const shelfExercises = availableExercises.slice(1, 4);
  const catalogExercises = availableExercises.slice(4);

  return (
    <View style={{ marginBottom: 32 }}>
      <View style={[nutrieStyles.sectionHeader, !isFirst && { paddingTop: 16 }]}>
        <View style={[nutrieStyles.categoryBadge, { backgroundColor: "transparent", paddingHorizontal: 0 }]}>
          {Platform.OS === "ios" ? <SymbolView name={badgeTheme.sf as any} size={16} tintColor={badgeTheme.text} weight="bold" style={{ width: 18, height: 18 }} /> : <Feather name={badgeTheme.feather as any} size={16} color={badgeTheme.text} />}
          <TextLabel color={badgeTheme.text}>{label} • {availableExercises.length}</TextLabel>
        </View>
      </View>
      {featuredExercise ? <FeaturedExerciseHero exercise={featuredExercise} onPress={onPress} /> : null}
      {shelfExercises.length >= 2 ? (
        <View style={{ marginHorizontal: -CAROUSEL_PEEK, marginBottom: 24 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: CAROUSEL_GAP, paddingHorizontal: CAROUSEL_PEEK, paddingTop: 4, paddingBottom: 8 }} snapToInterval={SHELF_CARD_WIDTH + CAROUSEL_GAP} decelerationRate="fast">
            {shelfExercises.map((exercise) => <View key={exercise.type} style={{ width: SHELF_CARD_WIDTH, paddingBottom: 4 }}><ExerciseShelfCard exercise={exercise} onPress={onPress} /></View>)}
          </ScrollView>
        </View>
      ) : shelfExercises.length === 1 ? (
        <CompactExerciseRow exercise={shelfExercises[0]} onPress={onPress} />
      ) : null}
      {catalogExercises.length > 0 ? <View style={{ marginTop: 8 }}>{catalogExercises.map((exercise) => <CompactExerciseRow key={exercise.type} exercise={exercise} onPress={onPress} />)}</View> : null}
    </View>
  );
});

function TextLabel({ children, color }: { children: ReactNode; color?: string }) {
  return <Text style={[nutrieStyles.cleanSectionTitle, color ? { color } : null]}>{children}</Text>;
}

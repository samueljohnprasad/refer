import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SummaryCard } from "./components/SummaryCard";
import { CaloriesCard } from "./components/CaloriesCard";
import { DailyGoalCard } from "./components/DailyGoalCard";
import { MealScoreCard } from "./components/MealScoreCard";
import {
  NutritionSummary,
  CaloriesData,
  DailyGoalData,
  MealScoreData,
  SAMPLE_NUTRITION_SUMMARY,
  SAMPLE_CALORIES,
  SAMPLE_DAILY_GOAL,
  SAMPLE_MEAL_SCORE,
} from "./data";

type NutrieScreenProps = {
  summary?: NutritionSummary;
  calories?: CaloriesData;
  dailyGoal?: DailyGoalData;
  mealScore?: MealScoreData;
};

export const NutrieScreen = ({
  summary = SAMPLE_NUTRITION_SUMMARY,
  calories = SAMPLE_CALORIES,
  dailyGoal = SAMPLE_DAILY_GOAL,
  mealScore = SAMPLE_MEAL_SCORE,
}: NutrieScreenProps) => {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 40 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.appleIcon}>🍎</Text>
        <Text style={styles.headerTitle}>Nutrie</Text>
      </View>

      <Animated.View entering={FadeInDown.duration(400).delay(100)}>
        <SummaryCard data={summary} />
      </Animated.View>

      <Animated.View
        entering={FadeInDown.duration(400).delay(200)}
        style={styles.row}
      >
        <CaloriesCard data={calories} />
        <DailyGoalCard data={dailyGoal} />
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(400).delay(300)}>
        <MealScoreCard data={mealScore} />
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#F7F7F8",
  },
  content: {
    gap: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  appleIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  row: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 12,
  },
});

export type MacroEntry = {
  label: string;
  shortLabel: string;
  percentage: number;
  color: string;
  trackColor: string;
};

export type MealScoreDay = {
  day: string;
  score: number;
  isHighlighted: boolean;
};

export type NutritionSummary = {
  calories: number;
  protein: { value: number; unit: string };
  fat: { value: number; unit: string };
  carbs: { value: number; unit: string };
  qualityScore: number;
  maxScore: number;
};

export type CaloriesData = {
  percentage: number;
  consumed: number;
  goal: number;
};

export type DailyGoalData = {
  macros: MacroEntry[];
};

export type MealScoreData = {
  description: string;
  todayLabel: string;
  todayScore: number;
  todayGrade: string;
  todayFeedback: string;
  averageLabel: string;
  averageScore: number;
  weekScores: MealScoreDay[];
};

export const SAMPLE_NUTRITION_SUMMARY: NutritionSummary = {
  calories: 1229,
  protein: { value: 43, unit: "g" },
  fat: { value: 71.5, unit: "g" },
  carbs: { value: 109, unit: "g" },
  qualityScore: 8.6,
  maxScore: 10,
};

export const SAMPLE_CALORIES: CaloriesData = {
  percentage: 73,
  consumed: 1229,
  goal: 1684,
};

export const SAMPLE_DAILY_GOAL: DailyGoalData = {
  macros: [
    {
      label: "Carbs",
      shortLabel: "C",
      percentage: 18,
      color: "#FF3B30",
      trackColor: "#FFE5E3",
    },
    {
      label: "Protein",
      shortLabel: "P",
      percentage: 32,
      color: "#8E8E93",
      trackColor: "#F0F0F3",
    },
    {
      label: "Fat",
      shortLabel: "F",
      percentage: 16,
      color: "#8E8E93",
      trackColor: "#F0F0F3",
    },
    {
      label: "Cholesterol",
      shortLabel: "C",
      percentage: 24,
      color: "#8E8E93",
      trackColor: "#F0F0F3",
    },
  ],
};

export const SAMPLE_MEAL_SCORE: MealScoreData = {
  description: "Meal score analyses the nutritional quality of your meals",
  todayLabel: "TODAY'S SCORE",
  todayScore: 8.3,
  todayGrade: "Great",
  todayFeedback: "Today's meal is good for sodium and fiber.",
  averageLabel: "Average 7 days\nmeal score",
  averageScore: 5.3,
  weekScores: [
    { day: "Mon", score: 3.2, isHighlighted: false },
    { day: "Tue", score: 4.5, isHighlighted: false },
    { day: "Wed", score: 2.8, isHighlighted: false },
    { day: "Thu", score: 6.1, isHighlighted: false },
    { day: "Fri", score: 7.2, isHighlighted: false },
    { day: "Sat", score: 8.5, isHighlighted: true },
    { day: "Sun", score: 9.0, isHighlighted: true },
  ],
};

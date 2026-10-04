import { View } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { moodScoreToColor } from "@/constants/moodColors";
import { useTranslation } from "react-i18next";
import { moodTranslationKey, type MoodLevel } from "./weeklyMoodChartData";

interface Props {
  subtitle: string;
  average: number;
  roundedAverage: number;
  mood: MoodLevel;
}

export function MoodChartSummary({ subtitle, average, roundedAverage, mood }: Props) {
  const { t } = useTranslation("insights");
  return (
    <>
      <View className="flex-row items-end justify-between px-4 mb-2">
        <Text className="flex-1 text-xs text-ink-soft font-medium">{subtitle}</Text>
        <View className="flex-row items-center">
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: moodScoreToColor(roundedAverage), marginRight: 6 }} />
          <Text className="text-xs text-ink-soft">
            {t("chart.weeklyMood.average")}{" "}
            <Text className="font-semibold text-ink">
              {average ? t(`chart.weeklyMood.scale.moods.${moodTranslationKey[mood]}`) : "-"}
            </Text>
          </Text>
        </View>
      </View>
    </>
  );
}

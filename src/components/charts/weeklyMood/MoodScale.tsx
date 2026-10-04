import { View } from "react-native";
import { MoodIcon, type MoodKey } from "@/src/components/MoodIcon";
import { moodScoreToPale } from "@/constants/moodColors";
import { useTranslation } from "react-i18next";

export function MoodScale() {
  const { t } = useTranslation("insights");
  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        right: 5,
        top: 120,
        bottom: 50,
        alignItems: "center",
        justifyContent: "space-between",
      }}
      accessibilityLabel={t("chart.weeklyMood.scale.accessibilityLabel")}
      accessibilityRole="image"
    >
      {[
        { score: 5, key: "great", label: t("chart.weeklyMood.scale.moods.great") },
        { score: 4, key: "good", label: t("chart.weeklyMood.scale.moods.good") },
        { score: 3, key: "fine", label: t("chart.weeklyMood.scale.moods.fine") },
        { score: 2, key: "bad", label: t("chart.weeklyMood.scale.moods.bad") },
        { score: 1, key: "terrible", label: t("chart.weeklyMood.scale.moods.terrible") },
      ].map((item) => (
        <View
          key={item.key}
          style={{
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: moodScoreToPale(item.score),
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 4,
          }}
          accessibilityLabel={t("chart.weeklyMood.scale.level", { mood: item.label })}
        >
          <MoodIcon mood={item.key as MoodKey} size={18} />
        </View>
      ))}
    </View>
  );
}

import { View, Text, StyleSheet, Platform } from "react-native";
import { SymbolView } from "expo-symbols";
import { Feather } from "@expo/vector-icons";
import { NutritionSummary } from "../data";

type BadgeIconType = "calories" | "protein" | "fat" | "carbs" | "quality";

const BADGE_SF_NAMES: Record<BadgeIconType, { sf: string; feather: string }> = {
  calories: { sf: "sun.max", feather: "sun" },
  protein: { sf: "snowflake", feather: "droplet" },
  fat: { sf: "moon.circle", feather: "moon" },
  carbs: { sf: "circle.fill", feather: "circle" },
  quality: { sf: "face.smiling", feather: "smile" },
};

type InlineBadgeProps = {
  icon: BadgeIconType;
  text: string;
};

const InlineBadge = ({ icon, text }: InlineBadgeProps) => {
  const iconConfig = BADGE_SF_NAMES[icon];

  return (
    <View style={styles.inlineBadge}>
      {Platform.OS === "ios" ? (
        <SymbolView
          name={iconConfig.sf as any}
          size={12}
          tintColor="#5C5C5C"
          weight="medium"
          style={{ width: 14, height: 14 }}
        />
      ) : (
        <Feather name={iconConfig.feather as any} size={12} color="#5C5C5C" />
      )}
      <Text style={styles.inlineBadgeText}>{text}</Text>
    </View>
  );
};

type SummaryCardProps = {
  data: NutritionSummary;
};

export const SummaryCard = ({ data }: SummaryCardProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <View style={styles.labelBadge}>
          {Platform.OS === "ios" ? (
            <SymbolView
              name="doc.text"
              size={13}
              tintColor="#6B5CE7"
              weight="semibold"
              style={{ width: 14, height: 14 }}
            />
          ) : (
            <Feather name="file-text" size={13} color="#6B5CE7" />
          )}
          <Text style={styles.labelText}>Summary</Text>
        </View>
      </View>

      <Text style={styles.bodyText}>
        You've had <InlineBadge icon="calories" text={`${data.calories}`} />{" "}
        calories,{" "}
        <InlineBadge
          icon="protein"
          text={`${data.protein.value}${data.protein.unit}`}
        />{" "}
        of protein,{" "}
        <InlineBadge icon="fat" text={`${data.fat.value}${data.fat.unit}`} /> of
        fat and{" "}
        <InlineBadge
          icon="carbs"
          text={`${data.carbs.value}${data.carbs.unit}`}
        />{" "}
        of carbs. The average quality of your food today so far is{" "}
        <InlineBadge icon="quality" text={`${data.qualityScore}`} /> out or{" "}
        {data.maxScore}.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 22,
    paddingBottom: 26,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
  },
  labelContainer: {
    marginBottom: 18,
  },
  labelBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F0EDFF",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  labelText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B5CE7",
  },
  bodyText: {
    fontSize: 21,
    fontWeight: "400",
    color: "#1A1A1A",
    lineHeight: 36,
    letterSpacing: -0.3,
  },
  inlineBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F4F5",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E0E0E2",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 5,
  },
  inlineBadgeText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1A1A1A",
  },
});

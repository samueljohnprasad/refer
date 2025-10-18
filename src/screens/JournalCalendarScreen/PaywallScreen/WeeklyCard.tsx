import { Text, View } from "@/components/Themed";
import { StyleSheet, TouchableOpacity } from "react-native";
import { COLORS } from "./helpers";
import { styles as bestOfferStyles } from "./BestOfferCard";

interface WeeklyCardProps {
  onPress: () => void;
  isSelected: boolean;
}
function WeeklyCard({ onPress, isSelected }: WeeklyCardProps) {
  return (
    <TouchableOpacity
      style={[
        styles.weeklyCard,
        isSelected && {
          ...bestOfferStyles.bestOfferCard,
          borderColor: "transparent",
        },
      ]}
      accessibilityRole="button"
      onPress={onPress}
    >
      <Text style={styles.weeklyLabel}>Weekly</Text>
      <Text style={styles.weeklyPrice}>
        ₹400<Text style={styles.per}>/week</Text>
      </Text>
    </TouchableOpacity>
  );
}

export const styles = StyleSheet.create({
  weeklyCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(15,23,42,0.15)",
  },

  weeklyLabel: {
    color: "rgba(15,23,42,0.75)",
    fontWeight: "700",
    marginBottom: 8,
  },
  weeklyPrice: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: "900",
  },
  per: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default WeeklyCard;

import { Text, View } from "@/components/Themed";
import { StyleSheet, TouchableOpacity } from "react-native";
import { COLORS } from "./helpers";

interface BestOfferCardProps {
  onPress: () => void;
  isSelected: boolean;
}
function BestOfferCard({ onPress, isSelected }: BestOfferCardProps) {
  return (
    <TouchableOpacity
      style={[
        styles.weeklyCard,
        isSelected && {
          ...styles.bestOfferCard,
          borderColor: "transparent",
        },
      ]}
      accessibilityRole="button"
      onPress={onPress}
    >
      <View style={styles.badge}>
        <Text style={styles.badgeText}>Best Offer</Text>
      </View>
      <Text style={styles.bigPrice}>
        ₹67<Text style={styles.per}>/week</Text>
      </Text>
      <Text style={styles.smallMuted}>billed yearly</Text>
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
  bestOfferCard: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    padding: 14,
    position: "relative",
  },
  badgeText: {
    color: COLORS.text,
    fontWeight: "800",
    fontSize: 12,
  },
  badge: {
    position: "absolute",
    top: -12,
    left: 12,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  bigPrice: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: "900",
  },

  per: {
    fontSize: 16,
    fontWeight: "600",
  },
  smallMuted: {
    marginTop: 4,
    color: "rgba(15,23,42,0.6)",
    fontWeight: "600",
  },
});

export default BestOfferCard;

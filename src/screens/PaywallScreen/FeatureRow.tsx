import { StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";
import { COLORS, RADIUS } from "./helpers";

function FeatureRow({
  icon,
  tint,
  label,
}: {
  icon: React.ReactNode;
  tint: string;
  label: string;
}) {
  return (
    <View style={styles.featureRow}>
      <View style={[styles.featureIconChip, { backgroundColor: tint }]}>
        {icon}
      </View>
      <Text style={styles.featureLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  featureIconChip: {
    width: 34,
    height: 34,
    borderRadius: RADIUS.chip,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  featureLabel: {
    color: COLORS.text,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "600",
  },
});

export default FeatureRow;

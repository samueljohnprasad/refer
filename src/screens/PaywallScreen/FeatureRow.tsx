import { StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";
import { COLORS, RADIUS } from "./helpers";

function FeatureRow({
  icon,
  tint,
  label,
  subtitle,
}: {
  icon: React.ReactNode;
  tint: string;
  label: string;
  subtitle?: string;
}) {
  return (
    <View style={styles.featureRow}>
      <View style={[styles.featureIconChip, { backgroundColor: tint }]}>
        {icon}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.featureLabel}>{label}</Text>
        {subtitle && <Text style={styles.featureSubtitle}>{subtitle}</Text>}
      </View>
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
    lineHeight: 20,
    fontWeight: "600",
  },
  featureSubtitle: {
    color: "rgba(15,23,42,0.6)",
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
});

export default FeatureRow;

import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";

interface AIInsightsChipProps {
  onPress: () => void;
  visible?: boolean;
}

/**
 * Presentational floating chip component for AI insights
 * Shows below week navigation when AI summary exists
 */
export const AIInsightsChip: React.FC<AIInsightsChipProps> = ({
  onPress,
  visible = true,
}) => {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        style={styles.touchable}
      >
        <LinearGradient
          colors={["#7B61FF", "#9C7CFF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          <Text style={styles.icon}>✨</Text>
          <Text style={styles.text}>Week Insights</Text>
          <Feather name="chevron-right" size={16} color="#FFF" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    marginTop: 8,
    marginBottom: 12,
  },
  touchable: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#7B61FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  gradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 18,
    gap: 10,
  },
  icon: {
    fontSize: 20,
  },
  text: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#FFF",
    letterSpacing: 0.3,
  },
});

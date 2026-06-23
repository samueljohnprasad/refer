import { View, Text, StyleSheet, Platform } from "react-native";
import { SymbolView } from "expo-symbols";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useEffect } from "react";
import { CaloriesData } from "../data";

type CaloriesCardProps = {
  data: CaloriesData;
};

export const CaloriesCard = ({ data }: CaloriesCardProps) => {
  const animatedWidth = useSharedValue(0);

  useEffect(() => {
    animatedWidth.value = withTiming(Math.min(data.percentage, 100), {
      duration: 900,
      easing: Easing.out(Easing.cubic),
    });
  }, [data.percentage]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${animatedWidth.value}%`,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.labelBadge}>
        {Platform.OS === "ios" ? (
          <SymbolView
            name="gearshape"
            size={12}
            tintColor="#00A3D9"
            weight="semibold"
            style={{ width: 14, height: 14 }}
          />
        ) : (
          <Feather name="settings" size={12} color="#00A3D9" />
        )}
        <Text style={styles.labelText}>Calories</Text>
      </View>

      <View style={styles.valueRow}>
        <Text style={styles.valueText}>{data.percentage}</Text>
        <Text style={styles.unitText}>%</Text>
      </View>

      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressFill, progressStyle]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
  },
  labelBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#E4F6FC",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    alignSelf: "flex-start",
  },
  labelText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#00A3D9",
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 14,
    marginBottom: 14,
  },
  valueText: {
    fontSize: 60,
    fontWeight: "800",
    color: "#1A1A1A",
    letterSpacing: -3,
    lineHeight: 64,
  },
  unitText: {
    fontSize: 24,
    fontWeight: "300",
    color: "#C4C4CC",
    marginLeft: 2,
  },
  progressTrack: {
    height: 14,
    backgroundColor: "#E4F6FC",
    borderRadius: 7,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#00B4E6",
    borderRadius: 7,
  },
});

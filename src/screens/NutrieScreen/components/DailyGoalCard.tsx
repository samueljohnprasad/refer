import { View, Text, StyleSheet, Platform } from "react-native";
import { SymbolView } from "expo-symbols";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { useEffect } from "react";
import { DailyGoalData, MacroEntry } from "../data";

type MacroRowProps = {
  macro: MacroEntry;
  index: number;
};

const MacroRow = ({ macro, index }: MacroRowProps) => {
  const animatedWidth = useSharedValue(0);

  useEffect(() => {
    animatedWidth.value = withDelay(
      index * 120,
      withTiming(Math.min(macro.percentage * 2.5, 100), {
        duration: 700,
        easing: Easing.out(Easing.cubic),
      }),
    );
  }, [macro.percentage, index]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${animatedWidth.value}%`,
  }));

  return (
    <View style={styles.macroRow}>
      <Text style={styles.macroLabel}>{macro.shortLabel}</Text>
      <View
        style={[styles.macroBarTrack, { backgroundColor: macro.trackColor }]}
      >
        <Animated.View
          style={[
            styles.macroBarFill,
            { backgroundColor: macro.color },
            fillStyle,
          ]}
        />
      </View>
      <Text style={styles.macroValue}>{macro.percentage}%</Text>
    </View>
  );
};

type DailyGoalCardProps = {
  data: DailyGoalData;
};

export const DailyGoalCard = ({ data }: DailyGoalCardProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.labelBadge}>
        {Platform.OS === "ios" ? (
          <SymbolView
            name="flame"
            size={12}
            tintColor="#FF6B4A"
            weight="semibold"
            style={{ width: 14, height: 14 }}
          />
        ) : (
          <Feather name="target" size={12} color="#FF6B4A" />
        )}
        <Text style={styles.labelText}>Daily goal</Text>
      </View>

      <View style={styles.macroList}>
        {data.macros.map((macro, index) => (
          <MacroRow
            key={`${macro.shortLabel}-${index}`}
            macro={macro}
            index={index}
          />
        ))}
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
    backgroundColor: "#FFEDE8",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    alignSelf: "flex-start",
    marginBottom: 18,
  },
  labelText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FF6B4A",
  },
  macroList: {
    gap: 14,
  },
  macroRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  macroLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1A1A1A",
    width: 16,
  },
  macroBarTrack: {
    flex: 1,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 10,
    overflow: "hidden",
  },
  macroBarFill: {
    height: "100%",
    borderRadius: 6,
  },
  macroValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    width: 38,
    textAlign: "right",
  },
});

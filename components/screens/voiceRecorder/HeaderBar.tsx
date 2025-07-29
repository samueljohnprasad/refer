import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const HeaderBar: React.FC = () => (
  <View style={styles.header}>
    <Text style={styles.date}>
      {new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })}
    </Text>
    <View style={styles.streakContainer}>
      <Ionicons name="flame" size={16} color="#FF6B6B" />
      <Text style={styles.streakText}>1</Text>
    </View>
  </View>
);

export default HeaderBar;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 30,
  },
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  streakText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF6B6B",
    marginLeft: 4,
  },
  date: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D3748",
  },
});

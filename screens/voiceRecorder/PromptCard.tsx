import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ReanimatedView, { FadeInUp } from "react-native-reanimated";

const PromptCard: React.FC = () => (
  <ReanimatedView.View
    entering={FadeInUp.delay(400)
      .duration(1000)
      .springify()
      .damping(25)
      .stiffness(60)}
    style={styles.journalCard}
  >
    <Text style={styles.journalQuestion}>
      How did your voice recording go today?
    </Text>
  </ReanimatedView.View>
);

export default PromptCard;

const styles = StyleSheet.create({
  journalCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 24,
    padding: 32,
    marginBottom: 40,
    minHeight: 300,
    justifyContent: "center",
    alignItems: "center",
    // Soft drop shadow with pastel accent
    shadowColor: "#E8D5FF", // Soft lavender shadow
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    // Subtle inner border for inset effect
    borderWidth: 1,
    borderColor: "rgba(232, 213, 255, 0.3)", // Soft lavender border
    // Additional visual depth
    transform: [{ translateY: -2 }],
  },
  journalQuestion: {
    fontSize: 24,
    fontWeight: "600",
    color: "#2D3748",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 32,
  },
});

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const InsightsScreen: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("1W");

  // Hardcoded mood trend data (1-5 scale)
  const moodData = [
    { x: 1, y: 3.2 },
    { x: 2, y: 3.1 },
    { x: 3, y: 3.0 },
    { x: 4, y: 3.2 },
    { x: 5, y: 3.4 },
    { x: 6, y: 3.6 },
    { x: 7, y: 3.8 },
    { x: 8, y: 4.1 },
    { x: 9, y: 4.3 },
    { x: 10, y: 4.5 },
    { x: 11, y: 4.7 },
    { x: 12, y: 4.9 },
    { x: 13, y: 5.0 },
  ];

  const periods = ["1D", "1W", "1M", "3M", "6M", "1Y", "All"];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1494790108755-2616b612b407?w=100&h=100&fit=crop&crop=face",
            }}
            style={styles.profileImage}
          />
        </View>
        
        <Pressable style={styles.inviteButton}>
          <Text style={styles.inviteText}>Invite</Text>
          <Feather name="gift" size={16} color="#000" style={{ marginLeft: 6 }} />
        </Pressable>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Main Mood Score */}
        <View style={styles.mainScoreContainer}>
          <Text style={styles.moodScore}>4.2</Text>
          <Text style={styles.moodScoreDecimal}>/5</Text>
        </View>

        <View style={styles.todayContainer}>
          <Text style={styles.todayLabel}>Today</Text>
          <View style={styles.trendContainer}>
            <Feather name="trending-up" size={16} color="#22C55E" />
            <Text style={styles.trendText}>12.3%</Text>
            <Text style={styles.trendValue}>(+0.5)</Text>
          </View>
        </View>

        {/* Chart Container - Mood Trend Visualization */}
        <View style={styles.chartContainer}>
          <View style={styles.chartPlaceholder}>
            <View style={styles.chartLine} />
            <Text style={styles.chartPlaceholderText}>Mood Trending Upward</Text>
            <Text style={styles.chartSubtext}>4.2 average this week</Text>
          </View>
        </View>

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {periods.map((period) => (
            <Pressable
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.periodButtonActive,
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text
                style={[
                  styles.periodText,
                  selectedPeriod === period && styles.periodTextActive,
                ]}
              >
                {period}
              </Text>
            </Pressable>
          ))}
          
          <Pressable style={styles.shareButton}>
            <Feather name="share" size={16} color="#6B7280" />
          </Pressable>
        </View>

        {/* Insights Cards */}
        <View style={styles.insightsContainer}>
          <View style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <Feather name="zap" size={20} color="#F59E0B" />
              <Text style={styles.insightTitle}>Streak</Text>
            </View>
            <Text style={styles.insightValue}>14 days</Text>
            <Text style={styles.insightSubtext}>Current journaling streak</Text>
          </View>

          <View style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <Feather name="edit-3" size={20} color="#8B5CF6" />
              <Text style={styles.insightTitle}>Words</Text>
            </View>
            <Text style={styles.insightValue}>2,847</Text>
            <Text style={styles.insightSubtext}>This week</Text>
          </View>

          <View style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <Feather name="heart" size={20} color="#EF4444" />
              <Text style={styles.insightTitle}>Positivity</Text>
            </View>
            <Text style={styles.insightValue}>73%</Text>
            <Text style={styles.insightSubtext}>Of your entries</Text>
          </View>
        </View>

        {/* Reflection Summary */}
        <View style={styles.reflectionCard}>
          <View style={styles.reflectionHeader}>
            <Feather name="sunrise" size={20} color="#06B6D4" />
            <Text style={styles.reflectionTitle}>Weekly Reflection</Text>
          </View>
          <Text style={styles.reflectionText}>
            You've shown remarkable consistency this week. Your mood has been trending upward, especially after evening walks. Consider scheduling walks on stressful days to maintain this positive momentum.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  profileContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: "#E5E7EB",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  inviteButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  inviteText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
  },
  mainScoreContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
    marginTop: 40,
  },
  moodScore: {
    fontSize: 72,
    fontWeight: "300",
    color: "#000",
    letterSpacing: -2,
  },
  moodScoreDecimal: {
    fontSize: 32,
    fontWeight: "300",
    color: "#9CA3AF",
    marginLeft: 4,
  },
  todayContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 40,
  },
  todayLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    marginRight: 12,
  },
  trendContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  trendText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#22C55E",
    marginLeft: 4,
  },
  trendValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#22C55E",
    marginLeft: 4,
  },
  chartContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  periodSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  periodButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  periodButtonActive: {
    backgroundColor: "#22C55E",
  },
  periodText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#9CA3AF",
  },
  periodTextActive: {
    color: "#FFFFFF",
  },
  shareButton: {
    padding: 8,
  },
  insightsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  insightCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    flex: 1,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  insightHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
    marginLeft: 6,
  },
  insightValue: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  insightSubtext: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  reflectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  reflectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  reflectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginLeft: 8,
  },
  reflectionText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#4B5563",
  },
  chartPlaceholder: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    margin: 10,
  },
  chartLine: {
    width: "70%",
    height: 4,
    backgroundColor: "#22C55E",
    borderRadius: 2,
    marginBottom: 16,
    transform: [{ rotate: "5deg" }],
  },
  chartPlaceholderText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#22C55E",
    marginBottom: 4,
  },
  chartSubtext: {
    fontSize: 14,
    color: "#6B7280",
  },
});

export default InsightsScreen;

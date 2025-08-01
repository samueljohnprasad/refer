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
import { VictoryLine, VictoryChart, VictoryArea, VictoryTheme } from "victory-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const InsightsScreen: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("1W");
  const periods = ["1D", "1W", "1M", "3M", "6M", "1Y", "All"];

  // Comprehensive test data for different time periods
  const moodDataSets = {
    "1D": [
      { x: 1, y: 4.2 }, { x: 2, y: 4.1 }, { x: 3, y: 4.3 }, { x: 4, y: 4.2 },
      { x: 5, y: 4.4 }, { x: 6, y: 4.1 }, { x: 7, y: 4.0 }, { x: 8, y: 4.2 },
      { x: 9, y: 4.3 }, { x: 10, y: 4.5 }, { x: 11, y: 4.2 }, { x: 12, y: 4.0 },
      { x: 13, y: 3.9 }, { x: 14, y: 4.1 }, { x: 15, y: 4.3 }, { x: 16, y: 4.4 },
      { x: 17, y: 4.2 }, { x: 18, y: 4.0 }, { x: 19, y: 4.1 }, { x: 20, y: 4.2 },
      { x: 21, y: 4.3 }, { x: 22, y: 4.1 }, { x: 23, y: 3.9 }, { x: 24, y: 4.0 }
    ],
    "1W": [
      { x: 1, y: 3.8 }, { x: 2, y: 3.9 }, { x: 3, y: 4.1 }, { x: 4, y: 4.0 },
      { x: 5, y: 4.2 }, { x: 6, y: 4.3 }, { x: 7, y: 4.2 }
    ],
    "1M": [
      { x: 1, y: 3.2 }, { x: 3, y: 3.4 }, { x: 5, y: 3.3 }, { x: 7, y: 3.6 },
      { x: 9, y: 3.8 }, { x: 11, y: 3.7 }, { x: 13, y: 3.9 }, { x: 15, y: 4.0 },
      { x: 17, y: 4.1 }, { x: 19, y: 4.2 }, { x: 21, y: 4.0 }, { x: 23, y: 4.1 },
      { x: 25, y: 4.3 }, { x: 27, y: 4.2 }, { x: 29, y: 4.4 }, { x: 30, y: 4.2 }
    ],
    "3M": [
      { x: 1, y: 2.8 }, { x: 7, y: 2.9 }, { x: 14, y: 3.1 }, { x: 21, y: 3.0 },
      { x: 28, y: 3.2 }, { x: 35, y: 3.4 }, { x: 42, y: 3.3 }, { x: 49, y: 3.5 },
      { x: 56, y: 3.7 }, { x: 63, y: 3.8 }, { x: 70, y: 3.9 }, { x: 77, y: 4.0 },
      { x: 84, y: 4.2 }, { x: 91, y: 4.1 }
    ],
    "6M": [
      { x: 1, y: 2.5 }, { x: 15, y: 2.7 }, { x: 30, y: 2.8 }, { x: 45, y: 3.0 },
      { x: 60, y: 3.2 }, { x: 75, y: 3.1 }, { x: 90, y: 3.3 }, { x: 105, y: 3.5 },
      { x: 120, y: 3.7 }, { x: 135, y: 3.8 }, { x: 150, y: 3.9 }, { x: 165, y: 4.1 },
      { x: 180, y: 4.2 }
    ],
    "1Y": [
      { x: 1, y: 2.2 }, { x: 30, y: 2.4 }, { x: 60, y: 2.6 }, { x: 90, y: 2.8 },
      { x: 120, y: 3.0 }, { x: 150, y: 3.1 }, { x: 180, y: 3.3 }, { x: 210, y: 3.5 },
      { x: 240, y: 3.7 }, { x: 270, y: 3.8 }, { x: 300, y: 3.9 }, { x: 330, y: 4.1 },
      { x: 365, y: 4.2 }
    ],
    "All": [
      { x: 1, y: 2.0 }, { x: 60, y: 2.2 }, { x: 120, y: 2.5 }, { x: 180, y: 2.7 },
      { x: 240, y: 2.9 }, { x: 300, y: 3.1 }, { x: 360, y: 3.3 }, { x: 420, y: 3.5 },
      { x: 480, y: 3.7 }, { x: 540, y: 3.8 }, { x: 600, y: 3.9 }, { x: 660, y: 4.0 },
      { x: 720, y: 4.2 }
    ]
  };

  const getCurrentData = () => moodDataSets[selectedPeriod as keyof typeof moodDataSets] || moodDataSets["1W"];
  
  const getLatestValue = () => {
    const data = getCurrentData();
    return data[data.length - 1]?.y || 4.2;
  };
  
  const getTrendPercentage = () => {
    const data = getCurrentData();
    if (data.length < 2) return "0.00";
    const current = data[data.length - 1].y;
    const previous = data[data.length - 2].y;
    const change = ((current - previous) / previous) * 100;
    return Math.abs(change).toFixed(2);
  };
  
  const getTrendDirection = () => {
    const data = getCurrentData();
    if (data.length < 2) return "stable";
    const current = data[data.length - 1].y;
    const previous = data[data.length - 2].y;
    return current > previous ? "up" : current < previous ? "down" : "stable";
  };

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
        {/* Premium Serene Chart Section */}
        <View style={styles.premiumChartSection}>
          {/* Gentle Score Display with Breathing Animation */}
          <View style={styles.serenePScoreDisplay}>
            <View style={styles.breathingScoreContainer}>
              <Text style={styles.premiumMainScore}>{getLatestValue().toFixed(1)}</Text>
              <Text style={styles.etherealDecimal}>/{selectedPeriod === '1D' ? '5' : '5'}</Text>
            </View>
            <View style={styles.sereneDivider} />
          </View>

          {/* Calm Today Stats */}
          <View style={styles.sereneStats}>
            <Text style={styles.calmLabel}>{selectedPeriod === '1D' ? 'Today' : selectedPeriod}</Text>
            <View style={styles.gentleChangeContainer}>
              <View style={[
                styles.trendIconContainer,
                { backgroundColor: getTrendDirection() === 'up' ? 'rgba(34, 197, 94, 0.1)' : 
                                 getTrendDirection() === 'down' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(107, 114, 128, 0.1)' }
              ]}>
                <Feather 
                  name={getTrendDirection() === 'up' ? 'trending-up' : getTrendDirection() === 'down' ? 'trending-down' : 'minus'} 
                  size={14} 
                  color={getTrendDirection() === 'up' ? '#059669' : getTrendDirection() === 'down' ? '#DC2626' : '#6B7280'} 
                />
              </View>
              <Text style={[
                styles.gentlePercentage,
                { color: getTrendDirection() === 'up' ? '#059669' : getTrendDirection() === 'down' ? '#DC2626' : '#6B7280' }
              ]}>
                {getTrendPercentage()}%
              </Text>
              <Text style={styles.whisperChange}>
                ({getTrendDirection() === 'up' ? '+' : getTrendDirection() === 'down' ? '-' : ''}0.{Math.floor(Math.random() * 99).toString().padStart(2, '0')})
              </Text>
            </View>
          </View>

          {/* Premium Chart Container with Breath-like Glow */}
          <View style={styles.premiumChartWrapper}>
            <View style={styles.chartGlowContainer}>
              <VictoryChart
                width={screenWidth - 60}
                height={220}
                padding={{ left: 30, right: 30, top: 30, bottom: 30 }}
                theme={{
                  ...VictoryTheme.clean,
                  chart: { padding: 30 },
                  axis: {
                    style: {
                      grid: { stroke: "rgba(148, 163, 184, 0.1)", strokeDasharray: "3,3" },
                      axis: { stroke: "transparent" },
                      ticks: { stroke: "transparent" },
                      tickLabels: { fill: "transparent" }
                    }
                  }
                }}
                domain={{ y: [1.5, 5.0] }}
              >
                {/* Ethereal Area with Gradient */}
                <VictoryArea
                  data={getCurrentData()}
                  style={{
                    data: {
                      fill: "#059669",
                      fillOpacity: 0.15,
                      stroke: "rgba(34, 197, 94, 0.2)",
                      strokeWidth: 1,
                    },
                  }}
                  interpolation="catmullRom"
                  animate={{
                    duration: 1800,
                    onLoad: { duration: 2400 }
                  }}
                />
                
                {/* Main Serene Trend Line */}
                <VictoryLine
                  data={getCurrentData()}
                  style={{
                    data: {
                      stroke: "#059669",
                      strokeWidth: 2.5,
                      strokeLinecap: "round",
                    },
                  }}
                  interpolation="catmullRom"
                  animate={{
                    duration: 1800,
                    onLoad: { duration: 2400 }
                  }}
                />
                
                {/* Gentle Current Point Indicator - using VictoryScatter for proper point rendering */}
                <VictoryLine
                  data={[getCurrentData()[getCurrentData().length - 1]]}
                  style={{
                    data: {
                      stroke: "#059669",
                      strokeWidth: 4,
                    },
                  }}
                  animate={{
                    duration: 2000,
                    onLoad: { duration: 3000 }
                  }}
                />
              </VictoryChart>
              
              {/* Breathing Glow Effect */}
              <View style={styles.breathingGlow} />
            </View>
          </View>

          {/* Period Selector */}
          <View style={styles.periodSelector}>
            <View style={styles.periodButtons}>
              {periods.map((period) => (
                <Pressable
                  key={period}
                  style={[
                    styles.periodButton,
                    selectedPeriod === period && styles.activePeriodButton,
                  ]}
                  onPress={() => setSelectedPeriod(period)}
                >
                  <Text
                    style={[
                      styles.periodText,
                      selectedPeriod === period && styles.activePeriodText,
                    ]}
                  >
                    {period}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Pressable style={styles.shareButton}>
              <Feather name="share" size={18} color="#9CA3AF" />
            </Pressable>
          </View>
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
    backgroundColor: "#FFFFFF",
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
    paddingHorizontal: 20,
  },
  premiumChartSection: {
    backgroundColor: "#FEFEFE",
    paddingVertical: 40,
    paddingHorizontal: 24,
    marginBottom: 28,
    borderRadius: 24,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 12,
    elevation: 3,
  },
  serenePScoreDisplay: {
    alignItems: "center",
    marginBottom: 20,
  },
  breathingScoreContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 12,
  },
  premiumMainScore: {
    fontSize: 68,
    fontWeight: "200",
    color: "#1F2937",
    letterSpacing: -2.5,
    lineHeight: 68,
    textShadowColor: "rgba(0, 0, 0, 0.05)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  etherealDecimal: {
    fontSize: 28,
    fontWeight: "200",
    color: "#94A3B8",
    letterSpacing: -0.5,
    marginLeft: 3,
    opacity: 0.8,
  },
  sereneDivider: {
    width: 40,
    height: 1,
    backgroundColor: "rgba(148, 163, 184, 0.2)",
    borderRadius: 1,
  },
  sereneStats: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 36,
  },
  calmLabel: {
    fontSize: 15,
    fontWeight: "400",
    color: "#374151",
    marginRight: 16,
    letterSpacing: 0.2,
  },
  gentleChangeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(248, 250, 252, 0.8)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  trendIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  gentlePercentage: {
    fontSize: 14,
    fontWeight: "500",
    marginRight: 6,
    letterSpacing: 0.1,
  },
  whisperChange: {
    fontSize: 13,
    fontWeight: "400",
    color: "#64748B",
    opacity: 0.8,
  },
  premiumChartWrapper: {
    alignItems: "center",
    marginBottom: 36,
    height: 240,
  },
  chartGlowContainer: {
    position: "relative",
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    shadowColor: "#059669",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
  },
  breathingGlow: {
    position: "absolute",
    top: -15,
    left: -15,
    right: -15,
    bottom: -15,
    borderRadius: 35,
    backgroundColor: "rgba(5, 150, 105, 0.04)",
    zIndex: -1,
    // Subtle breathing animation effect
    transform: [{ scale: 1.0 }],
  },
  periodSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  periodButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  activePeriodButton: {
    backgroundColor: "#22C55E",
  },
  periodText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#9CA3AF",
  },
  activePeriodText: {
    color: "#FFFFFF",
  },
  shareButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
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

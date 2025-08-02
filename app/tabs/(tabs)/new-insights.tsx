import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  Animated,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import {
  VictoryChart,
  VictoryLine,
  VictoryScatter,
  VictoryAxis,
  VictoryArea,
  VictoryLabel,
} from "victory-native";
import { Feather } from "@expo/vector-icons";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface MoodDataPoint {
  day: string;
  dayIndex: number;
  mood: number; // 1 = Depressed, 2 = Neutral, 3 = Happy
  label: string;
  x: number;
  y: number;
}

interface InsightsApiResponse {
  moodData: MoodDataPoint[];
  insights: string;
  period: string;
}

// Simulated API service
class InsightsApiService {
  static async fetchMoodData(period: string): Promise<InsightsApiResponse> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Test data based on period
    const dataByPeriod: Record<string, MoodDataPoint[]> = {
      "This week": [
        { day: "Mon", dayIndex: 0, mood: 3, label: "Happy", x: 0, y: 3 },
        { day: "Tue", dayIndex: 1, mood: 2.5, label: "Good", x: 1, y: 2.5 },
        { day: "Wed", dayIndex: 2, mood: 2, label: "Neutral", x: 2, y: 2 },
        { day: "Thu", dayIndex: 3, mood: 1, label: "Depressed", x: 3, y: 1 },
        { day: "Fri", dayIndex: 4, mood: 2, label: "Neutral", x: 4, y: 2 },
        { day: "Sat", dayIndex: 5, mood: 2.8, label: "Good", x: 5, y: 2.8 },
        { day: "Sun", dayIndex: 6, mood: 3, label: "Happy", x: 6, y: 3 },
      ],
      "Last week": [
        { day: "Mon", dayIndex: 0, mood: 2.5, label: "Good", x: 0, y: 2.5 },
        { day: "Tue", dayIndex: 1, mood: 3, label: "Happy", x: 1, y: 3 },
        { day: "Wed", dayIndex: 2, mood: 2.8, label: "Good", x: 2, y: 2.8 },
        { day: "Thu", dayIndex: 3, mood: 2, label: "Neutral", x: 3, y: 2 },
        { day: "Fri", dayIndex: 4, mood: 1.5, label: "Low", x: 4, y: 1.5 },
        { day: "Sat", dayIndex: 5, mood: 2.2, label: "Neutral", x: 5, y: 2.2 },
        { day: "Sun", dayIndex: 6, mood: 2.9, label: "Good", x: 6, y: 2.9 },
      ],
      "This month": [
        { day: "W1", dayIndex: 0, mood: 2.8, label: "Good", x: 0, y: 2.8 },
        { day: "W2", dayIndex: 1, mood: 2.4, label: "Neutral", x: 1, y: 2.4 },
        { day: "W3", dayIndex: 2, mood: 1.8, label: "Low", x: 2, y: 1.8 },
        { day: "W4", dayIndex: 3, mood: 2.6, label: "Good", x: 3, y: 2.6 },
      ],
      "Last month": [
        { day: "W1", dayIndex: 0, mood: 2.2, label: "Neutral", x: 0, y: 2.2 },
        { day: "W2", dayIndex: 1, mood: 2.7, label: "Good", x: 1, y: 2.7 },
        { day: "W3", dayIndex: 2, mood: 3, label: "Happy", x: 2, y: 3 },
        { day: "W4", dayIndex: 3, mood: 2.5, label: "Good", x: 3, y: 2.5 },
      ],
    };

    const insightsByPeriod: Record<string, string> = {
      "This week":
        "Your mood has been fluctuating this week. Remember that it's normal to experience ups and downs. Consider practicing mindfulness or reaching out to someone you trust.",
      "Last week":
        "Last week showed more stability in your emotional patterns. You handled challenges well and maintained good self-care habits.",
      "This month":
        "This month has been a journey of growth. You've shown resilience through difficult periods and celebrated the good moments.",
      "Last month":
        "Last month demonstrated your ability to maintain emotional balance. Your mindfulness practices seem to be helping.",
    };

    return {
      moodData: dataByPeriod[period] || dataByPeriod["This week"],
      insights: insightsByPeriod[period] || insightsByPeriod["This week"],
      period,
    };
  }
}

const InsightsScreen: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("This week");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [moodData, setMoodData] = useState<MoodDataPoint[]>([]);
  const [insights, setInsights] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const chartFadeAnim = useRef(new Animated.Value(0)).current;
  const chartScaleAnim = useRef(new Animated.Value(0.95)).current;
  const dropdownAnim = useRef(new Animated.Value(0)).current;

  // Fetch mood data from simulated API
  const fetchMoodData = async (period: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await InsightsApiService.fetchMoodData(period);
      setMoodData(response.moodData);
      setInsights(response.insights);
    } catch (err) {
      setError("Failed to load mood data. Please try again.");
      console.error("Error fetching mood data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const periods = ["This week", "Last week", "This month", "Last month"];

  useEffect(() => {
    // Initial data fetch
    fetchMoodData(selectedPeriod);
  }, []);

  useEffect(() => {
    // Gentle entrance animations
    if (!isLoading) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start();

      // Delayed chart animation for a mindful reveal
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(chartFadeAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.spring(chartScaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            tension: 20,
            friction: 8,
          }),
        ]).start();
      }, 400);
    }
  }, [isLoading]);

  const getMoodColor = (mood: number): string => {
    if (mood >= 2.5) return "#84CC16"; // Happy - soft green
    if (mood >= 1.5) return "#84CC16"; // Neutral - same green for consistency
    return "#EAB308"; // Depressed - warm yellow
  };

  const getMoodLabel = (mood: number): string => {
    if (mood >= 2.5) return "Happy";
    if (mood >= 1.5) return "Neutral";
    return "Depressed";
  };

  const toggleDropdown = (): void => {
    setShowDropdown(!showDropdown);
    Animated.timing(dropdownAnim, {
      toValue: showDropdown ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const selectPeriod = (period: string): void => {
    setSelectedPeriod(period);
    setShowDropdown(false);
    Animated.timing(dropdownAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();

    // Reset animations and fetch new data
    fadeAnim.setValue(0);
    slideAnim.setValue(30);
    chartFadeAnim.setValue(0);
    chartScaleAnim.setValue(0.95);
    fetchMoodData(period);
  };

  // Get current day's data point (or middle point for non-weekly data)
  const currentDayData =
    moodData.length > 0 ? moodData[Math.floor(moodData.length / 2)] : null;

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#84CC16" />
          <Text style={styles.loadingText}>Loading your insights...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Feather name="alert-circle" size={48} color="#EF4444" />
          <Text style={styles.errorText}>{error}</Text>
          <Pressable
            onPress={() => fetchMoodData(selectedPeriod)}
            style={styles.retryButton}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>My Insights</Text>

          {/* Period Selector with Dropdown */}
          <View style={styles.periodSelectorContainer}>
            <Pressable onPress={toggleDropdown} style={styles.periodSelector}>
              <Text style={styles.periodText}>{selectedPeriod}</Text>
              <Animated.View
                style={{
                  transform: [
                    {
                      rotate: dropdownAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0deg", "180deg"],
                      }),
                    },
                  ],
                }}
              >
                <Feather name="chevron-down" size={20} color="#6B7280" />
              </Animated.View>
            </Pressable>

            {/* Dropdown Menu */}
            {showDropdown && (
              <Animated.View
                style={[
                  styles.dropdown,
                  {
                    opacity: dropdownAnim,
                    transform: [
                      {
                        translateY: dropdownAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-10, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                {periods.map((period) => (
                  <Pressable
                    key={period}
                    onPress={() => selectPeriod(period)}
                    style={styles.dropdownItem}
                  >
                    <Text style={styles.dropdownText}>{period}</Text>
                  </Pressable>
                ))}
              </Animated.View>
            )}
          </View>
        </View>

        {/* Chart Container */}
        <Animated.View
          style={[
            styles.chartContainer,
            {
              opacity: chartFadeAnim,
              transform: [{ scale: chartScaleAnim }],
            },
          ]}
        >
          {/* Mood Labels */}
          {/* <View style={styles.moodLabelsContainer}>
            <View style={[styles.moodLabel, { backgroundColor: "#84CC16" }]}>
              <Text style={styles.moodLabelText}>Happy</Text>
            </View>
            <View style={[styles.moodLabel, { backgroundColor: "#84CC16" }]}>
              <Text style={styles.moodLabelText}>Neutral</Text>
            </View>
          </View> */}

          {/* Chart Area with soft background */}
          <View style={styles.chartWrapper}>
            <VictoryChart
              width={screenWidth - 40}
              height={280}
              padding={{ left: 4, top: 4, right: 4, bottom: 40 }}
              domain={{ x: [-0.5, 6.5], y: [0.5, 3.5] }}
            >
              {/* Soft background area */}
              {/* <VictoryArea
                data={moodData}
                x="x"
                y="y"
                style={{
                  data: {
                    fill: "#FEF3C7",
                    fillOpacity: 0.3,
                    stroke: "none",
                  },
                }}
                animate={{
                  duration: 2000,
                  onLoad: { duration: 2500 },
                }}
              /> */}

              {/* Main mood line */}
              <VictoryLine
                data={moodData}
                x="x"
                y="y"
                style={{
                  data: {
                    stroke: "#92400E",
                    strokeWidth: 3,
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                  },
                }}
                interpolation="catmullRom"
                animate={{
                  duration: 2200,
                  onLoad: { duration: 2800 },
                }}
              />

              {/* Data points with labels */}
              <VictoryScatter
                data={moodData}
                x="x"
                y="y"
                size={8}
                style={{
                  data: {
                    fill: (datum) => getMoodColor(datum.y),
                    stroke: "#ffffff",
                    strokeWidth: 3,
                  },
                }}
                labelComponent={<View></View>}
                animate={{
                  duration: 1800,
                  onLoad: { duration: 3200 },
                }}
              />

              {/* Current day highlight */}
              {currentDayData && (
                <VictoryScatter
                  data={[currentDayData]}
                  x="x"
                  y="y"
                  size={12}
                  style={{
                    data: {
                      fill: "#EAB308",
                      stroke: "#ffffff",
                      strokeWidth: 4,
                    },
                  }}
                  animate={{
                    duration: 1000,
                    onLoad: { duration: 4000 },
                  }}
                />
              )}

              {/* Y-axis (hidden but defines scale) */}
              <VictoryAxis
                dependentAxis
                domain={[0.5, 3.5]}
                style={{
                  axis: { stroke: "transparent" },
                  tickLabels: { display: "none" },
                  grid: { stroke: "transparent" },
                }}
              />

              {/* X-axis with day labels */}
              <VictoryAxis
                style={{
                  axis: { stroke: "transparent" },
                  tickLabels: {
                    fontSize: 14,
                    fill: "#9CA3AF",
                    fontFamily: "System",
                    fontWeight: "500",
                  },
                  grid: { stroke: "transparent" },
                }}
                tickFormat={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
              />
            </VictoryChart>

            {/* Current mood indicator */}
            {/* {currentDayData && (
              <View style={styles.currentMoodIndicator}>
                <View
                  style={[
                    styles.currentMoodBadge,
                    { backgroundColor: getMoodColor(currentDayData.y) },
                  ]}
                >
                  <Text style={styles.currentMoodText}>
                    {currentDayData.label}
                  </Text>
                  <View
                    style={[
                      styles.currentMoodPointer,
                      { borderTopColor: getMoodColor(currentDayData.y) },
                    ]}
                  />
                </View>
              </View>
            )} */}
          </View>

          {/* Dynamic insights text */}
          <View style={styles.insightsTextContainer}>
            <Text style={styles.insightsText}>{insights}</Text>
          </View>
        </Animated.View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FEF7ED", // Warm, therapeutic background
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1F2937",
    letterSpacing: -0.5,
  },
  periodSelectorContainer: {
    position: "relative",
    zIndex: 10,
  },
  periodSelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  periodText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
    marginRight: 8,
  },
  dropdown: {
    position: "absolute",
    top: 50,
    right: 0,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    minWidth: 140,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  dropdownText: {
    fontSize: 15,
    fontWeight: "400",
    color: "#374151",
  },
  chartContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 5,
    overflow: "hidden",
  },
  moodLabelsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 40,
    paddingTop: 20,
    paddingBottom: 10,
  },
  moodLabel: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  moodLabelText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
  },
  chartWrapper: {
    position: "relative",
    backgroundColor: "#FFFBEB", // Soft cream background for chart area
    marginHorizontal: 4,
    marginVertical: 4,
    borderRadius: 16,
    overflow: "hidden",
  },
  currentMoodIndicator: {
    position: "absolute",
    top: 180, // Positioned over Thursday's "Depressed" point
    left: "57%", // Adjusted for Thursday position (4th day out of 7)
    transform: [{ translateX: -40 }],
    zIndex: 10,
  },
  currentMoodBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    position: "relative",
  },
  currentMoodText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#ffffff",
    textAlign: "center",
  },
  currentMoodPointer: {
    position: "absolute",
    bottom: -6,
    left: "50%",
    transform: [{ translateX: -6 }],
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#EAB308",
  },
  insightsTextContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#F8FAFC",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  insightsText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#6B7280",
    textAlign: "center",
    fontFamily: "System",
    fontWeight: "400",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FEF7ED",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6B7280",
    fontFamily: "System",
    fontWeight: "500",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FEF7ED",
    paddingHorizontal: 24,
  },
  errorText: {
    marginTop: 16,
    marginBottom: 24,
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    fontFamily: "System",
    fontWeight: "400",
  },
  retryButton: {
    backgroundColor: "#84CC16",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  retryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "System",
  },
});

export default InsightsScreen;

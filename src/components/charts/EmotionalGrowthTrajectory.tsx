import React, { useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  VictoryChart,
  VictoryTheme,
  VictoryLine,
  VictoryScatter,
  VictoryAxis,
  VictoryArea,
  VictoryLabel,
} from "victory-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { format, subMonths, addMonths } from "date-fns";
import { Defs, LinearGradient as SvgGradient, Stop } from "react-native-svg";

interface GrowthDataPoint {
  date: Date;
  emotionalWellbeing: number; // 0-100
  consistency: number; // 0-100
  resilience: number; // 0-100
  selfAwareness: number; // 0-100
}

interface Milestone {
  date: Date;
  title: string;
  description: string;
  icon: string;
}

interface EmotionalGrowthTrajectoryProps {
  data?: GrowthDataPoint[];
  milestones?: Milestone[];
  loading?: boolean;
  premium?: boolean;
  monthsToShow?: number;
  predictMonths?: number;
}

const METRICS = [
  { key: "emotionalWellbeing", label: "Emotional Wellbeing", color: "#10B981" },
  { key: "consistency", label: "Consistency", color: "#7B61FF" },
  { key: "resilience", label: "Resilience", color: "#F97316" },
  { key: "selfAwareness", label: "Self-Awareness", color: "#3B82F6" },
];

export const EmotionalGrowthTrajectory: React.FC<
  EmotionalGrowthTrajectoryProps
> = ({
  data,
  milestones,
  loading = false,
  premium = false,
  monthsToShow = 6,
  predictMonths = 3,
}) => {
  // Generate mock historical data
  const mockData: GrowthDataPoint[] = useMemo(() => {
    const points: GrowthDataPoint[] = [];
    const today = new Date();

    for (let i = monthsToShow; i >= 0; i--) {
      const date = subMonths(today, i);

      // Create realistic growth curves
      const timeProgress = (monthsToShow - i) / monthsToShow;
      const baseProgress = timeProgress * 30 + 30; // Start at 30%, grow to 60%

      points.push({
        date,
        emotionalWellbeing:
          baseProgress +
          Math.sin(timeProgress * Math.PI * 2) * 10 +
          Math.random() * 5,
        consistency: baseProgress * 0.9 + Math.random() * 10,
        resilience:
          baseProgress * 0.8 +
          Math.cos(timeProgress * Math.PI * 2) * 15 +
          Math.random() * 5,
        selfAwareness: baseProgress * 1.1 + Math.random() * 8,
      });
    }

    return points;
  }, [monthsToShow]);

  const historicalData = data || mockData;

  // Generate predictive data using linear regression
  const predictiveData: GrowthDataPoint[] = useMemo(() => {
    if (historicalData.length < 2) return [];

    const predictions: GrowthDataPoint[] = [];
    const today = new Date();

    // Simple linear regression for each metric
    const calculateTrend = (
      metric: keyof GrowthDataPoint
    ): { slope: number; intercept: number } => {
      if (metric === "date") return { slope: 0, intercept: 0 };

      const values = historicalData.map((d) => d[metric] as number);
      const n = values.length;
      const indices = Array.from({ length: n }, (_, i) => i);

      const sumX = indices.reduce((sum, x) => sum + x, 0);
      const sumY = values.reduce((sum, y) => sum + y, 0);
      const sumXY = indices.reduce((sum, x, i) => sum + x * values[i], 0);
      const sumX2 = indices.reduce((sum, x) => sum + x * x, 0);

      const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
      const intercept = (sumY - slope * sumX) / n;

      return { slope, intercept };
    };

    const trends = {
      emotionalWellbeing: calculateTrend("emotionalWellbeing"),
      consistency: calculateTrend("consistency"),
      resilience: calculateTrend("resilience"),
      selfAwareness: calculateTrend("selfAwareness"),
    };

    for (let i = 1; i <= predictMonths; i++) {
      const date = addMonths(today, i);
      const futureIndex = historicalData.length - 1 + i;

      predictions.push({
        date,
        emotionalWellbeing: Math.min(
          100,
          Math.max(
            0,
            trends.emotionalWellbeing.intercept +
              trends.emotionalWellbeing.slope * futureIndex
          )
        ),
        consistency: Math.min(
          100,
          Math.max(
            0,
            trends.consistency.intercept +
              trends.consistency.slope * futureIndex
          )
        ),
        resilience: Math.min(
          100,
          Math.max(
            0,
            trends.resilience.intercept + trends.resilience.slope * futureIndex
          )
        ),
        selfAwareness: Math.min(
          100,
          Math.max(
            0,
            trends.selfAwareness.intercept +
              trends.selfAwareness.slope * futureIndex
          )
        ),
      });
    }

    return predictions;
  }, [historicalData, predictMonths]);

  // Calculate overall growth score
  const growthScore = useMemo(() => {
    if (historicalData.length < 2) return "0";

    const firstPoint = historicalData[0];
    const lastPoint = historicalData[historicalData.length - 1];

    const avgFirst =
      (firstPoint.emotionalWellbeing +
        firstPoint.consistency +
        firstPoint.resilience +
        firstPoint.selfAwareness) /
      4;
    const avgLast =
      (lastPoint.emotionalWellbeing +
        lastPoint.consistency +
        lastPoint.resilience +
        lastPoint.selfAwareness) /
      4;

    return (((avgLast - avgFirst) / avgFirst) * 100).toFixed(0);
  }, [historicalData]);

  // Generate milestones
  const mockMilestones: Milestone[] = useMemo(
    () => [
      {
        date:
          historicalData[Math.floor(historicalData.length * 0.3)]?.date ||
          new Date(),
        title: "First Week Streak",
        description: "Maintained 7-day journaling streak",
        icon: "🎯",
      },
      {
        date:
          historicalData[Math.floor(historicalData.length * 0.6)]?.date ||
          new Date(),
        title: "Emotional Breakthrough",
        description: "Identified key emotional patterns",
        icon: "💡",
      },
      {
        date: historicalData[historicalData.length - 1]?.date || new Date(),
        title: "Resilience Master",
        description: "Bounced back from 3 challenges",
        icon: "💪",
      },
    ],
    [historicalData]
  );

  const allMilestones = milestones || mockMilestones;

  // Prepare chart data
  const chartData = useMemo(() => {
    const combined = [...historicalData, ...predictiveData];

    return METRICS.map((metric) => ({
      ...metric,
      historical: historicalData.map((d, i) => ({
        x: i,
        y: d[metric.key as keyof GrowthDataPoint] as number,
        date: d.date,
      })),
      predicted: predictiveData.map((d, i) => ({
        x: historicalData.length - 1 + i + 1,
        y: d[metric.key as keyof GrowthDataPoint] as number,
        date: d.date,
      })),
    }));
  }, [historicalData, predictiveData]);

  const xTickValues = useMemo(() => {
    const total = historicalData.length + predictiveData.length;
    const step = Math.ceil(total / 5);
    return Array.from({ length: 5 }, (_, i) => i * step);
  }, [historicalData, predictiveData]);

  if (loading) {
    return (
      <View className="w-full rounded-3xl bg-white p-6 shadow-lg border border-gray-100">
        <View className="items-center justify-center py-20">
          <ActivityIndicator size="large" color="#7B61FF" />
        </View>
      </View>
    );
  }

  return (
    <View className="w-full rounded-3xl bg-white shadow-lg border border-gray-100 overflow-hidden">
      {/* Premium Badge */}
      {premium && (
        <LinearGradient
          colors={["#7B61FF", "#9C7CFF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            paddingHorizontal: 12,
            paddingVertical: 6,
            position: "absolute",
            top: 0,
            right: 0,
            borderBottomLeftRadius: 12,
            zIndex: 10,
          }}
        >
          <Text className="text-white text-xs font-bold">PREMIUM</Text>
        </LinearGradient>
      )}

      {/* Header */}
      <View className="p-5 pb-3">
        <View className="flex-row items-center justify-between mb-3">
          <View>
            <Text className="text-xl font-extrabold text-gray-800">
              Your Growth Journey
            </Text>
            <Text className="text-xs text-gray-500 mt-1">
              {monthsToShow} months + {predictMonths} month prediction
            </Text>
          </View>
          <View className="items-end">
            <View className="flex-row items-center">
              <Feather
                name={
                  parseInt(growthScore) > 0 ? "trending-up" : "trending-down"
                }
                size={20}
                color={parseInt(growthScore) > 0 ? "#10B981" : "#EF4444"}
              />
              <Text
                className="text-2xl font-extrabold ml-1"
                style={{
                  color: parseInt(growthScore) > 0 ? "#10B981" : "#EF4444",
                }}
              >
                {parseInt(growthScore) > 0 ? "+" : ""}
                {growthScore}%
              </Text>
            </View>
            <Text className="text-xs text-gray-500">Overall Growth</Text>
          </View>
        </View>

        {/* AI Insight */}
        <View
          className="p-3 rounded-2xl mb-3"
          style={{ backgroundColor: "#F0F9FF" }}
        >
          <View className="flex-row items-start">
            <Text className="text-lg mr-2">🤖</Text>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-blue-700 mb-1">
                AI Prediction
              </Text>
              <Text className="text-xs text-blue-600 leading-5">
                Based on your current trajectory, you're on track to improve
                your emotional wellbeing by{" "}
                {(
                  (predictiveData[predictiveData.length - 1]
                    ?.emotionalWellbeing || 0) -
                  (historicalData[historicalData.length - 1]
                    ?.emotionalWellbeing || 0)
                ).toFixed(0)}
                % in the next {predictMonths} months. Keep journaling
                consistently!
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Main Chart */}
      <View className="px-5">
        <VictoryChart
          theme={VictoryTheme.material}
          width={350}
          height={250}
          padding={{ top: 20, bottom: 50, left: 50, right: 20 }}
          domain={{ y: [0, 100] }}
        >
          <Defs>
            <SvgGradient
              id="predictionGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <Stop offset="0%" stopColor="#7B61FF" stopOpacity="0.3" />
              <Stop offset="100%" stopColor="#7B61FF" stopOpacity="0.05" />
            </SvgGradient>
          </Defs>

          <VictoryAxis
            tickValues={xTickValues}
            tickFormat={(i) => {
              const allPoints = [...historicalData, ...predictiveData];
              const point = allPoints[i];
              if (!point) return "";
              return format(point.date, "MMM");
            }}
            style={{
              tickLabels: { fontSize: 10, fill: "#6B7280" },
              grid: { stroke: "transparent" },
            }}
          />

          <VictoryAxis
            dependentAxis
            tickValues={[0, 25, 50, 75, 100]}
            tickFormat={(t) => `${t}%`}
            style={{
              tickLabels: { fontSize: 10, fill: "#6B7280" },
              grid: { stroke: "#E5E7EB", strokeDasharray: "2,4" },
            }}
          />

          {/* Historical lines */}
          {chartData.map((metric) => (
            <VictoryLine
              key={`${metric.key}-historical`}
              data={metric.historical}
              interpolation="cardinal"
              style={{
                data: { stroke: metric.color, strokeWidth: 2 },
              }}
            />
          ))}

          {/* Predicted lines */}
          {chartData.map((metric) => (
            <VictoryLine
              key={`${metric.key}-predicted`}
              data={[
                metric.historical[metric.historical.length - 1],
                ...metric.predicted,
              ]}
              interpolation="cardinal"
              style={{
                data: {
                  stroke: metric.color,
                  strokeWidth: 2,
                  strokeDasharray: "5,5",
                  opacity: 0.6,
                },
              }}
            />
          ))}

          {/* Prediction area */}
          {predictiveData.length > 0 && (
            <VictoryArea
              data={[
                { x: historicalData.length - 1, y: 100 },
                {
                  x: historicalData.length + predictiveData.length - 1,
                  y: 100,
                },
              ]}
              style={{
                data: { fill: "url(#predictionGradient)" },
              }}
            />
          )}

          {/* Milestone markers */}
          {allMilestones.map((milestone, idx) => {
            const dataIndex = historicalData.findIndex(
              (d) =>
                format(d.date, "yyyy-MM") === format(milestone.date, "yyyy-MM")
            );
            if (dataIndex === -1) return null;

            return (
              <VictoryScatter
                key={idx}
                data={[{ x: dataIndex, y: 95 }]}
                size={8}
                style={{
                  data: { fill: "#FCD34D", stroke: "#FBBF24", strokeWidth: 2 },
                }}
              />
            );
          })}
        </VictoryChart>
      </View>

      {/* Legend */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-5 pb-3"
      >
        <View className="flex-row gap-4">
          {METRICS.map((metric) => (
            <View key={metric.key} className="flex-row items-center">
              <View
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: metric.color }}
              />
              <Text className="text-xs text-gray-600">{metric.label}</Text>
            </View>
          ))}
          <View className="flex-row items-center ml-3">
            <View
              className="w-4 h-0.5 mr-2"
              style={{
                backgroundColor: "#7B61FF",
                borderStyle: "dashed",
                borderWidth: 1,
                borderColor: "#7B61FF",
              }}
            />
            <Text className="text-xs text-gray-600">Predicted</Text>
          </View>
        </View>
      </ScrollView>

      {/* Milestones */}
      <View className="px-5 pb-5 pt-3 border-t border-gray-100">
        <Text className="text-sm font-semibold text-gray-700 mb-3">
          🏆 Recent Milestones
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-3">
            {allMilestones.map((milestone, idx) => (
              <TouchableOpacity
                key={idx}
                className="p-3 rounded-2xl border border-gray-200 bg-gray-50 min-w-[140px]"
              >
                <Text className="text-2xl mb-2">{milestone.icon}</Text>
                <Text className="text-xs font-semibold text-gray-700">
                  {milestone.title}
                </Text>
                <Text className="text-xs text-gray-500 mt-1">
                  {format(milestone.date, "MMM d")}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default EmotionalGrowthTrajectory;

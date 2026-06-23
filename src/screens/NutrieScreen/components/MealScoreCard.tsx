import { View, Text, StyleSheet, Platform } from "react-native";
import { SymbolView } from "expo-symbols";
import { Feather } from "@expo/vector-icons";
import Svg, { Circle } from "react-native-svg";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useEffect } from "react";
import { MealScoreData, MealScoreDay } from "../data";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type ScoreRingProps = {
  score: number;
  maxScore: number;
  size: number;
};

const ScoreRing = ({ score, maxScore, size }: ScoreRingProps) => {
  const strokeWidth = 11;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const cx = size / 2;
  const cy = size / 2;
  const startAngle = 225;
  const arcSweep = 270;
  const arcLength = (arcSweep / 360) * circumference;
  const gapLength = circumference - arcLength;

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(score / maxScore, {
      duration: 1200,
      easing: Easing.out(Easing.cubic),
    });
  }, [score, maxScore]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: arcLength * (1 - progress.value),
  }));

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Svg width={size} height={size} style={{ position: "absolute" }}>
        <Circle
          cx={cx}
          cy={cy}
          r={radius}
          stroke="#EEEEEE"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${arcLength} ${gapLength}`}
          strokeLinecap="round"
          rotation={startAngle - 90}
          origin={`${cx}, ${cy}`}
        />
        <AnimatedCircle
          cx={cx}
          cy={cy}
          r={radius}
          stroke="#22C55E"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${arcLength} ${gapLength}`}
          animatedProps={animatedProps}
          strokeLinecap="round"
          rotation={startAngle - 90}
          origin={`${cx}, ${cy}`}
        />
      </Svg>
      <View style={ringStyles.center}>
        <Text style={ringStyles.score}>{score}</Text>
        <Text style={ringStyles.emoji}>👍</Text>
      </View>
    </View>
  );
};

const ringStyles = StyleSheet.create({
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  score: {
    fontSize: 24,
    fontWeight: "800",
    color: "#22C55E",
    letterSpacing: -0.5,
  },
  emoji: {
    fontSize: 11,
    marginTop: -1,
  },
});

type BarChartProps = {
  scores: MealScoreDay[];
  averageScore: number;
  maxScore?: number;
};

const BarChart = ({ scores, averageScore, maxScore = 10 }: BarChartProps) => {
  const chartHeight = 72;

  return (
    <View style={barStyles.container}>
      <View
        style={[
          barStyles.averageLine,
          { bottom: (averageScore / maxScore) * chartHeight },
        ]}
      >
        <View style={barStyles.lineInner} />
      </View>
      <View style={barStyles.barsRow}>
        {scores.map((day, index) => {
          const barHeight = (day.score / maxScore) * chartHeight;
          return (
            <View key={index} style={barStyles.barCol}>
              <View
                style={[
                  barStyles.bar,
                  {
                    height: barHeight,
                    backgroundColor: day.isHighlighted ? "#22C55E" : "#E2E2E2",
                  },
                ]}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
};

const barStyles = StyleSheet.create({
  container: {
    flex: 1,
    height: 82,
    justifyContent: "flex-end",
    position: "relative",
  },
  barsRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 6,
  },
  barCol: {
    flex: 1,
    alignItems: "center",
  },
  bar: {
    width: 16,
    borderRadius: 4,
    minHeight: 6,
  },
  averageLine: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 1,
  },
  lineInner: {
    height: 2.5,
    backgroundColor: "#22C55E",
    borderRadius: 1.5,
  },
});

type MealScoreCardProps = {
  data: MealScoreData;
};

export const MealScoreCard = ({ data }: MealScoreCardProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.labelBadge}>
        {Platform.OS === "ios" ? (
          <SymbolView
            name="clock"
            size={12}
            tintColor="#22C55E"
            weight="semibold"
            style={{ width: 14, height: 14 }}
          />
        ) : (
          <Feather name="clock" size={12} color="#22C55E" />
        )}
        <Text style={styles.labelText}>Meal score</Text>
      </View>

      <Text style={styles.description}>{data.description}</Text>

      <View style={styles.dashedDivider}>
        {Array.from({ length: 40 }).map((_, i) => (
          <View key={i} style={styles.dash} />
        ))}
      </View>

      <Text style={styles.todayLabel}>{data.todayLabel}</Text>

      <View style={styles.scoreRow}>
        <View style={styles.scoreLeft}>
          <Text style={styles.gradeText}>{data.todayGrade}</Text>
          <Text style={styles.feedbackText}>{data.todayFeedback}</Text>
        </View>
        <ScoreRing score={data.todayScore} maxScore={10} size={92} />
      </View>

      <View style={styles.dashedDivider}>
        {Array.from({ length: 40 }).map((_, i) => (
          <View key={i} style={styles.dash} />
        ))}
      </View>

      <View style={styles.averageSection}>
        <View style={styles.averageLeft}>
          <Text style={styles.averageLabel}>{data.averageLabel}</Text>
          <Text style={styles.averageValue}>{data.averageScore}</Text>
        </View>
        <BarChart scores={data.weekScores} averageScore={data.averageScore} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 22,
    marginHorizontal: 16,
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
    backgroundColor: "#E8FBF0",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    alignSelf: "flex-start",
    marginBottom: 14,
  },
  labelText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#22C55E",
  },
  description: {
    fontSize: 17,
    fontWeight: "500",
    color: "#1A1A1A",
    lineHeight: 24,
  },
  dashedDivider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 18,
    gap: 4,
  },
  dash: {
    flex: 1,
    height: 1.5,
    backgroundColor: "#E8E8E8",
    borderRadius: 1,
  },
  todayLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#8E8E93",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  scoreLeft: {
    flex: 1,
    marginRight: 16,
  },
  gradeText: {
    fontSize: 40,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  feedbackText: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
  },
  averageSection: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  averageLeft: {
    marginRight: 20,
    minWidth: 80,
  },
  averageLabel: {
    fontSize: 12,
    color: "#8E8E93",
    lineHeight: 16,
    marginBottom: 6,
  },
  averageValue: {
    fontSize: 38,
    fontWeight: "700",
    color: "#1A1A1A",
    letterSpacing: -1,
  },
});

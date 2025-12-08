import React, { useMemo, useState, useCallback, useRef } from "react";
import {
  View,
  LayoutChangeEvent,
  Image,
  FlatList,
  ViewToken,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Pressable,
} from "react-native";
import { Animated } from "react-native";
import ReanimatedModule, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Text } from "@/components/ui/text";
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryScatter,
  VictoryTheme,
} from "victory-native";
import { Defs, LinearGradient, Stop, G } from "react-native-svg";
import { addDays, differenceInCalendarDays, format } from "date-fns";
import { emotions } from "@/assets/emojis";
import {
  MOOD_COLORS,
  moodScoreToColor,
  moodScoreToPale,
  clampToMoodScore,
} from "@/constants/moodColors";
import useFetchMoods, { MoodsMap } from "@/hooks/data/useFetchMoods";
import {
  useFetchDailyMoods,
  DailyMoodsMap,
} from "@/hooks/data/useFetchDailyMoods";
import dayjs from "dayjs";
import { ISO_DATE_FORMAT } from "../utils/date";
import Loading from "./Loading";

export interface WeeklyMoodChartProps {
  startDate: Date; // inclusive
  endDate: Date; // inclusive
  title?: string;
}

interface ChartPoint {
  x: string;
  y: number | null; // null indicates no data for that day
  dateKey: string; // yyyy-MM-dd
}

interface DailyChartPoint {
  x: string;
  y: number | null;
  timeKey: string; // HH:mm
  exactTime?: string;
}

interface NumericPoint {
  x: number;
  y: number;
  label: string;
  exactTime?: string;
}

type MoodLevel = "Terrible" | "Bad" | "Fine" | "Good" | "Great";
type TabType = "day" | "week";

const HEX = {
  grid: "#EAF0F6",
};

function moodLevelForScore(score: number): MoodLevel {
  const s = clampToMoodScore(score);
  switch (s) {
    case 5:
      return "Great";
    case 4:
      return "Good";
    case 3:
      return "Fine";
    case 2:
      return "Bad";
    case 1:
      return "Terrible";
    default:
      return "Terrible";
  }
}

function twoLetterDow(date: Date): string {
  // Ensure consistent two-letter labels in English
  const d = date.getDay();
  const labels: Record<number, string> = {
    0: "SU",
    1: "MO",
    2: "TU",
    3: "WE",
    4: "TH",
    5: "FR",
    6: "SA",
  };
  return labels[d];
}

// Generate 30-minute interval labels for a day (e.g., "6AM", "6:30", "7AM", etc.)
const DAILY_TIME_SLOTS = [
  "00:00",
  "00:30",
  "01:00",
  "01:30",
  "02:00",
  "02:30",
  "03:00",
  "03:30",
  "04:00",
  "04:30",
  "05:00",
  "05:30",
  "06:00",
  "06:30",
  "07:00",
  "07:30",
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
  "22:00",
  "22:30",
  "23:00",
  "23:30",
];

const buildChartData = (
  start: Date,
  end: Date,
  moodMap: MoodsMap
): ChartPoint[] => {
  const totalDays: number = differenceInCalendarDays(end, start) + 1;
  const points: ChartPoint[] = [];
  for (let i = 0; i < totalDays; i++) {
    const d = addDays(start, i);
    const key: string = format(d, "yyyy-MM-dd");
    const label: string = twoLetterDow(d);
    const val: number | undefined = moodMap.get(key);
    points.push({ x: label, y: val ?? null, dateKey: key });
  }
  return points;
};

// Helper to format HH:mm to h:mm A
const formatTimeLabel = (timeSlot: string): string => {
  const [h, m] = timeSlot.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${m} ${ampm}`;
};

const buildDailyChartData = (moodMap: DailyMoodsMap): DailyChartPoint[] => {
  return DAILY_TIME_SLOTS.map((timeSlot) => {
    const val = moodMap.get(timeSlot);
    const displayLabel = formatTimeLabel(timeSlot);
    return {
      x: displayLabel,
      y: val ? val.score : null,
      timeKey: timeSlot,
      exactTime: val ? val.timestamp : undefined,
    };
  });
};

const ChartTooltip = ({
  x,
  y,
  title,
  subtitle,
}: {
  x: number;
  y: number;
  title: string;
  subtitle: string;
}) => (
  <View
    style={{
      position: "absolute",
      left: x - 60,
      top: y - 55,
      width: 120,
      alignItems: "center",
      zIndex: 150,
    }}
    pointerEvents="none"
  >
    <View className="bg-gray-800 px-3 py-2 rounded-lg shadow-lg items-center">
      <Text className="text-white text-xs font-bold">{title}</Text>
      <Text className="text-gray-300 text-[10px]">{subtitle}</Text>
      <View
        style={{
          position: "absolute",
          bottom: -4,
          width: 0,
          height: 0,
          borderLeftWidth: 4,
          borderRightWidth: 4,
          borderTopWidth: 4,
          borderLeftColor: "transparent",
          borderRightColor: "transparent",
          borderTopColor: "#1F2937",
        }}
      />
    </View>
  </View>
);

interface ChartPageProps {
  startDate: Date;
  endDate: Date;
  width: number;
  height: number;
  padding: { top: number; bottom: number; left: number; right: number };
  emotionsData: MoodsMap | undefined;
  isLoading: boolean;
}

const ChartPage: React.FC<ChartPageProps> = React.memo(
  ({ startDate, endDate, width, height, padding, emotionsData, isLoading }) => {
    const points: ChartPoint[] = useMemo(
      () => buildChartData(startDate, endDate, emotionsData ?? new Map()),
      [startDate, endDate, emotionsData]
    );

    const totalDays: number = points.length;
    const numericPoints5: NumericPoint[] = useMemo(
      () =>
        points
          .map((p, idx) =>
            p.y !== null ? { x: idx + 1, y: p.y, label: p.x } : null
          )
          .filter((p): p is NumericPoint => p !== null),
      [points]
    );

    const xTickValues: number[] = useMemo(
      () => Array.from({ length: totalDays }, (_, i) => i + 1),
      [totalDays]
    );
    const xTickLabels: string[] = useMemo(
      () => points.map((p) => p.x),
      [points]
    );

    const hasData: boolean = numericPoints5.length > 0;

    const byLevel: Record<MoodLevel, NumericPoint[]> = useMemo(() => {
      return numericPoints5.reduce<Record<MoodLevel, NumericPoint[]>>(
        (acc, p) => {
          const lvl: MoodLevel = moodLevelForScore(p.y);
          acc[lvl].push(p);
          return acc;
        },
        { Great: [], Good: [], Fine: [], Bad: [], Terrible: [] }
      );
    }, [numericPoints5]);

    const gradientId: string = `weeklyMoodLineGradient-${format(
      startDate,
      "yyyyMMdd"
    )}`;

    const [selectedPoint, setSelectedPoint] = useState<{
      x: number;
      y: number;
      datum: any;
    } | null>(null);

    const handlePointPress = useCallback((props: any) => {
      const { x, y, datum } = props;
      setSelectedPoint({ x, y, datum });
    }, []);

    const renderScatter = (
      level: MoodLevel,
      score: number,
      data: NumericPoint[]
    ) => {
      if (data.length === 0) return null;
      return (
        <VictoryScatter
          key={level}
          labelComponent={<View />}
          data={data.map((point) => ({
            x: point.x,
            y: point.y + 0.5,
            original: point,
          }))}
          size={5}
          style={{
            data: {
              fill: moodScoreToColor(score),
              stroke: "#FFFFFF",
              strokeWidth: 2,
            },
          }}
          events={[
            {
              target: "data",
              eventHandlers: {
                onPressIn: (evt, props) => {
                  handlePointPress(props);
                  return [];
                },
              },
            },
          ]}
        />
      );
    };

    const levels: { level: MoodLevel; score: number }[] = [
      { level: "Great", score: 5 },
      { level: "Good", score: 4 },
      { level: "Fine", score: 3 },
      { level: "Bad", score: 2 },
      { level: "Terrible", score: 1 },
    ];

    return (
      <View style={{ width }}>
        <View>
          <VictoryChart
            width={width || undefined}
            height={height}
            padding={padding}
            domain={{ x: [0.5, totalDays + 0.5], y: [1, 6] }}
            theme={VictoryTheme.material}
            groupComponent={<G />}
          >
            {width > 0 && hasData && (
              <Defs>
                <LinearGradient
                  id={gradientId}
                  x1={padding.left}
                  y1={0}
                  x2={width - padding.right}
                  y2={0}
                  gradientUnits="userSpaceOnUse"
                >
                  {numericPoints5
                    .slice()
                    .sort((a, b) => a.x - b.x)
                    .map((p) => {
                      const xMin: number = 0.5;
                      const xMax: number = totalDays + 0.5;
                      const t: number = (p.x - xMin) / (xMax - xMin);
                      const offset: string = `${
                        Math.max(0, Math.min(1, t)) * 100
                      }%`;
                      const color: string = moodScoreToPale(p.y);
                      return (
                        <Stop
                          key={`stop-${p.x}`}
                          offset={offset}
                          stopColor={color}
                        />
                      );
                    })}
                </LinearGradient>
              </Defs>
            )}

            <VictoryAxis
              tickComponent={<View />}
              tickValues={xTickValues}
              tickFormat={xTickLabels}
              style={{
                axis: { stroke: "#EEF2F7" },
                tickLabels: { fontSize: 11, padding: 10, fill: "#9AA4B2" },
                grid: { stroke: "transparent" },
              }}
            />
            <VictoryAxis
              dependentAxis
              axisComponent={<View />}
              tickComponent={<View />}
              tickValues={[1, 2, 3, 4, 5]}
              style={{
                axis: { stroke: "#EEF2F7" },
                tickLabels: { fill: "transparent" },
                grid: { stroke: HEX.grid, strokeDasharray: "4,8" },
              }}
            />

            {hasData && (
              <VictoryLine
                labelComponent={<View />}
                data={numericPoints5.map((p) => ({ x: p.x, y: p.y + 0.5 }))}
                interpolation="cardinal"
                style={{
                  data: {
                    stroke: width > 0 ? `url(#${gradientId})` : "#64748B",
                    strokeWidth: 2,
                    strokeLinecap: "round",
                  },
                }}
              />
            )}

            {levels.map(({ level, score }) =>
              renderScatter(level, score, byLevel[level])
            )}
          </VictoryChart>
          {selectedPoint && (
            <ChartTooltip
              x={selectedPoint.x}
              y={selectedPoint.y}
              title={`Mood: ${moodLevelForScore(
                selectedPoint.datum.original.y
              )}`}
              subtitle={`Day: ${selectedPoint.datum.original.label}`}
            />
          )}
        </View>
        {isLoading && (
          <View
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Loading />
          </View>
        )}
      </View>
    );
  }
);

interface DailyChartPageProps {
  targetDate: Date;
  width: number;
  height: number;
  padding: { top: number; bottom: number; left: number; right: number };
  emotionsData: DailyMoodsMap | undefined;
  isLoading: boolean;
}

const DailyChartPage: React.FC<DailyChartPageProps> = React.memo(
  ({ targetDate, width, height, padding, emotionsData, isLoading }) => {
    const points: DailyChartPoint[] = useMemo(
      () => buildDailyChartData(emotionsData ?? new Map()),
      [emotionsData]
    );

    const totalSlots: number = points.length;

    // Only include points with data
    const numericPoints: NumericPoint[] = useMemo(
      () =>
        points
          .map((p, idx) =>
            p.y !== null
              ? ({
                  x: idx + 1,
                  y: p.y,
                  label: p.x,
                  exactTime: p.exactTime,
                } as NumericPoint)
              : null
          )
          .filter((p): p is NumericPoint => p !== null),
      [points]
    );

    // Show ticks at every 4th slot (every 2 hours)
    const xTickValues: number[] = useMemo(
      () => [1, 5, 9, 13, 17, 21, 25, 29, 33, 37, 41, 45],
      []
    );
    const xTickLabels: string[] = useMemo(
      () => [
        "12AM",
        "2AM",
        "4AM",
        "6AM",
        "8AM",
        "10AM",
        "12PM",
        "2PM",
        "4PM",
        "6PM",
        "8PM",
        "10PM",
      ],
      []
    );

    const hasData: boolean = numericPoints.length > 0;

    const byLevel: Record<MoodLevel, NumericPoint[]> = useMemo(() => {
      return numericPoints.reduce<Record<MoodLevel, NumericPoint[]>>(
        (acc, p) => {
          const lvl: MoodLevel = moodLevelForScore(p.y);
          acc[lvl].push(p);
          return acc;
        },
        { Great: [], Good: [], Fine: [], Bad: [], Terrible: [] }
      );
    }, [numericPoints]);

    const gradientId: string = `dailyMoodLineGradient-${format(
      targetDate,
      "yyyyMMdd"
    )}`;

    const [selectedPoint, setSelectedPoint] = useState<{
      x: number;
      y: number;
      datum: any;
    } | null>(null);

    const handlePointPress = useCallback((props: any) => {
      const { x, y, datum } = props;
      setSelectedPoint({ x, y, datum });
    }, []);

    const renderScatter = (
      level: MoodLevel,
      score: number,
      data: NumericPoint[]
    ) => {
      if (data.length === 0) return null;
      return (
        <VictoryScatter
          key={level}
          labelComponent={<View />}
          data={data.map((point) => ({
            x: point.x,
            y: point.y + 0.5,
            original: point,
          }))}
          size={5}
          style={{
            data: {
              fill: moodScoreToColor(score),
              stroke: "#FFFFFF",
              strokeWidth: 2,
            },
          }}
          events={[
            {
              target: "data",
              eventHandlers: {
                onPressIn: (evt, props) => {
                  handlePointPress(props);
                  return [];
                },
              },
            },
          ]}
        />
      );
    };

    const levels: { level: MoodLevel; score: number }[] = [
      { level: "Great", score: 5 },
      { level: "Good", score: 4 },
      { level: "Fine", score: 3 },
      { level: "Bad", score: 2 },
      { level: "Terrible", score: 1 },
    ];

    return (
      <View style={{ width }}>
        <View>
          <VictoryChart
            width={width || undefined}
            height={height}
            padding={padding}
            domain={{ x: [0.5, totalSlots + 0.5], y: [1, 6] }}
            theme={VictoryTheme.material}
            groupComponent={<G />}
          >
            {width > 0 && hasData && (
              <Defs>
                <LinearGradient
                  id={gradientId}
                  x1={padding.left}
                  y1={0}
                  x2={width - padding.right}
                  y2={0}
                  gradientUnits="userSpaceOnUse"
                >
                  {numericPoints
                    .slice()
                    .sort((a, b) => a.x - b.x)
                    .map((p) => {
                      const xMin: number = 0.5;
                      const xMax: number = totalSlots + 0.5;
                      const t: number = (p.x - xMin) / (xMax - xMin);
                      const offset: string = `${
                        Math.max(0, Math.min(1, t)) * 100
                      }%`;
                      const color: string = moodScoreToPale(p.y);
                      return (
                        <Stop
                          key={`stop-${p.x}`}
                          offset={offset}
                          stopColor={color}
                        />
                      );
                    })}
                </LinearGradient>
              </Defs>
            )}

            <VictoryAxis
              tickComponent={<View />}
              tickValues={xTickValues}
              tickFormat={(t: number) => {
                const idx = xTickValues.indexOf(t);
                return idx >= 0 ? xTickLabels[idx] : "";
              }}
              style={{
                axis: { stroke: "#EEF2F7" },
                tickLabels: { fontSize: 9, padding: 10, fill: "#9AA4B2" },
                grid: { stroke: "transparent" },
              }}
            />
            <VictoryAxis
              dependentAxis
              axisComponent={<View />}
              tickComponent={<View />}
              tickValues={[1, 2, 3, 4, 5]}
              style={{
                axis: { stroke: "#EEF2F7" },
                tickLabels: { fill: "transparent" },
                grid: { stroke: HEX.grid, strokeDasharray: "4,8" },
              }}
            />

            {hasData && (
              <VictoryLine
                labelComponent={<View />}
                data={numericPoints.map((p) => ({ x: p.x, y: p.y + 0.5 }))}
                interpolation="cardinal"
                style={{
                  data: {
                    stroke: width > 0 ? `url(#${gradientId})` : "#64748B",
                    strokeWidth: 2,
                    strokeLinecap: "round",
                  },
                }}
              />
            )}

            {levels.map(({ level, score }) =>
              renderScatter(level, score, byLevel[level])
            )}
          </VictoryChart>
          {selectedPoint && (
            <ChartTooltip
              x={selectedPoint.x}
              y={selectedPoint.y}
              title={`Mood: ${moodLevelForScore(
                selectedPoint.datum.original.y
              )}`}
              subtitle={`Time: ${
                selectedPoint.datum.original.exactTime
                  ? dayjs(selectedPoint.datum.original.exactTime).format(
                      "h:mm A"
                    )
                  : selectedPoint.datum.original.label
              }`}
            />
          )}
        </View>
        {isLoading && (
          <View
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Loading />
          </View>
        )}
      </View>
    );
  }
);

// Wrapper component that fetches data for a specific day
interface DailyChartPageWithDataProps {
  dayOffset: number; // 0 = today, -1 = yesterday, etc.
  baseDate: Date;
  width: number;
  height: number;
  padding: { top: number; bottom: number; left: number; right: number };
}

const DailyChartPageWithData: React.FC<DailyChartPageWithDataProps> =
  React.memo(({ dayOffset, baseDate, width, height, padding }) => {
    const targetDate = useMemo(
      () => addDays(baseDate, dayOffset),
      [baseDate, dayOffset]
    );
    const targetDateStr = useMemo(
      () => dayjs(targetDate).format(ISO_DATE_FORMAT),
      [targetDate]
    );

    const { data, isLoading } = useFetchDailyMoods({
      targetDate: targetDateStr,
    });

    return (
      <DailyChartPage
        targetDate={targetDate}
        emotionsData={data}
        width={width}
        height={height}
        padding={padding}
        isLoading={isLoading}
      />
    );
  });

// Tab component for Day/Week selection with animated indicator
interface TabProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TAB_WIDTH = 50;
const TAB_GAP = 16;

const TabSelector: React.FC<TabProps> = ({ activeTab, onTabChange }) => {
  const indicatorPosition = useSharedValue(
    activeTab === "day" ? 0 : TAB_WIDTH + TAB_GAP
  );

  // Update indicator position when tab changes
  React.useEffect(() => {
    indicatorPosition.value = withSpring(
      activeTab === "day" ? 0 : TAB_WIDTH + TAB_GAP,
      {
        damping: 20,
        stiffness: 200,
      }
    );
  }, [activeTab, indicatorPosition]);

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: indicatorPosition.value }],
    };
  });

  return (
    <View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Pressable
          onPress={() => onTabChange("day")}
          style={{ width: TAB_WIDTH, marginRight: TAB_GAP }}
        >
          <Text
            className={`text-base font-medium ${
              activeTab === "day" ? "text-gray-900" : "text-gray-400"
            }`}
          >
            Day
          </Text>
        </Pressable>
        <Pressable
          onPress={() => onTabChange("week")}
          style={{ width: TAB_WIDTH }}
        >
          <Text
            className={`text-base font-medium ${
              activeTab === "week" ? "text-gray-900" : "text-gray-400"
            }`}
          >
            Week
          </Text>
        </Pressable>
      </View>
      {/* Animated Indicator */}
      <ReanimatedModule.View
        style={[
          {
            position: "absolute",
            bottom: -6,
            left: 0,
            height: 3,
            width: TAB_WIDTH,
            backgroundColor: "#3B82F6",
            borderRadius: 1.5,
          },
          animatedIndicatorStyle,
        ]}
      />
    </View>
  );
};

export const WeeklyMoodChart: React.FC<WeeklyMoodChartProps> = ({
  startDate,
  endDate,
  title = "Mood Flow",
}) => {
  // Tab state
  const [activeTab, setActiveTab] = useState<TabType>("week");

  // Pager state for sliding weeks
  const [weekIndex, setWeekIndex] = useState<number>(0);
  const spanDays: number = differenceInCalendarDays(endDate, startDate) + 1;

  const effectiveStartDate: Date = useMemo(
    () => addDays(startDate, weekIndex * spanDays),
    [startDate, weekIndex, spanDays]
  );
  const effectiveEndDate: Date = useMemo(
    () => addDays(endDate, weekIndex * spanDays),
    [endDate, weekIndex, spanDays]
  );

  // Pager state for sliding days
  const [dayIndex, setDayIndex] = useState<number>(0);
  const today = useMemo(() => new Date(), []);
  const effectiveDay: Date = useMemo(
    () => addDays(today, dayIndex),
    [today, dayIndex]
  );
  const effectiveDayStr = useMemo(
    () => dayjs(effectiveDay).format(ISO_DATE_FORMAT),
    [effectiveDay]
  );

  // Fetch weekly data
  const {
    data: weeklyData,
    isLoading: isWeeklyLoading,
    isError: isWeeklyError,
  } = useFetchMoods({
    visibleStartDate: dayjs(startDate).startOf("month").format(ISO_DATE_FORMAT),
    visibleEndDate: dayjs(startDate).endOf("month").format(ISO_DATE_FORMAT),
  });

  // For day view, loading/error is handled per-page
  const isLoading = activeTab === "week" ? isWeeklyLoading : false;
  const isError = activeTab === "week" ? isWeeklyError : false;

  // Calculate average for weekly view
  const weeklyPoints: ChartPoint[] = useMemo(
    () =>
      buildChartData(
        effectiveStartDate,
        effectiveEndDate,
        (weeklyData as MoodsMap) ?? new Map<string, number>()
      ),
    [effectiveStartDate, effectiveEndDate, weeklyData]
  );

  const weeklyNumericPoints: NumericPoint[] = weeklyPoints
    .map((p, idx) => (p.y !== null ? { x: idx + 1, y: p.y, label: p.x } : null))
    .filter((p) => p !== null);

  const weeklyAvg: number =
    weeklyNumericPoints.length > 0
      ? weeklyNumericPoints.reduce((s, p) => s + p.y, 0) /
        weeklyNumericPoints.length
      : 0;
  const weeklyAvgRounded = clampToMoodScore(weeklyAvg);
  const weeklyAvgLabel: MoodLevel = moodLevelForScore(weeklyAvgRounded);

  // For day view, we show "Average" only for week view (day view doesn't aggregate)
  const avgRounded = weeklyAvgRounded;
  const avgLabel = weeklyAvgLabel;
  const avg = weeklyAvg;

  // Determine day view title based on offset
  const getDayTitle = (): string => {
    if (dayIndex === 0) return "Today's Mood";
    if (dayIndex === -1) return "Yesterday's Mood";
    return format(effectiveDay, "EEEE's Mood"); // e.g., "Monday's Mood"
  };

  const headerTitle: string =
    activeTab === "week" ? "This Week's Mood" : getDayTitle();
  const headerSubtitle: string =
    activeTab === "week"
      ? `${format(effectiveStartDate, "LLLL d")} - ${format(
          effectiveEndDate,
          "d, yyyy"
        )}`
      : format(effectiveDay, "LLLL d, yyyy");

  const chartHeight: number = 330;
  const padding = { top: 10, bottom: 26, left: 10, right: 35 } as const;
  const [layoutWidth, setLayoutWidth] = useState<number>(0);
  const onLayout = (e: LayoutChangeEvent): void => {
    setLayoutWidth(e.nativeEvent.layout.width);
  };

  // Animated FlatList pager (virtualized weeks) - only for week view
  type WeekOffset = number; // negative for past, positive for future
  const PRELOAD_PAST_WEEKS: number = 52;
  const pages: WeekOffset[] = useMemo(
    () =>
      Array.from(
        { length: PRELOAD_PAST_WEEKS + 1 },
        (_, i) => i - PRELOAD_PAST_WEEKS
      ),
    []
  );
  const CURRENT_INDEX: number = pages.length - 1; // index of offset 0 (current week)

  const listRef = useRef<FlatList<WeekOffset> | null>(null);
  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const v = viewableItems.find((vi) => vi.isViewable);
      if (v) {
        const offset: WeekOffset =
          typeof v.item === "number"
            ? (v.item as WeekOffset)
            : (pages[v.index ?? CURRENT_INDEX] as WeekOffset);
        setWeekIndex(offset);
      }
    },
    [pages, CURRENT_INDEX]
  );
  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 60,
  }).current;

  // Use an integer page width everywhere to avoid subpixel drift
  const pageWidth: number = useMemo(
    () => (layoutWidth > 0 ? Math.round(layoutWidth) : 0),
    [layoutWidth]
  );

  const renderItem = useCallback(
    ({ item }: { item: WeekOffset }) => (
      <ChartPage
        emotionsData={weeklyData}
        startDate={addDays(startDate, item * spanDays)}
        endDate={addDays(endDate, item * spanDays)}
        width={pageWidth}
        height={chartHeight}
        padding={padding}
        isLoading={isWeeklyLoading}
      />
    ),
    [
      startDate,
      endDate,
      spanDays,
      pageWidth,
      chartHeight,
      padding,
      weeklyData,
      isWeeklyLoading,
    ]
  );

  const keyExtractor = useCallback((item: WeekOffset) => `week-${item}`, []);
  const getItemLayout = useCallback(
    (_: ArrayLike<WeekOffset> | null | undefined, index: number) => ({
      length: pageWidth,
      offset: pageWidth * index,
      index,
    }),
    [pageWidth]
  );

  const onMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>): void => {
      if (pageWidth <= 0) return;
      const x = e.nativeEvent.contentOffset.x;
      const idx = Math.round(x / pageWidth);
      // Clamp to exact page to eliminate any pixel drift
      listRef.current?.scrollToIndex({ index: idx, animated: false });
    },
    [pageWidth]
  );

  // Daily pager (virtualized days)
  type DayOffset = number; // negative for past, positive for future
  const PRELOAD_PAST_DAYS: number = 30;
  const dayPages: DayOffset[] = useMemo(
    () =>
      Array.from(
        { length: PRELOAD_PAST_DAYS + 1 },
        (_, i) => i - PRELOAD_PAST_DAYS
      ),
    []
  );
  const CURRENT_DAY_INDEX: number = dayPages.length - 1; // index of offset 0 (today)

  const dayListRef = useRef<FlatList<DayOffset> | null>(null);
  const onDayViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const v = viewableItems.find((vi) => vi.isViewable);
      if (v) {
        const offset: DayOffset =
          typeof v.item === "number"
            ? (v.item as DayOffset)
            : (dayPages[v.index ?? CURRENT_DAY_INDEX] as DayOffset);
        setDayIndex(offset);
      }
    },
    [dayPages, CURRENT_DAY_INDEX]
  );
  const dayViewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 60,
  }).current;

  const renderDailyItem = useCallback(
    ({ item }: { item: DayOffset }) => (
      <DailyChartPageWithData
        dayOffset={item}
        baseDate={today}
        width={pageWidth}
        height={chartHeight}
        padding={padding}
      />
    ),
    [today, pageWidth, chartHeight, padding]
  );

  const dayKeyExtractor = useCallback((item: DayOffset) => `day-${item}`, []);
  const getDayItemLayout = useCallback(
    (_: ArrayLike<DayOffset> | null | undefined, index: number) => ({
      length: pageWidth,
      offset: pageWidth * index,
      index,
    }),
    [pageWidth]
  );

  const onDayMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>): void => {
      if (pageWidth <= 0) return;
      const x = e.nativeEvent.contentOffset.x;
      const idx = Math.round(x / pageWidth);
      dayListRef.current?.scrollToIndex({ index: idx, animated: false });
    },
    [pageWidth]
  );

  if (isLoading && layoutWidth === 0) {
    return (
      <View className="w-full rounded-2xl bg-white p-4 border border-gray-100">
        <Text className="text-base font-semibold mb-2">{title}</Text>
        <View className="py-10 items-center justify-center">
          <Loading />
        </View>
      </View>
    );
  }
  if (isError) {
    return (
      <View className="w-full rounded-2xl bg-white p-4 border border-gray-100">
        <Text className="text-base font-semibold mb-2">{title}</Text>
        <Text className="text-red-500">Failed to load mood data.</Text>
      </View>
    );
  }

  return (
    <View className="w-full rounded-3xl bg-white py-4 border border-gray-100">
      {/* Tab Header */}
      <View className="px-4 mb-4">
        <TabSelector activeTab={activeTab} onTabChange={setActiveTab} />
      </View>

      {/* Title and Average Row */}
      <View className="flex-row items-start justify-between px-4">
        <View className="flex-1">
          <Text className="text-2xl text-gray-800 font-cormorantSemiBold">
            {headerTitle}
          </Text>
          <Text className="text-xs text-gray-500 mt-1">{headerSubtitle}</Text>
        </View>
        <View className="flex-row items-center">
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: moodScoreToColor(avgRounded),
              marginRight: 6,
            }}
          />
          <Text className="text-xs text-gray-500">
            Average:{" "}
            <Text className="font-semibold text-gray-700">
              {avg ? avgLabel : "-"}
            </Text>
          </Text>
        </View>
      </View>

      {/* Chart area */}
      <View className="overflow-hidden" onLayout={onLayout}>
        {layoutWidth === 0 ? (
          <View
            style={{
              height: chartHeight,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Loading />
          </View>
        ) : activeTab === "week" ? (
          <Animated.FlatList
            key="week-list"
            ref={listRef}
            data={pages}
            horizontal
            pagingEnabled
            snapToInterval={pageWidth}
            snapToAlignment="start"
            disableIntervalMomentum
            scrollEventThrottle={16}
            initialScrollIndex={CURRENT_INDEX + weekIndex}
            showsHorizontalScrollIndicator={false}
            bounces={false}
            overScrollMode="never"
            decelerationRate="fast"
            nestedScrollEnabled
            hitSlop={{ left: 124, right: 124 }}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            getItemLayout={getItemLayout}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            onScrollEndDrag={onMomentumScrollEnd}
            windowSize={5}
            maxToRenderPerBatch={3}
            directionalLockEnabled
            removeClippedSubviews={false}
          />
        ) : (
          <Animated.FlatList
            key="day-list"
            ref={dayListRef}
            data={dayPages}
            horizontal
            pagingEnabled
            snapToInterval={pageWidth}
            snapToAlignment="start"
            disableIntervalMomentum
            scrollEventThrottle={16}
            initialScrollIndex={CURRENT_DAY_INDEX + dayIndex}
            showsHorizontalScrollIndicator={false}
            bounces={false}
            overScrollMode="never"
            decelerationRate="fast"
            nestedScrollEnabled
            hitSlop={{ left: 124, right: 124 }}
            renderItem={renderDailyItem}
            keyExtractor={dayKeyExtractor}
            getItemLayout={getDayItemLayout}
            onViewableItemsChanged={onDayViewableItemsChanged}
            viewabilityConfig={dayViewabilityConfig}
            onScrollEndDrag={onDayMomentumScrollEnd}
            windowSize={5}
            maxToRenderPerBatch={3}
            directionalLockEnabled
            removeClippedSubviews={false}
          />
        )}
      </View>

      {/* Emoji rail on the right */}
      {layoutWidth > 0 && (
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            right: 5,
            top: 120,
            bottom: 50,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {[
            { score: 5, key: "great" },
            { score: 4, key: "good" },
            { score: 3, key: "fine" },
            { score: 2, key: "bad" },
            { score: 1, key: "terrible" },
          ].map((it) => (
            <View
              key={it.key}
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: moodScoreToPale(it.score),
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#000",
                shadowOpacity: 0.05,
                shadowRadius: 4,
              }}
            >
              <Image
                source={emotions[it.key as keyof typeof emotions]}
                style={{ width: 18, height: 18 }}
                resizeMode="contain"
                progressiveRenderingEnabled={true}
              />
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default WeeklyMoodChart;

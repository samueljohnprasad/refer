import React, { useMemo, useState, useCallback, useRef } from "react";
import {
  View,
  LayoutChangeEvent,
  Image,
  FlatList,
  ViewToken,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { Animated } from "react-native";
import { Text } from "@/components/ui/text";
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryScatter,
  VictoryTheme,
} from "victory-native";
import { Defs, LinearGradient, Stop } from "react-native-svg";
import { addDays, differenceInCalendarDays, format } from "date-fns";
import { emotions } from "@/assets/emojis";
import {
  MOOD_COLORS,
  moodScoreToColor,
  moodScoreToPale,
  clampToMoodScore,
} from "@/constants/moodColors";
import useFetchMoods, { MoodsMap } from "@/hooks/data/useFetchMoods";
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

interface NumericPoint {
  x: number;
  y: number;
  label: string;
}

type MoodLevel = "Terrible" | "Bad" | "Fine" | "Good" | "Great";

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

    return (
      <View style={{ width }}>
        <View>
          <VictoryChart
            width={width || undefined}
            height={height}
            padding={padding}
            domain={{ x: [0.5, totalDays + 0.5], y: [1, 6] }}
            theme={VictoryTheme.material}
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

            {byLevel.Great.length > 0 && (
              <VictoryScatter
                labelComponent={<View />}
                data={byLevel.Great.map((point) => ({
                  x: point.x,
                  y: point.y + 0.5,
                }))}
                size={5}
                style={{
                  data: {
                    fill: MOOD_COLORS[5],
                    stroke: "#FFFFFF",
                    strokeWidth: 2,
                  },
                }}
              />
            )}
            {byLevel.Good.length > 0 && (
              <VictoryScatter
                labelComponent={<View />}
                data={byLevel.Good.map((point) => ({
                  x: point.x,
                  y: point.y + 0.5,
                }))}
                size={5}
                style={{
                  data: {
                    fill: MOOD_COLORS[4],
                    stroke: "#FFFFFF",
                    strokeWidth: 2,
                  },
                }}
              />
            )}
            {byLevel.Fine.length > 0 && (
              <VictoryScatter
                labelComponent={<View />}
                data={byLevel.Fine.map((point) => ({
                  x: point.x,
                  y: point.y + 0.5,
                }))}
                size={5}
                style={{
                  data: {
                    fill: MOOD_COLORS[3],
                    stroke: "#FFFFFF",
                    strokeWidth: 2,
                  },
                }}
              />
            )}
            {byLevel.Bad.length > 0 && (
              <VictoryScatter
                labelComponent={<View />}
                data={byLevel.Bad.map((point) => ({
                  x: point.x,
                  y: point.y + 0.5,
                }))}
                size={5}
                style={{
                  data: {
                    fill: MOOD_COLORS[2],
                    stroke: "#FFFFFF",
                    strokeWidth: 2,
                  },
                }}
              />
            )}
            {byLevel.Terrible.length > 0 && (
              <VictoryScatter
                labelComponent={<View />}
                data={byLevel.Terrible.map((point) => ({
                  x: point.x,
                  y: point.y + 0.5,
                }))}
                size={5}
                style={{
                  data: {
                    fill: MOOD_COLORS[1],
                    stroke: "#FFFFFF",
                    strokeWidth: 2,
                  },
                }}
              />
            )}
          </VictoryChart>
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

export const WeeklyMoodChart: React.FC<WeeklyMoodChartProps> = ({
  startDate,
  endDate,
  title = "Mood Flow",
}) => {
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

  const { data, isLoading, isError } = useFetchMoods({
    visibleStartDate: dayjs(startDate).startOf("month").format(ISO_DATE_FORMAT),
    visibleEndDate: dayjs(startDate).endOf("month").format(ISO_DATE_FORMAT),
  });

  const points: ChartPoint[] = useMemo(
    () =>
      buildChartData(
        effectiveStartDate,
        effectiveEndDate,
        (data as MoodsMap) ?? new Map<string, number>()
      ),
    [effectiveStartDate, effectiveEndDate, data]
  );
  // Derived values and layout
  const numericPoints5: NumericPoint[] = points
    .map((p, idx) => (p.y !== null ? { x: idx + 1, y: p.y, label: p.x } : null))
    .filter((p) => p !== null);
  const avg5: number =
    numericPoints5.length > 0
      ? numericPoints5.reduce((s, p) => s + p.y, 0) / numericPoints5.length
      : 0;
  const avgRounded = clampToMoodScore(avg5);

  const avgLabel: MoodLevel = moodLevelForScore(avgRounded);

  const headerTitle: string = title;
  const headerSubtitle: string = `${format(
    effectiveStartDate,
    "LLLL d"
  )} - ${format(effectiveEndDate, "d, yyyy")}`;
  const chartHeight: number = 270;
  const padding = { top: 10, bottom: 26, left: 10, right: 55 } as const;
  const [layoutWidth, setLayoutWidth] = useState<number>(0);
  const onLayout = (e: LayoutChangeEvent): void => {
    setLayoutWidth(e.nativeEvent.layout.width);
  };

  // Animated FlatList pager (virtualized weeks)
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
        emotionsData={data}
        startDate={addDays(startDate, item * spanDays)}
        endDate={addDays(endDate, item * spanDays)}
        width={pageWidth}
        height={chartHeight}
        padding={padding}
        isLoading={isLoading}
      />
    ),
    [startDate, endDate, spanDays, pageWidth, chartHeight, padding]
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

  if (isLoading) {
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
    <View className="w-full rounded-3xl bg-white p-4 border border-gray-100">
      {/* Header */}
      <View className="flex-row items-center justify-between px-1">
        <View>
          <Text
            // style={{ fontFamily: "CormorantRegular" }}
            className="text-2xl text-gray-800 font-cormorantSemiBold"
          >
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
              {avg5 ? avgLabel : "-"}
            </Text>
          </Text>
        </View>
      </View>

      {/* Chart area (swipeable) */}
      <View className="mt-3 overflow-hidden" onLayout={onLayout}>
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
        ) : (
          <Animated.FlatList
            ref={listRef}
            data={pages}
            horizontal
            pagingEnabled
            snapToInterval={pageWidth}
            snapToAlignment="start"
            disableIntervalMomentum
            // onMomentumScrollEnd={onMomentumScrollEnd}
            scrollEventThrottle={16}
            initialScrollIndex={CURRENT_INDEX}
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
        )}
      </View>

      {/* Emoji rail on the right */}
      {layoutWidth > 0 && (
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            right: 10,
            top: 85,
            bottom: 50,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {(
            [
              { score: 5, key: "great" },
              { score: 4, key: "good" },
              { score: 3, key: "fine" },
              { score: 2, key: "bad" },
              { score: 1, key: "terrible" },
            ] as const
          ).map((it) => (
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

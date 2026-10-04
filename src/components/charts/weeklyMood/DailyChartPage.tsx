import React, { useMemo, useState, useCallback } from "react";
import { View } from "react-native";
import { VictoryAxis, VictoryChart, VictoryLine, VictoryArea, VictoryScatter, VictoryTheme } from "victory-native";
import { Defs, LinearGradient, Stop, G } from "react-native-svg";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import type { DailyMoodsMap } from "@/hooks/data/useFetchDailyMoods";
import type { MoodsMap } from "@/hooks/data/useFetchMoods";
import { moodScoreToColor, moodScoreToPale } from "@/constants/moodColors";
import { ChartTooltip } from "./MoodChartTooltip";
import { ChartLoadingOverlay } from "./ChartLoadingOverlay";
import { buildDailyChartData, moodLevelForScore, moodTranslationKey, type DailyChartPoint, type MoodLevel, type NumericPoint } from "./weeklyMoodChartData";

const HEX = { grid: "#EAF0F6" };
interface DailyChartPageProps {
  targetDate: Date;
  width: number;
  height: number;
  padding: { top: number; bottom: number; left: number; right: number };
  emotionsData: DailyMoodsMap | undefined;
  isLoading: boolean;
  locale: string;
}

const DailyChartPage: React.FC<DailyChartPageProps> = React.memo(
  ({ targetDate, width, height, padding, emotionsData, isLoading, locale }) => {
    const { t } = useTranslation("insights");
    const points: DailyChartPoint[] = useMemo(
      () => buildDailyChartData(emotionsData ?? new Map(), locale),
      [emotionsData, locale],
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
              : null,
          )
          .filter((p): p is NumericPoint => p !== null),
      [points],
    );

    // Show ticks at every 4th slot (every 2 hours)
    const xTickValues: number[] = useMemo(
      () => [1, 5, 9, 13, 17, 21, 25, 29, 33, 37, 41, 45],
      [],
    );
    const xTickLabels: string[] = useMemo(
      () => Array.from({ length: 12 }, (_, index) => {
        const hour = index * 2;
        return new Intl.DateTimeFormat(locale, { hour: "numeric" })
          .format(new Date(2020, 0, 1, hour));
      }),
      [locale],
    );

    const hasData: boolean = numericPoints.length > 0;

    const byLevel: Record<MoodLevel, NumericPoint[]> = useMemo(() => {
      return numericPoints.reduce<Record<MoodLevel, NumericPoint[]>>(
        (acc, p) => {
          const lvl: MoodLevel = moodLevelForScore(p.y);
          acc[lvl].push(p);
          return acc;
        },
        { Great: [], Good: [], Fine: [], Bad: [], Terrible: [] },
      );
    }, [numericPoints]);

    const gradientId: string = `dailyMoodLineGradient-${format(
      targetDate,
      "yyyyMMdd",
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
      data: NumericPoint[],
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
          animate={{
            duration: 800,
            onLoad: { duration: 2000 },
            easing: "sinInOut",
          }}
          style={{
            data: {
              fill: moodScoreToColor(score),
              stroke: "rgba(255,255,255,0.6)",
              strokeWidth: 4,
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
                      const offset: string = `${Math.max(0, Math.min(1, t)) * 100
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
                tickLabels: {
                  fontSize: 10,
                  padding: 8,
                  fill: "#9AA4B2",
                  fontWeight: "600",
                },
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
                grid: { stroke: HEX.grid, strokeDasharray: "4,6" },
              }}
            />

            {hasData && (
              <VictoryArea
                data={numericPoints.map((p) => ({
                  x: p.x,
                  y: p.y + 0.5,
                  y0: 1,
                }))}
                interpolation="monotoneX"
                animate={{
                  duration: 800,
                  onLoad: { duration: 2000 },
                  easing: "sinInOut",
                }}
                style={{
                  data: {
                    fill: width > 0 ? `url(#${gradientId})` : "#64748B",
                    opacity: 0.2,
                  },
                }}
              />
            )}

            {hasData && (
              <VictoryLine
                labelComponent={<View />}
                data={numericPoints.map((p) => ({ x: p.x, y: p.y + 0.5 }))}
                interpolation="monotoneX"
                animate={{
                  duration: 800,
                  onLoad: { duration: 2000 },
                  easing: "sinInOut",
                }}
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
              renderScatter(level, score, byLevel[level]),
            )}
          </VictoryChart>
          {selectedPoint && (
            <ChartTooltip
              x={selectedPoint.x}
              y={selectedPoint.y}
              title={t("chart.weeklyMood.tooltip.mood", { mood: t(`chart.weeklyMood.scale.moods.${moodTranslationKey[moodLevelForScore(selectedPoint.datum.original.y)]}`) })}
              subtitle={t("chart.weeklyMood.tooltip.time", { time: selectedPoint.datum.original.exactTime
                ? new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit" }).format(new Date(selectedPoint.datum.original.exactTime))
                : selectedPoint.datum.original.label })}
            />
          )}
        </View>
        {isLoading && <ChartLoadingOverlay />}
      </View>
    );
  },
);

// Wrapper component that fetches data for a specific day
export default DailyChartPage;

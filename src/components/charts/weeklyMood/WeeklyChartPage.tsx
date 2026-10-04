import React, { useMemo, useState, useCallback } from "react";
import { View } from "react-native";
import { VictoryAxis, VictoryChart, VictoryLine, VictoryArea, VictoryScatter, VictoryTheme } from "victory-native";
import { Defs, LinearGradient, Stop, G } from "react-native-svg";
import { format } from "date-fns";
import { Text } from "@/src/components/ui/Text";
import { useTranslation } from "react-i18next";
import type { MoodsMap } from "@/hooks/data/useFetchMoods";
import Loading from "@/src/components/Loading";
import { moodScoreToColor, moodScoreToPale } from "@/constants/moodColors";
import { buildChartData, moodLevelForScore, moodTranslationKey, type ChartPoint, type MoodLevel, type NumericPoint } from "./weeklyMoodChartData";
import { ChartTooltip } from "./MoodChartTooltip";

const HEX = { grid: "#EAF0F6" };
interface ChartPageProps {
  startDate: Date;
  endDate: Date;
  width: number;
  height: number;
  padding: { top: number; bottom: number; left: number; right: number };
  emotionsData: MoodsMap | undefined;
  isLoading: boolean;
  locale: string;
}

const ChartPage: React.FC<ChartPageProps> = React.memo(
  ({ startDate, endDate, width, height, padding, emotionsData, isLoading, locale }) => {
    const { t } = useTranslation("insights");
    const points: ChartPoint[] = useMemo(
      () => buildChartData(startDate, endDate, emotionsData ?? new Map(), locale),
      [startDate, endDate, emotionsData, locale],
    );

    const totalDays: number = points.length;
    const numericPoints5: NumericPoint[] = useMemo(
      () =>
        points
          .map((p, idx) =>
            p.y !== null ? { x: idx + 1, y: p.y, label: p.x } : null,
          )
          .filter((p): p is NumericPoint => p !== null),
      [points],
    );

    const xTickValues: number[] = useMemo(
      () => Array.from({ length: totalDays }, (_, i) => i + 1),
      [totalDays],
    );
    const xTickLabels: string[] = useMemo(
      () => points.map((p) => p.x),
      [points],
    );

    const hasData: boolean = numericPoints5.length > 0;

    const byLevel: Record<MoodLevel, NumericPoint[]> = useMemo(() => {
      return numericPoints5.reduce<Record<MoodLevel, NumericPoint[]>>(
        (acc, p) => {
          const lvl: MoodLevel = moodLevelForScore(p.y);
          acc[lvl].push(p);
          return acc;
        },
        { Great: [], Good: [], Fine: [], Bad: [], Terrible: [] },
      );
    }, [numericPoints5]);

    const gradientId: string = `weeklyMoodLineGradient-${format(
      startDate,
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
              tickFormat={xTickLabels}
              style={{
                axis: { stroke: "#EEF2F7" },
                tickLabels: {
                  fontSize: 12,
                  padding: 10,
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
                data={numericPoints5.map((p) => ({
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
                data={numericPoints5.map((p) => ({ x: p.x, y: p.y + 0.5 }))}
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
              subtitle={t("chart.weeklyMood.tooltip.day", { day: selectedPoint.datum.original.label })}
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
              backgroundColor: "rgba(255, 255, 255, 0.6)",
              borderRadius: 24,
            }}
          >
            <Loading />
          </View>
        )}
      </View>
    );
  },
);
export default ChartPage;

// ponytail: pure JSX for .agents/exercises.html's `chart()` — props in, SVG out. A line of the days
// you logged, a leaf under days you practised, numbers only on today and the brightest day.
import React from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import Svg, { Circle, Defs, G, Line, LinearGradient, Path, Stop, Text as SvgText } from 'react-native-svg';
import { CHART_H, CHART_W, moodY, type MoodWeek } from '../domain/moodWeek';

const LEAF = 'M-6 5C-6-2-1-6 6-6 6 1 1 6-6 5Z';
const ACCENT = '#44633f';

export interface PracticeMoodChartProps {
  week: MoodWeek;
  title: string;
  caption: string;
}

export function PracticeMoodChart({ week, title, caption }: PracticeMoodChartProps): React.JSX.Element {
  const { days, peak, line, area } = week;
  const sub = peak
    ? `Brightest so far: ${peak.short}, ${peak.value} of 5.`
    : 'Nothing logged this week yet.';
  const spoken = days
    .map((d) => `${d.short} ${d.isAhead ? 'not yet' : d.value === null ? 'nothing logged' : `${d.value} of 5`}${d.practiced ? ', practised' : ''}`)
    .join(', ');

  return (
    <View>
      <Text className="text-t-lead font-bold tracking-tight text-happy-label">{title}</Text>
      <Text className="mt-1 text-t-sub font-semibold text-happy-label-2">{sub}</Text>

      <Animated.View entering={FadeIn.duration(600)} style={{ aspectRatio: CHART_W / CHART_H }} className="w-full mt-2">
        <Svg width="100%" height="100%" viewBox={`0 0 ${CHART_W} ${CHART_H}`} accessibilityLabel={`Mood you logged this week, out of 5. ${spoken}`}>
          <Defs>
            <LinearGradient id="mg" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#8fb184" stopOpacity={0.45} />
              <Stop offset="1" stopColor="#8fb184" stopOpacity={0} />
            </LinearGradient>
          </Defs>
          <Line x1={8} x2={300} y1={moodY(2.5)} y2={moodY(2.5)} stroke="#e5e5e5" strokeDasharray="2 4" />
          {area && <Path d={area} fill="url(#mg)" />}
          {line && <Path d={line} fill="none" stroke={ACCENT} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />}
          {days.map((d) => (
            <G key={d.key}>
              {d.value === null ? (
                <Circle cx={d.x} cy={112} r={3.5} fill="none" stroke="#8a918a" strokeWidth={1.5} />
              ) : (
                <>
                  <Circle
                    cx={d.x} cy={d.y} r={d.isToday ? 7 : 4.5}
                    fill={d.isToday ? ACCENT : '#fff'} stroke={d.isToday ? '#fff' : ACCENT} strokeWidth={d.isToday ? 3 : 2}
                  />
                  {(d.isToday || d === peak) && (
                    <SvgText x={d.x} y={d.y - 13} textAnchor="middle" fontSize={13} fontWeight="600" fill="#142414">
                      {d.value}
                    </SvgText>
                  )}
                </>
              )}
              {d.practiced && <Path transform={`translate(${d.x} 130)`} d={LEAF} fill="#5f7f58" />}
              <SvgText x={d.x} y={154} textAnchor="middle" fontSize={12} fontWeight="700" fill={d.isToday ? '#142414' : '#767676'}>
                {d.isToday ? 'Today' : d.letter}
              </SvgText>
            </G>
          ))}
        </Svg>
      </Animated.View>

      <Text className="mt-3 text-t-cap font-semibold text-happy-label-3">{caption}</Text>
    </View>
  );
}

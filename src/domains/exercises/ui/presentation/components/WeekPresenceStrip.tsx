// ponytail: exact .days row matching .agents/exercises.html's My Log — presence, never a streak.
// A leaf on days you showed up (completed exercise or mood log), an empty ring on the rest, today gets a ring regardless.
import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, { ZoomIn } from 'react-native-reanimated';

const LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const pad = (n: number): string => String(n).padStart(2, '0');
const toYmd = (d: Date): string => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

function Leaf(): React.JSX.Element {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="#5f7f58">
      <Path d="M5 19c0-8 5-14 14-14 0 9-6 14-14 14Z" />
    </Svg>
  );
}

export interface WeekPresenceStripProps {
  /** local YYYY-MM-DD days this week with a completed exercise or a mood log */
  showedUp: ReadonlySet<string>;
}

export function WeekPresenceStrip({ showedUp }: WeekPresenceStripProps): React.JSX.Element {
  const now = new Date();
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - ((now.getDay() + 6) % 7));
  const today = toYmd(now);
  const days = LABELS.map((label, i) => {
    const d = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
    const key = toYmd(d);
    return { key, label, isToday: key === today, logged: showedUp.has(key), name: d.toLocaleDateString(undefined, { weekday: 'long' }) };
  });
  const count = days.filter((d) => d.logged).length;

  return (
    <View className="p-4 rounded-[20px] bg-happy-tint">
      <Text className="text-t-foot font-bold text-happy-accent">This week</Text>
      <Text className="mt-1 font-display text-t-h leading-[28px] tracking-tight text-happy-label">
        {count === 0 ? 'A fresh week.' : `You showed up on ${count} ${count === 1 ? 'day' : 'days'}.`}
      </Text>
      <View className="flex-row justify-between mt-4">
        {days.map(({ key, label, isToday, logged, name }, i) => (
          <View
            key={key}
            className="items-center"
            accessible
            accessibilityLabel={`${name}${isToday ? ', today' : ''}${logged ? ', logged' : ''}`}
          >
            <View className="w-[34px] h-[34px] items-center justify-center">
              {logged ? (
                <Animated.View
                  entering={ZoomIn.delay(150 + i * 100).springify().damping(14)}
                  className="w-[34px] h-[34px] rounded-full items-center justify-center absolute bg-happy-ink"
                >
                  <Leaf />
                </Animated.View>
              ) : (
                <View className="w-[34px] h-[34px] rounded-full border-2 border-[#a9bfa0] absolute" />
              )}
              {isToday && <View className="w-[34px] h-[34px] rounded-full border-2 border-happy-ink absolute" />}
            </View>
            <Text className={`text-t-cap font-bold mt-1 ${isToday ? 'text-happy-label' : 'text-happy-label-2'}`}>
              {label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

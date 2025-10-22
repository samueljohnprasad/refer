import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { VictoryChart, VictoryBar, VictoryAxis, VictoryTheme } from 'victory-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

interface TriggerData {
  trigger: string;
  positive: number;
  negative: number;
  neutral: number;
  avgMoodChange: number;
  category: 'activity' | 'social' | 'work' | 'health' | 'weather' | 'other';
}

interface MoodTriggersAnalysisProps {
  data?: TriggerData[];
  loading?: boolean;
  premium?: boolean;
  onTriggerPress?: (trigger: TriggerData) => void;
}

const CATEGORY_ICONS: Record<string, string> = {
  activity: '🎯',
  social: '👥',
  work: '💼',
  health: '🏃',
  weather: '☀️',
  other: '📌'
};

const CATEGORY_COLORS: Record<string, string> = {
  activity: '#7B61FF',
  social: '#3B82F6',
  work: '#F97316',
  health: '#10B981',
  weather: '#FCD34D',
  other: '#6B7280'
};

export const MoodTriggersAnalysis: React.FC<MoodTriggersAnalysisProps> = ({
  data,
  loading = false,
  premium = false,
  onTriggerPress
}) => {
  const mockData: TriggerData[] = useMemo(() => [
    {
      trigger: 'Morning Exercise',
      positive: 42,
      negative: 3,
      neutral: 8,
      avgMoodChange: 1.8,
      category: 'health'
    },
    {
      trigger: 'Work Meetings',
      positive: 12,
      negative: 28,
      neutral: 15,
      avgMoodChange: -0.9,
      category: 'work'
    },
    {
      trigger: 'Family Time',
      positive: 38,
      negative: 5,
      neutral: 10,
      avgMoodChange: 1.5,
      category: 'social'
    },
    {
      trigger: 'Meditation',
      positive: 35,
      negative: 2,
      neutral: 12,
      avgMoodChange: 1.2,
      category: 'health'
    },
    {
      trigger: 'Social Media',
      positive: 8,
      negative: 25,
      neutral: 20,
      avgMoodChange: -0.6,
      category: 'activity'
    },
    {
      trigger: 'Creative Work',
      positive: 30,
      negative: 4,
      neutral: 9,
      avgMoodChange: 1.3,
      category: 'activity'
    },
    {
      trigger: 'Rainy Weather',
      positive: 10,
      negative: 18,
      neutral: 25,
      avgMoodChange: -0.3,
      category: 'weather'
    },
    {
      trigger: 'Good Sleep',
      positive: 45,
      negative: 2,
      neutral: 6,
      avgMoodChange: 2.1,
      category: 'health'
    }
  ], []);

  const triggerData = data || mockData;
  const sortedTriggers = useMemo(() => {
    return [...triggerData].sort((a, b) => 
      Math.abs(b.avgMoodChange) - Math.abs(a.avgMoodChange)
    );
  }, [triggerData]);

  const positiveTriggers = sortedTriggers.filter(t => t.avgMoodChange > 0);
  const negativeTriggers = sortedTriggers.filter(t => t.avgMoodChange < 0);

  const insights = useMemo(() => {
    const strongestPositive = positiveTriggers[0];
    const strongestNegative = negativeTriggers[0];
    const totalPositiveEvents = triggerData.reduce((sum, t) => sum + t.positive, 0);
    const totalNegativeEvents = triggerData.reduce((sum, t) => sum + t.negative, 0);
    
    return {
      strongestPositive,
      strongestNegative,
      positiveRatio: (totalPositiveEvents / (totalPositiveEvents + totalNegativeEvents) * 100).toFixed(0),
      topCategories: Object.entries(
        triggerData.reduce((acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + Math.abs(t.avgMoodChange);
          return acc;
        }, {} as Record<string, number>)
      )
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([cat]) => cat)
    };
  }, [triggerData, positiveTriggers, negativeTriggers]);

  const chartData = useMemo(() => {
    return sortedTriggers.slice(0, 8).map(t => ({
      x: t.trigger.length > 12 ? t.trigger.substring(0, 12) + '...' : t.trigger,
      y: Math.abs(t.avgMoodChange),
      positive: t.avgMoodChange > 0,
      original: t
    }));
  }, [sortedTriggers]);

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
      {premium && (
        <LinearGradient
          colors={['#7B61FF', '#9C7CFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            paddingHorizontal: 12,
            paddingVertical: 6,
            position: 'absolute',
            top: 0,
            right: 0,
            borderBottomLeftRadius: 12,
            zIndex: 10
          }}
        >
          <Text className="text-white text-xs font-bold">PREMIUM</Text>
        </LinearGradient>
      )}

      <View className="p-5 pb-0">
        <View className="flex-row items-center justify-between mb-3">
          <View>
            <Text className="text-xl font-extrabold text-gray-800">
              Mood Triggers
            </Text>
            <Text className="text-xs text-gray-500 mt-1">
              What impacts your emotional state
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-2xl font-extrabold text-green-600">
              {insights.positiveRatio}%
            </Text>
            <Text className="text-xs text-gray-500">Positive Impact</Text>
          </View>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-5 py-4">
        <View className="flex-row gap-3">
          {insights.strongestPositive && (
            <TouchableOpacity
              onPress={() => onTriggerPress?.(insights.strongestPositive)}
              className="p-4 rounded-2xl border border-green-200"
              style={{ backgroundColor: '#F0FDF4', minWidth: 150 }}
            >
              <View className="flex-row items-center mb-2">
                <Feather name="trending-up" size={16} color="#10B981" />
                <Text className="text-xs font-medium text-green-700 ml-2">
                  Best Booster
                </Text>
              </View>
              <Text className="text-sm font-bold text-gray-800 mb-1">
                {insights.strongestPositive.trigger}
              </Text>
              <Text className="text-xl font-extrabold text-green-600">
                +{insights.strongestPositive.avgMoodChange.toFixed(1)}
              </Text>
              <Text className="text-xs text-gray-500 mt-1">
                mood improvement
              </Text>
            </TouchableOpacity>
          )}

          {insights.strongestNegative && (
            <TouchableOpacity
              onPress={() => onTriggerPress?.(insights.strongestNegative)}
              className="p-4 rounded-2xl border border-orange-200"
              style={{ backgroundColor: '#FFF7ED', minWidth: 150 }}
            >
              <View className="flex-row items-center mb-2">
                <Feather name="alert-circle" size={16} color="#F97316" />
                <Text className="text-xs font-medium text-orange-700 ml-2">
                  Watch Out
                </Text>
              </View>
              <Text className="text-sm font-bold text-gray-800 mb-1">
                {insights.strongestNegative.trigger}
              </Text>
              <Text className="text-xl font-extrabold text-orange-600">
                {insights.strongestNegative.avgMoodChange.toFixed(1)}
              </Text>
              <Text className="text-xs text-gray-500 mt-1">
                mood impact
              </Text>
            </TouchableOpacity>
          )}

          <View
            className="p-4 rounded-2xl border border-violet-200"
            style={{ backgroundColor: '#F5F3FF', minWidth: 150 }}
          >
            <View className="flex-row items-center mb-2">
              <Feather name="layers" size={16} color="#7B61FF" />
              <Text className="text-xs font-medium text-violet-700 ml-2">
                Top Categories
              </Text>
            </View>
            {insights.topCategories.map((cat, idx) => (
              <View key={idx} className="flex-row items-center mt-1">
                <Text className="text-sm">{CATEGORY_ICONS[cat]}</Text>
                <Text className="text-xs font-medium text-gray-700 ml-2 capitalize">
                  {cat}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View className="px-5 pb-5">
        <Text className="text-sm font-semibold text-gray-700 mb-3">
          Impact Strength
        </Text>
        <VictoryChart
          theme={VictoryTheme.material}
          width={350}
          height={200}
          padding={{ top: 10, bottom: 50, left: 50, right: 20 }}
          domainPadding={{ x: 20 }}
        >
          <VictoryAxis
            style={{
              tickLabels: { fontSize: 9, fill: '#6B7280', angle: -45 },
              grid: { stroke: 'transparent' }
            }}
          />
          <VictoryAxis
            dependentAxis
            tickFormat={(t) => `${t > 0 ? '+' : ''}${t}`}
            style={{
              tickLabels: { fontSize: 10, fill: '#6B7280' },
              grid: { stroke: '#E5E7EB', strokeDasharray: '2,4' }
            }}
          />
          <VictoryBar
            data={chartData}
            style={{
              data: {
                fill: ({ datum }) => datum.positive ? '#10B981' : '#EF4444',
                opacity: 0.8
              }
            }}
            cornerRadius={{ top: 4 }}
          />
        </VictoryChart>
      </View>

      <View className="px-5 pb-5 pt-3 border-t border-gray-100">
        <Text className="text-sm font-semibold text-gray-700 mb-3">
          All Triggers
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            {sortedTriggers.map((trigger, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => onTriggerPress?.(trigger)}
                className="px-3 py-2 rounded-full flex-row items-center border"
                style={{
                  backgroundColor: trigger.avgMoodChange > 0 ? '#F0FDF4' : '#FEF2F2',
                  borderColor: trigger.avgMoodChange > 0 ? '#BBF7D0' : '#FECACA'
                }}
              >
                <Text className="text-sm mr-1">{CATEGORY_ICONS[trigger.category]}</Text>
                <Text className="text-xs font-medium text-gray-700">
                  {trigger.trigger}
                </Text>
                <Text 
                  className="text-xs font-bold ml-2"
                  style={{ color: trigger.avgMoodChange > 0 ? '#10B981' : '#EF4444' }}
                >
                  {trigger.avgMoodChange > 0 ? '+' : ''}{trigger.avgMoodChange.toFixed(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default MoodTriggersAnalysis;

import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { VictoryChart, VictoryAxis, VictoryBar, VictoryTheme, VictoryLine } from 'victory-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { format } from 'date-fns';

interface MoodDataPoint {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  hourOfDay: number; // 0-23
  moodScore: number; // 1-5
  count: number; // Number of entries
}

interface CorrelationInsight {
  type: 'best' | 'worst';
  label: string;
  value: string;
  score: number;
}

interface MoodCorrelationMatrixProps {
  data?: MoodDataPoint[];
  loading?: boolean;
  premium?: boolean;
  onInsightPress?: (insight: CorrelationInsight) => void;
}

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const TIME_PERIODS = [
  { label: 'Early Morning', hours: [5, 6, 7, 8], icon: '🌅' },
  { label: 'Morning', hours: [9, 10, 11], icon: '☀️' },
  { label: 'Afternoon', hours: [12, 13, 14, 15], icon: '🌤️' },
  { label: 'Evening', hours: [16, 17, 18, 19], icon: '🌆' },
  { label: 'Night', hours: [20, 21, 22, 23], icon: '🌙' },
  { label: 'Late Night', hours: [0, 1, 2, 3, 4], icon: '🌌' }
];

const MOOD_GRADIENT = {
  terrible: '#EF4444',
  bad: '#F97316',
  fine: '#FCD34D',
  good: '#86EFAC',
  great: '#10B981'
};

export const MoodCorrelationMatrix: React.FC<MoodCorrelationMatrixProps> = ({
  data,
  loading = false,
  premium = false,
  onInsightPress
}) => {
  // Generate mock data for demonstration
  const mockData: MoodDataPoint[] = useMemo(() => {
    const points: MoodDataPoint[] = [];
    
    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 24; hour++) {
        // Create realistic patterns
        let baseMood = 3;
        
        // Weekend boost
        if (day === 0 || day === 6) baseMood += 0.5;
        
        // Time of day patterns
        if (hour >= 6 && hour <= 9) baseMood += 0.3; // Morning boost
        if (hour >= 14 && hour <= 16) baseMood -= 0.3; // Afternoon slump
        if (hour >= 20 && hour <= 22) baseMood += 0.2; // Evening relaxation
        if (hour >= 0 && hour <= 5) baseMood -= 0.5; // Late night dip
        
        // Add some randomness
        baseMood += (Math.random() - 0.5) * 1.5;
        baseMood = Math.max(1, Math.min(5, baseMood));
        
        if (Math.random() > 0.4) { // Not all time slots have data
          points.push({
            dayOfWeek: day,
            hourOfDay: hour,
            moodScore: baseMood,
            count: Math.floor(Math.random() * 10) + 1
          });
        }
      }
    }
    
    return points;
  }, []);

  const correlationData = data || mockData;

  // Calculate time period averages
  const periodAverages = useMemo(() => {
    return TIME_PERIODS.map(period => {
      const relevantData = correlationData.filter(d => 
        period.hours.includes(d.hourOfDay)
      );
      
      const avgMood = relevantData.length > 0
        ? relevantData.reduce((sum, d) => sum + d.moodScore, 0) / relevantData.length
        : 0;
      
      return {
        ...period,
        avgMood,
        dataPoints: relevantData.length
      };
    });
  }, [correlationData]);

  // Calculate day of week averages
  const dayAverages = useMemo(() => {
    return DAYS_OF_WEEK.map((day, idx) => {
      const dayData = correlationData.filter(d => d.dayOfWeek === idx);
      const avgMood = dayData.length > 0
        ? dayData.reduce((sum, d) => sum + d.moodScore, 0) / dayData.length
        : 0;
      
      return {
        day,
        dayIndex: idx,
        avgMood,
        dataPoints: dayData.length
      };
    });
  }, [correlationData]);

  // Generate insights
  const insights = useMemo((): CorrelationInsight[] => {
    const bestPeriod = periodAverages.reduce((best, current) => 
      current.avgMood > best.avgMood ? current : best
    );
    
    const worstPeriod = periodAverages.reduce((worst, current) => 
      current.avgMood < worst.avgMood && current.avgMood > 0 ? current : worst
    );
    
    const bestDay = dayAverages.reduce((best, current) => 
      current.avgMood > best.avgMood ? current : best
    );
    
    const worstDay = dayAverages.reduce((worst, current) => 
      current.avgMood < worst.avgMood && current.avgMood > 0 ? current : worst
    );
    
    return [
      {
        type: 'best',
        label: 'Peak Mood Time',
        value: `${bestPeriod.label} ${bestPeriod.icon}`,
        score: bestPeriod.avgMood
      },
      {
        type: 'worst',
        label: 'Challenging Time',
        value: `${worstPeriod.label} ${worstPeriod.icon}`,
        score: worstPeriod.avgMood
      },
      {
        type: 'best',
        label: 'Best Day',
        value: bestDay.day,
        score: bestDay.avgMood
      },
      {
        type: 'worst',
        label: 'Tough Day',
        value: worstDay.day,
        score: worstDay.avgMood
      }
    ];
  }, [periodAverages, dayAverages]);

  // Create heatmap matrix data
  const matrixData = useMemo(() => {
    const matrix: number[][] = Array(7).fill(null).map(() => Array(6).fill(0));
    
    TIME_PERIODS.forEach((period, periodIdx) => {
      DAYS_OF_WEEK.forEach((_, dayIdx) => {
        const relevantData = correlationData.filter(d => 
          d.dayOfWeek === dayIdx && period.hours.includes(d.hourOfDay)
        );
        
        if (relevantData.length > 0) {
          matrix[dayIdx][periodIdx] = 
            relevantData.reduce((sum, d) => sum + d.moodScore, 0) / relevantData.length;
        }
      });
    });
    
    return matrix;
  }, [correlationData]);

  const getMoodColor = (score: number): string => {
    if (score === 0) return '#F9FAFB';
    if (score <= 1.5) return MOOD_GRADIENT.terrible;
    if (score <= 2.5) return MOOD_GRADIENT.bad;
    if (score <= 3.5) return MOOD_GRADIENT.fine;
    if (score <= 4.5) return MOOD_GRADIENT.good;
    return MOOD_GRADIENT.great;
  };

  return (
    <View className="w-full rounded-3xl bg-white shadow-lg border border-gray-100 overflow-hidden">
      {/* Premium Badge */}
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

      {/* Header */}
      <View className="p-5 pb-0">
        <Text className="text-xl font-extrabold text-gray-800 mb-1">
          Mood Patterns Analysis
        </Text>
        <Text className="text-xs text-gray-500">
          Discover when you feel your best
        </Text>
      </View>

      {/* Key Insights */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-5 py-4">
        <View className="flex-row gap-3">
          {insights.map((insight, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => onInsightPress?.(insight)}
              className="p-3 rounded-2xl border"
              style={{
                borderColor: insight.type === 'best' ? '#10B981' : '#F97316',
                backgroundColor: insight.type === 'best' ? '#F0FDF4' : '#FFF7ED'
              }}
            >
              <View className="flex-row items-center gap-2">
                <Feather 
                  name={insight.type === 'best' ? 'trending-up' : 'trending-down'} 
                  size={16} 
                  color={insight.type === 'best' ? '#10B981' : '#F97316'}
                />
                <Text className="text-xs font-medium text-gray-600">
                  {insight.label}
                </Text>
              </View>
              <Text className="text-sm font-bold mt-1" 
                style={{ color: insight.type === 'best' ? '#10B981' : '#F97316' }}
              >
                {insight.value}
              </Text>
              <Text className="text-xs text-gray-500 mt-1">
                Avg: {insight.score.toFixed(1)}/5
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Heatmap Matrix */}
      <View className="px-5 pb-5">
        <Text className="text-sm font-semibold text-gray-700 mb-3">
          Time × Day Heatmap
        </Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View>
            {/* Time period headers */}
            <View className="flex-row mb-2">
              <View className="w-12" />
              {TIME_PERIODS.map((period, idx) => (
                <View key={idx} className="w-20 items-center">
                  <Text className="text-xs text-gray-600 font-medium">
                    {period.icon}
                  </Text>
                  <Text className="text-xs text-gray-500 mt-1">
                    {period.label.split(' ')[0]}
                  </Text>
                </View>
              ))}
            </View>

            {/* Matrix rows */}
            {DAYS_OF_WEEK.map((day, dayIdx) => (
              <View key={dayIdx} className="flex-row items-center mb-2">
                <Text className="text-xs font-medium text-gray-600 w-12">
                  {day}
                </Text>
                {TIME_PERIODS.map((_, periodIdx) => {
                  const score = matrixData[dayIdx][periodIdx];
                  return (
                    <View
                      key={periodIdx}
                      className="w-20 px-1"
                    >
                      <View
                        className="h-8 rounded-lg items-center justify-center"
                        style={{
                          backgroundColor: getMoodColor(score),
                          borderWidth: score > 0 ? 0 : 1,
                          borderColor: '#E5E7EB'
                        }}
                      >
                        {score > 0 && (
                          <Text className="text-xs font-semibold text-white">
                            {score.toFixed(1)}
                          </Text>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Legend */}
        <View className="flex-row items-center justify-center mt-4 gap-3">
          <Text className="text-xs text-gray-500">Mood:</Text>
          {Object.entries(MOOD_GRADIENT).map(([label, color]) => (
            <View key={label} className="flex-row items-center gap-1">
              <View 
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: color }}
              />
              <Text className="text-xs text-gray-500 capitalize">{label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Day Chart */}
      <View className="px-5 pb-5 border-t border-gray-100 pt-4">
        <Text className="text-sm font-semibold text-gray-700 mb-3">
          Weekly Mood Rhythm
        </Text>
        <VictoryChart
          theme={VictoryTheme.material}
          width={350}
          height={150}
          padding={{ top: 10, bottom: 30, left: 40, right: 20 }}
        >
          <VictoryAxis
            tickValues={dayAverages.map((_, i) => i)}
            tickFormat={dayAverages.map(d => d.day)}
            style={{
              tickLabels: { fontSize: 10, fill: '#6B7280' },
              grid: { stroke: 'transparent' }
            }}
          />
          <VictoryAxis
            dependentAxis
            domain={[1, 5]}
            tickValues={[1, 2, 3, 4, 5]}
            style={{
              tickLabels: { fontSize: 10, fill: '#6B7280' },
              grid: { stroke: '#E5E7EB', strokeDasharray: '2,4' }
            }}
          />
          <VictoryLine
            data={dayAverages.map((d, i) => ({ x: i, y: d.avgMood }))}
            interpolation="cardinal"
            style={{
              data: { stroke: '#7B61FF', strokeWidth: 2 }
            }}
          />
          <VictoryBar
            data={dayAverages.map((d, i) => ({ x: i, y: d.avgMood }))}
            style={{
              data: { fill: '#7B61FF', opacity: 0.2 }
            }}
          />
        </VictoryChart>
      </View>
    </View>
  );
};

export default MoodCorrelationMatrix;

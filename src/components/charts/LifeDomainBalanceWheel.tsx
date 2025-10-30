import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { Tooltip, TooltipContent, TooltipText } from '@/components/ui/tooltip';
import {
  VictoryChart,
  VictoryPolarAxis,
  VictoryArea,
  VictoryTheme,
  VictoryContainer,
} from 'victory-native';
import { LifeDomainScore } from '@/src/network/genAi';

interface LifeDomainBalanceWheelProps {
  data: LifeDomainScore[];
  insight?: string;
  loading?: boolean;
  premium?: boolean;
}

const domainIcons: { [key: string]: string } = {
  'Work/Career': '💼',
  'Relationships': '❤️',
  'Health': '🏃',
  'Personal Growth': '🌱',
  'Recreation': '🎮',
  'Spirituality': '🧘',
};

const domainColors: { [key: string]: string } = {
  'Work/Career': '#7B61FF',
  'Relationships': '#EC4899',
  'Health': '#10B981',
  'Personal Growth': '#F59E0B',
  'Recreation': '#3B82F6',
  'Spirituality': '#8B5CF6',
};

const trendIcons = {
  improving: '↗️',
  stable: '→',
  declining: '↘️',
};

export const LifeDomainBalanceWheel: React.FC<LifeDomainBalanceWheelProps> = ({
  data,
  insight,
  loading = false,
  premium = false,
}) => {
  // Process data for radar chart
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    return data.map((d) => ({
      x: d.domain,
      y: d.score,
    }));
  }, [data]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (!data || data.length === 0) return { balanceScore: 0, lowestDomain: null, highestDomain: null, needsAttention: [] };
    
    const scores = data.map(d => d.score);
    const avg = scores.reduce((sum, s) => sum + s, 0) / scores.length;
    const variance = scores.reduce((sum, s) => sum + Math.pow(s - avg, 2), 0) / scores.length;
    const stdDev = Math.sqrt(variance);
    
    // Balance score: higher when all domains are similar (low std deviation)
    const balanceScore = Math.max(0, 100 - (stdDev * 2));
    
    const lowestDomain = data.reduce((min, d) => d.score < min.score ? d : min, data[0]);
    const highestDomain = data.reduce((max, d) => d.score > max.score ? d : max, data[0]);
    const needsAttention = data.filter(d => d.attention_needed);
    
    return { balanceScore, lowestDomain, highestDomain, needsAttention };
  }, [data]);

  // Generate predictions for next month
  const predictions = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    return data.map(d => ({
      domain: d.domain,
      current: d.score,
      predicted: d.trend === 'improving' 
        ? Math.min(100, d.score + 10)
        : d.trend === 'declining' 
        ? Math.max(0, d.score - 10)
        : d.score,
      trend: d.trend,
    }));
  }, [data]);

  if (!premium) {
    return (
      <TouchableOpacity activeOpacity={0.95}>
        <LinearGradient
          colors={['#7B61FF', '#9C7CFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-2xl p-8 shadow-lg"
        >
          <View className="items-center">
            <View className="w-20 h-20 bg-white/30 rounded-full items-center justify-center mb-5">
              <MaterialIcons name="donut-large" size={36} color="#FFF" />
            </View>
            <Text className="text-white text-2xl font-extrabold mb-3">
              Life Domain Balance Wheel
            </Text>
            <Text className="text-white/90 text-center text-base mb-5 leading-6 font-medium">
              Visualize balance across all areas of your life
            </Text>
            <View className="bg-white/30 px-5 py-2.5 rounded-full">
              <Text className="text-white font-bold text-sm">🔒 Premium Feature</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (loading) {
    return (
      <View className="bg-white rounded-2xl p-6 shadow-sm">
        <View className="items-center py-8">
          <ActivityIndicator size="large" color="#7B61FF" />
          <Text className="text-gray-500 mt-4">Analyzing life balance...</Text>
        </View>
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View className="bg-white rounded-2xl p-6 shadow-sm">
        <View className="items-center py-8">
          <View className="w-16 h-16 bg-purple-100 rounded-full items-center justify-center mb-4">
            <MaterialIcons name="donut-large" size={32} color="#7B61FF" />
          </View>
          <Text className="text-gray-900 text-lg font-semibold mb-2">
            No Balance Data Yet
          </Text>
          <Text className="text-gray-500 text-center text-sm">
            Journal about different life areas to see your balance wheel
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
      {/* Header */}
      <View className="p-5 pb-3 bg-white">
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-1">
            <View className="flex-row items-center">
              <Text className="text-xl font-extrabold text-gray-800">
                Life Domain Balance
              </Text>
              <Tooltip
                placement="bottom"
                trigger={(triggerProps) => (
                  <Pressable {...triggerProps} className="ml-2">
                    <Feather name="info" size={16} color="#7B61FF" />
                  </Pressable>
                )}
              >
                <TooltipContent className="max-w-xs">
                  <TooltipText className="text-white">
                    <Text className="font-bold">How it's calculated:{"\n\n"}</Text>
                    <Text>• Balance Score: Measures how evenly distributed your focus is across life domains (higher = more balanced){"\n"}</Text>
                    <Text>• Domain Scores (0-100): AI analyzes journal entries to score each life area{"\n"}</Text>
                    <Text>• Trends: Tracks if each domain is improving, stable, or declining{"\n"}</Text>
                    <Text>• Predictions: Forecasts next month's scores based on current patterns{"\n\n"}</Text>
                    <Text className="font-bold">Helps identify neglected life areas needing attention</Text>
                  </TooltipText>
                </TooltipContent>
              </Tooltip>
            </View>
            <Text className="text-xs text-gray-500 mt-1">
              Your life areas at a glance
            </Text>
          </View>
          <View className="items-end">
            <Text 
              className="text-3xl font-extrabold"
              style={{
                color: stats.balanceScore >= 70 ? '#10B981' : 
                       stats.balanceScore >= 50 ? '#F59E0B' : '#EF4444'
              }}
            >
              {stats.balanceScore.toFixed(0)}%
            </Text>
            <Text className="text-xs text-gray-500 font-medium">Balance Score</Text>
          </View>
        </View>
      </View>

      {/* Balance Wheel Chart */}
      <View className="items-center py-4">
        <VictoryChart
          polar
          theme={VictoryTheme.material}
          domain={{ y: [0, 100] }}
          height={250}
          width={250}
          padding={40}
          containerComponent={<VictoryContainer responsive={false} />}
        >
          {/* Grid lines */}
          <VictoryPolarAxis
            dependentAxis
            style={{
              axis: { stroke: "none" },
              grid: { stroke: "#E5E7EB", strokeWidth: 0.5 },
              tickLabels: { fill: "transparent" },
            }}
            tickValues={[20, 40, 60, 80, 100]}
          />
          
          {/* Category labels */}
          <VictoryPolarAxis
            labelPlacement="perpendicular"
            style={{
              axis: { stroke: "none" },
              grid: { stroke: "#E5E7EB", strokeWidth: 0.5 },
              tickLabels: { fontSize: 9, fill: "#6B7280", fontWeight: "600" },
            }}
          />
          
          {/* Ideal balance area (gray) */}
          <VictoryArea
            data={chartData.map(d => ({ x: d.x, y: 70 }))}
            style={{
              data: { fill: "#E5E7EB", fillOpacity: 0.3, stroke: "#9CA3AF", strokeWidth: 1, strokeDasharray: "3,3" },
            }}
            interpolation="linear"
          />
          
          {/* Current balance area */}
          <VictoryArea
            data={chartData}
            style={{
              data: { fill: "#7B61FF", fillOpacity: 0.4, stroke: "#7B61FF", strokeWidth: 2 },
            }}
            interpolation="linear"
          />
        </VictoryChart>
      </View>

      {/* Domain Details */}
      <ScrollView className="px-6 pb-4 max-h-48">
        <Text className="text-gray-900 font-semibold text-sm mb-3">
          Domain Breakdown
        </Text>
        {data.map((domain, i) => (
          <View key={i} className="mb-3">
            <View className="flex-row items-center justify-between mb-1">
              <View className="flex-row items-center flex-1">
                <Text className="text-lg mr-2">{domainIcons[domain.domain]}</Text>
                <Text className="text-gray-900 font-medium text-sm">
                  {domain.domain}
                </Text>
                <Text className="ml-2">{trendIcons[domain.trend]}</Text>
                {domain.attention_needed && (
                  <View className="ml-2 bg-red-100 px-2 py-0.5 rounded-full">
                    <Text className="text-red-700 text-xs font-medium">Needs Attention</Text>
                  </View>
                )}
              </View>
              <Text className="text-gray-900 font-semibold">{domain.score}%</Text>
            </View>
            <View className="bg-gray-200 rounded-full h-2 overflow-hidden">
              <View 
                className="h-full rounded-full"
                style={{ 
                  width: `${domain.score}%`,
                  backgroundColor: domainColors[domain.domain] 
                }}
              />
            </View>
            {domain.insights && (
              <Text className="text-gray-600 text-xs mt-1 leading-4">
                {domain.insights}
              </Text>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Key Insights */}
      <View className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <Text className="text-gray-900 font-semibold text-sm mb-2">
          Key Insights
        </Text>
        <View className="space-y-2">
          {stats.lowestDomain && (
            <View className="flex-row items-start">
              <View className="w-2 h-2 bg-red-400 rounded-full mt-1.5 mr-2" />
              <Text className="text-gray-600 text-sm flex-1">
                <Text className="font-medium">{stats.lowestDomain.domain}</Text> needs the most attention 
                ({stats.lowestDomain.score}%)
              </Text>
            </View>
          )}
          {stats.highestDomain && (
            <View className="flex-row items-start">
              <View className="w-2 h-2 bg-green-400 rounded-full mt-1.5 mr-2" />
              <Text className="text-gray-600 text-sm flex-1">
                <Text className="font-medium">{stats.highestDomain.domain}</Text> is your strongest area 
                ({stats.highestDomain.score}%)
              </Text>
            </View>
          )}
          {stats.needsAttention.length > 1 && (
            <View className="flex-row items-start">
              <View className="w-2 h-2 bg-orange-400 rounded-full mt-1.5 mr-2" />
              <Text className="text-gray-600 text-sm flex-1">
                {stats.needsAttention.length} domains need immediate attention
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* AI Insight */}
      {insight && (
        <View className="px-6 py-4 bg-purple-50 border-t border-purple-100">
          <View className="flex-row items-start">
            <Text className="text-lg mr-2">🎯</Text>
            <View className="flex-1">
              <Text className="text-purple-900 font-semibold text-sm mb-1">
                Balance Recommendation
              </Text>
              <Text className="text-purple-700 text-sm leading-5">
                {insight}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Predicted Changes */}
      <View className="px-6 py-4 border-t border-gray-100">
        <Text className="text-gray-900 font-semibold text-sm mb-2">
          Next Month Prediction
        </Text>
        <View className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-3">
          <View className="flex-row flex-wrap">
            {predictions.map((pred, i) => (
              <View key={i} className="flex-row items-center mr-4 mb-2">
                <Text className="text-xs font-medium text-gray-700">
                  {pred.domain.split('/')[0]}:
                </Text>
                <View className="flex-row items-center ml-1">
                  {pred.trend === 'improving' ? (
                    <Feather name="trending-up" size={12} color="#10B981" />
                  ) : pred.trend === 'declining' ? (
                    <Feather name="trending-down" size={12} color="#EF4444" />
                  ) : (
                    <Feather name="minus" size={12} color="#6B7280" />
                  )}
                  <Text className="text-xs font-semibold ml-1" 
                    style={{ 
                      color: pred.trend === 'improving' ? '#10B981' : 
                             pred.trend === 'declining' ? '#EF4444' : '#6B7280' 
                    }}>
                    {pred.predicted}%
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { Tooltip, TooltipContent, TooltipText } from '@/components/ui/tooltip';
import {
  VictoryChart,
  VictoryTheme,
  VictoryLabel,
  VictoryAxis,
} from 'victory-native';
import Svg, { Path, Circle, Text as SvgText, G, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { CognitivePatternLink } from '@/src/network/genAi';

interface CognitivePatternFlowProps {
  data: CognitivePatternLink[];
  insight?: string;
  loading?: boolean;
  premium?: boolean;
}

const typeColors = {
  positive: '#10B981',
  negative: '#EF4444',
  neutral: '#6B7280',
};

const typeGradients = {
  positive: ['#10B981', '#059669'],
  negative: ['#EF4444', '#DC2626'],
  neutral: ['#6B7280', '#4B5563'],
};

export const CognitivePatternFlow: React.FC<CognitivePatternFlowProps> = ({
  data,
  insight,
  loading = false,
  premium = false,
}) => {
  // Process data to create nodes and links
  const { nodes, links, stats } = useMemo(() => {
    if (!data || data.length === 0) return { nodes: [], links: [], stats: {} };
    
    // Extract unique nodes
    const nodeSet = new Set<string>();
    data.forEach(link => {
      nodeSet.add(link.source);
      nodeSet.add(link.target);
    });
    
    // Create node positions
    const uniqueNodes = Array.from(nodeSet);
    const nodePositions = new Map<string, { x: number, y: number, type: 'source' | 'target' | 'both' }>();
    
    // Separate source and target nodes
    const sourceNodes = new Set(data.map(d => d.source));
    const targetNodes = new Set(data.map(d => d.target));
    const bothNodes = new Set([...sourceNodes].filter(x => targetNodes.has(x)));
    
    let sourceY = 50;
    let targetY = 50;
    let bothY = 50;
    
    uniqueNodes.forEach(node => {
      if (bothNodes.has(node)) {
        nodePositions.set(node, { x: 150, y: bothY, type: 'both' });
        bothY += 40;
      } else if (sourceNodes.has(node)) {
        nodePositions.set(node, { x: 50, y: sourceY, type: 'source' });
        sourceY += 40;
      } else {
        nodePositions.set(node, { x: 250, y: targetY, type: 'target' });
        targetY += 40;
      }
    });
    
    // Process links with positions
    const processedLinks = data.map(link => ({
      ...link,
      sourcePos: nodePositions.get(link.source),
      targetPos: nodePositions.get(link.target),
    }));
    
    // Calculate statistics
    const totalStrength = data.reduce((sum, d) => sum + d.value, 0);
    const avgStrength = totalStrength / data.length;
    const positiveCount = data.filter(d => d.type === 'positive').length;
    const negativeCount = data.filter(d => d.type === 'negative').length;
    const strongestPattern = data.reduce((max, d) => d.value > max.value ? d : max, data[0]);
    
    return {
      nodes: Array.from(nodePositions.entries()).map(([name, pos]) => ({ name, ...pos })),
      links: processedLinks,
      stats: {
        avgStrength,
        positiveCount,
        negativeCount,
        strongestPattern,
        totalPatterns: data.length,
      }
    };
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
              <Feather name="git-branch" size={36} color="#FFF" />
            </View>
            <Text className="text-white text-2xl font-extrabold mb-3">
              Cognitive Pattern Flow
            </Text>
            <Text className="text-white/90 text-center text-base mb-5 leading-6 font-medium">
              Visualize how your thoughts and emotions connect
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
          <Text className="text-gray-500 mt-4">Analyzing thought patterns...</Text>
        </View>
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View className="bg-white rounded-2xl p-6 shadow-sm">
        <View className="items-center py-8">
          <View className="w-16 h-16 bg-purple-100 rounded-full items-center justify-center mb-4">
            <Feather name="git-branch" size={32} color="#7B61FF" />
          </View>
          <Text className="text-gray-900 text-lg font-semibold mb-2">
            No Pattern Data Yet
          </Text>
          <Text className="text-gray-500 text-center text-sm">
            Journal more to discover your cognitive patterns
          </Text>
        </View>
      </View>
    );
  }

  // Generate curved path for links
  const generatePath = (source: any, target: any) => {
    if (!source || !target) return '';
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const dr = Math.sqrt(dx * dx + dy * dy);
    return `M${source.x},${source.y} Q${source.x + dx/2},${source.y + dy/2 - 20} ${target.x},${target.y}`;
  };

  return (
    <View className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
      {/* Header */}
      <View className="p-5 pb-3 bg-white">
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-1">
            <View className="flex-row items-center">
              <Text className="text-xl font-extrabold text-gray-800">
                Cognitive Pattern Flow
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
                    <Text>• Source & Target: Identifies recurring thought-emotion connections{"\n"}</Text>
                    <Text>• Pattern Strength (0-100): How strong the connection is{"\n"}</Text>
                    <Text>• Frequency: How often this pattern appears per week{"\n"}</Text>
                    <Text>• Type: Positive (green), Negative (red), or Neutral (gray) patterns{"\n\n"}</Text>
                    <Text className="font-bold">Helps identify thought cycles to break or reinforce</Text>
                  </TooltipText>
                </TooltipContent>
              </Tooltip>
            </View>
            <Text className="text-xs text-gray-500 mt-1">
              How your thoughts connect
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-2xl font-extrabold text-gray-800">
              {stats.totalPatterns}
            </Text>
            <Text className="text-xs text-gray-500">Patterns</Text>
          </View>
        </View>
      </View>

      {/* Stats Cards */}
      <View className="flex-row justify-around px-5 py-3 bg-gray-50 border-y border-gray-100">
        <View className="items-center flex-1">
          <View className="flex-row items-center">
            <View className="w-3 h-3 bg-green-500 rounded-full mr-1" />
            <Text className="text-gray-900 font-bold text-sm">{stats.positiveCount}</Text>
          </View>
          <Text className="text-gray-500 text-xs mt-1">Positive</Text>
        </View>
        
        <View className="w-px bg-gray-300" />
        
        <View className="items-center flex-1">
          <View className="flex-row items-center">
            <View className="w-3 h-3 bg-red-500 rounded-full mr-1" />
            <Text className="text-gray-900 font-bold text-sm">{stats.negativeCount}</Text>
          </View>
          <Text className="text-gray-500 text-xs mt-1">Negative</Text>
        </View>
        
        <View className="w-px bg-gray-300" />
        
        <View className="items-center flex-1">
          <Text className="text-gray-900 font-bold text-sm">
            {stats.avgStrength?.toFixed(0)}%
          </Text>
          <Text className="text-gray-500 text-xs mt-1">Avg Strength</Text>
        </View>
      </View>

      {/* Flow Diagram */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="p-4" style={{ width: 320, height: 300 }}>
          <Svg width="300" height="280" viewBox="0 0 300 280">
            <Defs>
              <SvgGradient id="positiveGradient">
                <Stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
                <Stop offset="100%" stopColor="#059669" stopOpacity="0.8" />
              </SvgGradient>
              <SvgGradient id="negativeGradient">
                <Stop offset="0%" stopColor="#EF4444" stopOpacity="0.8" />
                <Stop offset="100%" stopColor="#DC2626" stopOpacity="0.8" />
              </SvgGradient>
              <SvgGradient id="neutralGradient">
                <Stop offset="0%" stopColor="#6B7280" stopOpacity="0.8" />
                <Stop offset="100%" stopColor="#4B5563" stopOpacity="0.8" />
              </SvgGradient>
            </Defs>
            
            {/* Draw links */}
            {links.map((link, i) => (
              <G key={i}>
                <Path
                  d={generatePath(link.sourcePos, link.targetPos)}
                  stroke={typeColors[link.type]}
                  strokeWidth={Math.max(1, (link.value / 25))}
                  fill="none"
                  opacity={0.6}
                />
              </G>
            ))}
            
            {/* Draw nodes */}
            {nodes.map((node, i) => (
              <G key={i}>
                <Circle
                  cx={node.x}
                  cy={node.y}
                  r="20"
                  fill={node.type === 'source' ? '#7B61FF' : node.type === 'target' ? '#9C7CFF' : '#8B7AFF'}
                  opacity="0.9"
                />
                <SvgText
                  x={node.x}
                  y={node.y + 5}
                  fontSize="11"
                  fontWeight="700"
                  fill="white"
                  textAnchor="middle"
                >
                  {node.name.length > 9 ? node.name.substring(0, 7) + '..' : node.name}
                </SvgText>
              </G>
            ))}
          </Svg>
        </View>
      </ScrollView>

      {/* Legend */}
      <View className="px-6 py-3 border-t border-gray-100">
        <View className="flex-row justify-around">
          <View className="flex-row items-center">
            <View className="w-3 h-3 bg-green-500 rounded-full mr-1" />
            <Text className="text-xs text-gray-600">Positive Flow</Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-3 h-3 bg-red-500 rounded-full mr-1" />
            <Text className="text-xs text-gray-600">Negative Flow</Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-3 h-3 bg-gray-500 rounded-full mr-1" />
            <Text className="text-xs text-gray-600">Neutral Flow</Text>
          </View>
        </View>
      </View>

      {/* AI Insight */}
      {insight && (
        <View className="px-6 py-4 bg-purple-50 border-t border-purple-100">
          <View className="flex-row items-start">
            <Text className="text-lg mr-2">🧠</Text>
            <View className="flex-1">
              <Text className="text-purple-900 font-semibold text-sm mb-1">
                Pattern Insight
              </Text>
              <Text className="text-purple-700 text-sm leading-5">
                {insight}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Strongest Pattern */}
      {stats.strongestPattern && (
        <View className="px-6 py-4 border-t border-gray-100">
          <Text className="text-gray-900 font-semibold text-sm mb-2">
            Strongest Pattern
          </Text>
          <View className="bg-gray-50 rounded-lg p-3">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <View 
                  className="px-2 py-1 rounded-md mr-2"
                  style={{ backgroundColor: typeColors[stats.strongestPattern.type] + '20' }}
                >
                  <Text className="text-xs font-semibold" style={{ color: typeColors[stats.strongestPattern.type] }}>
                    {stats.strongestPattern.source}
                  </Text>
                </View>
                <Feather name="arrow-right" size={14} color="#6B7280" />
                <View 
                  className="px-2 py-1 rounded-md ml-2"
                  style={{ backgroundColor: typeColors[stats.strongestPattern.type] + '20' }}
                >
                  <Text className="text-xs font-semibold" style={{ color: typeColors[stats.strongestPattern.type] }}>
                    {stats.strongestPattern.target}
                  </Text>
                </View>
              </View>
              <View className="items-center ml-2">
                <Text className="text-lg font-bold text-gray-900">
                  {stats.strongestPattern.value}%
                </Text>
                <Text className="text-xs text-gray-500">strength</Text>
              </View>
            </View>
            <Text className="text-xs text-gray-600 mt-2">
              Occurs {stats.strongestPattern.frequency} times per week
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

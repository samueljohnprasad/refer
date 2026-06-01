import React, { useMemo } from 'react';
  View,
  ScrollView,
import { Feather } from '@expo/vector-icons';
import { Tooltip, TooltipContent, TooltipText } from '@/components/ui/tooltip';
import { Text } from "@/src/components/ui/Text";
import { Card } from "@/src/components/ui/Card";
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
            <Text variant="h2" className="text-white mb-3">
              Cognitive Pattern Flow
            </Text>
            <Text variant="body" className="text-white/90 text-center mb-5 font-medium">
              Visualize how your thoughts and emotions connect
            </Text>
            <View className="bg-white/30 px-5 py-2.5 rounded-full">
              <Text variant="label-bold" className="text-white">🔒 Premium Feature</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (loading) {
    return (
      <Card variant="tile">
        <View className="items-center py-8">
          <ActivityIndicator size="large" color="#7B61FF" />
          <Text variant="body" className="text-gray-500 mt-4">Analyzing thought patterns...</Text>
        </View>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card variant="tile">
        <View className="items-center py-8">
          <View className="w-16 h-16 bg-purple-100 rounded-full items-center justify-center mb-4">
            <Feather name="git-branch" size={32} color="#7B61FF" />
          </View>
          <Text variant="h3" className="mb-2">
            No Pattern Data Yet
          </Text>
          <Text variant="body" className="text-center text-gray-500">
            Journal more to discover your cognitive patterns
          </Text>
        </View>
      </Card>
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
    <Card variant="tile" className="p-0 overflow-hidden">
      <View className="p-5 pb-3 bg-white">
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-1">
            <View className="flex-row items-center">
              <Text variant="h2">
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
            <Text variant="caption-muted" className="mt-1">
              How your thoughts connect
            </Text>
          </View>
          <View className="items-end">
            <Text variant="h2">
              {stats.totalPatterns}
            </Text>
            <Text variant="caption-muted">Patterns</Text>
          </View>
        </View>
      </View>

      {/* Stats Cards */}
      <View className="flex-row justify-around px-5 py-3 bg-gray-50 border-y border-gray-100">
        <View className="items-center flex-1">
          <View className="flex-row items-center">
            <View className="w-3 h-3 bg-green-500 rounded-full mr-1" />
            <Text variant="label-bold">{stats.positiveCount}</Text>
          </View>
          <Text variant="caption-muted" className="mt-1">Positive</Text>
        </View>
        
        <View className="w-px bg-gray-300" />
        
        <View className="items-center flex-1">
          <View className="flex-row items-center">
            <View className="w-3 h-3 bg-red-500 rounded-full mr-1" />
            <Text variant="label-bold">{stats.negativeCount}</Text>
          </View>
          <Text variant="caption-muted" className="mt-1">Negative</Text>
        </View>
        
        <View className="w-px bg-gray-300" />
        
        <View className="items-center flex-1">
          <Text variant="label-bold">
            {stats.avgStrength?.toFixed(0)}%
          </Text>
          <Text variant="caption-muted" className="mt-1">Avg Strength</Text>
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
            <Text variant="caption-muted">Positive Flow</Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-3 h-3 bg-red-500 rounded-full mr-1" />
            <Text variant="caption-muted">Negative Flow</Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-3 h-3 bg-gray-500 rounded-full mr-1" />
            <Text variant="caption-muted">Neutral Flow</Text>
          </View>
        </View>
      </View>

      {/* AI Insight */}
      {insight && (
        <View className="px-6 py-4 bg-purple-50 border-t border-purple-100">
          <View className="flex-row items-start">
            <Text className="text-lg mr-2">🧠</Text>
            <View className="flex-1">
              <Text variant="label-bold" className="text-purple-900 mb-1">
                Pattern Insight
              </Text>
              <Text variant="body" className="text-purple-700">
                {insight}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Strongest Pattern */}
      {stats.strongestPattern && (
        <View className="px-6 py-4 border-t border-gray-100">
          <Text variant="label-bold" className="mb-2">
            Strongest Pattern
          </Text>
          <View className="bg-gray-50 rounded-lg p-3">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <View 
                  className="px-2 py-1 rounded-md mr-2"
                  style={{ backgroundColor: typeColors[stats.strongestPattern.type] + '20' }}
                >
                  <Text variant="label-bold" style={{ color: typeColors[stats.strongestPattern.type] }}>
                    {stats.strongestPattern.source}
                  </Text>
                </View>
                <Feather name="arrow-right" size={14} color="#6B7280" />
                <View 
                  className="px-2 py-1 rounded-md ml-2"
                  style={{ backgroundColor: typeColors[stats.strongestPattern.type] + '20' }}
                >
                  <Text variant="label-bold" style={{ color: typeColors[stats.strongestPattern.type] }}>
                    {stats.strongestPattern.target}
                  </Text>
                </View>
              </View>
              <View className="items-center ml-2">
                <Text variant="h3" className="text-gray-900">
                  {stats.strongestPattern.value}%
                </Text>
                <Text variant="caption-muted">strength</Text>
              </View>
            </View>
            <Text variant="caption-muted" className="mt-2">
              Occurs {stats.strongestPattern.frequency} times per week
            </Text>
          </View>
        </View>
      )}
    </Card>
  );
};

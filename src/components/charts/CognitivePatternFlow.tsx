
import { Feather } from '@expo/vector-icons';
import { Tooltip, TooltipContent, TooltipText } from '@/src/components/ui/tooltip';
import { Text } from "@/src/components/ui/Text";
import { Card } from "@/src/components/ui/Card";
import { CognitivePatternLink } from '@/src/network/genAi';
import { ActivityIndicator, Pressable, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo } from 'react';
import { useTranslation } from "react-i18next";
import { CognitivePatternVisuals } from "./CognitivePatternVisuals";

interface CognitivePatternFlowProps {
  data: CognitivePatternLink[];
  insight?: string;
  loading?: boolean;
  premium?: boolean;
}

export const CognitivePatternFlow: React.FC<CognitivePatternFlowProps> = ({
  data,
  insight,
  loading = false,
  premium = false,
}) => {
  const { t } = useTranslation("insights");
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
              {t("cognitive.title")}
            </Text>
            <Text variant="body" className="text-white/90 text-center mb-5 font-medium">{t("cognitive.lockedDescription")}</Text>
            <View className="bg-white/30 px-5 py-2.5 rounded-full">
              <Text variant="label-bold" className="text-white">🔒 {t("chart.premiumFeature")}</Text>
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
          <Text variant="body" className="text-gray-500 mt-4">{t("cognitive.analyzing")}</Text>
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
            {t("cognitive.emptyTitle")}
          </Text>
          <Text variant="body" className="text-center text-gray-500">
            {t("cognitive.emptyDescription")}
          </Text>
        </View>
      </Card>
    );
  }

  return (
    <Card variant="tile" className="p-0 overflow-hidden">
      <View className="p-5 pb-3 bg-white">
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-1">
            <View className="flex-row items-center">
              <Text variant="h2">
                {t("cognitive.title")}
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
                    <Text className="font-bold">{t("cognitive.howCalculated")}:{"\n\n"}</Text>
                    <Text>• {t("cognitive.sourceAndTarget")}: {t("cognitive.sourceAndTargetHelp")}{"\n"}</Text>
                    <Text>• {t("cognitive.patternStrength")}: {t("cognitive.patternStrengthHelp")}{"\n"}</Text>
                    <Text>• {t("cognitive.frequencyLabel")}: {t("cognitive.frequencyHelp")}{"\n"}</Text>
                    <Text>• {t("cognitive.type")}: {t("cognitive.typeHelp")}{"\n\n"}</Text>
                    <Text className="font-bold">{t("cognitive.helpsIdentify")}</Text>
                  </TooltipText>
                </TooltipContent>
              </Tooltip>
            </View>
            <Text variant="caption-muted" className="mt-1">
              {t("cognitive.description")}
            </Text>
          </View>
          <View className="items-end">
            <Text variant="h2">
              {stats.totalPatterns}
            </Text>
            <Text variant="caption-muted">{t("cognitive.patterns")}</Text>
          </View>
        </View>
      </View>

      <CognitivePatternVisuals links={links} nodes={nodes} stats={stats} insight={insight} />
    </Card>
  );
};

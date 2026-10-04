import { ScrollView } from "react-native-gesture-handler";
import Svg, { Circle, Defs, G, LinearGradient, Path, Stop, Text as SvgText } from "react-native-svg";
import { Feather } from "@expo/vector-icons";
import { Text } from "@/src/components/ui/Text";
import { View } from "react-native";
import { CognitivePatternLink } from "@/src/network/genAi";
import { useTranslation } from "react-i18next";

interface Point { x: number; y: number }
interface PositionedLink extends CognitivePatternLink { sourcePos?: Point; targetPos?: Point }
interface PatternNode extends Point { name: string; type: "source" | "target" | "both" }
interface PatternStats {
  avgStrength?: number;
  positiveCount?: number;
  negativeCount?: number;
  strongestPattern?: CognitivePatternLink;
  totalPatterns?: number;
}
interface CognitivePatternVisualsProps {
  links: PositionedLink[];
  nodes: PatternNode[];
  stats: PatternStats;
  insight?: string;
}

const TYPE_COLORS = { positive: "#10B981", negative: "#EF4444", neutral: "#6B7280" };

function createCurve(source?: Point, target?: Point) {
  if (!source || !target) return "";
  const middleX = source.x + (target.x - source.x) / 2;
  const middleY = source.y + (target.y - source.y) / 2 - 20;
  return `M${source.x},${source.y} Q${middleX},${middleY} ${target.x},${target.y}`;
}

export function CognitivePatternVisuals({ links, nodes, stats, insight }: CognitivePatternVisualsProps) {
  const { t } = useTranslation("insights");
  return (
    <>
      <View className="flex-row justify-around px-5 py-3 bg-gray-50 border-y border-gray-100">
        <Stat color="positive" value={stats.positiveCount ?? 0} label={t("cognitive.positive")} />
        <View className="w-px bg-gray-300" />
        <Stat color="negative" value={stats.negativeCount ?? 0} label={t("cognitive.negative")} />
        <View className="w-px bg-gray-300" />
        <View className="items-center flex-1"><Text variant="label-bold">{stats.avgStrength?.toFixed(0)}%</Text><Text variant="caption-muted" className="mt-1">{t("cognitive.averageStrength")}</Text></View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="p-4" style={{ width: 320, height: 300 }}>
          <Svg width="300" height="280" viewBox="0 0 300 280">
            <Defs><LinearGradient id="positiveGradient"><Stop offset="0%" stopColor="#10B981" stopOpacity="0.8" /><Stop offset="100%" stopColor="#059669" stopOpacity="0.8" /></LinearGradient><LinearGradient id="negativeGradient"><Stop offset="0%" stopColor="#EF4444" stopOpacity="0.8" /><Stop offset="100%" stopColor="#DC2626" stopOpacity="0.8" /></LinearGradient><LinearGradient id="neutralGradient"><Stop offset="0%" stopColor="#6B7280" stopOpacity="0.8" /><Stop offset="100%" stopColor="#4B5563" stopOpacity="0.8" /></LinearGradient></Defs>
            {links.map((link, index) => <G key={index}><Path d={createCurve(link.sourcePos, link.targetPos)} stroke={TYPE_COLORS[link.type]} strokeWidth={Math.max(1, link.value / 25)} fill="none" opacity={0.6} /></G>)}
            {nodes.map((node, index) => <G key={index}><Circle cx={node.x} cy={node.y} r="20" fill={node.type === "source" ? "#7B61FF" : node.type === "target" ? "#9C7CFF" : "#8B7AFF"} opacity="0.9" /><SvgText x={node.x} y={node.y + 5} fontSize="11" fontWeight="700" fill="white" textAnchor="middle">{node.name.length > 9 ? `${node.name.substring(0, 7)}..` : node.name}</SvgText></G>)}
          </Svg>
        </View>
      </ScrollView>

      <View className="px-6 py-3 border-t border-gray-100"><View className="flex-row justify-around"><Legend color="positive" label={t("cognitive.positiveFlow")} /><Legend color="negative" label={t("cognitive.negativeFlow")} /><Legend color="neutral" label={t("cognitive.neutralFlow")} /></View></View>
      {insight && <View className="px-6 py-4 bg-purple-50 border-t border-purple-100"><View className="flex-row items-start"><Text className="text-lg mr-2">🧠</Text><View className="flex-1"><Text variant="label-bold" className="text-purple-900 mb-1">{t("cognitive.patternInsight")}</Text><Text variant="body" className="text-purple-700">{insight}</Text></View></View></View>}
      {stats.strongestPattern && <View className="px-6 py-4 border-t border-gray-100"><Text variant="label-bold" className="mb-2">{t("cognitive.strongestPattern")}</Text><View className="bg-gray-50 rounded-lg p-3"><View className="flex-row items-center justify-between"><View className="flex-row items-center flex-1"><PatternLabel color={TYPE_COLORS[stats.strongestPattern.type]} value={stats.strongestPattern.source} /><Feather name="arrow-right" size={14} color="#6B7280" /><PatternLabel color={TYPE_COLORS[stats.strongestPattern.type]} value={stats.strongestPattern.target} /><View className="items-center ml-2"><Text variant="h3" className="text-gray-900">{stats.strongestPattern.value}%</Text><Text variant="caption-muted">{t("cognitive.strength")}</Text></View></View></View><Text variant="caption-muted" className="mt-2">{t("cognitive.frequency", { count: stats.strongestPattern.frequency })}</Text></View></View>}
    </>
  );
}

type PatternColor = "positive" | "negative" | "neutral";
const DOT_CLASSES: Record<PatternColor, string> = { positive: "bg-green-500", negative: "bg-red-500", neutral: "bg-gray-500" };

function Stat({ color, value, label }: { color: PatternColor; value: number; label: string }) {
  return <View className="items-center flex-1"><View className="flex-row items-center"><View className={`w-3 h-3 ${DOT_CLASSES[color]} rounded-full mr-1`} /><Text variant="label-bold">{value}</Text></View><Text variant="caption-muted" className="mt-1">{label}</Text></View>;
}

function Legend({ color, label }: { color: PatternColor; label: string }) {
  return <View className="flex-row items-center"><View className={`w-3 h-3 ${DOT_CLASSES[color]} rounded-full mr-1`} /><Text variant="caption-muted">{label}</Text></View>;
}

function PatternLabel({ color, value }: { color: string; value: string }) {
  return <View className="px-2 py-1 rounded-md mx-2" style={{ backgroundColor: `${color}20` }}><Text variant="label-bold" style={{ color }}>{value}</Text></View>;
}

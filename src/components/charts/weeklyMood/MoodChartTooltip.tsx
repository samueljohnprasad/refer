import { View } from "react-native";
import { Text } from "@/src/components/ui/Text";

export const ChartTooltip = ({
  x,
  y,
  title,
  subtitle,
}: {
  x: number;
  y: number;
  title: string;
  subtitle: string;
}) => (
  <View
    style={{
      position: "absolute",
      left: x - 60,
      top: y - 55,
      width: 120,
      alignItems: "center",
      zIndex: 150,
    }}
    pointerEvents="none"
  >
    <View className="bg-ink px-3 py-2 rounded-lg shadow-lg items-center">
      <Text className="text-white text-xs font-bold">{title}</Text>
      <Text className="text-ink-muted text-[10px]">{subtitle}</Text>
      <View
        style={{
          position: "absolute",
          bottom: -4,
          width: 0,
          height: 0,
          borderLeftWidth: 4,
          borderRightWidth: 4,
          borderTopWidth: 4,
          borderLeftColor: "transparent",
          borderRightColor: "transparent",
          borderTopColor: "#1F2937",
        }}
      />
    </View>
  </View>
);

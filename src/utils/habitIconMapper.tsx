import React from "react";
import { Platform, Text, View } from "react-native";

let SwiftUIImage: any = null;
let SwiftUIHost: any = null;
if (Platform.OS === "ios") {
  try {
    const swiftui = require("@expo/ui/swift-ui");
    SwiftUIImage = swiftui.Image;
    SwiftUIHost = swiftui.Host;
  } catch (e) {
    // Fallback if not installed
  }
}

type SFSymbolMapping = {
  systemName: string;
  color: string;
};

// Map existing emojis to SF Symbols
export const EMOJI_TO_SF_SYMBOL: Record<string, SFSymbolMapping> = {
  "💧": { systemName: "drop.fill", color: "#0ea5e9" }, // sky-500
  "💪": { systemName: "figure.run", color: "#f59e0b" }, // amber-500
  "🧘": { systemName: "figure.mind.and.body", color: "#8b5cf6" }, // violet-500
  "📚": { systemName: "book.closed.fill", color: "#3b82f6" }, // blue-500
  "❤️": { systemName: "heart.fill", color: "#ef4444" }, // red-500
  "✍️": { systemName: "pencil.and.outline", color: "#10b981" }, // emerald-500
  "😴": { systemName: "moon.zzz.fill", color: "#6366f1" }, // indigo-500
  "🚶": { systemName: "figure.walk", color: "#22c55e" }, // green-500
  "✨": { systemName: "sparkles", color: "#eab308" }, // yellow-500
  "✓": { systemName: "checkmark.circle.fill", color: "#14b8a6" }, // teal-500
};

interface HabitIconProps {
  icon: string | null | undefined;
  size?: number;
  opacity?: number;
}

export function HabitIcon({ icon, size = 24, opacity = 1 }: HabitIconProps) {
  const defaultEmoji = "✨";
  const emoji = icon || defaultEmoji;

  if (Platform.OS === "ios" && SwiftUIImage && SwiftUIHost) {
    const mapping = EMOJI_TO_SF_SYMBOL[emoji];
    if (mapping) {
      return (
        <View style={{ opacity, width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
          <SwiftUIHost matchContents>
            <SwiftUIImage 
              systemName={mapping.systemName} 
              size={size} 
              color={mapping.color} 
            />
          </SwiftUIHost>
        </View>
      );
    }
  }

  // Fallback to emoji
  return (
    <Text style={{ fontSize: size, opacity }}>
      {emoji}
    </Text>
  );
}

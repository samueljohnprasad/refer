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
// ponytail: colors desaturated ~20% so icons feel part of the sage palette
export const EMOJI_TO_SF_SYMBOL: Record<string, SFSymbolMapping> = {
  "💧": { systemName: "drop.fill", color: "#38a3c8" },       // muted sky
  "💪": { systemName: "figure.run", color: "#c98d35" },       // muted amber
  "🧘": { systemName: "figure.mind.and.body", color: "#7c5cc4" }, // muted violet
  "📚": { systemName: "book.closed.fill", color: "#3d7cc4" }, // muted blue
  "❤️": { systemName: "heart.fill", color: "#d95f5f" },       // muted red
  "✍️": { systemName: "pencil.and.outline", color: "#2fa87a" }, // muted emerald
  "😴": { systemName: "moon.zzz.fill", color: "#5b5ec4" },    // muted indigo
  "🚶": { systemName: "figure.walk", color: "#3aaa5a" },      // muted green
  "✨": { systemName: "sparkles", color: "#c9a020" },          // muted yellow
  "✓": { systemName: "checkmark.circle.fill", color: "#2aa89a" }, // muted teal
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

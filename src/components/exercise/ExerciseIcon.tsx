import React from "react";
import { Platform, View } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { SymbolView } from "expo-symbols";
import { getExerciseIcon, getCategoryIcon } from "@/src/data/exerciseIconRegistry";

const EXERCISE_TO_SFSYMBOL: Record<string, string> = {
  // CBT Core
  thought_catcher: "brain.head.profile",
  thought_reframing: "arrow.triangle.2.circlepath",
  gratitude_reframe: "sparkles",
  abc_analysis: "scalemass",
  // Mindfulness
  box_breathing: "lungs.fill",
  breathing_478: "wind",
  grounding_54321: "hand.raised.fill",
  body_scan_pmr: "figure.mind.and.body",
  mindful_breathing_1min: "timer",
  // Anxiety
  decatastrophizing: "cloud.fill",
  worry_decision_tree: "arrow.branch",
  // Overthinking
  detached_mindfulness: "leaf.fill",
  attention_training: "headphones",
};

const CATEGORY_TO_SFSYMBOL: Record<string, string> = {
  cbt_core: "brain.head.profile",
  mindfulness: "leaf.fill",
  anxiety: "cloud.fill",
  overthinking: "arrow.triangle.2.circlepath",
};

let SwiftUIImage: any = null;
let SwiftUIHost: any = null;
let symbolEffect: any = null;
if (Platform.OS === "ios") {
  try {
    const swiftui = require("@expo/ui/swift-ui");
    SwiftUIImage = swiftui.Image;
    SwiftUIHost = swiftui.Host;
    symbolEffect = require("@expo/ui/swift-ui/modifiers").symbolEffect;
  } catch (e) {
    // Fallback
  }
}

interface ExerciseIconProps {
  type?: string;
  category?: string;
  size?: number;
  color?: string;
  animated?: boolean;
}

export function ExerciseIcon({ type, category, size = 24, color = "black", animated = false }: ExerciseIconProps) {
  const sfSymbol = (type && EXERCISE_TO_SFSYMBOL[type]) || (category && CATEGORY_TO_SFSYMBOL[category]);
  
  if (Platform.OS === "ios" && sfSymbol) {
    const sfSize = Math.max(12, Math.round(size * 0.75));

    if (animated && SwiftUIImage && SwiftUIHost) {
      const modifiers = symbolEffect ? [
        symbolEffect({ effect: 'bounce', options: { direction: 'up', speed: 1.2 } })
      ] : [];

      return (
        <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <SwiftUIHost matchContents style={{ width: sfSize, height: sfSize }}>
            <SwiftUIImage 
              systemName={sfSymbol} 
              size={sfSize} 
              color={color} 
              modifiers={modifiers}
            />
          </SwiftUIHost>
        </View>
      );
    }

    return (
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <SymbolView
          name={sfSymbol as any}
          size={sfSize}
          tintColor={color}
          style={{ width: sfSize, height: sfSize }}
        />
      </View>
    );
  }
  
  const hugeicon = type ? getExerciseIcon(type) : getCategoryIcon(category!);
  return <HugeiconsIcon icon={hugeicon} size={size} color={color} />;
}

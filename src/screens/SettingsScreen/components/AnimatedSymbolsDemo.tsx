import { Host, HStack, Image, VStack, useNativeState } from "@expo/ui/swift-ui";
import { frame, symbolEffect, type SymbolEffect } from "@expo/ui/swift-ui/modifiers";
import { scheduleOnUI } from "react-native-worklets";
import type { SFSymbol } from "sf-symbols-typescript";

type Item = { symbol: SFSymbol; effect: SymbolEffect };

const ROWS: Item[][] = [
  [
    { symbol: "bell.and.waves.left.and.right.fill", effect: { effect: "wiggle" } },
    {
      symbol: "wifi",
      effect: { effect: "variableColor", fillStyle: "iterative", playbackStyle: "reversing" },
    },
    { symbol: "heart.fill", effect: { effect: "bounce", direction: "up" } },
  ],
  [
    { symbol: "ellipsis.message.fill", effect: { effect: "variableColor", fillStyle: "cumulative" } },
    { symbol: "arrow.triangle.2.circlepath", effect: { effect: "rotate", direction: "clockwise" } },
    {
      symbol: "rays",
      effect: { effect: "variableColor", fillStyle: "iterative", inactiveLayers: "dim" },
    },
  ],
  [
    { symbol: "paperplane.fill", effect: { effect: "bounce", direction: "up" } },
    { symbol: "star.fill", effect: { effect: "breathe" } },
    {
      symbol: "speaker.wave.3.fill",
      effect: { effect: "variableColor", fillStyle: "iterative", playbackStyle: "reversing" },
    },
  ],
];

function AnimatedSymbol({ symbol, effect }: Item) {
  const trigger = useNativeState(0);

  return (
    <Image
      systemName={symbol}
      size={44}
      onPress={() =>
        scheduleOnUI(() => {
          "worklet";
          trigger.value = trigger.value + 1;
        })
      }
      modifiers={[symbolEffect(effect, { value: trigger }), frame({ width: 92, height: 60 })]}
    />
  );
}

export function AnimatedSymbolsDemo() {
  return (
    <Host matchContents>
      <VStack spacing={24}>
        {ROWS.map((row, index) => (
          <HStack key={`row-${index}`} spacing={16}>
            {row.map((item) => (
              <AnimatedSymbol key={item.symbol} {...item} />
            ))}
          </HStack>
        ))}
      </VStack>
    </Host>
  );
}

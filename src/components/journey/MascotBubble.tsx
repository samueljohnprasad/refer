/**
 * MascotBubble (Task 4.1.1)
 * Duolingo-style owl mascot that appears along the journey path.
 *
 * Features:
 * - Owl avatar with breathing scale animation (synced to a gentle pulse)
 * - Speech bubble with the current message
 * - Entrance slide-in animation (slides from the placement side)
 * - Tap to cycle through random encouraging messages (Task 4.1.3)
 *
 * Placement is absolute-positioned; the parent provides x/y via props.
 */

import React, { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import Animated, {
  useSharedValue,
  withTiming,
  withSpring,
  withDelay,
  FadeIn,
} from "react-native-reanimated";

import { PressableScale } from "@/src/components/ui/PressableScale";
import { useReducedMotion } from "@/src/hooks/useReducedMotion";
import {
  ANIMATION_TIMING,
  MASCOT_MESSAGES,
  MASCOT_SIZE,
} from "@/src/data/journey/constants";
import { MascotSide } from "@/src/types/journey/enums";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface MascotBubbleProps {
  /** Absolute X position (center of the mascot avatar) */
  x: number;
  /** Absolute Y position (center of the mascot avatar) */
  y: number;
  /** Which side of the path the mascot sits on */
  side: MascotSide;
  /** Initial message to display in the speech bubble */
  initialMessage?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getRandomMessage(exclude: string): string {
  const filtered: readonly string[] = MASCOT_MESSAGES.filter(
    (m: string) => m !== exclude,
  );
  const index: number = Math.floor(Math.random() * filtered.length);
  return filtered[index] ?? MASCOT_MESSAGES[0];
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface OwlAvatarProps { }

function OwlAvatar({ }: OwlAvatarProps): React.JSX.Element {
  return (
    <View
      className="items-center justify-center rounded-full"
      accessibilityRole="image"
      accessibilityLabel="Duo the owl mascot"
    >
      <View
        className="items-center justify-center rounded-full"
        style={{
          width: MASCOT_SIZE.avatar,
          height: MASCOT_SIZE.avatar,
          backgroundColor: "#58CC02",
          borderWidth: 3,
          borderColor: "#45A802",
        }}
      >
        <Text className="text-2xl">🦉</Text>
      </View>
    </View>
  );
}

interface SpeechBubbleProps {
  message: string;
  side: MascotSide;
}

function SpeechBubble({ message, side }: SpeechBubbleProps): React.JSX.Element {
  const isLeft: boolean = side === MascotSide.LEFT;

  return (
    <View
      className="rounded-2xl px-3 py-2 bg-white"
      accessibilityRole="text"
      accessibilityLabel={`Mascot says: ${message}`}
      accessibilityLiveRegion="polite"
      style={{
        maxWidth: MASCOT_SIZE.bubbleMaxWidth,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
      }}
    >
      <Text className="text-xs font-bold text-slate-700 leading-4">
        {message}
      </Text>
      {/* Speech bubble arrow pointing toward the owl */}
      <View
        className="absolute bg-white"
        style={{
          width: 10,
          height: 10,
          bottom: 10,
          ...(isLeft ? { right: -4 } : { left: -4 }),
          transform: [{ rotate: "45deg" }],
        }}
      />
    </View>
  );
}

// ---------------------------------------------------------------------------
// MascotBubble
// ---------------------------------------------------------------------------

function MascotBubble({
  x,
  y,
  side,
  initialMessage,
}: MascotBubbleProps): React.JSX.Element {
  const [message, setMessage] = useState<string>(
    initialMessage ?? MASCOT_MESSAGES[0],
  );

  const isLeft: boolean = side === MascotSide.LEFT;
  const halfAvatar: number = MASCOT_SIZE.avatar / 2;
  const reducedMotion: boolean = useReducedMotion();

  // ── Entrance slide-in animation ──
  // Mascots are now kept mounted (hidden via opacity in parent) so this
  // animation only fires once on initial mount — no more churn.
  const entranceX = useSharedValue(reducedMotion ? 0 : isLeft ? -60 : 60);
  const entranceOpacity = useSharedValue(reducedMotion ? 1 : 0);

  useEffect(() => {
    if (reducedMotion) {
      entranceX.value = 0;
      entranceOpacity.value = 1;
      return;
    }
    entranceX.value = withDelay(
      ANIMATION_TIMING.mascotEntrance,
      withSpring(0, { damping: 14, stiffness: 120 }),
    );
    entranceOpacity.value = withDelay(
      ANIMATION_TIMING.mascotEntrance,
      withTiming(1, { duration: 300 }),
    );
  }, [entranceX, entranceOpacity, isLeft, reducedMotion]);

  // ── Tap handler — cycle random message (Task 4.1.3) ──
  const handleTap = useCallback((): void => {
    setMessage((prev: string) => getRandomMessage(prev));
  }, []);

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          left: x - halfAvatar,
          top: y - halfAvatar,
          flexDirection: isLeft ? "row" : "row-reverse",
          alignItems: "center",
        },
      ]}
      entering={FadeIn.delay(ANIMATION_TIMING.mascotEntrance).duration(400)}
    >
      <PressableScale
        onPress={handleTap}
        scale={0.9}
        hapticStyle="light"
        accessibilityRole="button"
        accessibilityLabel="Tap for encouragement"
      >
        <OwlAvatar />
      </PressableScale>

      <View style={{ width: 8 }} />

      <SpeechBubble
        message={message}
        side={side}
      />
    </Animated.View>
  );
}

export default React.memo(MascotBubble);

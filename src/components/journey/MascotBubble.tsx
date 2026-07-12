/**
 * MascotBubble (Task 4.1.1)
 * Duolingo-style owl mascot that appears along the journey path.
 *
 * Features:
 * - Owl avatar with breathing scale animation (synced to a gentle pulse)
 * - Speech bubble with the current message
 * - Tap to cycle through random encouraging messages (Task 4.1.3)
 *
 * Placement is absolute-positioned; the parent provides x/y via props.
 */

import React, { useCallback, useState } from "react";
import { View } from "react-native";
import { Image } from "expo-image";
import { Text } from "@/src/components/ui/Text";
import Animated from "react-native-reanimated";

import { PressableScale } from "@/src/components/ui/PressableScale";
import { MASCOT_MESSAGES, MASCOT_SIZE } from "@/src/data/journey/constants";
import { MascotSide } from "@/src/types/journey/enums";
import { Mascot } from "@/src/components/ui/Mascot";

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
  /** Image key (e.g. 'panda-writing') */
  imageKey?: string;
  /**
   * Avatar render size in dp. Falls back to MASCOT_SIZE.avatar when omitted.
   * Comes straight from MascotPlacementConfig — no computation here.
   */
  avatarSize?: number;
  /**
   * Vertical nudge from the anchor point in dp.
   * Falls back to MASCOT_SIZE.verticalOffset when omitted.
   */
  offsetY?: number;
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
      className="rounded-2xl px-3 py-2 bg-brand-surface"
      accessibilityRole="text"
      accessibilityLabel={`Mascot says: ${message}`}
      accessibilityLiveRegion="polite"
      style={{
        maxWidth: MASCOT_SIZE.bubbleMaxWidth,
        shadowColor: "#2B3A22",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.10,
        shadowRadius: 6,
        elevation: 3,
      }}
    >
      <Text className="text-xs font-bold text-ink leading-4">
        {message}
      </Text>
      {/* Speech bubble arrow pointing toward the owl */}
      <View
        className="absolute bg-brand-surface"
        style={{
          width: 10,
          height: 10,
          bottom: 10,
          ...(isLeft ? { left: -4 } : { right: -4 }),
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
  imageKey,
  avatarSize,
  offsetY,
}: MascotBubbleProps): React.JSX.Element {
  const [message, setMessage] = useState<string>(
    initialMessage ?? MASCOT_MESSAGES[0],
  );

  const isLeft: boolean = side === MascotSide.LEFT;
  // Use config-supplied size; fall back to the constant — no multipliers.
  const resolvedAvatarSize: number = avatarSize ?? MASCOT_SIZE.avatar;
  const resolvedOffsetY: number = offsetY ?? MASCOT_SIZE.verticalOffset;
  const halfAvatar: number = resolvedAvatarSize / 2;

  // ── Tap handler — cycle random message (Task 4.1.3) ──
  const handleTap = useCallback((): void => {
    setMessage((prev: string) => getRandomMessage(prev));
  }, []);

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          left: x,
          top: y + resolvedOffsetY,
          width: 0,
          height: 0,
          alignItems: "center",
          justifyContent: "center",
          opacity: 1,
          backgroundColor: "transparent",
        },
      ]}
      pointerEvents="box-none"
    >
      {/* Speech Bubble centered vertically around avatar, positioned to the correct side */}
      <View
        style={{
          position: "absolute",
          top: -100,
          bottom: -100,
          justifyContent: "center",
          ...(isLeft ? { left: halfAvatar + 8 } : { right: halfAvatar + 8 }),
          backgroundColor: "transparent",
        }}
        pointerEvents="box-none"
      >
        <SpeechBubble message={message} side={side} />
      </View>

      {/* Avatar perfectly centered at x,y */}
      <View
        style={{
          position: "absolute",
          left: -halfAvatar,
          top: -halfAvatar,
          backgroundColor: "transparent",
        }}
      >
        <PressableScale
          onPress={handleTap}
          scale={0.9}
          hapticStyle="light"
          accessibilityRole="button"
          accessibilityLabel="Tap for encouragement"
        >
          <Mascot
            state={(imageKey as any) ?? "panda-happy"}
            size={resolvedAvatarSize}
          />
        </PressableScale>
      </View>
    </Animated.View>
  );
}

export default React.memo(MascotBubble);

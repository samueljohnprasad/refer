import React from "react";
import { View } from "react-native";
import { Text } from "@/src/components/ui/Text";
import Animated from "react-native-reanimated";
import { PressableScale } from "@/src/components/ui/PressableScale";
import { MASCOT_SIZE } from "@/src/data/journey/constants";
import { MascotSide } from "@/src/types/journey/enums";
import { Mascot } from "@/src/components/ui/Mascot";
import {
  useMascotBubbleViewModel,
  type MascotBubbleProps,
} from "../hooks/useMascotBubbleViewModel";

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
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
      }}
    >
      <Text className="text-xs font-bold text-ink leading-4">{message}</Text>
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

export interface MascotBubbleViewProps
  extends ReturnType<typeof useMascotBubbleViewModel> {}

/**
 * Presentational View component for MascotBubble.
 * Consists strictly of JSX code without internal hooks.
 */
export const MascotBubbleView = React.memo(function MascotBubbleView({
  message,
  isLeft,
  resolvedAvatarSize,
  resolvedOffsetY,
  halfAvatar,
  handleTap,
  x,
  y,
  side,
  imageKey,
}: MascotBubbleViewProps): React.JSX.Element {
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
});

/**
 * Container component for MascotBubble.
 */
function MascotBubble(props: MascotBubbleProps): React.JSX.Element {
  const viewModel = useMascotBubbleViewModel(props);
  return <MascotBubbleView {...viewModel} />;
}

export default React.memo(MascotBubble);
export type { MascotBubbleProps };

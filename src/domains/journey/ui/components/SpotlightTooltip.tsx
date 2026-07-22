import React from "react";
import { View, Text, Pressable } from "react-native";
import Animated from "react-native-reanimated";
import {
  useSpotlightTooltipViewModel,
  type SpotlightTooltipProps,
  type SpotlightTarget,
  TOOLTIP_MAX_WIDTH,
  SPOTLIGHT_PADDING,
} from "../hooks/useSpotlightTooltipViewModel";

export interface SpotlightTooltipViewProps
  extends ReturnType<typeof useSpotlightTooltipViewModel> {}

/**
 * Presentational View component for SpotlightTooltip.
 * Strictly contains JSX code without internal hooks.
 */
export const SpotlightTooltipView = React.memo(function SpotlightTooltipView({
  overlayStyle,
  tooltipAnimStyle,
  hasTarget,
  showBelow,
  tooltipTop,
  tooltipLeft,
  visible,
  message,
  target,
  onDismiss,
}: SpotlightTooltipViewProps): React.JSX.Element | null {
  if (!visible) return null;

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
      }}
      pointerEvents="box-none"
    >
      <Pressable
        onPress={onDismiss}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        accessibilityLabel="Dismiss tooltip"
        accessibilityRole="button"
      >
        <Animated.View
          style={[
            overlayStyle,
            { flex: 1, backgroundColor: "rgba(0,0,0,0.6)" },
          ]}
        />
      </Pressable>

      {hasTarget ? (
        <View
          style={{
            position: "absolute",
            left: target!.x - (target!.width / 2 + SPOTLIGHT_PADDING),
            top: target!.y - (target!.height / 2 + SPOTLIGHT_PADDING),
            width: target!.width + SPOTLIGHT_PADDING * 2,
            height: target!.height + SPOTLIGHT_PADDING * 2,
            borderRadius: (target!.width + SPOTLIGHT_PADDING * 2) / 2,
            backgroundColor: "transparent",
            borderWidth: 3,
            borderColor: "rgba(255,255,255,0.8)",
          }}
          pointerEvents="none"
        />
      ) : null}

      <Animated.View
        style={[
          tooltipAnimStyle,
          {
            position: "absolute",
            top: tooltipTop,
            left: tooltipLeft,
            width: TOOLTIP_MAX_WIDTH,
          },
        ]}
        pointerEvents="box-none"
      >
        {hasTarget ? (
          <View
            style={{
              alignSelf: "center",
              width: 0,
              height: 0,
              borderLeftWidth: 8,
              borderRightWidth: 8,
              borderLeftColor: "transparent",
              borderRightColor: "transparent",
              ...(showBelow
                ? {
                    borderBottomWidth: 8,
                    borderBottomColor: "#FFFFFF",
                    marginBottom: -1,
                  }
                : {
                    borderTopWidth: 8,
                    borderTopColor: "#FFFFFF",
                    marginTop: -1,
                  }),
            }}
          />
        ) : null}

        <View
          className="bg-brand-surface rounded-2xl px-5 py-4"
          style={{
            elevation: 8,
            shadowColor: "#000",
            shadowOpacity: 0.15,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 4 },
          }}
        >
          <Text className="text-sm text-ink leading-5 mb-3 text-center">
            {message}
          </Text>

          <Pressable
            onPress={onDismiss}
            className="bg-violet-600 py-2.5 px-6 rounded-xl self-center"
            accessibilityLabel="Got it"
            accessibilityRole="button"
          >
            <Text className="text-sm font-bold text-white">Got it</Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
});

/**
 * Container component for SpotlightTooltip.
 */
export default function SpotlightTooltip(
  props: SpotlightTooltipProps,
): React.JSX.Element | null {
  const viewModel = useSpotlightTooltipViewModel(props);
  return <SpotlightTooltipView {...viewModel} />;
}

export type { SpotlightTarget, SpotlightTooltipProps };

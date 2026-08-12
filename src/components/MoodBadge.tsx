import React from "react";
import {
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { bad, fine, good, great, terrible } from "@/assets/emojis";
import { Image } from "@/src/components/tw";
import { PressableOpacity } from "pressto";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Add01Icon } from "@hugeicons/core-free-icons";
import { SAGE } from "@/lib/tokens";

export type MoodBadgeProps = {
  moodscore?: number;
  /** Whether this badge is the currently-selected / active day */
  active?: boolean;
  /** Diameter of the badge image/icon */
  size?: number;
  /** @deprecated - unused in CalendarPicker; will be removed in a future release */
  containerStyle?: StyleProp<ViewStyle>;
  onPress?: () => void;
  disabled: boolean;
  /**
   * When true the badge is purely visual — press handling is owned
   * by the parent DayCell, so the inner PressableOpacity is a no-op.
   * This lets the parent provide a full-cell 44pt touch target.
   */
  displayOnly?: boolean;
};

/** Human-readable label for each mood score (used in accessibilityLabel). */
const MOOD_SCORE_LABELS: Record<number, string> = {
  1: "Terrible",
  2: "Bad",
  3: "Okay",
  4: "Good",
  5: "Great",
};

const moodEmojiMap = {
  1: terrible,
  2: bad,
  3: fine,
  4: good,
  5: great,
};

export const MoodBadge: React.FC<MoodBadgeProps> = React.memo(
  ({ moodscore, size = 32, onPress, disabled, active = true, displayOnly = false }) => {
    const diameter = size;
    const radius = diameter / 2;
    const moodEmoji = moodscore
      ? moodEmojiMap[moodscore as keyof typeof moodEmojiMap]
      : null;

    const moodLabel = moodscore ? MOOD_SCORE_LABELS[moodscore] ?? String(moodscore) : "Not set";

    const plusRotation = useSharedValue(active ? 0 : -360);

    React.useEffect(() => {
      if (!moodEmoji) {
        if (active) {
          plusRotation.value = -360;
          plusRotation.value = withTiming(0, { duration: 400 });
        } else {
          plusRotation.value = -360;
        }
      }
    }, [active, moodEmoji, plusRotation]);

    const plusAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{ rotate: `${plusRotation.value}deg` }],
    }));

    // --- Render core badge content (display-only, no press handling here) ---
    const badgeContent = (
      <View
        style={{ width: diameter, height: diameter, borderRadius: radius }}
        className={`items-center justify-center ${disabled ? "opacity-30" : ""}`}
      >
        {moodEmoji ? (
          <Image
            source={moodEmoji}
            alt={moodLabel}
            style={{ width: diameter, height: diameter }}
            width={diameter}
            height={diameter}
            progressiveRenderingEnabled={true}
          />
        ) : (
          // Empty-slot affordance: dotted ring with + inside
          <View
            style={{
              width: diameter,
              height: diameter,
              borderRadius: radius,
              borderWidth: 1.5,
              borderColor: SAGE[200],
              borderStyle: "dashed",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0.4,
            }}
          >
            <Animated.View style={[plusAnimatedStyle, { width: diameter * 0.55, height: diameter * 0.55, justifyContent: "center", alignItems: "center" }]}>
              <HugeiconsIcon
                icon={Add01Icon}
                size={Math.max(10, diameter * 0.5)}
                color={SAGE[300]}
                strokeWidth={2}
              />
            </Animated.View>
          </View>
        )}
      </View>
    );

    // When the parent DayCell owns the press, skip the inner PressableOpacity
    if (displayOnly) {
      return badgeContent;
    }

    return (
      <PressableOpacity
        style={{ width: diameter, height: diameter }}
        onPress={disabled ? undefined : onPress}
        accessibilityRole="button"
        accessibilityLabel={`Mood: ${moodLabel}`}
        accessibilityState={{ selected: active, disabled }}
      >
        {badgeContent}
      </PressableOpacity>
    );
  }
);

export default MoodBadge;

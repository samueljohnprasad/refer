import React from "react";
import {
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { MoodIcon, type MoodKey } from "@/src/components/MoodIcon";
import { PressableOpacity } from "pressto";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Add01Icon } from "@hugeicons/core-free-icons";
import { SEMANTIC_COLORS } from "@/src/theme/colors";

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
  hideEmptySlot?: boolean;
};

/** Human-readable label for each mood score (used in accessibilityLabel). */
const MOOD_SCORE_LABELS: Record<number, string> = {
  1: "Terrible",
  2: "Bad",
  3: "Okay",
  4: "Good",
  5: "Great",
};

const MOOD_SCORE_TO_KEY: Record<number, MoodKey> = {
  1: "terrible",
  2: "bad",
  3: "okay",
  4: "good",
  5: "great",
};

export const MoodBadge: React.FC<MoodBadgeProps> = React.memo(
  ({
    moodscore,
    size = 32,
    onPress,
    disabled,
    active = true,
    displayOnly = false,
    hideEmptySlot = false,
  }) => {
    const diameter = size;
    const radius = diameter / 2;
    const moodKey = moodscore ? MOOD_SCORE_TO_KEY[moodscore] : null;

    const moodLabel = moodscore ? MOOD_SCORE_LABELS[moodscore] ?? String(moodscore) : "Not set";

    // --- Render core badge content (display-only, no press handling here) ---
    const badgeContent = (
      // ponytail: vector MoodIcon for crisp calendar badge rendering
      <View
        style={{ width: diameter, height: diameter, borderRadius: radius }}
        className={`items-center justify-center ${disabled ? "opacity-30" : ""}`}
      >
        {moodKey ? (
          <MoodIcon
            mood={moodKey}
            size={diameter}
          />
        ) : hideEmptySlot ? (
          // ponytail: suppress empty mood affordance when hideEmptySlot is active
          <View style={{ width: diameter, height: diameter }} />
        ) : (
          // ponytail: static subtle placeholder replaces reanimated spin loop
          <View
            style={{
              width: diameter,
              height: diameter,
              borderRadius: radius,
              borderWidth: 1,
              borderColor: SEMANTIC_COLORS.selection.foreground,
              borderStyle: "solid",
              alignItems: "center",
              justifyContent: "center",
              opacity: displayOnly ? 0.12 : 0.22,
            }}
          >
            <HugeiconsIcon
              icon={Add01Icon}
              size={Math.max(10, diameter * 0.35)}
              color={SEMANTIC_COLORS.border.selected}
              strokeWidth={1.5}
            />
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

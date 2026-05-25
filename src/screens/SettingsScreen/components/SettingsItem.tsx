import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import * as Haptics from "expo-haptics";
import { DANGER, GOLD, SAGE, TERRACOTTA } from "@/lib/tokens";

type SettingsItemTone = "sage" | "gold" | "terracotta" | "danger";

const toneStyles: Record<
  SettingsItemTone,
  { iconColor: string; iconBgClassName: string }
> = {
  sage: {
    iconColor: SAGE[600],
    iconBgClassName: "bg-sage-pill",
  },
  gold: {
    iconColor: GOLD,
    iconBgClassName: "bg-gold/15",
  },
  terracotta: {
    iconColor: TERRACOTTA,
    iconBgClassName: "bg-terracotta/15",
  },
  danger: {
    iconColor: DANGER,
    iconBgClassName: "bg-destructive/10",
  },
};

interface SettingsItemProps {
  // icon is IconSvgObject from @hugeicons/core-free-icons, not a React ComponentType
  icon: any;
  title: string;
  subtitle?: string;
  onPress: () => void;
  showArrow?: boolean;
  isLast?: boolean;
  // FIX #2: Added danger prop for destructive actions (Erase Data, Sign Out)
  danger?: boolean;
  tone?: SettingsItemTone;
}

export const SettingsItem: React.FC<SettingsItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  showArrow = true,
  isLast = false,
  danger = false,
  tone = "sage",
}) => {
  const handlePress = () => {
    Haptics.selectionAsync();
    onPress();
  };
  const resolvedTone = danger ? toneStyles.danger : toneStyles[tone];

  return (
    <TouchableOpacity
      // FIX #3: Minimum touch target height is 52px for iOS accessibility (was variable based on content)
      className={`min-h-[64px] flex-row items-center px-4 py-3.5 ${
        !isLast ? "border-b border-sage-100" : ""
      }`}
      // FIX #4: activeOpacity should be 0.6 (iOS default) not 0.7 for crisper feel
      activeOpacity={0.6}
      onPress={handlePress}
      // FIX #5: Accessibility props for screen reader support
      accessibilityRole="button"
      accessibilityLabel={subtitle ? `${title}. ${subtitle}` : title}
      accessibilityHint="Double tap to activate"
    >
      {/* FIX #6: Icon bubble rounded-xl instead of rounded-full — more modern, consistent with app */}
      {/* FIX #7: w-9 h-9 (36dp) — reduced from w-10 h-10; 44dp touch target is the outer row */}
      <View
        className={`mr-3.5 h-11 w-11 items-center justify-center rounded-[18px] ${resolvedTone.iconBgClassName}`}
      >
        {/* FIX #8: Icon size 20 instead of 22 — more refined at smaller bubble size */}
        <HugeiconsIcon
          icon={icon}
          size={21}
          color={resolvedTone.iconColor}
          strokeWidth={1.8}
        />
      </View>

      <View className="flex-1">
        {/* FIX #9: text-base font-semibold instead of text-xl font-cormorantBold — system sans-serif at consistent scale */}
        {/* FIX #10: Danger items use text-red-600 for title */}
        <Text
          className={`happy-font-body-bold text-[17px] leading-5 ${
            danger ? "text-destructive" : "text-ink"
          }`}
        >
          {title}
        </Text>
        {subtitle && (
          // FIX #11: text-[13px] for subtitle — one clear size below title, not text-sm which varies
          <Text className="happy-font-body-medium mt-0.5 text-[14px] text-ink-muted">
            {subtitle}
          </Text>
        )}
      </View>

      {showArrow && (
        <HugeiconsIcon
          icon={ArrowRight01Icon}
          size={18}
          color={SAGE[300]}
          strokeWidth={2}
        />
      )}
    </TouchableOpacity>
  );
};

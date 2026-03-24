import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import * as Haptics from "expo-haptics";

interface SettingsItemProps {
  // icon is IconSvgObject from @hugeicons/core-free-icons, not a React ComponentType
  icon: any;
  iconColor: string;
  iconBgColor: string;
  title: string;
  subtitle?: string;
  onPress: () => void;
  showArrow?: boolean;
  isLast?: boolean;
  // FIX #2: Added danger prop for destructive actions (Erase Data, Sign Out)
  danger?: boolean;
}

export const SettingsItem: React.FC<SettingsItemProps> = ({
  icon,
  iconColor,
  iconBgColor,
  title,
  subtitle,
  onPress,
  showArrow = true,
  isLast = false,
  danger = false,
}) => {
  const handlePress = () => {
    Haptics.selectionAsync();
    onPress();
  };

  return (
    <TouchableOpacity
      // FIX #3: Minimum touch target height is 52px for iOS accessibility (was variable based on content)
      className={`flex-row items-center min-h-[52px] py-3 px-4 ${
        !isLast ? "border-b border-gray-100" : ""
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
        className="w-9 h-9 rounded-xl justify-center items-center mr-3.5"
        style={{ backgroundColor: iconBgColor }}
      >
        {/* FIX #8: Icon size 20 instead of 22 — more refined at smaller bubble size */}
        <HugeiconsIcon icon={icon} size={20} color={iconColor} strokeWidth={1.8} />
      </View>

      <View className="flex-1">
        {/* FIX #9: text-base font-semibold instead of text-xl font-cormorantBold — system sans-serif at consistent scale */}
        {/* FIX #10: Danger items use text-red-600 for title */}
        <Text
          className={`text-base font-semibold leading-5 ${
            danger ? "text-red-600" : "text-gray-900"
          }`}
        >
          {title}
        </Text>
        {subtitle && (
          // FIX #11: text-[13px] for subtitle — one clear size below title, not text-sm which varies
          <Text className="text-[13px] text-gray-400 mt-0.5 font-normal">
            {subtitle}
          </Text>
        )}
      </View>

      {showArrow && (
        // FIX #12: Arrow color #C7C7CC (iOS native chevron gray) instead of #D1D5DB
        // FIX #13: Arrow size 18 instead of 24 — proportional to row height
        <HugeiconsIcon
          icon={ArrowRight01Icon}
          size={18}
          color="#C7C7CC"
          strokeWidth={2}
        />
      )}
    </TouchableOpacity>
  );
};

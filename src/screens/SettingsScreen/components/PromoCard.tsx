import React from "react";
import { View, Text, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
// FIX #17: Removed unused `useRouter` import
// FIX #18: Removed `StyleSheet` — all styles now in Tailwind/NativeWind

interface PromoCardProps {
  onLayout: (event: any) => void;
  onPromoPress: () => Promise<boolean>;
}

export const PromoCard: React.FC<PromoCardProps> = ({
  onLayout,
  onPromoPress,
}) => {
  return (
    // FIX #19: Replaced flat #FFED6B yellow with a softer violet-tinted gradient card
    // FIX #20: Added shadow for card depth
    <LinearGradient
      colors={["#EDE9FF", "#F5F3FF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        shadowColor: "#7C5CFF",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 3,
        alignSelf: "flex-start",
        padding: 12,
        borderWidth: 1,
        borderColor: "#EDE9FF",
        borderRadius: 16,
        marginBottom: 16
      }}
    >
      {/* FIX #21: Added a top-row spark emoji icon for visual personality */}
      <View className="flex-row items-center gap-2 mb-2">
        <Text className="text-lg">✨</Text>
        <Text className="text-[10px] font-bold text-violet-500 uppercase tracking-widest">
          Pro
        </Text>
      </View>

      {/* FIX #22: Title uses system sans-serif, not cormorantBold — consistent with rest of screen */}
      <Text className="text-xl font-black text-gray-900 mb-1.5">
        Unlock All Features
      </Text>

      {/* FIX #23: Feature list as single clean string instead of hard-coded newlines */}
      <Text className="text-gray-500 text-[13px] leading-5 mb-4">
        AI Insights, Weekly Summaries, Advanced Dashboard, Longer Recordings,
        and more.
      </Text>

      {/* Wrap in View to prevent LinearGradient from stretching full-width */}
      <View className="items-start">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Upgrade to Premium"
          onPress={onPromoPress}
          onLayout={onLayout}
          style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
        >
          <LinearGradient
            colors={["#7C5CFF", "#9C7CFF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 12,
              paddingHorizontal: 20,
              paddingVertical: 10,
            }}
          >
            <Text className="text-white font-bold text-sm tracking-wide">
              Upgrade to Pro →
            </Text>
          </LinearGradient>
        </Pressable>
      </View>

    </LinearGradient>
  );
};

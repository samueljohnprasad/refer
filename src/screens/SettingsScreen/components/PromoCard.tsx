import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

interface PromoCardProps {
  onLayout: (event: any) => void;
  onPromoPress: () => Promise<boolean>;
}

export const PromoCard: React.FC<PromoCardProps> = ({
  onLayout,
  onPromoPress,
}) => {
  const router = useRouter();

  return (
    <View className="bg-[#FFED6B] rounded-[18px] p-4 flex-row items-center mb-[18px]">
      <View style={{ flex: 1 }}>
        <Text className="text-[22px] font-extrabold text-[#0B1220] mb-1.5 font-cormorantBold">
          Unlock All Features
        </Text>
        <Text
          className="text-[#374151] text-[13.5px] leading-[19px] mb-3"
          numberOfLines={3}
        >
          AI Insights, Weekly Summaries,{"\n"}Advanced Dashboard,{"\n"}
          Longer Recordings, and more.
        </Text>

        <Pressable
          android_ripple={{ color: "#6D4AFF" }}
          onPress={() => {
            onPromoPress();
          }}
          style={{
            borderRadius: 28,
            overflow: "hidden",
            alignSelf: "flex-start",
          }}
          onLayout={onLayout}
        >
          <LinearGradient
            colors={["#7C5CFF", "#9C7CFF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.upgradeButtonGradient}
          >
            <Text className="text-white font-bold text-[15px] font-cormorantBold">
              Upgrade to Premium
            </Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  upgradeButtonGradient: {
    alignSelf: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 28,
  },
});

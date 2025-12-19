import React, { useRef } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Redirect } from "expo-router";
import { useAuth } from "@/src/context/AuthContext";
import SignInBottomSheet from "@/src/components/SignInBottomSheet";
import MovingGradientBackground from "@/src/components/MovingGradientBackground";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";

export default function Home() {
  const { session, loading } = useAuth();
  const sheetRef = useRef<BottomSheetModal>(null);
  const insets = useSafeAreaInsets();

  if (loading) {
    return (
      <View className="flex-1 w-full h-full items-center justify-center">
        <View className="flex-1 w-full h-full items-center justify-center" />
      </View>
    );
  }

  if (session) {
    return <Redirect href="/tabs/screens/onboard-container" />;
  }

  return (
    <View className="flex-1">
      <MovingGradientBackground />

      <View
        className="flex-1 px-8 justify-between"
        style={{
          paddingTop: insets.top + 40,
          paddingBottom: insets.bottom + 40,
        }}
      >
        {/* Main Content - Centered */}
        <View className="flex-1 justify-center items-center">
          <Text
            className="text-center text-gray-900 mt-12"
            style={{
              fontFamily: "Inter-Black",
              fontSize: 72,
              fontWeight: "900",
              lineHeight: 72,
              letterSpacing: -2,
            }}
          >
            Feel
          </Text>
          <Text
            className="text-center text-gray-900"
            style={{
              fontFamily: "Inter-Black",
              fontSize: 72,
              fontWeight: "900",
              lineHeight: 72,
              letterSpacing: -2,
            }}
          >
            happy
          </Text>
        </View>

        {/* Bottom Button */}
        <View className="w-full">
          <TouchableOpacity
            onPress={() => sheetRef.current?.present()}
            className="w-full bg-gray-900 flex-row rounded-full py-5 items-center justify-center"
            activeOpacity={0.8}
          >
            <Text className="text-white font-semibold text-lg">
              Get Started
            </Text>
            <HugeiconsIcon icon={ArrowRight01Icon} size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <SignInBottomSheet ref={sheetRef} />
      </View>
    </View>
  );
}

import React, { useRef } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Redirect } from "expo-router";
import { useAuth } from "@/src/context/AuthContext";
import SignInBottomSheet from "@/src/components/SignInBottomSheet";
import MovingGradientBackground from "@/src/components/MovingGradientBackground";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";

export default function Home() {
  const { session, loading } = useAuth();
  const sheetRef = useRef<BottomSheetModal>(null);

  if (loading) {
    return (
      <View className="flex-1 w-full h-full items-center justify-center">
        <View className="flex-1 w-full h-full items-center justify-center flex fixed inset-0 z-50 before:starting:backdrop-blur-0 before:absolute before:inset-0 before:bg-gray-200/50 before:backdrop-blur-[1px] before:transition before:duration-250 dark:before:bg-black/50 before:starting:opacity-0">
          {/* <LottieView
            autoPlay
            loop
            style={{
              width: 60,
              height: 60,
            }}
            source={loadingLottie}
          /> */}
        </View>
      </View>
    );
  }

  if (session) {
    return <Redirect href="/tabs/screens/onboard-container" />;
  }

  return (
    <View className="flex-1 bg-white">
      <MovingGradientBackground />

      <View className="flex-1 px-8 justify-between pb-12 pt-20">
        <View className="flex-1 justify-center items-center">
          <View className="items-center">
            {/* Logo Icon Placeholder - or just rely on Typography */}
            <View className="w-20 h-20 bg-purple-100/50 rounded-3xl items-center justify-center mb-8 backdrop-blur-sm border border-white/20">
              <Text style={{ fontSize: 40 }}>✨</Text>
            </View>

            <Text
              className="text-center text-gray-900 mb-2"
              style={{
                fontFamily: "CormorantSemiBold",
                fontSize: 64,
                lineHeight: 70,
              }}
            >
              Happy
            </Text>

            <Text
              className="text-center text-gray-600 font-medium tracking-widest uppercase text-xs"
              style={{ letterSpacing: 4 }}
            >
              Your Journaling Companion
            </Text>

            <Text className="text-center text-gray-500 mt-8 max-w-[280px] leading-6">
              Capture your thoughts, track your mood & calories, and discover
              insights about yourself.
            </Text>
          </View>
        </View>

        <View className="w-full space-y-4">
          <TouchableOpacity
            onPress={() => sheetRef.current?.present()}
            className="w-full bg-gray-900 rounded-full py-4 items-center flex-row justify-center gap-2 shadow-lg shadow-gray-200"
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

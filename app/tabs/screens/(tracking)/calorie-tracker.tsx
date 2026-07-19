import React from "react";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { BlurView } from "expo-blur";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Button, Host } from "@expo/ui/swift-ui";
import { format } from "date-fns";
import CalorieTrackerScreen from "@/src/screens/CalorieTrackerScreen/CalorieTrackerScreen";

const CalorieTrackerHeader: React.FC<{ selectedDate: Date }> = ({
  selectedDate,
}) => {
  const router = useRouter();
  const { height } = useWindowDimensions();
  const isLiquidGlass = isLiquidGlassAvailable();

  return (
    <BlurView
      intensity={50}
      tint="light"
      className="flex-row items-end justify-between"
      style={{
        height: height * 0.14,
        paddingHorizontal: 16,
        paddingBottom: 16,
      }}
    >
      {!isLiquidGlass && (
        <TouchableOpacity
          className="w-10 h-10 rounded-full justify-center items-center bg-[#7C5CFF]"
          activeOpacity={0.7}
          onPress={() => router.back()}
        >
          <HugeiconsIcon icon={ArrowLeft02Icon} size={20} color="#FFF" />
        </TouchableOpacity>
      )}
      {isLiquidGlass && (
        <Host matchContents>
          <Button
            onPress={() => router.back()}
            color="#7B61FF"
            variant="glassProminent"
            controlSize="regular"
            systemImage="chevron.left"
          />
        </Host>
      )}

      <View className="items-center">
        <Text className="text-[28px] font-extrabold text-[#0F172A] font-cormorantBold">
          Calorie Tracker
        </Text>
        <View className="bg-purple-100 px-3 py-1 rounded-full mt-1">
          <Text className="text-sm font-semibold text-purple-700">
            {format(selectedDate, "EEE, MMM d")}
          </Text>
        </View>
      </View>

      <View style={{ width: 40 }} />
    </BlurView>
  );
};

export default function CalorieTrackerPage() {
  const { date } = useLocalSearchParams<{ date?: string }>();
  const selectedDate = date ? new Date(date) : new Date();

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTransparent: true,
          headerBlurEffect: "regular",
          header: () => <CalorieTrackerHeader selectedDate={selectedDate} />,
        }}
      />
      <CalorieTrackerScreen selectedDate={selectedDate} />
    </>
  );
}

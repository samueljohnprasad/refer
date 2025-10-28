// DiscoveryScreen.tsx
// Updated per request: removed bottom tabs, bigger mic, slimmer progress, fire for streak.

import React, { useMemo, useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  Modal,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { Box } from "@/components/ui/box";
import LottieView from "lottie-react-native";
import { girlMeditation } from "@/assets/lottie";
import { useAtom } from "jotai";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { router } from "expo-router";
import { recorderOpenAtom } from "./helpers";
import VoiceRecorderModalWrapper from "./VoiceRecorderModalWrapper";
import { useUserProfile } from "@/hooks/data/useUserProfile";
import { format } from "date-fns";
import { CalendarPicker } from "../DailyNotesScreen/CalendarPicker";
import { AnimatedBlurView } from "@/src/components/AnimatedLinearGradient";

// Constants outside component to prevent recreation
const COLORS = {
  ink: "#2E285A", // deep purple
  accent: "#F6C24B", // yellow (mic, progress)
  lavender: "#E7E5FB", // chip background
  skyA: "#E7F4F5", // gradient start
  skyB: "#E6ECFA", // gradient end
  white: "#FFFFFF",
  streak: "#FF7A2F", // fire/number
};

const GRADIENT_COLORS = [COLORS.skyA, COLORS.skyB] as const;
const GRADIENT_START = { x: 0, y: 0 } as const;
const GRADIENT_END = { x: 1, y: 1 } as const;

const LOTTIE_STYLE = {
  width: 200,
  height: 200,
} as const;

const FIRE_ICON_STYLE = { marginLeft: 6 } as const;

// Memoized Header Component
interface DiscoveryHeaderProps {
  currentStreak: number;
  isLoading: boolean;
}

const DiscoveryHeader = React.memo<DiscoveryHeaderProps>(
  ({ currentStreak, isLoading }) => (
    <View className="flex-row items-center justify-between my-1.5">
      <View className="flex-row items-center">
        <View className="w-3.5 h-3.5 rounded-full bg-[#8D7BF7] mr-2.5" />
        <Text className="text-[#2E285A] text-[22px] font-extrabold tracking-wide">
          1st discovery
        </Text>
      </View>
      <View className="flex-row items-center">
        <Text className="text-[#FF7A2F] text-lg font-extrabold">
          {isLoading ? "..." : currentStreak}
        </Text>
        <MaterialCommunityIcons
          name="fire"
          size={22}
          color={COLORS.streak}
          style={FIRE_ICON_STYLE}
        />
      </View>
    </View>
  )
);

DiscoveryHeader.displayName = "DiscoveryHeader";

// Memoized Progress Bar Component
interface ProgressBarProps {
  progress: number;
}

const ProgressBar = React.memo<ProgressBarProps>(({ progress }) => (
  <View
    className="mt-2 mb-3.5"
    accessible
    accessibilityRole="progressbar"
    accessibilityLabel="Experience progress"
  >
    <View className="mb-1.5 flex-row justify-between items-center">
      <Text className="text-[#64748B] text-xs font-bold">0/100 XP</Text>
    </View>
    <View className="h-2 bg-[#F3F4F6] rounded-md overflow-hidden justify-center">
      <View
        className="h-full bg-[#F6C24B] rounded-md"
        style={{ width: `${progress}%` }}
      />
    </View>
  </View>
));

ProgressBar.displayName = "ProgressBar";

// Memoized Prompt Card Content
interface PromptCardContentProps {
  selectedDate: Date;
  onDatePress: () => void;
}

const PromptCardContent = React.memo<PromptCardContentProps>(
  ({ selectedDate, onDatePress }) => {
    const formattedDate = useMemo(
      () => format(selectedDate, "MMMM d"),
      [selectedDate]
    );

    return (
      <Box>
        <View className="flex-row justify-between items-center">
          <Pressable onPress={onDatePress}>
            <Text className="text-[#2E285A] opacity-75 font-bold">
              Journal · {formattedDate}
            </Text>
          </Pressable>
          <Feather name="rotate-cw" size={20} color={COLORS.ink} />
        </View>
        <Text className="mt-2.5 text-[#2E285A] text-[28px] font-black leading-[34px] tracking-wide">
          What do you wish{"\n"}you had done{"\n"}differently today?
        </Text>
      </Box>
    );
  }
);

PromptCardContent.displayName = "PromptCardContent";

// Memoized Illustration
const Illustration = React.memo(() => (
  <View className="justify-end items-center" pointerEvents="none">
    <LottieView autoPlay style={LOTTIE_STYLE} source={girlMeditation} />
  </View>
));

Illustration.displayName = "Illustration";

function DiscoveryScreen() {
  const [, setRecorderOpen] = useAtom(recorderOpenAtom);
  const tabBarHeight = useBottomTabBarHeight();
  const { data: userProfile, isLoading: isLoadingProfile } = useUserProfile();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isCalendarVisible, setIsCalendarVisible] = useState<boolean>(false);

  const currentStreak = userProfile?.currentStreak ?? 0;

  const handleOpenRecorder = useCallback(() => {
    setRecorderOpen(true);
  }, [setRecorderOpen]);

  const handleKeyboardPress = useCallback(() => {
    // router.push("/tabs/journal-keyboard-entry");
  }, []);

  const handleDatePress = useCallback(() => {
    setIsCalendarVisible(true);
  }, []);

  const handleDateSelect = useCallback((date: Date) => {
    setSelectedDate(date);
    setIsCalendarVisible(false);
  }, []);

  const handleCloseCalendar = useCallback(() => {
    setIsCalendarVisible(false);
  }, []);

  const scrollContentStyle = useMemo(
    () => ({
      paddingHorizontal: 18,
      paddingTop: 8,
      paddingBottom: Math.max(24, tabBarHeight + 16),
      flexGrow: 1,
    }),
    [tabBarHeight]
  );

  const cardShadowStyle = useMemo(() => [shadowCard, { borderRadius: 26 }], []);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <ScrollView
        contentContainerStyle={scrollContentStyle}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <DiscoveryHeader
            currentStreak={currentStreak}
            isLoading={isLoadingProfile}
          />
          <ProgressBar progress={74} />
        </View>

        {/* Prompt card */}
        <View style={cardShadowStyle} className="rounded-2xl flex-1">
          <LinearGradient
            colors={GRADIENT_COLORS}
            start={GRADIENT_START}
            end={GRADIENT_END}
            style={{
              borderRadius: 26,
              padding: 18,
              overflow: "hidden",
              minHeight: 260,
              justifyContent: "space-between",
              flex: 1,
            }}
          >
            <PromptCardContent
              selectedDate={selectedDate}
              onDatePress={handleDatePress}
            />
            <Illustration />

            <View className="flex-row items-center justify-between px-[18px]">
              <CircleAction
                key="menu"
                size={72}
                bg={COLORS.lavender}
                icon={<Feather name="menu" size={26} color={COLORS.ink} />}
              />

              <CircleAction
                key="mic"
                onPress={handleOpenRecorder}
                size={108}
                bg={COLORS.accent}
                elevation
                icon={<Feather name="mic" size={34} color={COLORS.ink} />}
              />

              <CircleAction
                key="keyboard"
                onPress={handleKeyboardPress}
                size={72}
                bg={COLORS.lavender}
                icon={
                  <MaterialCommunityIcons
                    name="keyboard-outline"
                    size={26}
                    color={COLORS.ink}
                  />
                }
              />
            </View>
          </LinearGradient>
        </View>

        <VoiceRecorderModalWrapper />
      </ScrollView>

      {/* Calendar Modal */}
      <Modal
        visible={isCalendarVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCloseCalendar}
      >
        <AnimatedBlurView
          intensity={40}
          className="flex-1 justify-center items-center"
        >
          <Pressable
            className="flex-1 bg-black/50 px-2 justify-center items-center"
            onPress={handleCloseCalendar}
          >
            <Pressable
              className="bg-violet-300 rounded-3xl p-4 w-full"
              onPress={(e) => e.stopPropagation()}
            >
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-white text-xl font-bold">
                  Select Date
                </Text>
                <Pressable onPress={handleCloseCalendar} className="p-2">
                  <Feather name="x" size={24} color="white" />
                </Pressable>
              </View>
              <CalendarPicker
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
                visible={isCalendarVisible}
                moodMap={undefined}
              />
            </Pressable>
          </Pressable>
        </AnimatedBlurView>
      </Modal>
    </SafeAreaView>
  );
}

// Memoized CircleAction Component
interface CircleActionProps {
  size: number;
  bg: string;
  icon: React.ReactNode;
  elevation?: boolean;
  onPress?: () => void;
}

const CircleAction = React.memo<CircleActionProps>(
  ({ size, bg, icon, elevation, onPress }) => {
    const buttonStyle = useMemo(
      () => [
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bg,
          zIndex: elevation ? 2 : 1,
        },
        elevation ? shadowCard : null,
      ],
      [size, bg, elevation]
    );

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        style={buttonStyle}
        className="items-center justify-center"
      >
        {icon}
      </TouchableOpacity>
    );
  }
);

CircleAction.displayName = "CircleAction";

const shadowCard = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  android: { elevation: 0 },
});

export default React.memo(DiscoveryScreen);

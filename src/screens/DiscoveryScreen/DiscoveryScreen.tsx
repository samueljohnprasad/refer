// DiscoveryScreen.tsx
// Updated per request: removed bottom tabs, bigger mic, slimmer progress, fire for streak.

import React, { useMemo, useCallback, useState, useEffect } from "react";
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
import { MaterialCommunityIcons, Feather, Entypo } from "@expo/vector-icons";
import { Box } from "@/components/ui/box";
import LottieView from "lottie-react-native";
import { girlMeditation } from "@/assets/lottie";
import { useAtom } from "jotai";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import {
  recorderOpenAtom,
  keyboardJournalOpenAtom,
  selectedDateDiscoveryAtom,
} from "./helpers";
import VoiceRecorderModalWrapper from "./VoiceRecorderModalWrapper";
import KeyboardJournalModalWrapper from "./KeyboardJournalModalWrapper";
import { useUserProfile } from "@/hooks/data/useUserProfile";
import { format } from "date-fns";
import { CalendarPicker } from "../DailyNotesScreen/CalendarPicker";
import { AnimatedBlurView } from "@/src/components/AnimatedLinearGradient";
import { useJournalEntry } from "@/hooks/useJournalEntry";
import { useLocalSearchParams } from "expo-router";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  AiMicIcon,
  KeyboardIcon,
  Menu02Icon,
  ReloadIcon,
} from "@hugeicons/core-free-icons";

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
      <View className="flex-row items-center"></View>
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

interface PromptCardContentProps {
  selectedDate: Date;
  onDatePress: () => void;
  prompt: string;
  onShufflePrompt: () => void;
}

const PromptCardContent = React.memo<PromptCardContentProps>(
  ({ selectedDate, onDatePress, prompt, onShufflePrompt }) => {
    const rotation = useSharedValue(0);

    const formattedDate = useMemo(
      () => format(selectedDate, "MMMM d"),
      [selectedDate]
    );

    const handleShuffle = useCallback(() => {
      rotation.value = withSpring(rotation.value + 360, {
        damping: 15,
        stiffness: 150,
      });
      onShufflePrompt();
    }, [onShufflePrompt, rotation]);

    const rotateStyle = useAnimatedStyle(() => {
      return {
        transform: [{ rotate: `${rotation.value}deg` }],
      };
    });

    return (
      <Box>
        <View className="flex-row justify-between items-center">
          <Pressable
            onPress={onDatePress}
            className="flex-row items-center justify-center gap-1"
          >
            <Text className="text-[#2E285A] opacity-75 font-bold ">
              Journal · {formattedDate}
            </Text>
            <View className="flex-col items-center p-0 m-0">
              <Entypo
                className=" p-0 m-0"
                name="chevron-small-up"
                size={12}
                color={COLORS.ink}
              />
              <Entypo
                className="p-0 m-0"
                name="chevron-small-down"
                size={12}
                color={COLORS.ink}
              />
            </View>
          </Pressable>
          <Pressable onPress={handleShuffle} className="p-1">
            <Animated.View style={rotateStyle}>
              <HugeiconsIcon icon={ReloadIcon} size={20} color={COLORS.ink} />
            </Animated.View>
          </Pressable>
        </View>
        <Text className="mt-2.5 text-[#2E285A] text-[28px] font-black leading-[34px] tracking-wide">
          {prompt}
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
  const [, setKeyboardJournalOpen] = useAtom(keyboardJournalOpenAtom);
  const tabBarHeight = useBottomTabBarHeight();
  const { data: userProfile, isLoading: isLoadingProfile } = useUserProfile();
  const { date } = useLocalSearchParams<{ date: string }>();
  const [selectedDate, setSelectedDate] = useAtom(selectedDateDiscoveryAtom);

  useEffect(() => {
    setSelectedDate(date ? new Date(date) : new Date());
  }, [date]);

  const [isCalendarVisible, setIsCalendarVisible] = useState<boolean>(false);
  const { currentPrompt, shufflePrompt } = useJournalEntry();

  const currentStreak = userProfile?.currentStreak ?? 0;

  const handleOpenRecorder = useCallback(() => {
    setRecorderOpen(true);
  }, [setRecorderOpen]);

  const handleKeyboardPress = useCallback(() => {
    setKeyboardJournalOpen(true);
  }, [setKeyboardJournalOpen]);

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

  const handleTodayPress = useCallback(() => {
    const today = new Date();
    setSelectedDate(today);
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
          {/* <ProgressBar progress={74} /> */}
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
              prompt={currentPrompt}
              onShufflePrompt={shufflePrompt}
            />
            <Illustration />

            <View className="flex-row items-center justify-between px-[18px]">
              <CircleAction
                key="menu"
                size={72}
                bg={COLORS.lavender}
                icon={
                  <HugeiconsIcon
                    icon={Menu02Icon}
                    size={26}
                    color={COLORS.ink}
                  />
                }
              />

              <CircleAction
                key="mic"
                onPress={handleOpenRecorder}
                size={108}
                bg={COLORS.accent}
                elevation
                icon={<HugeiconsIcon icon={AiMicIcon} size={56} />}
              />

              <CircleAction
                key="keyboard"
                onPress={handleKeyboardPress}
                size={72}
                bg={COLORS.lavender}
                icon={
                  <HugeiconsIcon
                    icon={KeyboardIcon}
                    size={26}
                    color={COLORS.ink}
                  />
                }
              />
            </View>
          </LinearGradient>
        </View>

        <VoiceRecorderModalWrapper />
        <KeyboardJournalModalWrapper />
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
                <View className="flex-row items-center gap-3">
                  <Text className="text-white text-xl font-bold">
                    Select Date
                  </Text>
                  <Pressable
                    onPress={handleTodayPress}
                    className="bg-white/20 px-3 py-1.5 rounded-full"
                  >
                    <Text className="text-white text-xs font-semibold">
                      Today
                    </Text>
                  </Pressable>
                </View>
                <Pressable onPress={handleCloseCalendar} className="p-2">
                  <Feather name="x" size={24} color="white" />
                </Pressable>
              </View>
              <CalendarPicker
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
                visible={isCalendarVisible}
                moodMap={undefined}
                showMoodBadges={false}
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

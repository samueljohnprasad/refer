import React, {
  useMemo,
  useCallback,
  useState,
  useEffect,
  useRef,
} from "react";
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
import { useAtom, useSetAtom } from "jotai";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
  runOnJS,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { PressableScale } from "@/src/components/ui/PressableScale";
import { SPRING_SNAPPY, SPRING_DEFAULT, TIMING_FADE } from "@/src/utils/motionTokens";
import { useReducedMotion } from "@/src/hooks/useReducedMotion";
import {
  recorderOpenAtom,
  keyboardJournalOpenAtom,
  selectedDateDiscoveryAtom,
} from "./helpers";
import { useUserProfile } from "@/hooks/data/useUserProfile";
import { format } from "date-fns";
import { AnimatedBlurView } from "@/src/components/AnimatedLinearGradient";
import { useJournalEntry } from "@/hooks/useJournalEntry";
import { useLocalSearchParams } from "expo-router";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  AiMicIcon,
  KeyboardIcon,
  Menu02Icon,
  ReloadIcon,
  Camera02Icon,
  ListViewIcon,
  Menu01Icon,
  Image02Icon,
} from "@hugeicons/core-free-icons";
import SuspensLoader from "@/src/components/SuspensLoader";
import { useJournalLimit } from "@/hooks/useJournalLimit";
import { useRevenueCat } from "@/src/context/RevenueCatProvider";
import { startRecordingAtom } from "../DailyNotesScreen/atoms";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Button, Host } from "@expo/ui/swift-ui";
import { clipShape, foregroundStyle, frame } from "@expo/ui/swift-ui/modifiers";
import { BRAND, PALETTE, SURFACE } from "@/constants/palette";
import { CARD_SHADOW, ELEVATED_SHADOW } from "@/constants/shadows";

// Lazy load components
const VoiceRecorderModalWrapper = React.lazy(
  () => import("./VoiceRecorderModalWrapper")
);
const KeyboardJournalModalWrapper = React.lazy(
  () => import("./KeyboardJournalModalWrapper")
);
const JournalingOptionsModal = React.lazy(() =>
  import("./JournalingOptionsModal").then((module) => ({
    default: module.JournalingOptionsModal,
  }))
);
const CalendarPicker = React.lazy(() =>
  import("../DailyNotesScreen/CalendarPicker").then((module) => ({
    default: module.CalendarPicker,
  }))
);
const ImageJournalModal = React.lazy(() => import("./ImageJournalModal"));

// Constants outside component to prevent recreation
const COLORS = BRAND;

const GRADIENT_COLORS = [BRAND.skyA, BRAND.skyB] as const;
const GRADIENT_START = { x: 0, y: 0 } as const;
const GRADIENT_END = { x: 1, y: 1 } as const;

const LOTTIE_STYLE = {
  width: 200,
  height: 200,
} as const;

// Memoized Header Component
interface DiscoveryHeaderProps {
  currentStreak: number;
  isLoading: boolean;
}

const DiscoveryHeader = React.memo<DiscoveryHeaderProps>(
  ({ currentStreak, isLoading }) => (
    <View className="flex-row items-center justify-between my-1.5">
      <View className="flex-row items-center"></View>
      <View className="flex-row items-center gap-1.5">
        <Text className="text-amber-500 text-lg font-extrabold">
          {isLoading ? "—" : currentStreak}
        </Text>
        <MaterialCommunityIcons
          name="fire"
          size={22}
          color={PALETTE.amber}
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
  onOpenOptions: () => void;
}

const PromptCardContent = React.memo<PromptCardContentProps>(
  ({ selectedDate, onDatePress, prompt, onShufflePrompt, onOpenOptions }) => {
    const rotation = useSharedValue(0);
    const reducedMotion = useReducedMotion();

    // Cross-fade prompt text when it changes
    const promptOpacity = useSharedValue<number>(1);
    const promptTranslateY = useSharedValue<number>(0);
    const [displayedPrompt, setDisplayedPrompt] = useState<string>(prompt);

    const updatePromptAndAnimateIn = useCallback((newPrompt: string) => {
      setDisplayedPrompt(newPrompt);
      promptOpacity.value = withTiming(1, TIMING_FADE);
      promptTranslateY.value = withSpring(0, SPRING_DEFAULT);
    }, [promptOpacity, promptTranslateY]);

    useEffect(() => {
      if (reducedMotion) {
        setDisplayedPrompt(prompt);
        return;
      }
      // Fade out
      promptOpacity.value = withTiming(0, TIMING_FADE, (finished) => {
        if (finished) {
          promptTranslateY.value = 8;
          runOnJS(updatePromptAndAnimateIn)(prompt);
        }
      });
    }, [prompt, reducedMotion, promptOpacity, promptTranslateY, updatePromptAndAnimateIn]);

    const promptAnimStyle = useAnimatedStyle(() => ({
      opacity: promptOpacity.value,
      transform: [{ translateY: promptTranslateY.value }],
    }));

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
            <Text className="text-theme-text-primary opacity-75 font-bold ">
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
          <View className="flex-row items-center gap-1">
            <Pressable onPress={onOpenOptions} className="p-1">
              <HugeiconsIcon icon={ListViewIcon} size={20} color={COLORS.ink} />
            </Pressable>
            <Pressable onPress={handleShuffle} className="p-1">
              <Animated.View style={rotateStyle}>
                <HugeiconsIcon icon={ReloadIcon} size={20} color={COLORS.ink} />
              </Animated.View>
            </Pressable>
          </View>
        </View>
        <Animated.Text
          style={promptAnimStyle}
          className="mt-2.5 text-gray-900 text-4xl font-black leading-tight tracking-wide font-cormorantSemiBold"
        >
          {displayedPrompt}
        </Animated.Text>
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
  const { data: userProfile, isLoading: isLoadingProfile } = useUserProfile();
  const { date } = useLocalSearchParams<{ date: string }>();
  const [selectedDate, setSelectedDate] = useAtom(selectedDateDiscoveryAtom);
  const { presentPaywall } = useRevenueCat();
  const { shouldShowPaywall } = useJournalLimit(selectedDate);
  const setStartRecording = useSetAtom(startRecordingAtom);

  useEffect(() => {
    setSelectedDate(date ? new Date(date) : new Date());
  }, [date]);

  const [isCalendarVisible, setIsCalendarVisible] = useState<boolean>(false);
  const [isOptionsVisible, setIsOptionsVisible] = useState<boolean>(false);
  const [isImageJournalVisible, setIsImageJournalVisible] =
    useState<boolean>(false);
  const imageJournalRef = useRef<any>(null);
  const { currentPrompt, shufflePrompt, setPrompt, allPrompts } =
    useJournalEntry();

  const currentStreak = userProfile?.currentStreak ?? 0;

  const handleOpenRecorder = useCallback(() => {
    if (shouldShowPaywall) {
      presentPaywall();
      return;
    }
    setRecorderOpen(true);
  }, [shouldShowPaywall, presentPaywall, setRecorderOpen]);

  const handleKeyboardPress = useCallback(() => {
    if (shouldShowPaywall) {
      presentPaywall();
      return;
    }
    setKeyboardJournalOpen(true);
  }, [shouldShowPaywall, presentPaywall, setKeyboardJournalOpen]);

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

  const handleScanJournal = useCallback(() => {
    if (shouldShowPaywall) {
      presentPaywall();
      return;
    }
    setIsImageJournalVisible(true);
    setTimeout(() => {
      imageJournalRef.current?.present();
    }, 100);
  }, [shouldShowPaywall, presentPaywall]);

  const handleImageInsightsReady = useCallback(
    (insights: any, transcript: string) => {
      // Navigate to journal entry screen with insights
      // This will be handled by the modal internally
      console.log("Insights ready:", insights);
      setIsImageJournalVisible(false);
    },
    []
  );

  const scrollContentStyle = useMemo(
    () => ({
      paddingHorizontal: 18,
      paddingTop: 8,
      paddingBottom: Math.max(24, 64),
      flexGrow: 1,
    }),
    []
  );

  const cardShadowStyle = useMemo(() => [CARD_SHADOW, { borderRadius: 24 }], []);
  const isLiquidGlass = isLiquidGlassAvailable();

  return (
    <SafeAreaView className="flex-1 bg-theme-background-primary" edges={["top", "bottom"]}>
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
              borderRadius: 24,
              padding: 20,
              overflow: "hidden",
              minHeight: 256,
              justifyContent: "space-between",
              flex: 1,
            }}
          >
            <PromptCardContent
              selectedDate={selectedDate}
              onDatePress={handleDatePress}
              prompt={currentPrompt}
              onShufflePrompt={shufflePrompt}
              onOpenOptions={() => setIsOptionsVisible(true)}
            />
            <Illustration />

            <View className="flex-row items-center justify-between px-[18px]">
              {!isLiquidGlass && (
                <View className="flex-row gap-2">
                  <PressableScale
                    key="camera"
                    onPress={handleScanJournal}
                    scale={0.92}
                    hapticStyle="light"
                    style={[CARD_SHADOW, { backgroundColor: '#FFFFFF', borderRadius: 999, width: 60, height: 44, alignItems: 'center', justifyContent: 'center' }]}
                    accessibilityRole="button"
                    accessibilityLabel="Scan journal with camera"
                  >
                    <HugeiconsIcon
                      icon={Camera02Icon}
                      size={24}
                      color={BRAND.ink}
                    />
                  </PressableScale>

                  <PressableScale
                    key="gallery"
                    onPress={handleScanJournal}
                    scale={0.92}
                    hapticStyle="light"
                    style={[CARD_SHADOW, { backgroundColor: '#FFFFFF', borderRadius: 999, width: 60, height: 44, alignItems: 'center', justifyContent: 'center' }]}
                    accessibilityRole="button"
                    accessibilityLabel="Scan journal from gallery"
                  >
                    <HugeiconsIcon
                      icon={Image02Icon}
                      size={24}
                      color={BRAND.ink}
                    />
                  </PressableScale>
                </View>
              )}
              {isLiquidGlass && (
                <Host matchContents>
                  <Button
                    onPress={handleScanJournal}
                    variant="glass"
                    controlSize="extraLarge"
                    systemImage="camera.fill"
                    modifiers={[foregroundStyle(COLORS.ink)]}
                  />
                </Host>
              )}

              <CircleAction
                key="mic"
                onPress={() => {
                  setStartRecording(true);
                  handleOpenRecorder();
                }}
                size={108}
                bg={BRAND.purple}
                elevation
                icon={<HugeiconsIcon icon={AiMicIcon} size={56} />}
                accessibilityLabel="Start voice recording"
              />

              {!isLiquidGlass && (
                <PressableScale
                  key="keyboard"
                  onPress={handleKeyboardPress}
                  scale={0.92}
                  hapticStyle="light"
                  style={[CARD_SHADOW, { backgroundColor: SURFACE.card, borderRadius: 999, width: 60, height: 44, alignItems: 'center', justifyContent: 'center' }]}
                  accessibilityRole="button"
                  accessibilityLabel="Open keyboard journal"
                >
                  <HugeiconsIcon
                    icon={KeyboardIcon}
                    size={24}
                    color={BRAND.ink}
                  />
                </PressableScale>
              )}
              {isLiquidGlass && (
                <Host matchContents>
                  <Button
                    onPress={handleKeyboardPress}
                    variant="glass"
                    controlSize="extraLarge"
                    systemImage="keyboard.fill"
                    modifiers={[
                      // clipShape("circle"),
                      foregroundStyle(COLORS.ink),
                    ]}
                  />
                </Host>
              )}
            </View>
          </LinearGradient>
        </View>

        <SuspensLoader>
          <VoiceRecorderModalWrapper />
          <KeyboardJournalModalWrapper />
          <JournalingOptionsModal
            visible={isOptionsVisible}
            onClose={() => setIsOptionsVisible(false)}
            onSelectPrompt={setPrompt}
            allPrompts={allPrompts}
            currentPrompt={currentPrompt}
            onScanJournal={handleScanJournal}
          />
          {isImageJournalVisible && (
            <ImageJournalModal
              sheetRef={imageJournalRef}
              onClose={() => setIsImageJournalVisible(false)}
              onInsightsReady={handleImageInsightsReady}
              selectedDate={selectedDate}
            />
          )}
        </SuspensLoader>
      </ScrollView>

      {/* Calendar Modal */}
      <Modal
        visible={isCalendarVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCloseCalendar}
        className="flex-1 h-full w-full"
      >
        <AnimatedBlurView
          intensity={40}
          className="flex-1 h-full w-full justify-center items-center"
        >
          <Pressable
            className="flex-1 px-2 w-full justify-center items-center"
            onPress={handleCloseCalendar}
          >
            <Pressable
              className="bg-white rounded-3xl p-4 w-full shadow-lg"
              onPress={(e) => e.stopPropagation()}
            >
              <View className="flex-row justify-between items-center mb-4">
                <View className="flex-row items-center gap-3">
                  <Text className="text-gray-900 text-xl font-bold">
                    Select Date
                  </Text>
                  <Pressable
                    onPress={handleTodayPress}
                    className="bg-gray-100 px-3 py-1.5 rounded-full"
                  >
                    <Text className="text-gray-600 text-xs font-semibold">
                      Today
                    </Text>
                  </Pressable>
                </View>
                <Pressable onPress={handleCloseCalendar} className="p-2">
                  <Feather name="x" size={24} color="#111827" />
                </Pressable>
              </View>
              <SuspensLoader>
                <CalendarPicker
                  selectedDate={selectedDate}
                  onDateSelect={handleDateSelect}
                  visible={isCalendarVisible}
                  moodMap={undefined}
                  showMoodBadges={false}
                />
              </SuspensLoader>
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
  accessibilityLabel?: string;
}

const CircleAction = React.memo<CircleActionProps>(
  ({ size, bg, icon, elevation, onPress, accessibilityLabel }) => {
    const reducedMotion = useReducedMotion();
    const pressScale = useSharedValue<number>(1);

    const buttonBaseStyle = useMemo(
      () => ([
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bg,
          zIndex: elevation ? 2 : 1,
          alignItems: 'center' as const,
          justifyContent: 'center' as const,
        },
        elevation ? ELEVATED_SHADOW : null,
      ]),
      [size, bg, elevation]
    );

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: pressScale.value }],
    }));

    const handlePressIn = useCallback(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      if (!reducedMotion) {
        pressScale.value = withSpring(0.91, SPRING_SNAPPY);
      }
    }, [reducedMotion, pressScale]);

    const handlePressOut = useCallback(() => {
      if (!reducedMotion) {
        pressScale.value = withSpring(1, SPRING_SNAPPY);
      }
    }, [reducedMotion, pressScale]);

    return (
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
      >
        <Animated.View style={[buttonBaseStyle, animatedStyle]}>
          {icon}
        </Animated.View>
      </Pressable>
    );
  }
);

CircleAction.displayName = "CircleAction";



export default React.memo(DiscoveryScreen);

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
  Modal,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons, Feather, Entypo } from "@expo/vector-icons";
import { Box } from "@/components/ui/box";
import { AnimatedFireIcon, GrayFireIcon } from "@/src/components/ui/AnimatedStatIcon";
import { useAtom, useSetAtom } from "jotai";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { PressableScale } from "@/src/components/ui/PressableScale";
import {
  SPRING_SNAPPY,
  SPRING_DEFAULT,
  TIMING_FADE,
} from "@/src/utils/motionTokens";
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
import { useLocalSearchParams, useRouter } from "expo-router";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  AiMicIcon,
  KeyboardIcon,
  ReloadIcon,
  Camera02Icon,
  ListViewIcon,
  Image02Icon,
} from "@hugeicons/core-free-icons";
import SuspensLoader from "@/src/components/SuspensLoader";
import { useJournalLimit } from "@/hooks/useJournalLimit";
import { useRevenueCat } from "@/src/context/RevenueCatProvider";
import { startRecordingAtom } from "../DailyNotesScreen/atoms";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Button, Host, BottomSheet, Group, RNHostView, DatePicker as SwiftUIDateTimePicker, VStack, Text as SUIText } from "@expo/ui/swift-ui";
import {
  foregroundStyle,
  buttonStyle,
  controlSize,
  labelStyle,
  presentationDetents,
  presentationDragIndicator,
  datePickerStyle,
  font,
  padding,
} from "@expo/ui/swift-ui/modifiers";
import { CARD_SHADOW, ELEVATED_SHADOW } from "@/constants/shadows";
import { Mascot } from "@/src/components/ui/Mascot";
import {
  BRAND_SURFACE,
  GOLD,
  INK_SOFT,
  SAGE,
  SAGE_DISCOVERY_GRADIENT,
} from "@/lib/tokens";

// Static imports to avoid Metro bundler React.lazy chunk resolution crashes
import { JournalingOptionsModal } from "./JournalingOptionsModal";
import ImageJournalModal from "./ImageJournalModal";

import { ConfigurableGlassMenu, type GlassMenuConfig } from "@/src/components/ui/ConfigurableGlassMenu";

const GRADIENT_START = { x: 0, y: 0 } as const;
const GRADIENT_END = { x: 1, y: 1 } as const;

// Memoized Header Component
interface DiscoveryHeaderProps {
  currentStreak: number;
  isLoading: boolean;
}

const DiscoveryHeader = React.memo<DiscoveryHeaderProps>(
  ({ currentStreak, isLoading }) => {
    const isStreakActive = currentStreak > 0;
    const FireIcon = isStreakActive ? AnimatedFireIcon : GrayFireIcon;

    return (
      <View className="flex-row items-center justify-between my-1.5">
        <View className="flex-row items-center"></View>
        <View className="flex-row items-center gap-1.5">
          <Text
            className={
              isStreakActive
                ? "text-gold text-lg font-extrabold"
                : "text-ink-muted text-lg font-extrabold"
            }
          >
            {isLoading ? "—" : currentStreak}
          </Text>
          <FireIcon width={24} height={24} />
        </View>
      </View>
    );
  },
);

DiscoveryHeader.displayName = "DiscoveryHeader";

interface PromptCardContentProps {
  selectedDate: Date;
  onDatePress: () => void;
  onTodayPress: () => void;
  prompt: string;
  onShufflePrompt: () => void;
  onOpenOptions: () => void;
}

const PromptCardContent = React.memo<PromptCardContentProps>(
  ({ selectedDate, onDatePress, onTodayPress, prompt, onShufflePrompt, onOpenOptions }) => {
    const reducedMotion = useReducedMotion();

    // Cross-fade prompt text when it changes
    const promptOpacity = useSharedValue<number>(1);
    const promptTranslateY = useSharedValue<number>(0);
    const [displayedPrompt, setDisplayedPrompt] = useState<string>(prompt);

    const updatePromptAndAnimateIn = useCallback(
      (newPrompt: string) => {
        setDisplayedPrompt(newPrompt);
        promptOpacity.value = withTiming(1, TIMING_FADE);
        promptTranslateY.value = withSpring(0, SPRING_DEFAULT);
      },
      [promptOpacity, promptTranslateY],
    );

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
    }, [
      prompt,
      reducedMotion,
      promptOpacity,
      promptTranslateY,
      updatePromptAndAnimateIn,
    ]);

    const promptAnimStyle = useAnimatedStyle(() => ({
      opacity: promptOpacity.value,
      transform: [{ translateY: promptTranslateY.value }],
    }));

    const formattedDate = useMemo(
      () => format(selectedDate, "MMMM d"),
      [selectedDate],
    );

    const menuConfig: GlassMenuConfig = useMemo(() => {
      return {
        title: `Journal · ${formattedDate}`,
        showChevron: true,
        controlSize: "regular",
        sections: [
          {
            items: [
              {
                type: "button",
                id: "change-date",
                label: "Select Date",
                systemImage: "calendar",
                onPress: onDatePress,
              },
              {
                type: "button",
                id: "today",
                label: "Go to Today",
                systemImage: "calendar.badge.clock",
                onPress: onTodayPress,
              },
              {
                type: "button",
                id: "shuffle-prompt",
                label: "Shuffle Prompt",
                systemImage: "arrow.triangle.2.circlepath",
                onPress: onShufflePrompt,
              },
              {
                type: "button",
                id: "browse-prompts",
                label: "Browse All Prompts",
                systemImage: "list.bullet",
                onPress: onOpenOptions,
              },
            ],
          },
        ],
      };
    }, [formattedDate, onDatePress, onTodayPress, onShufflePrompt, onOpenOptions]);

    return (
      <Box>
        <View className="flex-row justify-between items-center -ml-2 -mt-1">
          <ConfigurableGlassMenu config={menuConfig} />
        </View>
        <Animated.Text
          style={promptAnimStyle}
          className="mt-2 text-ink text-[42px] leading-[50px] tracking-tight happy-font-heading-bold"
        >
          {displayedPrompt}
        </Animated.Text>
      </Box>
    );
  },
);

PromptCardContent.displayName = "PromptCardContent";

// Memoized Illustration
const Illustration = React.memo(() => (
  <View className="items-center justify-end pt-3 pb-2" pointerEvents="none">
    <View className="happy-mascot-stage h-48 w-48 items-center justify-center rounded-[44px] border-0 bg-sage-50">
      <Mascot state="panda-notes" size={168} />
    </View>
  </View>
));

Illustration.displayName = "Illustration";

function DiscoveryScreen() {
  const router = useRouter();
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
  const { currentPrompt, shufflePrompt, setPrompt, allPrompts } =
    useJournalEntry();

  useEffect(() => {
    const interval = setInterval(
      () => {
        shufflePrompt();
      },
      5 * 60 * 1000,
    ); // 5 minutes

    return () => clearInterval(interval);
  }, [shufflePrompt]);

  const currentStreak = userProfile?.currentStreak ?? 0;

  const handleOpenRecorder = useCallback(() => {
    if (shouldShowPaywall) {
      presentPaywall();
      return;
    }
    router.push("/tabs/screens/voice-recorder");
  }, [shouldShowPaywall, presentPaywall, router]);

  const handleKeyboardPress = useCallback(() => {
    if (shouldShowPaywall) {
      presentPaywall();
      return;
    }
    router.push("/tabs/screens/keyboard-recorder");
  }, [shouldShowPaywall, presentPaywall, router]);

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
  }, [shouldShowPaywall, presentPaywall]);

  const handleImageInsightsReady = useCallback(
    (insights: any, transcript: string) => {
      // Navigate to journal entry screen with insights
      // This will be handled by the modal internally
      console.log("Insights ready:", insights);
      setIsImageJournalVisible(false);
    },
    [],
  );

  const scrollContentStyle = useMemo(
    () => ({
      paddingHorizontal: 18,
      paddingTop: 8,
      paddingBottom: Math.max(24, 64),
      flexGrow: 1,
    }),
    [],
  );

  const cardShadowStyle = useMemo(
    () => [CARD_SHADOW, { borderRadius: 32 }],
    [],
  );
  const isLiquidGlass = isLiquidGlassAvailable();

  return (
    <SafeAreaView
      className="flex-1 happy-brand-screen"
      edges={["top", "bottom"]}
    >
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
            colors={SAGE_DISCOVERY_GRADIENT}
            start={GRADIENT_START}
            end={GRADIENT_END}
            style={{
              borderRadius: 16,
              padding: 24,
              overflow: "hidden",
              minHeight: 620,
              justifyContent: "space-between",
              flex: 1,
              borderWidth: 2,
              borderColor: SAGE[100],
            }}
          >
            <PromptCardContent
              selectedDate={selectedDate}
              onDatePress={handleDatePress}
              onTodayPress={handleTodayPress}
              prompt={currentPrompt}
              onShufflePrompt={shufflePrompt}
              onOpenOptions={() => setIsOptionsVisible(true)}
            />
            <Illustration />

            <View className="flex-row items-center justify-between px-2 pb-2">
              {!isLiquidGlass && (
                <View className="flex-row gap-2">
                  <PressableScale
                    key="camera"
                    onPress={handleScanJournal}
                    scale={0.92}
                    hapticStyle="light"
                    style={CARD_SHADOW}
                    accessibilityRole="button"
                    accessibilityLabel="Scan journal with camera"
                  >
                    <View className="h-[50px] w-[66px] items-center justify-center rounded-full border border-brand-border bg-brand-surface">
                      <HugeiconsIcon
                        icon={Camera02Icon}
                        size={24}
                        color={SAGE[600]}
                      />
                    </View>
                  </PressableScale>

                  <PressableScale
                    key="gallery"
                    onPress={handleScanJournal}
                    scale={0.92}
                    hapticStyle="light"
                    style={CARD_SHADOW}
                    accessibilityRole="button"
                    accessibilityLabel="Scan journal from gallery"
                  >
                    <View className="h-[50px] w-[66px] items-center justify-center rounded-full border border-brand-border bg-brand-surface">
                      <HugeiconsIcon
                        icon={Image02Icon}
                        size={24}
                        color={SAGE[600]}
                      />
                    </View>
                  </PressableScale>
                </View>
              )}
              {isLiquidGlass && (
                <Host matchContents>
                  <Button
                    onPress={handleScanJournal}
                    label="Scan"
                    modifiers={[
                      buttonStyle("glass"),
                      controlSize("extraLarge"),
                      foregroundStyle(SAGE[600]),
                      labelStyle("iconOnly"),
                    ]}
                    systemImage="camera.fill"
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
                bg={SAGE[500]}
                elevation
                icon={
                  <HugeiconsIcon
                    icon={AiMicIcon}
                    size={56}
                    color={BRAND_SURFACE}
                  />
                }
                accessibilityLabel="Start voice recording"
              />

              {!isLiquidGlass && (
                <PressableScale
                  key="keyboard"
                  onPress={handleKeyboardPress}
                  scale={0.92}
                  hapticStyle="light"
                  style={CARD_SHADOW}
                  accessibilityRole="button"
                  accessibilityLabel="Open keyboard journal"
                >
                  <View className="h-[50px] w-[66px] items-center justify-center rounded-full border border-brand-border bg-brand-surface">
                    <HugeiconsIcon
                      icon={KeyboardIcon}
                      size={24}
                      color={SAGE[600]}
                    />
                  </View>
                </PressableScale>
              )}
              {isLiquidGlass && (
                <Host matchContents>
                  <Button
                    onPress={handleKeyboardPress}
                    label="Keyboard"
                    modifiers={[
                      buttonStyle("glass"),
                      controlSize("extraLarge"),
                      foregroundStyle(SAGE[600]),
                      labelStyle("iconOnly"),
                    ]}
                    systemImage="keyboard.fill"
                  />
                </Host>
              )}
            </View>
          </LinearGradient>
        </View>

        <SuspensLoader>
          <ImageJournalModal />
          <JournalingOptionsModal
            visible={isOptionsVisible}
            onClose={() => setIsOptionsVisible(false)}
            onSelectPrompt={setPrompt}
            allPrompts={allPrompts}
            currentPrompt={currentPrompt}
            onScanJournal={handleScanJournal}
          />
          <ImageJournalModal
            visible={isImageJournalVisible}
            onClose={() => setIsImageJournalVisible(false)}
            onInsightsReady={handleImageInsightsReady}
            selectedDate={selectedDate}
          />
        </SuspensLoader>
      </ScrollView>

      {/* Calendar Modal */}
      <Host>
        <BottomSheet
          isPresented={isCalendarVisible}
          onIsPresentedChange={(val) => {
            if (!val) {
              handleCloseCalendar();
            }
          }}
        >
          <Group
            modifiers={[
              presentationDetents(["medium"]),
              presentationDragIndicator("visible"),
            ]}
          >
            <VStack
              alignment="leading"
              spacing={16}
              modifiers={[padding(24)]}
            >
              <SUIText
                modifiers={[
                  font({ weight: "bold", size: 20 }),
                  foregroundStyle("#1C1C1E"),
                ]}
              >
                Select Date
              </SUIText>
              <SwiftUIDateTimePicker
                onDateChange={(date: Date) => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  handleDateSelect(date);
                }}
                displayedComponents={["date"]}
                title="Select Date"
                selection={selectedDate}
                modifiers={[datePickerStyle("graphical")]}
              />
            </VStack>
          </Group>
        </BottomSheet>
      </Host>
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
      () => [
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bg,
          zIndex: elevation ? 2 : 1,
          alignItems: "center" as const,
          justifyContent: "center" as const,
        },
        elevation ? ELEVATED_SHADOW : null,
      ],
      [size, bg, elevation],
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
  },
);

CircleAction.displayName = "CircleAction";

export default React.memo(DiscoveryScreen);

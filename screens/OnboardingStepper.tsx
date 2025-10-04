import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";
import { ChevronLeft, ArrowRight } from "lucide-react-native";
import { Emotion } from "@/assets/emojis";
import EmotionsStepper from "@/components/onboarding/mood/EmotionsStepper";
import { JournalOptions } from "@/screens/components/animations/steps/src/steps/journal-options/JournalOptions";
import { JOURNALING_REASONS } from "@/constants/journaling";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Local types for onboarding steps
type InputType = "name" | "birthday" | "options" | "reminder" | "mood";

interface MoodDef {
  emoji: string;
  name: string;
  backgroundColor: string;
  headline: string;
  subtext: string;
  inputType: InputType;
}

// Removed temporary EmojiStepper in favor of reusable EmotionsStepper

const moods: MoodDef[] = [
  {
    emoji: "😞",
    name: "Terrible",
    backgroundColor: "#F8D7DA",
    headline: "Bad day? You're not alone.",
    subtext: "Let's take one step upward.",
    inputType: "name",
  },
  {
    emoji: "😢",
    name: "Sad",
    backgroundColor: "#FFE4CC",
    headline: "Even heavy feelings are easier when shared with yourself.",
    subtext: "When is your special day?",
    inputType: "birthday",
  },
  {
    emoji: "😐",
    name: "Fine",
    backgroundColor: "#FFF3CD",
    headline: "Fine is okay… but let's aim higher.",
    subtext: "What brings you to journaling?",
    inputType: "options",
  },
  {
    emoji: "🙂",
    name: "Good",
    backgroundColor: "#D4EDDA",
    headline: "Good feels good. Let's grow it.",
    subtext: "Stay consistent with gentle reminders",
    inputType: "reminder",
  },
  {
    emoji: "😄",
    name: "Great",
    backgroundColor: "#CCE5FF",
    headline: "Welcome to Great 🎉",
    subtext: "How are you feeling right now?",
    inputType: "mood",
  },
];

const journalingReasons = Array.from(JOURNALING_REASONS);

const moodOptions = ["😞", "😢", "😐", "🙂", "😄", "🥰", "😴", "😤", "🤔"];

export default function OnboardingScreen(): JSX.Element {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formData, setFormData] = useState<{
    name: string;
    birthday: string;
    reason: string;
    reminderEnabled: boolean;
    reminderTime: string;
    currentMood: string;
  }>({
    name: "",
    birthday: "",
    reason: "",
    reminderEnabled: false,
    reminderTime: "9:00 AM",
    currentMood: "",
  });

  const CTA_BY_INPUT: Record<InputType, string> = {
    name: "That's Me",
    birthday: "Save Birthday",
    options: "Continue",
    reminder: "Lights Out",
    mood: "Finish",
  };

  const ctaLabel = useMemo<string>(() => {
    const current = moods[currentStep];
    return (
      CTA_BY_INPUT[current.inputType] ??
      (currentStep === moods.length - 1 ? "Finish" : "Continue")
    );
  }, [currentStep]);

  const buttonScale = useSharedValue(1);
  const backgroundProgress = useSharedValue(0);

  const emotionOrder = useMemo<Emotion[]>(
    () => [
      Emotion.Terrible,
      Emotion.Bad,
      Emotion.Fine,
      Emotion.Good,
      Emotion.Great,
    ],
    []
  );

  React.useEffect(() => {
    backgroundProgress.value = withTiming(currentStep, { duration: 300 });
  }, [currentStep]);

  const handleNext = (): void => {
    if (currentStep < moods.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      router.push("/");
    }
  };

  const handleBack = (): void => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canContinue = (): boolean => {
    const current = moods[currentStep];
    switch (current.inputType) {
      case "name":
        return formData.name.trim().length > 0;
      case "birthday":
        return formData.birthday.trim().length > 0;
      case "options":
        return formData.reason.length > 0;
      case "reminder":
        return true;
      case "mood":
        return formData.currentMood.length > 0;
      default:
        return false;
    }
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const backgroundAnimatedStyle = useAnimatedStyle(() => {
    const colors = moods.map((mood) => mood.backgroundColor);
    return {
      backgroundColor: interpolateColor(
        backgroundProgress.value,
        [0, 1, 2, 3, 4],
        colors
      ),
    };
  });

  const renderInput = (): React.ReactNode => {
    const current = moods[currentStep];

    switch (current.inputType) {
      case "name":
        return (
          <Animated.View
            entering={FadeIn.delay(200)}
            style={styles.inputContainer}
          >
            <TextInput
              style={styles.textInput}
              placeholder="Enter your name"
              placeholderTextColor="#999999"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              autoCapitalize="words"
            />
          </Animated.View>
        );

      case "birthday":
        return (
          <Animated.View
            entering={FadeIn.delay(200)}
            style={styles.inputContainer}
          >
            <TextInput
              style={styles.textInput}
              placeholder="MM/DD/YYYY"
              placeholderTextColor="#999999"
              value={formData.birthday}
              onChangeText={(text) =>
                setFormData({ ...formData, birthday: text })
              }
              keyboardType="numeric"
            />
          </Animated.View>
        );

      case "options":
        return (
          <Animated.View entering={FadeIn.delay(200)}>
            <JournalOptions
              reasons={journalingReasons}
              selectedReason={formData.reason}
              onSelect={(reason: string) =>
                setFormData({ ...formData, reason })
              }
            />
          </Animated.View>
        );

      case "reminder":
        return (
          <Animated.View
            entering={FadeIn.delay(200)}
            style={styles.reminderContainer}
          >
            <Pressable
              style={[
                styles.reminderToggle,
                formData.reminderEnabled && styles.reminderToggleActive,
              ]}
              onPress={() =>
                setFormData({
                  ...formData,
                  reminderEnabled: !formData.reminderEnabled,
                })
              }
            >
              <Text
                style={[
                  styles.reminderToggleText,
                  formData.reminderEnabled && styles.reminderToggleTextActive,
                ]}
              >
                Daily reminders {formData.reminderEnabled ? "ON" : "OFF"}
              </Text>
            </Pressable>
            {formData.reminderEnabled && (
              <Animated.View
                entering={FadeIn.delay(100)}
                style={styles.timeContainer}
              >
                <Text style={styles.timeLabel}>Remind me at:</Text>
                <TextInput
                  style={styles.timeInput}
                  value={formData.reminderTime}
                  onChangeText={(text) =>
                    setFormData({ ...formData, reminderTime: text })
                  }
                  placeholder="9:00 AM"
                  placeholderTextColor="#999999"
                />
              </Animated.View>
            )}
          </Animated.View>
        );

      case "mood":
        return (
          <Animated.View
            entering={FadeIn.delay(200)}
            style={styles.moodContainer}
          >
            <View style={styles.moodGrid}>
              {moodOptions.map((mood, index) => (
                <Animated.View key={mood} entering={FadeIn.delay(index * 30)}>
                  <Pressable
                    style={[
                      styles.moodButton,
                      formData.currentMood === mood &&
                        styles.moodButtonSelected,
                    ]}
                    onPress={() =>
                      setFormData({ ...formData, currentMood: mood })
                    }
                  >
                    <Text style={styles.moodEmoji}>{mood}</Text>
                  </Pressable>
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        );

      default:
        return null;
    }
  };

  const currentMood: MoodDef = moods[currentStep];

  return (
    <Animated.View style={[styles.container, backgroundAnimatedStyle]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={currentMood.backgroundColor}
      />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* Top stepper */}
          <View style={styles.topStepperWrapper}>
            <View style={styles.stepperCard}>
              <EmotionsStepper
                order={emotionOrder}
                activeIndex={currentStep}
                celebrate={currentStep === moods.length - 1}
                variant="light"
              />
            </View>
          </View>

          <Animated.View
            key={currentStep}
            entering={FadeIn.duration(400)}
            style={styles.header}
          >
            <Text style={styles.headline}>{currentMood.headline}</Text>
            <Text style={styles.subtext}>{currentMood.subtext}</Text>
          </Animated.View>

          <View style={styles.inputSection}>
            <Animated.View
              key={`input-${currentStep}`}
              entering={FadeIn.duration(300).delay(200)}
            >
              {renderInput()}
            </Animated.View>
          </View>
        </View>

        <View style={styles.fixedBottomSection}>
          {/* Left column: Back button */}
          <View style={styles.leftColumn}>
            <Pressable
              style={[
                styles.backButton,
                currentStep === 0 && styles.backButtonDisabled,
              ]}
              onPress={handleBack}
              disabled={currentStep === 0}
            >
              <ChevronLeft
                size={16}
                color={currentStep === 0 ? "#BDBDBD" : "#666666"}
              />
            </Pressable>
          </View>

          {/* Right column: Continue CTA */}
          <View style={styles.navigation}>
            <AnimatedPressable
              style={[
                styles.ctaButton,
                !canContinue() && styles.ctaButtonDisabled,
                buttonAnimatedStyle,
              ]}
              onPress={handleNext}
              disabled={!canContinue()}
              onPressIn={() => {
                if (canContinue()) {
                  buttonScale.value = withTiming(0.97, { duration: 90 });
                }
              }}
              onPressOut={() => {
                if (canContinue()) {
                  buttonScale.value = withTiming(1, { duration: 90 });
                }
              }}
            >
              {/* Gradient background */}
              <LinearGradient
                pointerEvents="none"
                colors={["#7C3AED", "#6366F1", "#60A5FA"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.ctaGradient}
              />
              <Text style={styles.ctaText}>{ctaLabel}</Text>
              <ArrowRight size={18} color="#FFFFFF" />
            </AnimatedPressable>
          </View>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  topStepperWrapper: {
    alignSelf: "center",
    marginTop: 56,
    marginBottom: 8,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 60,
  },
  headline: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1A1A1A",
    lineHeight: 36,
    marginBottom: 12,
  },
  subtext: {
    fontSize: 16,
    color: "#666666",
    lineHeight: 24,
  },
  inputSection: {
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: 20,
  },
  inputContainer: {
    marginTop: 20,
  },
  textInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    fontSize: 16,
    color: "#1A1A1A",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  optionsContainer: {
    marginTop: 20,
  },
  optionButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  optionButtonSelected: {
    backgroundColor: "#F5F5F5",
    borderColor: "#1A1A1A",
  },
  optionText: {
    fontSize: 16,
    color: "#1A1A1A",
  },
  optionTextSelected: {
    fontWeight: "600",
  },
  reminderContainer: {
    marginTop: 20,
  },
  reminderToggle: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  reminderToggleActive: {
    backgroundColor: "#F5F5F5",
    borderColor: "#1A1A1A",
  },
  reminderToggleText: {
    fontSize: 16,
    color: "#1A1A1A",
    textAlign: "center",
  },
  reminderToggleTextActive: {
    fontWeight: "600",
  },
  timeContainer: {
    alignItems: "center",
  },
  timeLabel: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 8,
  },
  timeInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1A1A1A",
    textAlign: "center",
    minWidth: 120,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  moodContainer: {
    marginTop: 20,
  },
  moodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 16,
  },
  moodButton: {
    width: 60,
    height: 60,
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  moodButtonSelected: {
    backgroundColor: "#F5F5F5",
    borderColor: "#1A1A1A",
    transform: [{ scale: 1.1 }],
  },
  moodEmoji: {
    fontSize: 24,
  },
  fixedBottomSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 32,
    paddingBottom: 32,
    marginBottom: 32,
  },
  leftColumn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  stepperWrapper: {
    marginBottom: 12,
  },
  stepperCard: {
    borderRadius: 16,
    // paddingVertical: 2,
    // paddingHorizontal: 2,
    backgroundColor: "rgba(255,255,255,0.35)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.45)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    display: "flex",
    justifyContent: "space-between",
  },
  journeyProgress: {
    flex: 1,
  },
  journeyLabel: {
    fontSize: 12,
    color: "#666666",
    marginBottom: 12,
    fontWeight: "500",
  },
  journeyPath: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  journeyStep: {
    flexDirection: "row",
    alignItems: "center",
  },
  journeyEmoji: {
    fontSize: 20,
    opacity: 0.3,
  },
  journeyEmojiActive: {
    opacity: 1,
    transform: [{ scale: 1.2 }],
  },
  journeyEmojiComplete: {
    opacity: 0.8,
  },
  journeyLine: {
    width: 16,
    height: 2,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 4,
    borderRadius: 1,
  },
  journeyLineComplete: {
    backgroundColor: "#1A1A1A",
    opacity: 0.3,
  },
  navigation: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    minWidth: 120,
  },
  backButton: {
    width: 60,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.04)",
  },
  backButtonDisabled: {
    opacity: 0.6,
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 18,
    height: 48,
    minWidth: 200,
    borderRadius: 24,
    overflow: "hidden",
    position: "relative",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  ctaGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
  },
  ctaText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  ctaButtonDisabled: {
    opacity: 0.6,
  },
});

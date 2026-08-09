import React from "react";
import { View, Pressable, ScrollView } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import {
  useJourneyOnboardingViewModel,
  type JourneyOnboardingScreenProps,
} from "../hooks/useJourneyOnboardingViewModel";

export interface OnboardingQuestion {
  id: string;
  title: string;
  subtitle: string;
  options: OnboardingOption[];
}

export interface OnboardingOption {
  id: string;
  label: string;
  emoji: string;
  description: string;
  categories: string[];
}

function WelcomeHero({ onStart }: { onStart: () => void }): React.JSX.Element {
  return (
    <View className="flex-1 items-center justify-center px-8">
      <View className="w-28 h-28 rounded-full bg-purple-50 items-center justify-center mb-6">
        <Text className="text-5xl">🧭</Text>
      </View>

      <Text className="text-3xl font-bold text-ink text-center mb-3">
        Find Your Path
      </Text>
      <Text className="text-base text-ink-soft text-center leading-6 mb-8 px-4">
        Answer 2 quick questions and we'll recommend the perfect journey to
        start your mental wellness practice.
      </Text>

      <Pressable
        onPress={onStart}
        className="bg-purple-600 rounded-2xl py-4 px-10 mb-4"
        accessibilityRole="button"
        accessibilityLabel="Start quiz to find your journey"
      >
        <Text className="text-base font-bold text-white">
          Let's Get Started
        </Text>
      </Pressable>

      <Text className="text-sm text-ink-muted">Takes less than 30 seconds</Text>
    </View>
  );
}

function QuestionCard({
  question,
  selectedOptionId,
  onSelect,
}: {
  question: OnboardingQuestion;
  selectedOptionId: string | null;
  onSelect: (optionId: string) => void;
}): React.JSX.Element {
  return (
    <View className="flex-1 px-6 pt-6">
      <Text className="text-2xl font-bold text-ink mb-2">{question.title}</Text>
      <Text className="text-sm text-ink-muted mb-6">{question.subtitle}</Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {question.options.map(
          (option: OnboardingOption): React.JSX.Element => {
            const isSelected: boolean = selectedOptionId === option.id;
            return (
              <Pressable
                key={option.id}
                onPress={() => onSelect(option.id)}
                className={`flex-row items-center p-4 rounded-2xl mb-3 border-2 ${
                  isSelected
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-100 bg-brand-surface"
                }`}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={`${option.label}: ${option.description}`}
              >
                <View
                  className={`w-12 h-12 rounded-xl items-center justify-center mr-4 ${
                    isSelected ? "bg-purple-100" : "bg-brand-canvas"
                  }`}
                >
                  <Text className="text-2xl">{option.emoji}</Text>
                </View>
                <View className="flex-1">
                  <Text
                    className={`text-base font-bold ${
                      isSelected ? "text-ink" : "text-ink"
                    }`}
                  >
                    {option.label}
                  </Text>
                  <Text className="text-sm text-ink-muted mt-0.5">
                    {option.description}
                  </Text>
                </View>
                {isSelected && (
                  <View className="w-6 h-6 rounded-full bg-purple-500 items-center justify-center">
                    <Feather name="check" size={14} color="white" />
                  </View>
                )}
              </Pressable>
            );
          },
        )}
      </ScrollView>
    </View>
  );
}

function EnrollingState(): React.JSX.Element {
  return (
    <View className="flex-1 items-center justify-center px-8">
      <View className="w-20 h-20 rounded-full bg-green-50 items-center justify-center mb-6">
        <Text className="text-4xl">✨</Text>
      </View>
      <Text className="text-xl font-bold text-ink mb-2">
        Setting up your journey...
      </Text>
      <Text className="text-sm text-ink-muted text-center">
        We're preparing your personalized learning path
      </Text>
    </View>
  );
}

export interface JourneyOnboardingScreenViewProps
  extends ReturnType<typeof useJourneyOnboardingViewModel> {}

/**
 * Presentational View component for JourneyOnboardingScreen.
 * Consists strictly of JSX code without internal hooks.
 */
export const JourneyOnboardingScreenView = React.memo(
  function JourneyOnboardingScreenView({
    screenState,
    currentQuestionIndex,
    answers,
    currentQuestion,
    totalQuestions,
    handleStart,
    handleSelectOption,
    handlePreviousQuestion,
    onSkip,
    isEnrolling,
  }: JourneyOnboardingScreenViewProps): React.JSX.Element {
    if (screenState === "enrolling" || isEnrolling) {
      return (
        <SafeAreaView className="flex-1 bg-brand-surface" edges={["top"]}>
          <EnrollingState />
        </SafeAreaView>
      );
    }

    if (screenState === "welcome") {
      return (
        <SafeAreaView className="flex-1 bg-brand-surface" edges={["top"]}>
          <WelcomeHero onStart={handleStart} />
          <View className="px-8 pb-8">
            <Pressable
              onPress={onSkip}
              className="py-3 items-center"
              accessibilityRole="button"
              accessibilityLabel="Skip quiz and browse all journeys"
            >
              <Text className="text-sm font-medium text-ink">
                Skip and browse all journeys
              </Text>
            </Pressable>
          </View>
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView className="flex-1 bg-brand-surface" edges={["top"]}>
        <View className="px-6 pt-4 pb-2">
          <View className="flex-row items-center justify-between mb-3">
            {currentQuestionIndex > 0 ? (
              <Pressable
                onPress={handlePreviousQuestion}
                className="w-9 h-9 rounded-full bg-brand-canvas items-center justify-center"
                accessibilityRole="button"
                accessibilityLabel="Previous question"
              >
                <Feather name="arrow-left" size={18} color="#64748B" />
              </Pressable>
            ) : (
              <View className="w-9" />
            )}

            <Text className="text-sm font-semibold text-ink-muted">
              {currentQuestionIndex + 1} of {totalQuestions}
            </Text>

            <Pressable
              onPress={onSkip}
              accessibilityRole="button"
              accessibilityLabel="Skip quiz"
            >
              <Text className="text-sm font-medium text-ink">Skip</Text>
            </Pressable>
          </View>

          <View className="h-1.5 bg-sage-50 rounded-full">
            <View
              className="h-1.5 bg-purple-500 rounded-full"
              style={{
                width: `${
                  ((currentQuestionIndex + 1) / totalQuestions) * 100
                }%`,
              }}
            />
          </View>
        </View>

        {currentQuestion && (
          <QuestionCard
            question={currentQuestion}
            selectedOptionId={answers[currentQuestion.id] ?? null}
            onSelect={handleSelectOption}
          />
        )}
      </SafeAreaView>
    );
  },
);

/**
 * Container component for JourneyOnboardingScreen.
 */
export default function JourneyOnboardingScreen(
  props: JourneyOnboardingScreenProps,
): React.JSX.Element {
  const viewModel = useJourneyOnboardingViewModel(props);
  return <JourneyOnboardingScreenView {...viewModel} />;
}

export type { JourneyOnboardingScreenProps };

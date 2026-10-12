import React from "react";
import { Pressable, Text, View } from "react-native";
import { ScreenLayout } from "@/src/components/ui/ScreenLayout";
import TactileButton from "@/src/screens/OnboardingScreen/components/TactileButton";
import { ANXIOUS_THOUGHTS_STARTER_PATH } from "@/src/domains/journey/model/starterPath";

export type StarterStep = "goal" | "lesson" | "practice";

const PATH_COPY = ANXIOUS_THOUGHTS_STARTER_PATH.copyKeys;

interface StarterStepProps {
  translate: (key: string) => string;
}

function GoalStep({ translate }: StarterStepProps): React.JSX.Element {
  return (
    <View className="gap-6">
      <View className="gap-2">
        <Text className="text-sm font-bold tracking-wide text-sage-600">
          {translate(PATH_COPY.goal.eyebrow)}
        </Text>
        <Text className="text-[32px] leading-9 text-ink happy-font-body-extrabold">
          {translate(PATH_COPY.goal.title)}
        </Text>
        <Text className="text-base leading-6 text-ink-soft happy-font-body-medium">
          {translate(PATH_COPY.goal.description)}
        </Text>
      </View>

      <View className="rounded-3xl border-2 border-sage-600 bg-sage-50 p-5">
        <Text className="mb-2 text-2xl">🌊</Text>
        <Text className="text-xl text-ink happy-font-body-bold">
          {translate(PATH_COPY.goal.choice)}
        </Text>
        <Text className="mt-1 text-base leading-6 text-ink-soft happy-font-body-medium">
          {translate(PATH_COPY.goal.choiceDescription)}
        </Text>
      </View>
    </View>
  );
}

function LessonStep({ translate }: StarterStepProps): React.JSX.Element {
  return (
    <View className="gap-5">
      <View className="gap-2">
        <Text className="text-sm font-bold tracking-wide text-sage-600">
          {translate(PATH_COPY.lesson.eyebrow)}
        </Text>
        <Text className="text-[32px] leading-9 text-ink happy-font-body-extrabold">
          {translate(PATH_COPY.lesson.title)}
        </Text>
      </View>

      <View className="gap-4 rounded-3xl bg-sage-50 p-5">
        <Text className="text-base leading-6 text-ink happy-font-body-medium">
          {translate(PATH_COPY.lesson.paragraphOne)}
        </Text>
        <Text className="text-base leading-6 text-ink happy-font-body-medium">
          {translate(PATH_COPY.lesson.paragraphTwo)}
        </Text>
      </View>

      <View className="rounded-2xl border border-sage-200 bg-white p-4">
        <Text className="text-sm leading-5 text-ink-soft happy-font-body-medium">
          {translate(PATH_COPY.boundary)}
        </Text>
      </View>
    </View>
  );
}

interface PracticeStepProps extends StarterStepProps {
  hasCompletionError: boolean;
  isCompleting: boolean;
  onOpenPractice: () => void;
  onContinueHome: () => void;
}

function PracticeStep({
  translate,
  hasCompletionError,
  isCompleting,
  onOpenPractice,
  onContinueHome,
}: PracticeStepProps): React.JSX.Element {
  return (
    <View className="gap-5">
      <View className="gap-2">
        <Text className="text-sm font-bold tracking-wide text-sage-600">
          {translate(PATH_COPY.practice.eyebrow)}
        </Text>
        <Text className="text-[32px] leading-9 text-ink happy-font-body-extrabold">
          {translate(PATH_COPY.practice.title)}
        </Text>
        <Text className="text-base leading-6 text-ink-soft happy-font-body-medium">
          {translate(PATH_COPY.practice.description)}
        </Text>
      </View>

      <View className="rounded-3xl border-2 border-sage-600 bg-sage-50 p-5">
        <Text className="mb-2 text-2xl">🧠</Text>
        <Text className="text-xl text-ink happy-font-body-bold">
          {translate(PATH_COPY.practice.toolTitle)}
        </Text>
        <Text className="mt-1 text-base leading-6 text-ink-soft happy-font-body-medium">
          {translate(PATH_COPY.practice.toolDescription)}
        </Text>
      </View>

      <Text className="text-sm leading-5 text-ink-soft happy-font-body-medium">
        {translate(PATH_COPY.boundary)}
      </Text>

      {hasCompletionError && (
        <Text className="text-sm leading-5 text-danger happy-font-body-bold">
          {translate(PATH_COPY.practice.completionError)}
        </Text>
      )}

      <View className="gap-3">
        <TactileButton
          label={translate(PATH_COPY.practice.openButton)}
          onPress={onOpenPractice}
          disabled={isCompleting}
        />
        <TactileButton
          label={translate(PATH_COPY.practice.homeButton)}
          onPress={onContinueHome}
          disabled={isCompleting}
          variant="secondary"
        />
      </View>
    </View>
  );
}

interface StarterPathHeaderProps extends StarterStepProps {
  step: StarterStep;
  onBack: () => void;
}

export function StarterPathHeader({
  step,
  translate,
  onBack,
}: StarterPathHeaderProps): React.JSX.Element {
  const backButton =
    step === "goal" ? null : (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={translate("starter_path.back")}
        onPress={onBack}
        className="min-h-[44px] justify-center"
      >
        <Text className="text-base text-sage-700 happy-font-body-bold">
          {translate("starter_path.back")}
        </Text>
      </Pressable>
    );

  return (
    <ScreenLayout.Header className="bg-brand-surface">
      {backButton}
    </ScreenLayout.Header>
  );
}

interface StarterPathContentProps extends PracticeStepProps {
  step: StarterStep;
}

export function StarterPathContent({
  step,
  translate,
  hasCompletionError,
  isCompleting,
  onOpenPractice,
  onContinueHome,
}: StarterPathContentProps): React.JSX.Element {
  const contentByStep: Record<StarterStep, React.JSX.Element> = {
    goal: <GoalStep translate={translate} />,
    lesson: <LessonStep translate={translate} />,
    practice: (
      <PracticeStep
        translate={translate}
        hasCompletionError={hasCompletionError}
        isCompleting={isCompleting}
        onOpenPractice={onOpenPractice}
        onContinueHome={onContinueHome}
      />
    ),
  };

  return (
    <ScreenLayout.Content hasHeader={step !== "goal"}>
      {contentByStep[step]}
    </ScreenLayout.Content>
  );
}

interface StarterPathFooterProps extends StarterStepProps {
  step: StarterStep;
  onAdvance: () => void;
}

export function StarterPathFooter({
  step,
  translate,
  onAdvance,
}: StarterPathFooterProps): React.JSX.Element | null {
  const footerByStep: Record<StarterStep, React.JSX.Element | null> = {
    goal: (
      <ScreenLayout.Footer variant="transparent">
        <TactileButton
          label={translate(PATH_COPY.goal.continueButton)}
          onPress={onAdvance}
        />
      </ScreenLayout.Footer>
    ),
    lesson: (
      <ScreenLayout.Footer variant="transparent">
        <TactileButton
          label={translate(PATH_COPY.lesson.continueButton)}
          onPress={onAdvance}
        />
      </ScreenLayout.Footer>
    ),
    practice: null,
  };

  return footerByStep[step];
}

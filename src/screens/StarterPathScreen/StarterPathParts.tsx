import React from "react";
import { Pressable, Text, View } from "react-native";
import { ScreenLayout } from "@/src/components/ui/ScreenLayout";
import TactileButton from "@/src/screens/OnboardingScreen/components/TactileButton";
import type { StarterPathV1 } from "@/src/domains/journey/model/starterPath";

export type StarterStep = "goal" | "lesson" | "practice";

interface StarterStepProps {
  translate: (key: string) => string;
  path: StarterPathV1;
}

interface GoalStepProps extends StarterStepProps {
  availablePaths: readonly StarterPathV1[];
  onSelectPath: (pathId: string) => void;
}

function GoalStep({
  translate,
  path,
  availablePaths,
  onSelectPath,
}: GoalStepProps): React.JSX.Element {
  const pathCopy = path.copyKeys;
  return (
    <View className="gap-6">
      <View className="gap-2">
        <Text className="text-sm font-bold tracking-wide text-sage-600">
          {translate(pathCopy.goal.eyebrow)}
        </Text>
        <Text className="text-[32px] leading-9 text-ink happy-font-body-extrabold">
          {translate(pathCopy.goal.title)}
        </Text>
        <Text className="text-base leading-6 text-ink-soft happy-font-body-medium">
          {translate(pathCopy.goal.description)}
        </Text>
      </View>

      <View className="gap-3">
        {availablePaths.map((candidatePath) => {
          const candidateCopy = candidatePath.copyKeys.goal;
          const isSelected = candidatePath.pathId === path.pathId;
          return (
            <Pressable
              key={candidatePath.pathId}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              onPress={() => onSelectPath(candidatePath.pathId)}
              className={`rounded-3xl border-2 p-5 ${isSelected ? "border-sage-600 bg-sage-50" : "border-sage-200 bg-white"}`}
            >
              <Text className="mb-2 text-2xl">{isSelected ? "🌊" : "🌿"}</Text>
              <Text className="text-xl text-ink happy-font-body-bold">
                {translate(candidateCopy.choice)}
              </Text>
              <Text className="mt-1 text-base leading-6 text-ink-soft happy-font-body-medium">
                {translate(candidateCopy.choiceDescription)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function LessonStep({ translate, path }: StarterStepProps): React.JSX.Element {
  const pathCopy = path.copyKeys;
  return (
    <View className="gap-5">
      <View className="gap-2">
        <Text className="text-sm font-bold tracking-wide text-sage-600">
          {translate(pathCopy.lesson.eyebrow)}
        </Text>
        <Text className="text-[32px] leading-9 text-ink happy-font-body-extrabold">
          {translate(pathCopy.lesson.title)}
        </Text>
      </View>

      <View className="gap-4 rounded-3xl bg-sage-50 p-5">
        <Text className="text-base leading-6 text-ink happy-font-body-medium">
          {translate(pathCopy.lesson.paragraphOne)}
        </Text>
        <Text className="text-base leading-6 text-ink happy-font-body-medium">
          {translate(pathCopy.lesson.paragraphTwo)}
        </Text>
      </View>

      <View className="rounded-2xl border border-sage-200 bg-white p-4">
        <Text className="text-sm leading-5 text-ink-soft happy-font-body-medium">
          {translate(pathCopy.boundary)}
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
  const pathCopy = path.copyKeys;
  return (
    <View className="gap-5">
      <View className="gap-2">
        <Text className="text-sm font-bold tracking-wide text-sage-600">
          {translate(pathCopy.practice.eyebrow)}
        </Text>
        <Text className="text-[32px] leading-9 text-ink happy-font-body-extrabold">
          {translate(pathCopy.practice.title)}
        </Text>
        <Text className="text-base leading-6 text-ink-soft happy-font-body-medium">
        {translate(pathCopy.practice.description)}
        </Text>
      </View>

      <View className="rounded-3xl border-2 border-sage-600 bg-sage-50 p-5">
        <Text className="mb-2 text-2xl">🧠</Text>
        <Text className="text-xl text-ink happy-font-body-bold">
          {translate(pathCopy.practice.toolTitle)}
        </Text>
        <Text className="mt-1 text-base leading-6 text-ink-soft happy-font-body-medium">
          {translate(pathCopy.practice.toolDescription)}
        </Text>
      </View>

      <Text className="text-sm leading-5 text-ink-soft happy-font-body-medium">
        {translate(pathCopy.boundary)}
      </Text>

      {hasCompletionError && (
        <Text className="text-sm leading-5 text-danger happy-font-body-bold">
          {translate(pathCopy.practice.completionError)}
        </Text>
      )}

      <View className="gap-3">
        <TactileButton
          label={translate(pathCopy.practice.openButton)}
          onPress={onOpenPractice}
          disabled={isCompleting}
        />
        <TactileButton
          label={translate(pathCopy.practice.homeButton)}
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
  availablePaths: readonly StarterPathV1[];
  onSelectPath: (pathId: string) => void;
}

export function StarterPathContent({
  step,
  path,
  translate,
  hasCompletionError,
  isCompleting,
  onOpenPractice,
  onContinueHome,
  availablePaths,
  onSelectPath,
}: StarterPathContentProps): React.JSX.Element {
  const contentByStep: Record<StarterStep, React.JSX.Element> = {
    goal: (
      <GoalStep
        translate={translate}
        path={path}
        availablePaths={availablePaths}
        onSelectPath={onSelectPath}
      />
    ),
    lesson: <LessonStep translate={translate} path={path} />,
    practice: (
      <PracticeStep
        translate={translate}
        path={path}
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
  path,
  translate,
  onAdvance,
}: StarterPathFooterProps): React.JSX.Element | null {
  const pathCopy = path.copyKeys;
  const footerByStep: Record<StarterStep, React.JSX.Element | null> = {
    goal: (
      <ScreenLayout.Footer variant="transparent">
        <TactileButton
          label={translate(pathCopy.goal.continueButton)}
          onPress={onAdvance}
        />
      </ScreenLayout.Footer>
    ),
    lesson: (
      <ScreenLayout.Footer variant="transparent">
        <TactileButton
          label={translate(pathCopy.lesson.continueButton)}
          onPress={onAdvance}
        />
      </ScreenLayout.Footer>
    ),
    practice: null,
  };

  return footerByStep[step];
}

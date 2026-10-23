import React from "react";
import { Pressable, Text, View } from "react-native";
import { SymbolView } from "expo-symbols";
import HappiMascot from "@/src/screens/OnboardingScreen/components/HappiMascot";
import { ScreenLayout } from "@/src/components/ui/ScreenLayout";
import TactileButton from "@/src/screens/OnboardingScreen/components/TactileButton";
import type { StarterPathV1 } from "@/src/domains/journey/model/starterPath";
import { StarterPathGoalOption } from "./StarterPathGoalOption";

export type StarterStep = "goal" | "lesson" | "practice";

interface StarterStepProps {
  translate: (key: string) => string;
  path: StarterPathV1;
}

interface GoalStepProps extends StarterStepProps {
  availablePaths: readonly StarterPathV1[];
  onSelectPath: (pathId: string) => void;
}

// ponytail: benchmark goal step with balanced vertical hierarchy and squircle options
function GoalStep({
  translate,
  path,
  availablePaths,
  onSelectPath,
}: GoalStepProps): React.JSX.Element {
  const pathCopy = path.copyKeys;
  return (
    <View className="gap-6 pt-1">
      <View className="gap-2">
        <View className="self-start rounded-full border border-sage-200/80 bg-sage-100/90 px-3.5 py-1">
          <Text className="text-[12px] uppercase tracking-wider text-sage-700 happy-font-body-extrabold">
            {translate(pathCopy.goal.eyebrow)}
          </Text>
        </View>
        <Text className="text-[32px] leading-[38px] text-ink happy-font-body-extrabold tracking-tight mt-1">
          {translate(pathCopy.goal.title)}
        </Text>
        <Text className="text-[16px] leading-[23px] text-ink-soft happy-font-body-medium">
          {translate(pathCopy.goal.description)}
        </Text>
      </View>

      <View className="gap-4 pt-3">
        {availablePaths.map((candidatePath) => {
          const isSelected = candidatePath.pathId === path.pathId;
          return (
            <StarterPathGoalOption
              key={candidatePath.pathId}
              path={candidatePath}
              selected={isSelected}
              translate={translate}
              onSelect={() => onSelectPath(candidatePath.pathId)}
            />
          );
        })}
      </View>
    </View>
  );
}

function LessonStep({ translate, path }: StarterStepProps): React.JSX.Element {
  const pathCopy = path.copyKeys;
  return (
    <View className="gap-5 pt-1">
      <View className="gap-2">
        <View className="self-start rounded-full border border-sage-200/80 bg-sage-100/90 px-3.5 py-1">
          <Text className="text-[12px] uppercase tracking-wider text-sage-700 happy-font-body-extrabold">
            {translate(pathCopy.lesson.eyebrow)}
          </Text>
        </View>
        <Text className="text-[32px] leading-[38px] text-ink happy-font-body-extrabold tracking-tight mt-1">
          {translate(pathCopy.lesson.title)}
        </Text>
      </View>

      <View className="gap-4 rounded-3xl border-2 border-b-[5px] border-sage-200 border-b-sage-300 bg-sage-50 p-6">
        <Text className="text-base leading-6 text-ink happy-font-body-medium">
          {translate(pathCopy.lesson.paragraphOne)}
        </Text>
        <Text className="text-base leading-6 text-ink happy-font-body-medium">
          {translate(pathCopy.lesson.paragraphTwo)}
        </Text>
      </View>

      <View className="rounded-2xl border-2 border-b-4 border-brand-border border-b-brand-border-strong bg-white p-4">
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
  path,
  hasCompletionError,
  isCompleting,
  onOpenPractice,
  onContinueHome,
}: PracticeStepProps): React.JSX.Element {
  const pathCopy = path.copyKeys;
  return (
    <View className="gap-5 pt-1">
      <View className="gap-2">
        <View className="self-start rounded-full border border-sage-200/80 bg-sage-100/90 px-3.5 py-1">
          <Text className="text-[12px] uppercase tracking-wider text-sage-700 happy-font-body-extrabold">
            {translate(pathCopy.practice.eyebrow)}
          </Text>
        </View>
        <Text className="text-[32px] leading-[38px] text-ink happy-font-body-extrabold tracking-tight mt-1">
          {translate(pathCopy.practice.title)}
        </Text>
        <Text className="text-base leading-6 text-ink-soft happy-font-body-medium">
          {translate(pathCopy.practice.description)}
        </Text>
      </View>

      <View className="rounded-3xl border-2 border-b-[5px] border-sage-500 border-b-sage-700 bg-sage-50 px-6 py-6">
        {/* ponytail: Happi toolkit mascot with key unlocks the user's first cognitive tool */}
        <View className="mb-4 items-center justify-center">
          <HappiMascot expression="toolkit" size={120} />
        </View>
        <Text className="text-xl text-ink happy-font-body-bold">
          {translate(pathCopy.practice.toolTitle)}
        </Text>
        <Text className="mt-2 text-base leading-6 text-ink-soft happy-font-body-medium">
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
          height={60}
          fontSize={17}
          pressDepth={6}
          faceColor="#44633F"
          rimColor="#29452A"
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

export { StarterPathHeader } from "./StarterPathHeader";

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
    <ScreenLayout.Content hasHeader={true}>
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
          height={60}
          fontSize={17}
          pressDepth={6}
          faceColor="#44633F"
          rimColor="#29452A"
        />
      </ScreenLayout.Footer>
    ),
    lesson: (
      <ScreenLayout.Footer variant="transparent">
        <TactileButton
          label={translate(pathCopy.lesson.continueButton)}
          onPress={onAdvance}
          height={60}
          fontSize={17}
          pressDepth={6}
          faceColor="#44633F"
          rimColor="#29452A"
        />
      </ScreenLayout.Footer>
    ),
    practice: null,
  };

  return footerByStep[step];
}

// ponytail: clean container orchestrating onboarding state, hooks, and presentation views
import React, { useState, useCallback } from 'react';
import { View, SafeAreaView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { OnboardingStep, ChatPhase, SheetType, MessageSender, ReminderPreset } from '../../domain/enums';
import { GOALS } from '../../domain/goals';
import { TRAP_LABELS } from '../../domain/traps';
import { getShiftCopy, weighBelief } from '../../domain/scoring';
import { completeOnboarding } from '../../data/onboardingRepository';

import { useOnboardingStep } from './hooks/useOnboardingStep';
import { useChatMessages } from './hooks/useChatMessages';
import { useReflectionDraft } from './hooks/useReflectionDraft';
import { useReminderSelection } from './hooks/useReminderSelection';
import { useComposerState } from './hooks/useComposerState';
import { useHappiGuideMotion, ActingPose } from './useHappiGuideMotion';

import { OnboardingHeader } from '../presentation/components/OnboardingHeader';
import { HappiGuideStage } from '../presentation/components/HappiGuideStage';
import { HelloStepView } from '../presentation/views/HelloStepView';
import { GoalPickStepView } from '../presentation/views/GoalPickStepView';
import { ThoughtCatcherChatStepView } from '../presentation/views/ThoughtCatcherChatStepView';
import { SavedKeepsakeStepView } from '../presentation/views/SavedKeepsakeStepView';
import { ChatReplyFooter } from '../presentation/components/ChatReplyFooter';
import { OnboardingSheetsModal } from '../presentation/components/OnboardingSheetsModal';
import type { GoalDefinition } from '../../domain/types';

export interface OnboardingContainerProps {
  userId?: string;
  onComplete: () => void;
}

export function OnboardingContainer({
  userId,
  onComplete,
}: OnboardingContainerProps): React.JSX.Element {
  const { step, progressFill, goToStep, goBack } = useOnboardingStep();
  const { messages, isTyping, setIsTyping, pushMessage } = useChatMessages();
  const { reflection, applyGoal, setBeliefRating, setPersonalThought, setReminder } = useReflectionDraft();
  const reminder = useReminderSelection((p: ReminderPreset): void => setReminder(p));
  const composer = useComposerState();
  const guide = useHappiGuideMotion();

  const [selectedGoal, setSelectedGoal] = useState<GoalDefinition | null>(null);
  const [chatPhase, setChatPhase] = useState<ChatPhase>(ChatPhase.ShowMe);
  const [activeSheet, setActiveSheet] = useState<SheetType | null>(null);

  const handleStartHello = useCallback((): void => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    goToStep(OnboardingStep.GoalPick, 0.2);
    guide.actPose(ActingPose.Rest);
    guide.setWeather(0.35);
  }, [goToStep, guide]);

  const handleSelectGoal = useCallback((g: GoalDefinition): void => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedGoal(g);
    applyGoal(g);
    guide.actPose(g.id);
    guide.setWeather(g.f);
    goToStep(OnboardingStep.Chat, 0.35);
    setChatPhase(ChatPhase.ShowMe);
    pushMessage(MessageSender.Happi, g.mirror, { isHeading: true });
  }, [applyGoal, goToStep, guide, pushMessage]);

  const handleShowMe = useCallback((): void => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setChatPhase(ChatPhase.RateInitial);
  }, []);

  const handleRateBelief = useCallback((rating: number): void => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (chatPhase === ChatPhase.RateInitial) {
      setBeliefRating(rating, false);
      guide.setWeather(weighBelief(rating));
      pushMessage(MessageSender.User, `${rating}/4`);
      setIsTyping(true);
      setTimeout((): void => {
        setIsTyping(false);
        if (selectedGoal) {
          guide.actPose(ActingPose.Relieved);
          guide.setWeather(0.12, true);
          const trapName: string | undefined = selectedGoal.trap ? TRAP_LABELS[selectedGoal.trap] : undefined;
          pushMessage(MessageSender.Happi, selectedGoal.fair, {
            isFair: true,
            why: selectedGoal.why,
            trapLabel: trapName,
          });
          setChatPhase(ChatPhase.RateShift);
        }
      }, 600);
    } else {
      setBeliefRating(rating, true);
      const copy: string = getShiftCopy(reflection.before ?? 3, rating);
      pushMessage(MessageSender.User, `${rating}/4`);
      pushMessage(MessageSender.Happi, copy);
      guide.actPose(ActingPose.Rest);
      setChatPhase(ChatPhase.ReadyToSave);
    }
  }, [chatPhase, guide, pushMessage, reflection.before, selectedGoal, setBeliefRating, setIsTyping]);

  const handleShowSaved = useCallback((): void => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    goToStep(OnboardingStep.Saved, 1.0);
    guide.actPose(ActingPose.Pride);
    guide.setWeather(0.08);
  }, [goToStep, guide]);

  const handlePersonalSubmit = useCallback((): void => {
    const trimmed: string = composer.text.trim();
    if (!trimmed) return;
    setPersonalThought(trimmed);
    pushMessage(MessageSender.User, trimmed);
    composer.clearText();
    setChatPhase(ChatPhase.RateInitial);
  }, [composer, pushMessage, setPersonalThought]);

  const handleFinish = useCallback(async (): Promise<void> => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await completeOnboarding(userId, reflection);
    onComplete();
  }, [userId, reflection, onComplete]);

  const handleBack = useCallback((): void => {
    if (step === OnboardingStep.Chat) {
      setActiveSheet(SheetType.Leave);
    } else {
      goBack();
    }
  }, [step, goBack]);

  return (
    <SafeAreaView className="flex-1 bg-happy-bg">
      <OnboardingHeader
        showBack={step !== OnboardingStep.Hello}
        showProgress={step !== OnboardingStep.Hello}
        progressFill={progressFill}
        onBack={handleBack}
      />

      <View className="flex-1">
        {step === OnboardingStep.Hello && (
          <HelloStepView
            guideStage={<HappiGuideStage weather={guide.weatherF.value} size="hero" />}
            onHiPress={handleStartHello}
            onWhoPress={(): void => setActiveSheet(SheetType.Who)}
            onSignInPress={(): void => setActiveSheet(SheetType.SignIn)}
          />
        )}

        {step === OnboardingStep.GoalPick && (
          <GoalPickStepView
            goals={GOALS}
            selectedGoalId={selectedGoal?.id ?? null}
            guideStage={<HappiGuideStage weather={guide.weatherF.value} size="compact" />}
            onSelectGoal={handleSelectGoal}
          />
        )}

        {step === OnboardingStep.Chat && (
          <ThoughtCatcherChatStepView
            messages={messages}
            isTyping={isTyping}
            isHeroPhase={chatPhase === ChatPhase.ShowMe}
            heroMirrorText={selectedGoal?.mirror ?? ''}
            activeSceneGoalId={selectedGoal?.id ?? null}
            activeSceneCaption={selectedGoal?.scene ?? null}
            weather={guide.weatherF.value}
            onShowMe={handleShowMe}
            footerReplyView={
              <ChatReplyFooter
                phase={chatPhase}
                composerText={composer.text}
                onShowMe={handleShowMe}
                onRateBelief={handleRateBelief}
                onSaveReflection={handleShowSaved}
                onChangeComposerText={composer.setText}
                onSelectStarter={composer.applyStarter}
                onSubmitPersonal={handlePersonalSubmit}
              />
            }
          />
        )}

        {step === OnboardingStep.Saved && (
          <SavedKeepsakeStepView
            reflection={reflection}
            isReminderSet={reminder.isSet}
            activeReminderTime={reminder.activeTime}
            onPickPreset={reminder.selectPreset}
            onChangeReminderTime={reminder.resetSelection}
            onGoHome={handleFinish}
          />
        )}
      </View>

      <OnboardingSheetsModal
        activeSheet={activeSheet}
        onClose={(): void => setActiveSheet(null)}
        onLeaveConfirm={(): void => {
          setActiveSheet(null);
          goBack();
        }}
        onSignInPress={(): void => {
          setActiveSheet(null);
          handleFinish();
        }}
      />
    </SafeAreaView>
  );
}

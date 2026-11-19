// ponytail: clean container orchestrating onboarding state, hooks, and presentation views.
// Mirrors .agents/onboarding.html's state machine (s0/s1/chat/saved, teach()/personal()/another()) as
// explicit ChatPhase transitions, since React callbacks (not one linear async script) drive each beat.
// Skipped on purpose vs. the prototype: the "aside" stage-hide while any ordinary (non-crisis) composer is
// focused, and the FLIP fly-in for user chat bubbles — cosmetic, not core behavior.
import React, { useState, useCallback, useRef } from 'react';
import { View, SafeAreaView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { OnboardingStep, ChatPhase, SheetType, MessageSender, ReminderPreset } from '../../domain/enums';
import { GOALS } from '../../domain/goals';
import { TRAP_LABELS } from '../../domain/traps';
import { getShiftCopy, weighBelief, BELIEF_OPTIONS } from '../../domain/scoring';
import { matchesCrisis } from '../../domain/crisis';
import { completeOnboarding } from '../../data/onboardingRepository';

import { useOnboardingStep } from './hooks/useOnboardingStep';
import { useChatMessages } from './hooks/useChatMessages';
import { useReflectionDraft } from './hooks/useReflectionDraft';
import { useReminderSelection } from './hooks/useReminderSelection';
import { useComposerState } from './hooks/useComposerState';
import { useHappiGuideMotion, ActingPose } from './useHappiGuideMotion';

import { OnboardingHeader } from '../presentation/components/OnboardingHeader';
import { HappiStage } from '../presentation/components/HappiStage';
import { HelloStepView } from '../presentation/views/HelloStepView';
import { GoalPickStepView } from '../presentation/views/GoalPickStepView';
import { ThoughtCatcherChatStepView } from '../presentation/views/ThoughtCatcherChatStepView';
import { SavedKeepsakeStepView } from '../presentation/views/SavedKeepsakeStepView';
import { ChatReplyFooter } from '../presentation/components/ChatReplyFooter';
import { OnboardingSheetsModal } from '../presentation/components/OnboardingSheetsModal';
import type { GoalDefinition, ChatMessage } from '../../domain/types';

const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));
// typed thoughts sometimes arrive quoted; strip quotes + trailing punctuation for mid-sentence quoting
const bare = (s: string): string => s.trim().replace(/^["“]([^]*)["”]$/, '$1').replace(/[.!?…]+$/, '');

const CHECK_REPLY: Record<'yes' | 'unsure' | 'no', string> = {
  yes: "It feels true, and that's real. But feeling sure isn't the same as knowing.",
  unsure: "Not being sure is fine. Let's look closer.",
  no: 'So your mind added more than what happened.',
};

function poseForRating(v: number, isAfter: boolean): ActingPose {
  if (isAfter) return ActingPose.Listen;
  if (v >= 3) return ActingPose.Heavy;
  if (v === 0) return ActingPose.Gentle;
  return ActingPose.Listen;
}
function weatherForRating(v: number, isAfter: boolean): number {
  const w = weighBelief(v);
  return isAfter ? Math.min(w, 0.3) : w;
}

export interface OnboardingContainerProps {
  userId?: string;
  onComplete: () => void;
  onRequestSignIn?: () => void;
}

export function OnboardingContainer({
  userId,
  onComplete,
  onRequestSignIn,
}: OnboardingContainerProps): React.JSX.Element {
  const { step, progressFill, progressLabel, goToStep, enterStage, inchProgress, goBack } = useOnboardingStep();
  const { messages, isTyping, setIsTyping, pushMessage } = useChatMessages();
  const {
    reflection, applyGoal, setBeliefRating, startPersonal,
    setPersonalSituation, setPersonalThought, setPersonalFair, setReminder,
  } = useReflectionDraft();
  const reminder = useReminderSelection((p: ReminderPreset): void => setReminder(p));
  const composer = useComposerState();
  const guide = useHappiGuideMotion();

  const [selectedGoal, setSelectedGoal] = useState<GoalDefinition | null>(null);
  const [activeExample, setActiveExample] = useState<GoalDefinition | null>(null);
  const [isHeroPhase, setIsHeroPhase] = useState<boolean>(true);
  const [chatPhase, setChatPhase] = useState<ChatPhase>(ChatPhase.ShowMe);
  const [moreAvailable, setMoreAvailable] = useState<boolean>(true);
  const [activeSheet, setActiveSheet] = useState<SheetType | null>(null);
  const [crisis, setCrisis] = useState<boolean>(false);
  const exampleIndexRef = useRef<number>(0);

  const sayHappi = useCallback(async (text: string, extra?: Partial<ChatMessage>): Promise<void> => {
    guide.look(1.5, -2);
    setIsTyping(true);
    await delay(Math.min(900, 380 + text.length * 7));
    setIsTyping(false);
    guide.look(-1.2, 1.6);
    pushMessage(MessageSender.Happi, text, extra);
    await delay(220);
  }, [guide, pushMessage, setIsTyping]);

  const triggerCrisis = useCallback((): void => {
    setCrisis(true);
    setActiveSheet(SheetType.Help);
  }, []);

  const handleStartHello = useCallback((): void => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    goToStep(OnboardingStep.GoalPick, 0);
    guide.setPose(ActingPose.Rest);
    guide.setWeather(0.35);
  }, [goToStep, guide]);

  const handleSelectGoal = useCallback((g: GoalDefinition): void => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedGoal(g);
    setActiveExample(g);
    exampleIndexRef.current = GOALS.findIndex((goal) => goal.id === g.id);
    setMoreAvailable(true);
    applyGoal(g);
    guide.setPose(g.id);
    guide.setWeather(g.f);
    goToStep(OnboardingStep.Chat, 1);
    setIsHeroPhase(true);
    setChatPhase(ChatPhase.ShowMe);
    pushMessage(MessageSender.Happi, g.mirror, { isHeading: true });
  }, [applyGoal, goToStep, guide, pushMessage]);

  const runTeach = useCallback(async (g: GoalDefinition): Promise<void> => {
    await delay(600);
    await sayHappi(g.thought, { leadText: 'Then this thought shows up:', isQuote: true });
    await sayHappi(`If that happened to you, how much would you believe "${bare(g.thought)}"?`);
    setChatPhase(ChatPhase.RateInitial);
  }, [sayHappi]);

  const handleShowMe = useCallback((): void => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsHeroPhase(false);
    inchProgress();
    if (activeExample) void runTeach(activeExample);
  }, [activeExample, inchProgress, runTeach]);

  const advanceToNextExample = useCallback((): void => {
    const nextIndex = (exampleIndexRef.current + 1) % GOALS.length;
    exampleIndexRef.current = nextIndex;
    const g = GOALS[nextIndex];
    setActiveExample(g);
    applyGoal(g);
    guide.setWeather(g.f);
    guide.setPose(g.id);
    setMoreAvailable(false);
    void runTeach(g);
  }, [applyGoal, guide, runTeach]);

  const handleShowSaved = useCallback((): void => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    goToStep(OnboardingStep.Saved, 3);
    guide.setPose(ActingPose.Pride);
    guide.setWeather(0.08);
    guide.nudge('gx', -2.5, 500);
    guide.nudge('gy', 2, 500);
  }, [goToStep, guide]);

  const afterReality = useCallback(async (before: number): Promise<void> => {
    if (reflection.source === 'personal') {
      await sayHappi("What's another way to see it? Fair and believable, not forced positive.");
      setChatPhase(ChatPhase.PersonalFair);
      return;
    }
    const g = activeExample;
    if (!g) return;
    if (before > 0) {
      guide.setWeather(0.12, true);
      guide.setPose(ActingPose.Relieved);
      guide.stretch();
    } else {
      guide.setWeather(0.12);
      guide.setPose(ActingPose.Listen);
    }
    const trapName = g.trap ? TRAP_LABELS[g.trap] : undefined;
    await sayHappi(g.fair, { leadText: "Here's another way to see it:", isFair: true, why: g.why, trapLabel: trapName });
    await delay(400);
    if (before === 0) {
      guide.setPose(ActingPose.Rest);
      setChatPhase(ChatPhase.AfterTeach);
    } else {
      setChatPhase(ChatPhase.RateShift);
    }
  }, [activeExample, guide, reflection.source, sayHappi]);

  const handleRateBelief = useCallback((rating: number): void => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const isAfter = chatPhase === ChatPhase.RateShift;
    setBeliefRating(rating, isAfter);
    pushMessage(MessageSender.User, BELIEF_OPTIONS[rating]);
    guide.setWeather(weatherForRating(rating, isAfter));
    guide.setPose(poseForRating(rating, isAfter));

    void (async (): Promise<void> => {
      if (!isAfter) {
        if (rating === 0) {
          await sayHappi("Then you don't believe it. Let's look at it anyway.");
          await afterReality(0);
        } else {
          await sayHappi('Is it actually true?');
          setChatPhase(ChatPhase.Reality);
        }
        return;
      }
      const before = reflection.before ?? 0;
      await sayHappi(getShiftCopy(before, rating));
      guide.setPose(ActingPose.Rest);
      if (reflection.source === 'personal') handleShowSaved();
      else setChatPhase(ChatPhase.AfterTeach);
    })();
  }, [chatPhase, guide, afterReality, handleShowSaved, pushMessage, reflection.before, reflection.source, sayHappi, setBeliefRating]);

  const handleReality = useCallback((answer: 'yes' | 'unsure' | 'no'): void => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    pushMessage(MessageSender.User, answer === 'yes' ? 'Yes' : answer === 'unsure' ? 'Not sure' : 'No');
    if (answer === 'yes') guide.setPose(ActingPose.Gentle);
    else guide.nod();
    void (async (): Promise<void> => {
      await sayHappi(CHECK_REPLY[answer]);
      await afterReality(reflection.before ?? 0);
    })();
  }, [afterReality, guide, pushMessage, reflection.before, sayHappi]);

  const handleTryMine = useCallback((): void => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    pushMessage(MessageSender.User, 'Try with something from today');
    startPersonal();
    guide.setWeather(0.6);
    guide.setPose(ActingPose.Listen);
    void (async (): Promise<void> => {
      await sayHappi('What happened? Just what a camera would have seen.');
      setChatPhase(ChatPhase.PersonalSituation);
    })();
  }, [guide, pushMessage, sayHappi, startPersonal]);

  const handleAnotherExample = useCallback((): void => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    pushMessage(MessageSender.User, 'Another example');
    advanceToNextExample();
  }, [advanceToNextExample, pushMessage]);

  const handleSaveThisOne = useCallback((): void => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    pushMessage(MessageSender.User, 'Save this one');
    handleShowSaved();
  }, [handleShowSaved, pushMessage]);

  const handlePersonalSkip = useCallback((): void => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    pushMessage(MessageSender.User, moreAvailable ? 'Skip, show an example' : 'Skip for now');
    composer.clearText();
    void (async (): Promise<void> => {
      if (moreAvailable) {
        await sayHappi("Here's a different one.");
        advanceToNextExample();
      } else {
        await sayHappi('No problem. Want to try one of yours, or move on?');
        setChatPhase(ChatPhase.AfterTeach);
      }
    })();
  }, [advanceToNextExample, composer, moreAvailable, pushMessage, sayHappi]);

  const handleSubmitPersonalSituation = useCallback((): void => {
    const text = composer.text.trim();
    if (!text) { handlePersonalSkip(); return; }
    if (matchesCrisis(text)) { triggerCrisis(); return; }
    pushMessage(MessageSender.User, text);
    setPersonalSituation(text);
    composer.clearText();
    void (async (): Promise<void> => {
      await sayHappi('What did your mind add? Write it the way it showed up.');
      setChatPhase(ChatPhase.PersonalThought);
    })();
  }, [composer, handlePersonalSkip, pushMessage, sayHappi, setPersonalSituation, triggerCrisis]);

  const handleSubmitPersonalThought = useCallback((): void => {
    const text = composer.text.trim();
    if (!text) { handlePersonalSkip(); return; }
    if (matchesCrisis(text)) { triggerCrisis(); return; }
    pushMessage(MessageSender.User, text);
    setPersonalThought(text);
    composer.clearText();
    guide.nod();
    void (async (): Promise<void> => {
      await sayHappi(`How much do you believe "${bare(text)}" right now?`);
      setChatPhase(ChatPhase.RateInitial);
    })();
  }, [composer, guide, handlePersonalSkip, pushMessage, sayHappi, setPersonalThought, triggerCrisis]);

  const handleSubmitPersonalFair = useCallback((): void => {
    const text = composer.text.trim();
    if (!text) { handlePersonalSkip(); return; }
    if (matchesCrisis(text)) { triggerCrisis(); return; }
    pushMessage(MessageSender.User, text);
    setPersonalFair(text);
    composer.clearText();
    const before = reflection.before ?? 0;
    if (before > 0) { guide.setWeather(0.15, true); guide.setPose(ActingPose.Relieved); guide.stretch(); }
    else { guide.setWeather(0.15); guide.setPose(ActingPose.Listen); }
    if (before === 0) { handleShowSaved(); return; }
    void (async (): Promise<void> => {
      await sayHappi(`Look at "${bare(reflection.thought)}" again. How much do you believe it now?`);
      setChatPhase(ChatPhase.RateShift);
    })();
  }, [composer, guide, handlePersonalSkip, handleShowSaved, pushMessage, reflection.before, reflection.thought, sayHappi, setPersonalFair, triggerCrisis]);

  const handleFinish = useCallback(async (): Promise<void> => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await completeOnboarding(userId, reflection);
    onComplete();
  }, [userId, reflection, onComplete]);

  const handleBack = useCallback((): void => {
    if (step === OnboardingStep.Chat) setActiveSheet(SheetType.Leave);
    else goBack();
  }, [step, goBack]);

  const currentGoalId = activeExample?.id ?? selectedGoal?.id ?? null;

  return (
    <SafeAreaView className="flex-1 bg-happy-bg">
      <OnboardingHeader
        showBack={step !== OnboardingStep.Hello && step !== OnboardingStep.Saved}
        showProgress={step !== OnboardingStep.Hello && step !== OnboardingStep.Saved}
        progressFill={progressFill}
        progressLabel={progressLabel}
        onBack={handleBack}
        crisisActive={crisis}
        onGetHelp={(): void => setActiveSheet(SheetType.Help)}
      />

      <View className="flex-1">
        {step === OnboardingStep.Hello && (
          <HelloStepView
            guideStage={<HappiStage motion={guide} size="full" width={220} />}
            onHiPress={handleStartHello}
            onWhoPress={(): void => setActiveSheet(SheetType.Who)}
            onSignInPress={(): void => (onRequestSignIn ? onRequestSignIn() : setActiveSheet(SheetType.SignIn))}
          />
        )}

        {step === OnboardingStep.GoalPick && (
          <GoalPickStepView
            goals={GOALS}
            selectedGoalId={selectedGoal?.id ?? null}
            guideStage={crisis ? null : <HappiStage motion={guide} size="ask" width={92} />}
            onSelectGoal={handleSelectGoal}
          />
        )}

        {step === OnboardingStep.Chat && (
          <ThoughtCatcherChatStepView
            messages={messages}
            isTyping={isTyping}
            isHeroPhase={isHeroPhase}
            heroMirrorText={selectedGoal?.mirror ?? ''}
            activeSceneGoalId={crisis ? null : currentGoalId}
            activeSceneCaption={crisis ? null : activeExample?.scene ?? null}
            motion={guide}
            onShowMe={handleShowMe}
            footerReplyView={
              <ChatReplyFooter
                phase={chatPhase}
                composerText={composer.text}
                moreExamplesAvailable={moreAvailable}
                personalStarters={{ situation: activeExample?.ideas.sit ?? [], thought: activeExample?.ideas.th ?? [] }}
                onRateBelief={handleRateBelief}
                onReality={handleReality}
                onTryMine={handleTryMine}
                onAnotherExample={handleAnotherExample}
                onSaveThisOne={handleSaveThisOne}
                onChangeComposerText={composer.setText}
                onSelectStarter={composer.applyStarter}
                onSubmitPersonal={
                  chatPhase === ChatPhase.PersonalSituation ? handleSubmitPersonalSituation
                    : chatPhase === ChatPhase.PersonalThought ? handleSubmitPersonalThought
                      : handleSubmitPersonalFair
                }
                onSkipPersonal={handlePersonalSkip}
              />
            }
          />
        )}

        {step === OnboardingStep.Saved && (
          <SavedKeepsakeStepView
            reflection={reflection}
            reminderStatus={reminder.status}
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
          onRequestSignIn?.();
        }}
      />
    </SafeAreaView>
  );
}

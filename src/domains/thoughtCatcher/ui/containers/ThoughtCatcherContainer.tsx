// ponytail: state and side effects for the Thought Catcher wizard (.agents/thought-catcher.html). Step order,
// rules and copy live in domain/; JSX lives in ThoughtCatcherView. Saves to the app's real exercise entry,
// the coping-card store and home's local reflections.
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Keyboard } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { randomUUID } from 'expo-crypto';
import * as Haptics from 'expo-haptics';
import { HappiStage } from '@/src/domains/onboarding/ui/presentation/components/HappiStage';
import { useHappiGuideMotion } from '@/src/domains/onboarding/ui/containers/useHappiGuideMotion';
import { ActingPose } from '@/src/domains/onboarding/ui/containers/happiPoses';
import { matchesCrisis } from '@/src/domains/onboarding/domain/crisis';
import { useExerciseMutation } from '@/src/hooks/useExerciseMutation';
import { useCopingCards } from '@/src/hooks/useCopingCards';
import { useAuth } from '@/src/context/AuthContext';
import { acknowledgePracticeCompletion } from '@/src/domains/practice/data/practiceCompletion.repo';
import { buildExerciseRoute } from '@/src/screens/ExercisesScreen/exerciseScreenUtils';
import { freshDraft, type ThoughtCatcherDraft } from '../../domain/types';
import { splitTraps, type TrapChoice } from '@/src/domains/exercises/domain/trap';
import { isHardEntry, type MoodBand } from '@/src/domains/exercises/domain/mood';
import { readBandToday } from '@/src/domains/exercises/data/moodBand.repo';
import { usePracticeCounts } from '@/src/domains/exercises/ui/containers/usePracticeCounts';
import { useTrapPicks } from '@/src/domains/exercises/ui/containers/useTrapPicks';
import { getRecentThoughts } from '@/src/domains/home/data/reflectionsStorage';
import { pickExample, pickStems } from '@/src/domains/exercises/domain/rotation';
import { STAGE_NAMES, WRITING_RULES, canContinue, isWritingStep, nextLabel, nextStep, prevStep, stageIndexOf, stageProgress, writingIsValid, type StepId, type StepUpChoice, type WritingKey } from '../../domain/steps';
import { hasSeenIntro, markIntroSeen } from '../../data/introSeen';
import { prependStarter } from '../../domain/text';
import { saveThoughtCatcherReflection } from '../../data/saveReflection';
import { buildEntryPayload, ymd } from '../../data/buildEntryPayload';
import { clearPausedEntry, readPausedEntry, writePausedEntry } from '../../data/pausedEntry';
import { readCaughtResponse } from '../../data/caughtEntry';
import { dropQueued, queueSave, readOutbox } from '../../data/outbox';
import type { SavedVariant } from '../presentation/components/SavedEntryCard';
import { ThoughtCatcherView } from '../presentation/views/ThoughtCatcherView';

export function ThoughtCatcherContainer(): React.JSX.Element {
  const [step, setStep] = useState<StepId>('intro');
  const [firstStep, setFirstStep] = useState<StepId | null>(null); // 'intro' shows the first-time intro, 'thought' skips it
  const [stepUpChoice, setStepUpChoice] = useState<StepUpChoice>(null); // the row is offered once per sitting
  const [recent, setRecent] = useState<string[]>([]);
  const [moreOpen, setMoreOpen] = useState(false);
  const { data: { picks, fairCount } = { picks: [], fairCount: 0 } } = useTrapPicks();
  const [entryId, setEntryId] = useState(() => randomUUID()); // one sitting, one row
  const startedAt = useRef(new Date()); // selected_date is fixed at sitting start (AD-25)
  const [draft, setDraft] = useState<ThoughtCatcherDraft>(freshDraft());
  const [crisis, setCrisis] = useState(false); // lasts the whole session: Happi never comes back after a crisis phrase
  const [helpOpen, setHelpOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [bandToday, setBandToday] = useState<MoodBand | null | undefined>(undefined); // undefined while read; null = none or unreadable
  const [toast, setToast] = useState<string | null>(null);
  const [sync, setSync] = useState<'pending' | 'synced' | 'queued'>('pending'); // pending until a write is acknowledged or queued;
  const motion = useHappiGuideMotion();
  const { save } = useExerciseMutation();
  const { user } = useAuth();
  const launch = useLocalSearchParams<{ practiceSessionId?: string; pathId?: string; pathVersion?: string; practiceSource?: string; practiceId?: string }>();
  const completionAcked = useRef(false); // one completion record per sitting
  const { saveCard } = useCopingCards();
  const crisisTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // AD-21: pure on the count of earlier rung-3 entries
  const { stems, example } = useMemo(() => ({ stems: pickStems(fairCount), example: pickExample(fairCount) }), [fairCount]);

  // chips keep their order once a trap is picked, so the refetch that includes this sitting's own row can't move them
  const split = useRef(splitTraps(picks));
  if (draft.trap === null) split.current = splitTraps(picks);

  // AD-19: the hard-entry rule runs when the summary opens; a failed mood read means no band
  useEffect(() => {
    setBandToday(undefined);
    if (step !== 'summary') return;
    if (!user?.id) { setBandToday(null); return; }
    let live = true; // a read from an earlier visit must not overwrite this one
    const done = (band: MoodBand | null) => { if (live) setBandToday(band); };
    readBandToday(user.id, new Date()).then(done, () => done(null));
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const hard = bandToday !== undefined && isHardEntry({ trap: draft.trap, intensity: draft.intensity, post: draft.checked ? draft.post : null, bandToday });
  const variant: SavedVariant | null = step !== 'summary' || bandToday === undefined ? null : hard ? 'hard' : draft.checked ? 'standard' : 'caught';
  const { data: counts } = usePracticeCounts();

  useEffect(() => {
    if (variant) {
      motion.setPose(variant === 'hard' ? ActingPose.Gentle : ActingPose.Pride);
      if (variant === 'standard') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      else Haptics.impactAsync(variant === 'caught' ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Soft);
    } else if (step !== 'summary') motion.setPose(ActingPose.Catch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, variant]);

  useEffect(() => {
    void (async () => {
      const seen = await hasSeenIntro();
      if (!seen) void markIntroSeen();
      // AD-14: an unfinished fair thought restores its id, date, step and text onto the same row
      const paused = await readPausedEntry();
      let caught: Awaited<ReturnType<typeof readCaughtResponse>> = null;
      let unreadable = false; // offline or guest: keep the draft, start a fresh sitting meanwhile
      if (paused) try { caught = await readCaughtResponse(paused.entryId); } catch { unreadable = true; }
      if (paused && caught) {
        const [y, m, d] = paused.selectedDate.split('-').map(Number);
        startedAt.current = new Date(y, m - 1, d);
        setEntryId(paused.entryId);
        setDraft({ ...freshDraft(), situation: caught.situation ?? '', thought: caught.automaticThought, trap: caught.trap ?? null, intensity: caught.intensity, balanced: paused.text });
        setStepUpChoice('write');
        setFirstStep('thought');
        setStep('balanced');
        return;
      }
      // row confirmed missing and not waiting in the outbox, so the draft is stale
      if (paused && !unreadable && !(await readOutbox()).some((x) => x.id === paused.entryId)) void clearPausedEntry();
      setFirstStep(seen ? 'thought' : 'intro');
      if (seen) setStep('thought');
    })();
    void getRecentThoughts(3).then(setRecent);
  }, []);

  useEffect(() => {
    const show = Keyboard.addListener('keyboardWillShow', () => setTyping(true));
    const hide = Keyboard.addListener('keyboardWillHide', () => setTyping(false));
    return () => { show.remove(); hide.remove(); clearTimeout(crisisTimer.current); clearTimeout(toastTimer.current); };
  }, []);

  const flash = useCallback((message: string) => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }, []);

  const openHelp = useCallback(() => { setCrisis(true); setHelpOpen(true); }, []);

  // opens once per run; the next Continue goes through
  const crisisCheck = useCallback((text: string): boolean => {
    if (draft.helpShown || !matchesCrisis(text)) return false;
    setDraft((d) => ({ ...d, helpShown: true }));
    openHelp();
    return true;
  }, [draft.helpShown, openHelp]);

  const persistText = useCallback((text: string) => {
    void writePausedEntry({ entryId, selectedDate: ymd(startedAt.current), text });
  }, [entryId]);

  const onWrite = useCallback((key: WritingKey, value: string) => {
    if (key === 'balanced') persistText(value);
    setDraft((d) => ({ ...d, [key]: value, ...(key === 'thought' && { trap: null, post: null, isTrue: null, cardSaved: false }), ...(key === 'balanced' && { post: null, cardSaved: false }) }));
    clearTimeout(crisisTimer.current);
    crisisTimer.current = setTimeout(() => crisisCheck(value), 1500);
  }, [crisisCheck, persistText]);

  const onStarter = useCallback((starter: string) => {
    const text = prependStarter(draft.balanced, starter);
    persistText(text);
    setDraft((d) => ({ ...d, balanced: text, post: null, cardSaved: false }));
  }, [draft.balanced, persistText]);

  const onRate = useCallback((key: 'intensity' | 'post', value: number) => {
    setDraft((d) => (key === 'intensity' ? { ...d, intensity: value, post: null } : { ...d, post: value }));
  }, []);

  // AD-26: a failed or user-less write is queued by entry id instead of swallowed
  const persist = useCallback(async (d: ThoughtCatcherDraft): Promise<boolean> => {
    const payload = buildEntryPayload(d, startedAt.current);
    setSync('pending');
    try {
      await save(payload, entryId);
      void dropQueued(entryId);
      setSync('synced');
      return true;
    } catch {
      await queueSave(entryId, payload);
      setSync('queued');
      return false;
    }
  }, [save, entryId]);

  // AD-14: answering the trap step is the first durable write; re-answering upserts the same id
  const onTrap = useCallback(async (trap: TrapChoice) => {
    Haptics.selectionAsync();
    const next = { ...draft, trap };
    setDraft(next);
    if (trap === 'none') void clearPausedEntry(); // no step-up after "None of these", so no draft
    // the local reflection below always saves, so Home counts the entry even when the write is queued
    if (await persist(next)) {
      const { practiceSessionId, pathId, pathVersion, practiceSource, practiceId } = launch;
      if (!completionAcked.current && user?.id && practiceSessionId && pathId && pathVersion && practiceSource && practiceId) {
        try {
          await acknowledgePracticeCompletion({ userId: user.id, practiceSessionId, pathId, pathVersion: Number(pathVersion), practiceRef: { source: practiceSource, id: practiceId } });
          completionAcked.current = true;
        } catch { /* ponytail: the ack retries on the next trap answer */ }
      }
    }
    await saveThoughtCatcherReflection(next, entryId);
  }, [persist, launch, user, entryId]);

  // AD-14: a fair thought upgrades the same row to rung 3 and ends the draft
  const saveFair = useCallback(async () => {
    const next = { ...draft, checked: true };
    setDraft(next);
    await persist(next);
    await saveThoughtCatcherReflection(next, entryId);
    await clearPausedEntry(); // saved or queued, the text now lives in the row or the outbox
  }, [draft, persist, entryId]);

  const onStepUp = useCallback((choice: 'write' | 'stop') => {
    setStepUpChoice(choice);
    if (choice === 'stop') { void clearPausedEntry(); setStep('summary'); return; }
    persistText(draft.balanced);
    setStep('balanced');
  }, [draft.balanced, persistText]);

  const onNext = useCallback(() => {
    if (step === 'summary') { router.back(); return; }
    if (isWritingStep(step) && crisisCheck(draft[step])) return;
    if (!canContinue(step, draft)) return;
    if (step === 'rate2') { void saveFair(); setStep('summary'); return; }
    setStep(nextStep(step, draft.trap, stepUpChoice));
  }, [step, draft, crisisCheck, stepUpChoice, saveFair]);

  const prev = firstStep !== null && step !== firstStep ? prevStep(step, draft.checked) : null;
  const onBack = useCallback(() => { if (prev) setStep(prev); }, [prev]);

  const onClose = useCallback(() => {
    // before the trap answer nothing is saved yet; after it the catch is already kept
    if (step === 'intro' || step === 'thought' || draft.trap !== null) { router.back(); return; }
    Alert.alert('Leave this exercise?', 'What you wrote so far won’t be saved.', [
      { text: 'Keep going', style: 'cancel' },
      { text: 'Leave', style: 'destructive', onPress: () => router.back() },
    ]);
  }, [step, draft.trap]);

  const onSaveCard = useCallback(async () => {
    if (draft.cardSaved || !draft.balanced.trim()) return;
    try {
      await saveCard({ exercise_type: 'thought_catcher', original_thought: draft.thought.trim(), reframe_text: draft.balanced.trim(), reframe_label: 'Balanced thought' });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setDraft((d) => ({ ...d, cardSaved: true }));
      flash('Saved to coping cards');
    } catch {
      flash('Could not save this coping card. Try again.');
    }
  }, [draft, saveCard, flash]);

  const progress = stageProgress(step, draft.checked);
  const hint = isWritingStep(step) && !writingIsValid(step, draft[step]) ? WRITING_RULES[step].hint : '';
  const stageIndex = stageIndexOf(step);
  const progressText = step === 'intro' ? 'Not started' : step === 'summary' ? 'Done' : step === 'stepUp' ? 'Caught, one more step is optional' : `${STAGE_NAMES[stageIndex]}, part ${stageIndex + 1} of ${STAGE_NAMES.length}`;

  if (firstStep === null) return <></>; // intro-seen flag and any paused draft still loading
  const { top, rest } = split.current;

  return (
    <ThoughtCatcherView
      step={step}
      draft={draft}
      progress={progress}
      progressText={progressText}
      canGoBack={prev !== null}
      nextLabel={nextLabel(step)}
      nextEnabled={canContinue(step, draft)}
      hint={hint}
      recent={recent}
      topTraps={top}
      moreTraps={rest}
      moreOpen={moreOpen}
      typing={typing}
      helpOpen={helpOpen}
      toast={toast}
      happi={crisis ? undefined : (width) => <HappiStage motion={motion} size="scene" width={width} />}
      onBack={onBack}
      onNext={onNext}
      stems={stems}
      example={example}
      onStepUp={onStepUp}
      onTrap={(trap) => void onTrap(trap)}
      onMore={() => setMoreOpen(true)}
      onHelp={openHelp}
      onCloseHelp={() => setHelpOpen(false)}
      onClose={onClose}
      onWrite={onWrite}
      onStarter={onStarter}
      onRate={onRate}
      onSaveCard={() => void onSaveCard()}
      variant={variant}
      counts={sync === 'synced' ? counts : undefined}
      sync={sync === 'queued' ? 'queued' : 'synced'}
      onBreathe={() => router.push(buildExerciseRoute('mindful_breathing_1min') as never)}
      onGoDeeper={() => router.push(buildExerciseRoute('thought_reframing') as never)}
    />
  );
}

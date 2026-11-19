// ponytail: pure JSX for every step of .agents/thought-catcher.html — all state and handlers arrive as props
// from ThoughtCatcherContainer. Step order, copy and rules live in domain/.
import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { TRAP_LABEL_KEYS, trapDefinitionKey, type TrapChoice } from '@/src/domains/exercises/domain/trap';
import type { CognitiveDistortionKey } from '@/src/screens/ThoughtReframingScreen/types';
import { ExerciseArt } from '@/src/domains/exercises/ui/presentation/components/ExerciseArt';
import type { ExampleId, StemId } from '@/src/domains/exercises/domain/rotation';
import type { StepId, WritingKey } from '../../../domain/steps';
import type { ThoughtCatcherDraft } from '../../../domain/types';
import { compareLine } from '../../../domain/scoring';
import { tidy } from '../../../domain/text';
import { AskHeader } from '../components/AskHeader';
import { SentenceBubble } from '../components/SentenceBubble';
import { WritingField, type WritingKind } from '../components/WritingField';
import { QuickReplies } from '../components/QuickReplies';
import { BelievabilityScale } from '../components/BelievabilityScale';
import { ExerciseHeader, ExerciseFooter, Toast } from '../components/ExerciseChrome';
import { CrisisSheet } from '../components/CrisisSheet';
import { SavedEntryCard, type SavedVariant } from '../components/SavedEntryCard';

const THOUGHT_EXAMPLES = [1, 2, 3, 4] as const;

const WRITING: Record<WritingKey, { q: string; sub: string; kind: WritingKind; placeholder: string; label: string; max: number; examples: readonly string[] }> = {
  thought: { q: '', sub: 'Write it the way it showed up, even if it sounds harsh.', kind: 'bubble', placeholder: 'I always say the wrong thing.', label: 'What thought keeps coming back', max: 300, examples: [] },
  balanced: { q: '', sub: 'Aim for something fair and believable, not forced positive.', kind: 'frame', placeholder: 'It’s possible that…', label: 'A fairer way to say it', max: 300, examples: [] },
};

export interface ThoughtCatcherViewProps {
  step: StepId;
  draft: ThoughtCatcherDraft;
  progress: number[];
  progressText: string;
  canGoBack: boolean;
  nextLabel: string;
  nextEnabled: boolean;
  hint: string;
  recent: readonly string[];
  topTraps: readonly CognitiveDistortionKey[];
  moreTraps: readonly CognitiveDistortionKey[];
  moreOpen: boolean;
  typing: boolean;
  helpOpen: boolean;
  toast: string | null;
  /** Happi at the requested width; undefined once a crisis phrase has been seen */
  happi?: (width: number) => React.ReactNode;
  onBack: () => void;
  onNext: () => void;
  onHelp: () => void;
  onCloseHelp: () => void;
  onClose: () => void;
  onWrite: (key: WritingKey, value: string) => void;
  onStarter: (starter: string) => void;
  onRate: (key: 'intensity' | 'post', value: number) => void;
  /** AD-21: three stem numbers and one example number for this sitting */
  stems: readonly StemId[];
  example: ExampleId;
  onStepUp: (choice: 'write' | 'stop') => void;
  onTrap: (trap: TrapChoice) => void;
  onMore: () => void;
  onSaveCard: () => void;
  onGoDeeper: () => void;
  /** saved card variant; null while the check-in band is still being read */
  variant: SavedVariant | null;
  counts?: { lifetime: number; thisWeek: number };
  /** AD-26: queued shows the unsynced line instead of the counts */
  sync: 'synced' | 'queued';
  onBreathe: () => void;
}

export function ThoughtCatcherView(p: ThoughtCatcherViewProps): React.JSX.Element {
  const { step, draft } = p;
  const { t } = useTranslation('exercises');
  const post = draft.post ?? draft.intensity;

  const ask = (q: string, sub?: string, width = 84) => (
    <AskHeader question={q} sub={sub} happi={p.happi?.(width)} happiHidden={p.typing} />
  );

  const writing = (key: WritingKey) => {
    const w = WRITING[key];
    const value = draft[key];
    const question = key === 'thought' ? t('thoughtCatcher.question.thought') : t('thoughtCatcher.question.fair');
    const examples = key === 'thought' ? THOUGHT_EXAMPLES.map((n) => t(`thoughtCatcher.example.thought.${n}`)) : [t(`thoughtCatcher.example.fair.${p.example}`)];
    return (
      <>
        {key === 'balanced' && <SentenceBubble situation={draft.situation} thought={draft.thought} />}
        {ask(question, w.sub)}
        <WritingField kind={w.kind} value={value} placeholder={w.placeholder} label={w.label} maxLength={w.max} onChange={(v) => p.onWrite(key, v)} />
        <Text className="mt-2 min-h-[18px] text-t-foot font-semibold text-happy-label-2" accessibilityLiveRegion="polite">{p.hint}</Text>
        {key === 'thought' && p.recent.length > 0 && !value.trim() && (
          <Text className="mt-4 text-t-foot font-semibold text-happy-label-2">{t('thoughtCatcher.recentThoughts')}</Text>
        )}
        {key === 'thought' && <QuickReplies items={p.recent} selected={value} hidden={!!value.trim()} onPick={(x) => p.onWrite(key, x)} />}
        <QuickReplies items={examples} selected={value} hidden={!!value.trim()} onPick={(x) => p.onWrite(key, x)} />
        {key === 'balanced' && <QuickReplies items={p.stems.map((n) => t(`thoughtCatcher.stem.${n}`))} onPick={(stem) => p.onStarter(`${stem} `)} />}
      </>
    );
  };

  const trapChip = (choice: TrapChoice) => {
    const on = draft.trap === choice;
    return (
      <Pressable key={choice} onPress={() => p.onTrap(choice)} accessibilityRole="radio" accessibilityState={{ selected: on }} accessibilityHint={on ? t('thoughtCatcher.trapSelectedA11y') : undefined} className="min-h-11 max-w-full justify-center rounded-pill px-4 py-2" style={{ backgroundColor: on ? '#eef3ea' : '#f7f7f7', borderWidth: 2, borderColor: on ? '#5f7f58' : 'transparent' }}>
        <Text className="text-t-sub font-semibold leading-[20px] text-happy-label">{t(TRAP_LABEL_KEYS[choice])}</Text>
      </Pressable>
    );
  };

  const trapStep = (
    <>
      <Text className="mb-4 text-t-lead font-medium leading-[28px] text-happy-label-2">“{tidy(draft.thought)}”</Text>
      {ask(t('thoughtCatcher.question.trap'))}
      <View className="flex-row flex-wrap gap-2" accessibilityRole="radiogroup">
        {p.topTraps.map(trapChip)}
        {p.moreOpen
          ? p.moreTraps.map(trapChip)
          : p.moreTraps.length > 0 && (
            <Pressable onPress={p.onMore} accessibilityRole="button" className="min-h-11 justify-center rounded-pill px-4 py-2" style={{ backgroundColor: '#f7f7f7' }}>
              <Text className="text-t-sub font-semibold text-happy-label-2">{t('thoughtCatcher.trapMore')}</Text>
            </Pressable>
          )}
      </View>
      <View className="mt-2 flex-row flex-wrap gap-2" accessibilityRole="radiogroup">
        {trapChip('not_sure')}
        {trapChip('none')}
      </View>
      <Text className="mt-3 min-h-[18px] text-t-foot font-semibold text-happy-label-2" accessibilityLiveRegion="polite">
        {draft.trap && draft.trap !== 'not_sure' && draft.trap !== 'none' ? t(trapDefinitionKey(draft.trap)) : ''}
      </Text>
    </>
  );

  const rate = (key: 'intensity' | 'post') => {
    const second = key === 'post';
    const q = second ? 'How believable does it feel now?' : 'How believable does it feel?';
    return (
      <View className="flex-1">
        <SentenceBubble situation={draft.situation} thought={second ? draft.balanced : draft.thought} lead={second ? 'I could think' : 'my mind said'} />
        {ask(q, second ? 'Any answer is fine.' : undefined)}
        <BelievabilityScale
          value={second ? post : draft.intensity}
          was={second ? draft.intensity : undefined}
          label={q}
          note={second ? compareLine(draft.intensity, post) : undefined}
          onChange={(v) => p.onRate(key, v)}
        />
      </View>
    );
  };

  const stepUpOption = (choice: 'write' | 'stop', label: string) => (
    <Pressable onPress={() => p.onStepUp(choice)} accessibilityRole="button" className="min-h-14 items-center justify-center rounded-pill bg-happy-surface-2 px-5 active:scale-[0.97]">
      <Text className="text-t-body font-bold text-happy-label">{label}</Text>
    </Pressable>
  );

  const verdict = (title: string, sub: string, width = 72) => (
    <View className="mb-4 flex-row items-center gap-3">
      {p.happi && <View style={{ width, aspectRatio: 220 / 246 }}>{p.happi(width)}</View>}
      <View className="flex-1">
        <Text accessibilityRole="header" className="font-display text-t-h font-bold leading-[28px] text-happy-label">{title}</Text>
        <Text className="mt-1 text-t-sub font-medium leading-[22px] text-happy-label-2">{sub}</Text>
      </View>
    </View>
  );

  const deeper = (
    <Pressable onPress={p.onGoDeeper} accessibilityRole="link" className="mt-2 min-h-11 flex-row items-center gap-1 self-start">
      <Text className="text-t-sub font-semibold text-happy-accent underline">Go deeper: Thought Reframing</Text>
      <Feather name="chevron-right" size={18} color="#44633f" />
    </Pressable>
  );

  const caught = (
    <>
      {verdict('Thought caught.', 'Catching it is the skill. You can check it any time.')}
      <Text className="rounded-3xl bg-happy-surface p-4 text-t-lead font-medium leading-[28px] text-happy-label">“{tidy(draft.thought)}”</Text>
    </>
  );

  const stepUpStep = (
    <>
      {caught}
      <Text className="mb-4 mt-6 text-t-lead font-medium leading-[28px] text-happy-label-2">{t('thoughtCatcher.stepUp.body')}</Text>
      <View className="gap-3">
        {stepUpOption('write', t('thoughtCatcher.stepUp.write'))}
        {stepUpOption('stop', t('thoughtCatcher.stepUp.stop'))}
      </View>
    </>
  );

  const summary = () => {
    if (p.variant === null) return null;
    const hard = p.variant === 'hard';
    const trapName = draft.trap && draft.trap !== 'not_sure' && draft.trap !== 'none' ? t(TRAP_LABEL_KEYS[draft.trap]) : undefined;
    return (
      <>
        {p.happi && <View className="mb-3" style={{ width: 64, aspectRatio: 220 / 246 }}>{p.happi(64)}</View>}
        <SavedEntryCard variant={p.variant} thought={tidy(draft.thought)} fairer={tidy(draft.balanced)} before={draft.intensity} after={draft.post} trapName={trapName} counts={p.counts} sync={p.sync} />
        {!hard && draft.checked && (
          <Pressable
            onPress={p.onSaveCard}
            disabled={draft.cardSaved}
            accessibilityRole="button"
            className="mt-4 min-h-14 flex-row items-center justify-center gap-2 rounded-pill bg-happy-surface-2 px-5"
            style={{ opacity: draft.cardSaved ? 0.7 : 1 }}
          >
            <Feather name={draft.cardSaved ? 'check' : 'bookmark'} size={20} color="#142414" />
            <Text className="text-t-body font-bold text-happy-label">{draft.cardSaved ? 'Saved to coping cards' : 'Save for a difficult moment'}</Text>
          </Pressable>
        )}
        {!hard && deeper}
      </>
    );
  };

  return (
    <View className="flex-1 bg-happy-bg">
      <ExerciseHeader progress={p.progress} progressText={p.progressText} canGoBack={p.canGoBack} onBack={p.onBack} onHelp={p.onHelp} onClose={p.onClose} />

      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {step === 'intro' && (
          <>
            <Text className="mb-3 text-t-foot font-semibold text-happy-label-2">Thought Catcher · 3 to 5 min · private to you</Text>
            <View className="overflow-hidden rounded-3xl" style={{ backgroundColor: '#e6f0e2', aspectRatio: 160 / 96 }}>
              <ExerciseArt type="thought_catcher" />
            </View>
            {ask('Caught a stressful thought?')}
            <Text className="text-t-lead font-medium leading-[28px] text-happy-label-2">
              When <Text className="text-t-foot text-happy-label-3" style={{ textDecorationLine: 'underline', textDecorationStyle: 'dashed' }}>{'  moment  '}</Text>, my mind said <Text className="text-t-foot text-happy-label-3" style={{ textDecorationLine: 'underline', textDecorationStyle: 'dashed' }}>{'  thought  '}</Text>.
            </Text>
          </>
        )}
        {step === 'thought' && writing('thought')}
        {step === 'trap' && trapStep}
        {step === 'stepUp' && stepUpStep}
        {step === 'balanced' && writing('balanced')}
        {step === 'rate2' && rate('post')}
        {step === 'summary' && summary()}
      </ScrollView>

      {step === 'summary' && p.variant === 'hard' && (
        <View className="items-center px-4 pb-6">
          <Pressable onPress={p.onBreathe} accessibilityRole="button" className="min-h-14 w-full items-center justify-center rounded-pill border border-[#767676] bg-white px-5">
            <Text className="text-t-body font-bold text-happy-label">{t('thoughtCatcher.saved.breathe')}</Text>
          </Pressable>
        </View>
      )}
      {step !== 'stepUp' && (
        <ExerciseFooter
          nextLabel={step === 'summary' ? t('thoughtCatcher.saved.home') : p.nextLabel}
          nextEnabled={p.nextEnabled}
          onNext={p.onNext}
        />
      )}
      {step === 'summary' && p.variant === 'hard' && (
        <Pressable onPress={p.onHelp} accessibilityRole="button" className="mb-6 min-h-11 items-center justify-center self-center rounded-pill border border-[#767676] px-4">
          <Text className="text-t-sub font-bold text-happy-label">Get help</Text>
        </Pressable>
      )}
      <Toast message={p.toast} />
      <CrisisSheet visible={p.helpOpen} onClose={p.onCloseHelp} />
    </View>
  );
}

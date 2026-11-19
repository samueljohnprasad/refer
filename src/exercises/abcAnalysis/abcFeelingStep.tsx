// ponytail: "what did you feel" as ten faces, up to three (.agents/abc-analysis.html's feelings grid).
// The saved value keeps the app's existing format: emotion names joined by ", " (see customStepShared).
import React, { useMemo, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Feather } from '@expo/vector-icons';
import type { ABCAnalysisResponse, StepProps } from '@/src/types/exerciseFlow';
import { HelpSheetModal } from '@/src/domains/home/ui/containers/HelpRowWithSheet';
import { AbcAsk } from './abcAsk';
import { AbcFace } from './abcFaces';
import { AbcSentenceBubble } from './abcSentenceBubble';
import { ABC_MAX_FEEL, abcSentence } from './abcDomain';
import { ABC_EMOTION_OPTIONS, abcFeelPhrase, createEmotionSelectionStorage, getABCEmotionTokenState } from './customStepShared';
import { isAbcCrisisSeen } from './useAbcCrisisGuard';

export function AbcFeelingStep({ response, onUpdate, readOnly }: StepProps<ABCAnalysisResponse>): React.JSX.Element {
  const selected = useMemo(() => getABCEmotionTokenState(response.consequenceEmotion).recognized, [response.consequenceEmotion]);
  const [note, setNote] = useState('');
  const [helpOpen, setHelpOpen] = useState(false);
  const full = selected.length >= ABC_MAX_FEEL;

  const toggle = (name: string) => {
    if (readOnly) return;
    const on = selected.includes(name);
    if (!on && full) { setNote('Up to 3. Tap one to swap it out.'); return; }
    setNote('');
    Haptics.selectionAsync().catch(() => {});
    const next = on ? selected.filter((n) => n !== name) : [...selected, name];
    onUpdate({ consequenceEmotion: createEmotionSelectionStorage(response.consequenceEmotion).serialize(next) });
  };

  return (
    <View>
      <AbcSentenceBubble segments={abcSentence({ event: response.activatingEvent, belief: '', feel: abcFeelPhrase(response.consequenceEmotion) })} />
      <AbcAsk question="What did you feel?" sub={`Pick up to ${ABC_MAX_FEEL}.`} solo={isAbcCrisisSeen()} />
      <View className="flex-row flex-wrap gap-3">
        {ABC_EMOTION_OPTIONS.map((e) => {
          const on = selected.includes(e.name);
          return (
            <Pressable
              key={e.name}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              onPress={() => toggle(e.name)}
              className={`basis-[47%] grow min-h-[112px] items-center justify-center gap-2 p-3 rounded-2xl active:scale-[0.97] ${on ? 'bg-[#eef3ea] border-2 border-happy-ink' : 'bg-happy-surface-2 border-2 border-transparent'}`}
            >
              <View style={{ opacity: full && !on ? 0.45 : 1 }}><AbcFace name={e.name} on={on} /></View>
              <Text className={`text-t-body font-semibold ${full && !on ? 'text-happy-label-2' : 'text-happy-label'}`}>{e.label}</Text>
              {on && (
                <View className="absolute top-3 right-3 w-6 h-6 rounded-full items-center justify-center bg-[#29452a]">
                  <Feather name="check" size={14} color="#fff" />
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
      <Text accessibilityLiveRegion="polite" className="mt-2 text-t-foot font-semibold text-happy-label-2 min-h-[18px]">{note}</Text>
      {selected.includes('hopeless') && (
        <Pressable accessibilityRole="button" onPress={() => setHelpOpen(true)} className="min-h-11 justify-center">
          <Text className="text-t-sub font-semibold text-happy-accent underline">Get help now</Text>
        </Pressable>
      )}
      <HelpSheetModal visible={helpOpen} onClose={() => setHelpOpen(false)} />
    </View>
  );
}


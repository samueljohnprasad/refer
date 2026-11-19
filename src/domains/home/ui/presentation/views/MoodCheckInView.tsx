// ponytail: exact .mood/.faces row matching .agents/home.html — 5-face check-in, Happi answers via a
// reactive line (no score, no streak). Wraps the existing useEmotionLogger hook; doesn't reinvent logging.
import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useEmotionLogger } from '@/hooks/data/useEmotionLogger';
import { ActingPose } from '@/src/domains/onboarding/ui/containers/happiPoses';
import { FaceIcon, type MoodKey } from '../components/FaceIcon';

const MOODS: ReadonlyArray<{ key: MoodKey; label: string; emotionId: number; pose: ActingPose; say: string }> = [
  { key: 'terrible', label: 'Terrible', emotionId: 1, pose: ActingPose.Content, say: 'Thanks for telling me. I’m right here.' },
  { key: 'bad', label: 'Bad', emotionId: 2, pose: ActingPose.Content, say: 'Rough one. Want to catch what’s behind it?' },
  { key: 'okay', label: 'Okay', emotionId: 3, pose: ActingPose.Wave, say: 'Okay is a fine place to be.' },
  { key: 'good', label: 'Good', emotionId: 4, pose: ActingPose.Proud, say: 'Nice. Hold on to what helped.' },
  { key: 'great', label: 'Great', emotionId: 5, pose: ActingPose.Cheer, say: 'Love that. I’m doing a little dance.' },
];

export interface MoodCheckInViewProps {
  night: boolean;
  onAnswer: (say: string, pose: ActingPose) => void;
}

export function MoodCheckInView({ night, onAnswer }: MoodCheckInViewProps): React.JSX.Element {
  const { logEmotion, emotionCounts } = useEmotionLogger(new Date());
  const [mood, setMood] = useState<MoodKey | null>(null);

  // ponytail: restore today's already-logged mood (home.html reads `happy.mood` keyed by day on load)
  useEffect(() => {
    const logged = MOODS.find((m) => (emotionCounts.get(m.emotionId) ?? 0) > 0);
    if (logged) setMood(logged.key);
  }, [emotionCounts]);

  const selectedLabel = MOODS.find((m) => m.key === mood)?.label.toLowerCase();

  const handlePress = useCallback((m: typeof MOODS[number]) => {
    setMood(m.key);
    logEmotion(m.emotionId);
    onAnswer(m.say, m.pose);
  }, [logEmotion, onAnswer]);

  return (
    <View className="p-4 rounded-[20px] bg-happy-surface-2">
      <Text className="text-t-sub font-bold text-happy-label-2">
        {selectedLabel
          ? <>{night ? 'Today was ' : 'Today is '}<Text className="font-extrabold text-happy-label">{selectedLabel}</Text></>
          : night ? 'How was today?' : 'How’s today going?'}
      </Text>
      <View className="flex-row justify-between mt-3 -mx-1">
        {MOODS.map((m) => {
          const selected = mood === m.key;
          return (
            <Pressable
              key={m.key}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              onPress={() => handlePress(m)}
              className="flex-1 items-center gap-1.5 min-h-11 py-2"
              style={{ opacity: mood && !selected ? 0.55 : 1 }}
            >
              <View
                className="w-11 h-11 items-center justify-center rounded-full"
                style={{ backgroundColor: selected ? '#f2f8ef' : '#ffffff', transform: [{ scale: selected ? 1.14 : 1 }] }}
              >
                <FaceIcon mood={m.key} size={32} color={selected ? '#44633f' : '#4b4b4b'} />
              </View>
              <Text
                className="text-t-cap"
                style={{ color: selected ? '#142414' : '#4b4b4b', fontWeight: selected ? '800' : '600' }}
              >
                {m.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

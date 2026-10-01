import React, { useState } from 'react';
import { View, Button, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { CelebrationOverlay } from '../../src/components/celebration/CelebrationOverlay';
import { LessonCompleteCelebration } from '../../src/components/celebration/LessonCompleteCelebration';
import { CelebrationContext } from '../../src/types/celebration';

export default function CelebrationTestScreen() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [lessonVisible, setLessonVisible] = useState(false);
  const [context, setContext] = useState<CelebrationContext | null>(null);

  const triggerStandard = () => {
    setContext({
      type: 'lesson',
      level: 1,
      primaryText: 'You caught the thought.',
      secondaryText: 'Reframing · practiced',
      pandaAnimationKey: 'thought_reframe',
      backgroundColor: '#FEF3C7',
    } as any);
    setIsVisible(true);
  };

  const handleContinue = () => {
    setIsVisible(false);
  };

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-xl font-bold mb-8">Celebration Dev Test</Text>

      <View className="mb-8" style={{ gap: 12 }}>
        <Button
          title="Trigger Lesson Complete (new)"
          onPress={() => setLessonVisible(true)}
        />
        <Button title="Trigger Old Overlay" onPress={triggerStandard} />
      </View>

      {context && (
        <CelebrationOverlay
          isVisible={isVisible}
          context={context}
          onContinue={handleContinue}
        />
      )}

      <LessonCompleteCelebration
        isVisible={lessonVisible}
        xpEarned={10}
        title="Lesson complete!"
        message="You showed up for yourself today."
        onContinue={() => setLessonVisible(false)}
      />
    </View>
  );
}

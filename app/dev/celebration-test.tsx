import React, { useState } from 'react';
import { View, Button, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { CelebrationOverlay } from '../../src/components/celebration/CelebrationOverlay';
import { CelebrationContext } from '../../src/types/celebration';

export default function CelebrationTestScreen() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [context, setContext] = useState<CelebrationContext | null>(null);

  const triggerStandard = () => {
    setContext({
      level: 1,
      primaryText: 'You caught the thought.',
      secondaryText: 'Reframing · practiced',
      pandaAnimationKey: 'thought_reframe',
      backgroundColor: '#FEF3C7', // Example Tailwind amber-50
    });
    setIsVisible(true);
  };

  const triggerDaily = () => {
    setContext({
      level: 2,
      primaryText: 'You showed up for yourself.',
      secondaryText: '7 day streak \u2191',
      pandaAnimationKey: 'generic_success',
      backgroundColor: '#DBEAFE', // Example Tailwind blue-50
    });
    setIsVisible(true);
  };

  const handleContinue = () => {
    setIsVisible(false);
    // T021: Route transition to journey map
    console.log('Journey Map Transition');
  };

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-xl font-bold mb-8">Celebration Dev Test</Text>
      
      <View className="space-y-4 mb-8">
        <Button title="Trigger Standard Celebration" onPress={triggerStandard} />
        <Button title="Trigger Daily Habit Celebration" onPress={triggerDaily} />
      </View>

      {context && (
        <CelebrationOverlay
          isVisible={isVisible}
          context={context}
          onContinue={handleContinue}
        />
      )}
    </View>
  );
}

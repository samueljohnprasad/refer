import React, { lazy } from 'react';
import { View } from 'react-native';
import SuspensLoader from '@/src/components/SuspensLoader';
import { useRouter } from 'expo-router';

const OnboardingScreen = lazy(
  () => import('@/src/screens/OnboardingScreen/OnboardingScreen')
);

export default function PremiumOnboardingRoute(): React.JSX.Element {
  const router = useRouter();

  const handleComplete = async (): Promise<void> => {
    router.replace('/tabs/(tabs)/home');
  };

  return (
    <View className="flex-1">
      <SuspensLoader>
        <OnboardingScreen onComplete={handleComplete} />
      </SuspensLoader>
    </View>
  );
}

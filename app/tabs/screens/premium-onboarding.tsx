import React, { lazy, useCallback, useRef } from 'react';
import { View } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import SuspensLoader from '@/src/components/SuspensLoader';
import { useRouter } from 'expo-router';
import SignInBottomSheet from '@/src/components/SignInBottomSheet';
import { useAuth } from '@/src/context/AuthContext';

const OnboardingScreen = lazy(
  () => import('@/src/screens/OnboardingScreen/OnboardingScreen')
);

export default function PremiumOnboardingRoute(): React.JSX.Element {
  const router = useRouter();
  const signInSheetRef = useRef<BottomSheetModal>(null);
  const hasContinuedRef = useRef<boolean>(false);
  const { isAnonymous } = useAuth();

  const continueToHome = useCallback((): void => {
    if (hasContinuedRef.current) return;
    hasContinuedRef.current = true;
    router.replace('/tabs/(tabs)/home');
  }, [router]);

  const handleComplete = async (): Promise<void> => {
    if (isAnonymous) {
      setTimeout(() => {
        signInSheetRef.current?.present();
      }, 300);
      return;
    }

    continueToHome();
  };

  return (
    <View className="flex-1">
      <SuspensLoader>
        <OnboardingScreen onComplete={handleComplete} />
      </SuspensLoader>
      <SignInBottomSheet
        ref={signInSheetRef}
        showSkipButton
        onDismiss={continueToHome}
        onSkip={continueToHome}
        onSuccess={continueToHome}
      />
    </View>
  );
}

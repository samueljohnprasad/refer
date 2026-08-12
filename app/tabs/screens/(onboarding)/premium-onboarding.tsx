import React, { useCallback, useRef } from 'react';
import { View } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import SignInBottomSheet from '@/src/components/SignInBottomSheet';
import { useAuth } from '@/src/context/AuthContext';
import OnboardingScreen from '@/src/screens/OnboardingScreen/OnboardingScreen';

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

  const handleComplete = async (skipped?: boolean): Promise<void> => {
    if (isAnonymous && !skipped) {
      setTimeout(() => {
        signInSheetRef.current?.present();
      }, 300);
      return;
    }

    continueToHome();
  };

  return (
    <View className="flex-1">
      <OnboardingScreen onComplete={handleComplete} />
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

import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import SignInBottomSheet, { type SignInBottomSheetHandle } from '@/src/components/SignInBottomSheet';
import { useAuth } from '@/src/context/AuthContext';
import OnboardingScreen from '@/src/screens/OnboardingScreen/OnboardingScreen';

export default function PremiumOnboardingRoute(): React.JSX.Element {
  const router = useRouter();
  const signInSheetRef = useRef<SignInBottomSheetHandle>(null);
  const hasContinuedRef = useRef<boolean>(false);
  const { isAnonymous } = useAuth();
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);

  const continueToHome = useCallback((): void => {
    if (hasContinuedRef.current) return;
    hasContinuedRef.current = true;
    router.replace('/tabs/(tabs)/home');
  }, [router]);

  const handleComplete = useCallback(async (skipped?: boolean): Promise<void> => {
    if (isAnonymous && !skipped) {
      setTimeout(() => {
        signInSheetRef.current?.present();
      }, 300);
      return;
    }

    continueToHome();
  }, [isAnonymous, continueToHome]);

  return (
    <View className="flex-1">
      <OnboardingScreen onComplete={handleComplete} />
      {isSheetOpen && (
        <View
          style={StyleSheet.absoluteFill}
          className="bg-black/35"
          pointerEvents="auto"
        />
      )}
      <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
        <SignInBottomSheet
          ref={signInSheetRef}
          showSkipButton
          onOpenChange={setIsSheetOpen}
          onDismiss={continueToHome}
          onSkip={continueToHome}
          onSuccess={continueToHome}
        />
      </View>
    </View>
  );
}

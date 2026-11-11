import React, { useCallback, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import SignInBottomSheet, { type SignInBottomSheetHandle } from "@/src/components/SignInBottomSheet";
import { useAuth } from "@/src/context/AuthContext";
import { OnboardingContainer } from "@/src/domains/onboarding";

// ponytail: use clean architecture OnboardingContainer with guest continuity
export default function PremiumOnboardingRoute(): React.JSX.Element {
  const router = useRouter();
  const signInSheetRef = useRef<SignInBottomSheetHandle>(null);
  const hasContinuedRef = useRef<boolean>(false);
  const { user } = useAuth();
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);

  const continueToHome = useCallback((): void => {
    if (hasContinuedRef.current) return;
    hasContinuedRef.current = true;
    router.replace("/tabs/(tabs)/home");
  }, [router]);

  const handleComplete = useCallback((): void => {
    // ponytail: route anonymous guest directly to home without last-mile sheet friction
    continueToHome();
  }, [continueToHome]);

  return (
    <View className="flex-1 bg-happy-bg">
      <OnboardingContainer userId={user?.id} onComplete={handleComplete} />
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
          source="onboarding"
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

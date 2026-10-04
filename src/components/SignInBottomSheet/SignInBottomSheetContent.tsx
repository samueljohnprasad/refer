import React from "react";
import { View } from "react-native";
import type { AccountConflict } from "@/src/context/AuthContext";
import type { PremiumRecoveryState } from "./useSignInBottomSheetController";
import PremiumRecoveryContent from "./PremiumRecoveryContent";
import AccountConflictContent from "./AccountConflictContent";
import ProviderSignInContent from "./ProviderSignInContent";
import type { AuthProviderId } from "@/src/context/AuthContext";

interface SignInBottomSheetContentProps {
  isAnonymous: boolean;
  accountConflict: AccountConflict | null;
  hasPro: boolean;
  providerLabel: string;
  busyProvider: AuthProviderId | null;
  busyMove: boolean;
  busyRestore: boolean;
  premiumRecovery: PremiumRecoveryState | null;
  isAppleAuthAvailable: boolean;
  showSkipButton: boolean;
  onProviderPress: (provider: AuthProviderId) => void;
  onStay: () => void;
  onMove: () => void;
  onRetryRestore: () => void;
  onContinueAfterRecovery: () => void;
  onSkip: () => void;
}

export default function SignInBottomSheetContent({
  isAnonymous,
  accountConflict,
  hasPro,
  providerLabel,
  busyProvider,
  busyMove,
  busyRestore,
  premiumRecovery,
  isAppleAuthAvailable,
  showSkipButton,
  onProviderPress,
  onStay,
  onMove,
  onRetryRestore,
  onContinueAfterRecovery,
  onSkip,
}: SignInBottomSheetContentProps) {
  return (
    <View className="flex-1 px-6 pt-5 pb-5">
      {premiumRecovery ? (
        <PremiumRecoveryContent
          recovery={premiumRecovery}
          busyRestore={busyRestore}
          onRetryRestore={onRetryRestore}
          onContinue={onContinueAfterRecovery}
        />
      ) : accountConflict ? (
        <AccountConflictContent
          hasPro={hasPro}
          providerLabel={providerLabel}
          busyMove={busyMove}
          onStay={onStay}
          onMove={onMove}
        />
      ) : (
        <ProviderSignInContent
          isAnonymous={isAnonymous}
          busyProvider={busyProvider}
          isAppleAuthAvailable={isAppleAuthAvailable}
          showSkipButton={showSkipButton}
          onProviderPress={onProviderPress}
          onSkip={onSkip}
        />
      )}
    </View>
  );
}

import { View } from "react-native";
import { useRouter } from "expo-router";
import { Toast, ToastTitle, useToast } from "@/components/ui/toast";
import ShortBottomModal from "./ShortBottomModal";
import { forwardRef, useMemo, useState, type RefObject } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useAuth, type AuthProviderId } from "@/src/context/AuthContext";
import { useRevenueCat } from "@/src/context/RevenueCatProvider";
import { clearGuestProgress } from "@/hooks/data/useGuestProgress";
import type { CustomerInfo } from "react-native-purchases";
import { INK } from "@/lib/tokens";
import { Text } from "@/src/components/ui/Text";
import { Button } from "@/src/components/ui/Button";
import { Card } from "@/src/components/ui/Card";
import { FontAwesome } from "@expo/vector-icons";

interface PremiumRecoveryState {
  appUserID: string | null;
  supabaseUserId: string;
  reason: "claim" | "move";
}

interface SignInBottomSheetProps {
  onDismiss?: () => void;
  onSkip?: () => void;
  onSuccess?: () => void;
  showSkipButton?: boolean;
}

export default forwardRef<BottomSheetModal | null, SignInBottomSheetProps>(({
  onDismiss,
  onSkip,
  onSuccess,
  showSkipButton = false,
}, ref) => {
  const router = useRouter();
  const toast = useToast();
  const {
    session,
    isAnonymous,
    accountConflict,
    claimProfile,
    moveToExistingAccount,
    clearAccountConflict,
  } = useAuth();
  const {
    hasPro,
    identifyCurrentUser,
    restorePurchases,
    getAppUserID,
    dismissAccountClaimPrompt,
  } = useRevenueCat();
  const [busyProvider, setBusyProvider] = useState<AuthProviderId | null>(null);
  const [busyMove, setBusyMove] = useState<boolean>(false);
  const [busyRestore, setBusyRestore] = useState<boolean>(false);
  const [premiumRecovery, setPremiumRecovery] =
    useState<PremiumRecoveryState | null>(null);

  const modalRef = ref as RefObject<BottomSheetModal | null>;

  const providerLabel = useMemo(() => {
    if (!accountConflict) return "";
    return accountConflict.provider === "apple" ? "Apple" : "Google";
  }, [accountConflict]);

  const hasPremiumEntitlement = (info: CustomerInfo | null): boolean => {
    return Boolean(info?.entitlements.active["Premium journals"]);
  };

  const showError = (message: string): void => {
    toast.show({
      placement: "bottom right",
      render: ({ id }) => (
        <Toast nativeID={id} variant="solid" action="error">
          <ToastTitle>{message}</ToastTitle>
        </Toast>
      ),
    });
  };

  const showSuccess = (message: string): void => {
    toast.show({
      placement: "bottom right",
      render: ({ id }) => (
        <Toast nativeID={id} variant="solid" action="success">
          <ToastTitle>{message}</ToastTitle>
        </Toast>
      ),
    });
  };

  const dismissSheet = (): void => {
    dismissAccountClaimPrompt();
    modalRef?.current?.dismiss();
  };

  const handleSheetDismiss = (): void => {
    dismissAccountClaimPrompt();
    onDismiss?.();
  };

  const finishSuccessfully = (): void => {
    dismissSheet();

    if (onSuccess) {
      onSuccess();
      return;
    }

    router.replace("/tabs/screens/onboard-container");
  };

  const handleSkip = (): void => {
    dismissSheet();
    onSkip?.();
  };

  const handleProviderPress = async (provider: AuthProviderId) => {
    try {
      setBusyProvider(provider);

      if (!session && !isAnonymous) {
        const result = await moveToExistingAccount(provider);

        if (result.status === "signed_in") {
          showSuccess("Signed in successfully.");
          finishSuccessfully();
          return;
        }

        if (result.status === "failed") {
          showError("Sign-in failed. Please try again.");
        }

        return;
      }

      const result = await claimProfile(provider);

      if (result.status === "linked") {
        const info = await identifyCurrentUser(result.user.id);
        if (hasPro && !hasPremiumEntitlement(info)) {
          const appUserID = await getAppUserID();
          setPremiumRecovery({
            appUserID,
            supabaseUserId: result.user.id,
            reason: "claim",
          });
          showError("Account saved. Premium needs a refresh.");
          return;
        } else {
          showSuccess(hasPro ? "Premium profile saved." : "Progress saved.");
        }
        finishSuccessfully();
        return;
      }

      if (result.status === "failed") {
        showError("Sign-in failed. Please try again.");
      }
    } catch (error) {
      showError("Sign-in failed. Please try again.");
    } finally {
      setBusyProvider(null);
    }
  };

  const handleStay = (): void => {
    clearAccountConflict();
    dismissSheet();
  };

  const handleRetryRestore = async (): Promise<void> => {
    if (!premiumRecovery) return;

    try {
      setBusyRestore(true);
      const info = await restorePurchases();

      if (!hasPremiumEntitlement(info)) {
        showError("Premium still was not found. Please contact support.");
        return;
      }

      showSuccess("Premium restored.");
      setPremiumRecovery(null);
      finishSuccessfully();
    } finally {
      setBusyRestore(false);
    }
  };

  const handleContinueAfterRecovery = (): void => {
    setPremiumRecovery(null);
    finishSuccessfully();
  };

  const handleMove = async (): Promise<void> => {
    if (!accountConflict) return;

    try {
      setBusyMove(true);
      const hadPremiumBeforeMove = hasPro;
      const result = await moveToExistingAccount(accountConflict.provider);

      if (result.status === "cancelled") return;

      if (result.status === "failed") {
        showError("Could not switch accounts. Please try again.");
        return;
      }

      let info = await identifyCurrentUser(result.user.id);

      if (hadPremiumBeforeMove && !hasPremiumEntitlement(info)) {
        info = await restorePurchases();
      }

      await clearGuestProgress();

      if (hadPremiumBeforeMove && !hasPremiumEntitlement(info)) {
        const appUserID = await getAppUserID();
        setPremiumRecovery({
          appUserID,
          supabaseUserId: result.user.id,
          reason: "move",
        });
        showError("Premium could not be restored automatically.");
        return;
      }

      showSuccess("Switched to existing account.");
      finishSuccessfully();
    } finally {
      setBusyMove(false);
    }
  };

  if (premiumRecovery) {
    return (
      <ShortBottomModal
        ref={ref}
        snapPoints={["54%"]}
        onDismiss={handleSheetDismiss}
      >
        <View className="flex-1 px-6 pt-5 pb-8 justify-between bg-brand-surface rounded-[24px]">
          <View>
            <Text
              variant="h1"
              className="text-center mb-3"
            >
              {premiumRecovery.reason === "claim"
                ? "Premium Refresh Needed"
                : "Premium Restore Needed"}
            </Text>
            <Text variant="body" className="text-center mb-5 leading-[22px]">
              {premiumRecovery.reason === "claim"
                ? "Your profile is saved, but Premium could not be refreshed on this login. Try restore again, or share these IDs with support."
                : "You're now on the existing account, but Premium could not be restored automatically. Try restore again, or share these IDs with support."}
            </Text>
            <Card
              variant="tile"
              radius="lg"
              showDepth={false}
              className="mb-5 bg-brand-surface-soft border border-brand-border"
              contentClassName="p-4 gap-2"
            >
              <Text variant="eyebrow">
                RevenueCat App User ID
              </Text>
              <Text variant="label" className="text-ink-soft select-text">
                {premiumRecovery.appUserID ?? "Unavailable"}
              </Text>
              <Text variant="eyebrow" className="mt-2">
                Supabase User ID
              </Text>
              <Text variant="label" className="text-ink-soft select-text">
                {premiumRecovery.supabaseUserId}
              </Text>
            </Card>
          </View>

          <View className="gap-3">
            <Button
              label="Try Restore Again"
              variant="primary"
              onPress={handleRetryRestore}
              loading={busyRestore}
              fullWidth
            />
            <Button
              label={
                premiumRecovery.reason === "claim"
                  ? "Continue"
                  : "Continue Without Premium"
              }
              variant="secondary"
              onPress={handleContinueAfterRecovery}
              disabled={busyRestore}
              fullWidth
            />
          </View>
        </View>
      </ShortBottomModal>
    );
  }

  if (accountConflict) {
    return (
      <ShortBottomModal
        ref={ref}
        snapPoints={["54%"]}
        onDismiss={handleSheetDismiss}
      >
        <View className="flex-1 px-6 pt-5 pb-8 justify-between bg-brand-surface rounded-[24px]">
          <View>
            <Text
              variant="h1"
              className="text-center mb-3"
            >
              {hasPro ? "Premium Is Active Here" : "Existing Account Found"}
            </Text>
            <Text variant="body" className="text-center leading-[22px]">
              {hasPro
                ? `Your Premium and current progress belong to this profile. This ${providerLabel} login is already linked to another Happy account. You can keep this profile, or switch to your existing account and try to restore Premium there. Your current progress won't be transferred.`
                : `This ${providerLabel} login is already linked to another Happy account. If you continue, you'll switch to that account and your current progress won't be transferred.`}
            </Text>
          </View>

          <View className="gap-3">
            <Button
              label={hasPro ? "Keep This Premium Profile" : "Continue to Existing Account"}
              variant="primary"
              onPress={hasPro ? handleStay : handleMove}
              loading={busyMove && !hasPro}
              disabled={busyMove}
              fullWidth
            />
            <Button
              label={hasPro ? "Move to Existing Account" : "Stay on Current Progress"}
              variant="secondary"
              onPress={hasPro ? handleMove : handleStay}
              loading={busyMove && hasPro}
              disabled={busyMove}
              fullWidth
            />
          </View>
        </View>
      </ShortBottomModal>
    );
  }

  return (
    <ShortBottomModal
      ref={ref}
      snapPoints={showSkipButton ? ["45%"] : ["38%"]}
      onDismiss={handleSheetDismiss}
    >
      <View className="flex-1 px-6 pt-4 pb-8 justify-between bg-brand-surface rounded-[24px]">
        <View>
          <Text
            variant="h1"
            className="mb-2"
          >
            {isAnonymous
              ? hasPro
                ? "Save Your Premium Profile"
                : "Save Your Progress"
              : "Welcome Back"}
          </Text>
          <Text variant="body" className="leading-[22px]">
            {isAnonymous
              ? "Add a login to keep your current Happy profile, progress, and Premium access safe."
              : "Sign in to sync your journals, moods, and calories across all your devices."}
          </Text>
        </View>

        <View className="gap-3">
          <Button
            label="Continue with Apple"
            variant="primary"
            onPress={() => handleProviderPress("apple")}
            loading={busyProvider === "apple"}
            disabled={busyProvider !== null}
            fullWidth
            leftIcon={<FontAwesome name="apple" size={20} color="white" />}
          />

          <Button
            label="Continue with Google"
            variant="secondary"
            onPress={() => handleProviderPress("google")}
            loading={busyProvider === "google"}
            disabled={busyProvider !== null}
            fullWidth
            leftIcon={<FontAwesome name="google" size={18} color={INK} />}
          />

          {showSkipButton ? (
            <Button
              label="Maybe later"
              variant="ghost"
              onPress={handleSkip}
              disabled={busyProvider !== null}
              fullWidth
              className="mt-1"
            />
          ) : null}
        </View>
      </View>
    </ShortBottomModal>
  );
});

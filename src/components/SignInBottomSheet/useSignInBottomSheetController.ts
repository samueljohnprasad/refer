import { useEffect, useMemo, useState } from "react";
import { Platform } from "react-native";
import { useRouter } from "expo-router";
import { useToast } from "heroui-native";
import * as AppleAuthentication from "expo-apple-authentication";
import * as Haptics from "expo-haptics";
import type { CustomerInfo } from "react-native-purchases";
import { clearGuestProgress } from "@/hooks/data/useGuestProgress";
import { useAuth, type AuthProviderId } from "@/src/context/AuthContext";
import { useRevenueCat } from "@/src/context/RevenueCatProvider";
import { useTranslation } from "react-i18next";

export interface PremiumRecoveryState {
  appUserID: string | null;
  supabaseUserId: string;
  reason: "claim" | "move";
}

interface ControllerProps {
  onDismiss?: () => void;
  onSkip?: () => void;
  onSuccess?: () => void;
  onOpenChange?: (open: boolean) => void;
}

const hasPremiumEntitlement = (info: CustomerInfo | null): boolean =>
  Boolean(info?.entitlements.active["Premium journals"]);

export function useSignInBottomSheetController({
  onDismiss,
  onSkip,
  onSuccess,
  onOpenChange,
}: ControllerProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useTranslation("settings");
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

  const [isOpen, setIsOpen] = useState(false);
  const [busyProvider, setBusyProvider] = useState<AuthProviderId | null>(null);
  const [busyMove, setBusyMove] = useState(false);
  const [busyRestore, setBusyRestore] = useState(false);
  const [premiumRecovery, setPremiumRecovery] =
    useState<PremiumRecoveryState | null>(null);
  const [isAppleAuthAvailable, setIsAppleAuthAvailable] = useState(
    Platform.OS === "ios",
  );

  useEffect(() => {
    if (Platform.OS !== "ios") {
      setIsAppleAuthAvailable(false);
      return;
    }

    AppleAuthentication.isAvailableAsync()
      .then(setIsAppleAuthAvailable)
      .catch(() => setIsAppleAuthAvailable(false));
  }, []);

  const providerLabel = useMemo(() => {
    if (!accountConflict) return "";
    return accountConflict.provider === "apple" ? "Apple" : "Google";
  }, [accountConflict]);

  const dismissSheet = (): void => {
    dismissAccountClaimPrompt();
    setIsOpen(false);
    onOpenChange?.(false);
  };

  const handleSheetDismiss = (): void => {
    dismissAccountClaimPrompt();
    onDismiss?.();
    setIsOpen(false);
    onOpenChange?.(false);
  };

  const finishSuccessfully = (): void => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    dismissSheet();

    if (onSuccess) {
      onSuccess();
      return;
    }

    router.replace("/tabs/(tabs)/home");
  };

  const handleSkip = (): void => {
    dismissSheet();
    onSkip?.();
  };

  const showError = (message: string): void => {
    toast.show({ placement: "bottom", variant: "danger", label: message });
  };

  const showSuccess = (message: string): void => {
    toast.show({ placement: "bottom", variant: "success", label: message });
  };

  const handleProviderPress = async (provider: AuthProviderId): Promise<void> => {
    try {
      setBusyProvider(provider);

      if (!session && !isAnonymous) {
        const result = await moveToExistingAccount(provider);
        if (result.status === "signed_in") {
          showSuccess(t("accountAuth.toasts.signedIn"));
          finishSuccessfully();
          return;
        }
        if (result.status === "failed") {
          showError(t("accountAuth.toasts.signInFailed"));
        }
        return;
      }

      const result = await claimProfile(provider);
      if (result.status !== "linked") {
        if (result.status === "failed") {
          showError(t("accountAuth.toasts.signInFailed"));
        }
        return;
      }

      const info = await identifyCurrentUser(result.user.id);
      if (hasPro && !hasPremiumEntitlement(info)) {
        setPremiumRecovery({
          appUserID: await getAppUserID(),
          supabaseUserId: result.user.id,
          reason: "claim",
        });
        showError(t("accountAuth.toasts.premiumRefreshNeeded"));
        return;
      }

      showSuccess(t("accountAuth.toasts.accountCreated"));
      finishSuccessfully();
    } catch {
      showError(t("accountAuth.toasts.signInFailed"));
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
        showError(t("accountAuth.toasts.premiumNotFound"));
        return;
      }

      showSuccess(t("accountAuth.toasts.premiumRestored"));
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
        showError(t("accountAuth.toasts.switchFailed"));
        return;
      }

      let info = await identifyCurrentUser(result.user.id);
      if (hadPremiumBeforeMove && !hasPremiumEntitlement(info)) {
        info = await restorePurchases();
      }

      await clearGuestProgress();
      if (hadPremiumBeforeMove && !hasPremiumEntitlement(info)) {
        setPremiumRecovery({
          appUserID: await getAppUserID(),
          supabaseUserId: result.user.id,
          reason: "move",
        });
        showError(t("accountAuth.toasts.premiumRestoreFailed"));
        return;
      }

      showSuccess(t("accountAuth.toasts.accountSwitched"));
      finishSuccessfully();
    } finally {
      setBusyMove(false);
    }
  };

  return {
    isOpen,
    setIsOpen,
    isAnonymous,
    accountConflict,
    hasPro,
    providerLabel,
    busyProvider,
    busyMove,
    busyRestore,
    premiumRecovery,
    isAppleAuthAvailable,
    handleSheetDismiss,
    handleSkip,
    handleProviderPress,
    handleStay,
    handleMove,
    handleRetryRestore,
    handleContinueAfterRecovery,
    openSheet: () => {
      setIsOpen(true);
      onOpenChange?.(true);
    },
    dismissSheet,
  };
}

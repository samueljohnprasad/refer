import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useToast } from "heroui-native";
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react";
import * as AppleAuthentication from "expo-apple-authentication";
import * as Haptics from "expo-haptics";
import Svg, { Path } from "react-native-svg";
import { useAuth, type AuthProviderId } from "@/src/context/AuthContext";
import { useRevenueCat } from "@/src/context/RevenueCatProvider";
import { clearGuestProgress } from "@/hooks/data/useGuestProgress";
import type { CustomerInfo } from "react-native-purchases";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { RADIUS } from "@/src/theme/radius";
import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import { Text } from "@/src/components/ui/Text";
import { Button } from "@/src/components/ui/Button";
import { Card } from "@/src/components/ui/Card";
import { FontAwesome } from "@expo/vector-icons";
import { Host, BottomSheet, Group, RNHostView } from "@expo/ui/swift-ui";
import {
  presentationDetents,
  presentationDragIndicator,
} from "@expo/ui/swift-ui/modifiers";

const GoogleGIcon = ({ size = 20 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <Path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <Path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      fill="#FBBC05"
    />
    <Path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      fill="#EA4335"
    />
  </Svg>
);

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
  onOpenChange?: (open: boolean) => void;
}

export interface SignInBottomSheetHandle {
  present: () => void;
  dismiss: () => void;
}

export default forwardRef<SignInBottomSheetHandle, SignInBottomSheetProps>(({
  onDismiss,
  onSkip,
  onSuccess,
  showSkipButton = false,
  onOpenChange,
}, ref) => {
  const router = useRouter();
  const { toast } = useToast();
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
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [busyProvider, setBusyProvider] = useState<AuthProviderId | null>(null);
  const [busyMove, setBusyMove] = useState<boolean>(false);
  const [busyRestore, setBusyRestore] = useState<boolean>(false);
  const [premiumRecovery, setPremiumRecovery] =
    useState<PremiumRecoveryState | null>(null);
  const [isAppleAuthAvailable, setIsAppleAuthAvailable] = useState<boolean>(
    Platform.OS === "ios"
  );

  useEffect(() => {
    if (Platform.OS === "ios") {
      AppleAuthentication.isAvailableAsync()
        .then((avail) => setIsAppleAuthAvailable(avail))
        .catch(() => setIsAppleAuthAvailable(false));
    } else {
      setIsAppleAuthAvailable(false);
    }
  }, []);

  useImperativeHandle(ref, () => ({
    present: () => {
      setIsOpen(true);
      onOpenChange?.(true);
    },
    dismiss: () => {
      dismissAccountClaimPrompt();
      setIsOpen(false);
      onOpenChange?.(false);
    },
  }));

  const providerLabel = useMemo(() => {
    if (!accountConflict) return "";
    return accountConflict.provider === "apple" ? "Apple" : "Google";
  }, [accountConflict]);

  const hasPremiumEntitlement = (info: CustomerInfo | null): boolean => {
    return Boolean(info?.entitlements.active["Premium journals"]);
  };

  const showError = (message: string): void => {
    toast.show({
      placement: "bottom",
      variant: "danger",
      label: message,
    });
  };

  const showSuccess = (message: string): void => {
    toast.show({
      placement: "bottom",
      variant: "success",
      label: message,
    });
  };

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
          showSuccess("Account created.");
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


  const sheetHeight =
    premiumRecovery || accountConflict ? 380 : showSkipButton ? 285 : 245;

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleSheetDismiss}
    >
      <Host style={StyleSheet.absoluteFill}>
        <BottomSheet
          isPresented={isOpen}
          onIsPresentedChange={(val: boolean) => {
            if (!val) {
              handleSheetDismiss();
            }
          }}
        >
          <Group
            modifiers={[
              presentationDetents([{ height: sheetHeight }]),
              presentationDragIndicator("visible"),
            ]}
          >
            <RNHostView>
              <View className="flex-1 px-6 pt-5 pb-5">
                {premiumRecovery ? (
                  <View className="flex-1 justify-between">
                    <View>
                      <Text
                        style={{ fontFamily: APP_FONT_FAMILIES.bold }}
                        className="text-center text-[20px] mb-2 text-ink"
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
                ) : accountConflict ? (
                  <View className="flex-1 justify-between">
                    <View>
                      <Text
                        style={{ fontFamily: APP_FONT_FAMILIES.bold }}
                        className="text-center text-[20px] mb-2 text-ink"
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
                ) : (
                  <View className="flex-1 justify-between">
                    <View>
                      <Text
                        style={{ fontFamily: APP_FONT_FAMILIES.bold }}
                        className="text-[21px] leading-tight text-ink"
                      >
                        {isAnonymous ? "Create your account" : "Welcome back"}
                      </Text>
                      <Text
                        style={{ fontFamily: APP_FONT_FAMILIES.regular }}
                        className="mt-1.5 text-[14px] leading-[20px] text-ink-soft"
                      >
                        {isAnonymous
                          ? "Keep your course, reflections, and streak synced to you."
                          : "Sign in to sync your course, reflections, and streak across devices."}
                      </Text>
                    </View>

                    <View className="gap-3">
                      {/* Apple Button: Official native ASAuthorizationAppleIDButton on iOS, styled HIG black on fallback */}
                      <View
                        pointerEvents={busyProvider !== null ? "none" : "auto"}
                        style={{
                          width: "100%",
                          height: 50,
                          opacity: busyProvider !== null && busyProvider !== "apple" ? 0.6 : 1,
                        }}
                      >
                        {Platform.OS === "ios" && isAppleAuthAvailable && busyProvider !== "apple" ? (
                          <AppleAuthentication.AppleAuthenticationButton
                            buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
                            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                            cornerRadius={16}
                            style={{ width: "100%", height: 50 }}
                            onPress={() => handleProviderPress("apple")}
                          />
                        ) : (
                          <Pressable
                            onPress={() => handleProviderPress("apple")}
                            disabled={busyProvider !== null}
                            accessibilityRole="button"
                            accessibilityLabel="Continue with Apple"
                            style={({ pressed }) => [
                              {
                                height: 50,
                                borderRadius: 16,
                                backgroundColor: pressed ? "#1A1A1A" : "#000000",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 10,
                              },
                            ]}
                          >
                            {busyProvider === "apple" ? (
                              <ActivityIndicator size="small" color="#FFFFFF" />
                            ) : (
                              <>
                                <FontAwesome name="apple" size={20} color="#FFFFFF" />
                                <Text
                                  style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}
                                  className="text-[16px] text-white"
                                >
                                  Continue with Apple
                                </Text>
                              </>
                            )}
                          </Pressable>
                        )}
                      </View>

                      {/* Google Button: Platform standard white surface, official 4-color G icon, matching 50pt height and 16pt radius */}
                      <Pressable
                        onPress={() => handleProviderPress("google")}
                        disabled={busyProvider !== null}
                        accessibilityRole="button"
                        accessibilityLabel="Continue with Google"
                        style={({ pressed }) => [
                          {
                            height: 50,
                            borderRadius: 16,
                            backgroundColor: pressed ? "#F8FAFC" : "#FFFFFF",
                            borderWidth: 1,
                            borderColor: "#E2E8F0",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 12,
                            opacity: busyProvider !== null && busyProvider !== "google" ? 0.6 : 1,
                          },
                        ]}
                      >
                        {busyProvider === "google" ? (
                          <ActivityIndicator size="small" color="#4285F4" />
                        ) : (
                          <>
                            <GoogleGIcon size={20} />
                            <Text
                              style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}
                              className="text-[16px] text-gray-900"
                            >
                              Continue with Google
                            </Text>
                          </>
                        )}
                      </Pressable>

                      {showSkipButton ? (
                        <Pressable
                          onPress={handleSkip}
                          disabled={busyProvider !== null}
                          hitSlop={8}
                          accessibilityRole="button"
                          accessibilityLabel="Maybe later"
                          className="py-2.5 items-center justify-center"
                        >
                          <Text
                            style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}
                            className="text-[14px] text-ink-soft"
                          >
                            Maybe later
                          </Text>
                        </Pressable>
                      ) : null}
                    </View>
                  </View>
                )}
              </View>
            </RNHostView>
          </Group>
        </BottomSheet>
      </Host>
    </Modal>
  );
});

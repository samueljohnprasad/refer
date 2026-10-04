import React from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  View,
} from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import Svg, { Path } from "react-native-svg";
import { FontAwesome } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import type { AuthProviderId } from "@/src/context/AuthContext";
import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import { Text } from "@/src/components/ui/Text";

interface ProviderSignInContentProps {
  isAnonymous: boolean;
  busyProvider: AuthProviderId | null;
  isAppleAuthAvailable: boolean;
  showSkipButton: boolean;
  onProviderPress: (provider: AuthProviderId) => void;
  onSkip: () => void;
}

export default function ProviderSignInContent({
  isAnonymous,
  busyProvider,
  isAppleAuthAvailable,
  showSkipButton,
  onProviderPress,
  onSkip,
}: ProviderSignInContentProps) {
  const { t } = useTranslation("settings");

  return (
    <View className="flex-1 justify-between">
      <View>
        <Text
          style={{ fontFamily: APP_FONT_FAMILIES.bold }}
          className="text-[21px] leading-tight text-ink"
        >
          {t(isAnonymous ? "accountAuth.signIn.createAccount" : "accountAuth.signIn.welcomeBack")}
        </Text>
        <Text
          style={{ fontFamily: APP_FONT_FAMILIES.regular }}
          className="mt-1.5 text-[14px] leading-[20px] text-ink-soft"
        >
          {t(isAnonymous ? "accountAuth.signIn.createDescription" : "accountAuth.signIn.welcomeDescription")}
        </Text>
      </View>
      <View className="gap-3">
        <View
          pointerEvents={busyProvider !== null ? "none" : "auto"}
          style={{
            width: "100%",
            height: 50,
            opacity: busyProvider !== null && busyProvider !== "apple" ? 0.6 : 1,
          }}
        >
          <AppleProviderButton
            busy={busyProvider === "apple"}
            disabled={busyProvider !== null}
            isAvailable={isAppleAuthAvailable}
            onPress={() => onProviderPress("apple")}
          />
        </View>
        <Pressable
          onPress={() => onProviderPress("google")}
          disabled={busyProvider !== null}
          accessibilityRole="button"
          accessibilityLabel={t("accountAuth.signIn.continueGoogle")}
          style={({ pressed }) => ({
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
          })}
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
                {t("accountAuth.signIn.continueGoogle")}
              </Text>
            </>
          )}
        </Pressable>
        {showSkipButton && (
          <Pressable
            onPress={onSkip}
            disabled={busyProvider !== null}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={t("accountAuth.signIn.maybeLater")}
            className="py-2.5 items-center justify-center"
          >
            <Text
              style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}
              className="text-[14px] text-ink-soft"
            >
              {t("accountAuth.signIn.maybeLater")}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

function AppleProviderButton({
  busy,
  disabled,
  isAvailable,
  onPress,
}: {
  busy: boolean;
  disabled: boolean;
  isAvailable: boolean;
  onPress: () => void;
}) {
  const { t } = useTranslation("settings");

  if (Platform.OS === "ios" && isAvailable && !busy) {
    return (
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={16}
        style={{ width: "100%", height: 50 }}
        onPress={onPress}
      />
    );
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={t("accountAuth.signIn.continueApple")}
      style={({ pressed }) => ({
        height: 50,
        borderRadius: 16,
        backgroundColor: pressed ? "#1A1A1A" : "#000000",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
      })}
    >
      {busy ? (
        <ActivityIndicator size="small" color="#FFFFFF" />
      ) : (
        <>
          <FontAwesome name="apple" size={20} color="#FFFFFF" />
          <Text
            style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}
            className="text-[16px] text-white"
          >
            {t("accountAuth.signIn.continueApple")}
          </Text>
        </>
      )}
    </Pressable>
  );
}

function GoogleGIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <Path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <Path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
      <Path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
    </Svg>
  );
}

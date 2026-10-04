import React from "react";
import { View, Animated, Share } from "react-native";
import { useTranslation } from "react-i18next";
import * as Application from "expo-application";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import {
  AlertSquareIcon,
  Delete02Icon,
  File01Icon,
  Login02Icon,
  Logout02Icon,
  MessageOutgoing01Icon,
  Notification01Icon,
  ShieldUserIcon,
  UserIcon,
  Copy01Icon,
  Share01Icon,
  StarIcon,
  Settings01Icon,
  Globe02Icon,
} from "@hugeicons/core-free-icons";

import { useLanguage } from "@/src/hooks/useLanguage";
import { LANGUAGE_METADATA, formatLanguageLabel } from "@/src/components/settings/LanguagePicker";
import type { SupportedLanguage } from "@/src/lib/i18n";

import { PromoCard } from "./components/PromoCard";
import { SettingsSection } from "./components/SettingsSection";
import { DailyGoalPicker } from "./components/DailyGoalPicker";
import { SettingsItem } from "./components/SettingsItem";
import { SettingsDialogs } from "./components/SettingsDialogs";
import { SettingsDevSection } from "./components/SettingsDevSection";

import { useSettingsModals } from "./hooks/useSettingsModals";
import { useSettingsBulkImport } from "./hooks/useSettingsBulkImport";
import { useSettingsAnimation } from "./hooks/useSettingsAnimation";
import { useRevenueCat } from "@/src/context/RevenueCatProvider";
import PostTrialDiscountBanner from "@/src/components/premium/PostTrialDiscountBanner";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { PremiumStatusCard } from "./components/PremiumStatusCard";

export default function SettingsScreen() {
  const { t } = useTranslation("settings");
  const router = useRouter();
  const signInSheetRef = React.useRef<BottomSheetModal>(null);
  const { customerInfo, hasPro, isLoadingRevenueCat } = useRevenueCat();

  const {
    isSignoutOPen,
    setIsSignoutOPen,
    showModal,
    setShowModal,
    showEraseDataModal,
    setShowEraseDataModal,
    deleteUserDataMutation,
    isSigningOut,
    shouldShowSignIn,
    signOut,
    handlePress,
    handleRateUs,
    handlePrivacyPolicy,
    handleTermsOfUse,
    handleEraseDataConfirm,
    handleCopyUserId,
  } = useSettingsModals();

  const {
    showImportModal,
    setShowImportModal,
    importDaysCount,
    setImportDaysCount,
    importStartDate,
    importing,
    progress,
    handleBulkImport,
  } = useSettingsBulkImport();

  const { scrollY, setUpgradeY } = useSettingsAnimation();

  const { currentLanguage } = useLanguage();

  const currentLanguageMeta =
    LANGUAGE_METADATA[currentLanguage as SupportedLanguage];
  const currentLanguageLabel = currentLanguageMeta
    ? formatLanguageLabel(
        t(`language.languages.${currentLanguage as SupportedLanguage}`),
        currentLanguageMeta.nativeName,
      )
    : t("language.device");

  const handleShareApp = async () => {
    try {
      await Share.share({
        message: t("share.message"),
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    // ponytail: calm, grouped settings view with zero floating shadows
    <View className="flex-1 bg-brand-canvas">
      <Animated.ScrollView
        contentContainerClassName="flex-grow"
        contentContainerStyle={{
          paddingBottom: 48,
          paddingTop: 16,
        }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        nestedScrollEnabled={true}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        contentInsetAdjustmentBehavior="automatic"
      >
        {/* Promo Card */}
        {!hasPro && (
          <PromoCard
            onPromoPress={() => router.push("/paywall")}
            onLayout={(e) => setUpgradeY(e.nativeEvent.layout.y)}
          />
        )}

        {hasPro && (
          <PremiumStatusCard
            customerInfo={customerInfo}
            isLoading={isLoadingRevenueCat}
          />
        )}

        {/* Post-trial 30% discount banner */}
        <PostTrialDiscountBanner />

        <SettingsSection title={t("sections.preferences")}>
          <DailyGoalPicker />
          <SettingsItem
            icon={Globe02Icon}
            title={t("language.title")}
            subtitle={currentLanguageLabel}
            onPress={() => {
              Haptics.selectionAsync();
              router.push("/tabs/screens/language" as any);
            }}
          />
          <SettingsItem
            icon={Notification01Icon}
            title={t("reminders.title")}
            subtitle={t("items.reminders.subtitle")}
            onPress={() => {
              Haptics.selectionAsync();
              router.push("/tabs/screens/reminders");
            }}
          />
          <SettingsItem
            icon={Settings01Icon}
            title={t("items.notifications.title")}
            subtitle={t("items.notifications.subtitle")}
            onPress={() => {
              Haptics.selectionAsync();
              router.push("/tabs/screens/notification-preferences");
            }}
          />
        </SettingsSection>

        <SettingsSection title={t("sections.account")}>
          <SettingsItem
            icon={UserIcon}
            title={t("items.editName.title")}
            onPress={() => handlePress("edit-name")}
            showArrow={false}
          />
          <SettingsItem
            icon={Copy01Icon}
            title={t("items.copyUserId.title")}
            onPress={handleCopyUserId}
            showArrow={false}
          />
        </SettingsSection>

        <SettingsSection title={t("sections.communitySupport")}>
          <SettingsItem
            icon={MessageOutgoing01Icon}
            title={t("support.title")}
            subtitle={t("items.support.subtitle")}
            onPress={() => {
              Haptics.selectionAsync();
              router.push("/tabs/screens/support-chat" as any);
            }}
          />
          <SettingsItem
            icon={Share01Icon}
            title={t("items.share.title")}
            subtitle={t("items.share.subtitle")}
            onPress={() => {
              Haptics.selectionAsync();
              handleShareApp();
            }}
          />
          <SettingsItem
            icon={StarIcon}
            title={t("items.rate.title")}
            subtitle={t("items.rate.subtitle")}
            onPress={handleRateUs}
            showArrow={false}
          />
        </SettingsSection>

        <SettingsSection title={t("sections.legalApp")}>
          <SettingsItem
            icon={File01Icon}
            title={t("items.terms")}
            onPress={handleTermsOfUse}
          />
          <SettingsItem
            icon={ShieldUserIcon}
            title={t("items.privacy")}
            onPress={handlePrivacyPolicy}
          />
          <SettingsItem
            icon={AlertSquareIcon}
            title={t("items.appInfo.title")}
            subtitle={t("items.appInfo.version", { version: Application.nativeApplicationVersion || "1.0.0" })}
            onPress={() => {}}
            showArrow={false}
          />
        </SettingsSection>

        <SettingsSection title={t("sections.accountManagement")}>
          {shouldShowSignIn ? (
            <SettingsItem
              icon={Login02Icon}
              title={t("items.signIn.title")}
              subtitle={t("items.signIn.subtitle")}
              onPress={() => {
                Haptics.selectionAsync();
                signInSheetRef.current?.present();
              }}
              showArrow={false}
            />
          ) : (
            <SettingsItem
              icon={Logout02Icon}
              title={t("items.signOut.title")}
              subtitle={t("items.signOut.subtitle")}
              onPress={() => setIsSignoutOPen(true)}
              showArrow={false}
            />
          )}
          <SettingsItem
            icon={Delete02Icon}
            title={t("items.deleteData.title")}
            subtitle={t("items.deleteData.subtitle")}
            onPress={() => {
              Haptics.selectionAsync();
              setShowEraseDataModal(true);
            }}
            danger={true}
            showArrow={false}
          />
        </SettingsSection>

        <SettingsDevSection
          onBulkImportPress={() => setShowImportModal(true)}
        />
      </Animated.ScrollView>

      <SettingsDialogs
        showModal={showModal}
        setShowModal={setShowModal}
        showImportModal={showImportModal}
        setShowImportModal={setShowImportModal}
        handleBulkImport={handleBulkImport}
        importing={importing}
        progress={progress}
        importStartDate={importStartDate}
        importDaysCount={importDaysCount}
        setImportDaysCount={setImportDaysCount}
        showEraseDataModal={showEraseDataModal}
        setShowEraseDataModal={setShowEraseDataModal}
        handleEraseDataConfirm={handleEraseDataConfirm}
        isDeleting={deleteUserDataMutation.isPending}
        isSignoutOPen={isSignoutOPen}
        setIsSignoutOPen={setIsSignoutOPen}
        signOut={signOut}
        isSigningOut={isSigningOut}
        signInSheetRef={signInSheetRef}
      />
    </View>
  );
}

import React from "react";
import { View, Animated, Share } from "react-native";
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
} from "@hugeicons/core-free-icons";

import { PromoCard } from "./components/PromoCard";
import { SettingsSection } from "./components/SettingsSection";
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

  const handleShareApp = async () => {
    try {
      await Share.share({
        message:
          "Check out Happy AI Journal! https://apps.apple.com/us/app/happy-ai-journal/id6755650433",
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

        <SettingsSection title="Preferences">
          <SettingsItem
            icon={Notification01Icon}
            title="Daily Reminders"
            subtitle="Schedule your reminders"
            onPress={() => {
              Haptics.selectionAsync();
              router.push("/tabs/screens/reminders");
            }}
          />
          <SettingsItem
            icon={Settings01Icon}
            title="Notifications"
            subtitle="Alerts & quiet hours"
            onPress={() => {
              Haptics.selectionAsync();
              router.push("/tabs/screens/notification-preferences");
            }}
          />
        </SettingsSection>

        <SettingsSection title="Account">
          <SettingsItem
            icon={UserIcon}
            title="Edit Name"
            onPress={() => handlePress("edit-name")}
            showArrow={false}
          />
          <SettingsItem
            icon={Copy01Icon}
            title="Copy User ID"
            onPress={handleCopyUserId}
            showArrow={false}
          />
        </SettingsSection>

        <SettingsSection title="Community & Support">
          <SettingsItem
            icon={MessageOutgoing01Icon}
            title="Support Chat"
            subtitle="Chat with our support team"
            onPress={() => {
              Haptics.selectionAsync();
              router.push("/tabs/screens/support-chat" as any);
            }}
          />
          <SettingsItem
            icon={Share01Icon}
            title="Share App"
            subtitle="Tell your friends about us"
            onPress={() => {
              Haptics.selectionAsync();
              handleShareApp();
            }}
          />
          <SettingsItem
            icon={StarIcon}
            title="Write a Review"
            onPress={handleRateUs}
            showArrow={false}
          />
        </SettingsSection>

        <SettingsSection title="Legal & App">
          <SettingsItem
            icon={File01Icon}
            title="Terms of Use"
            onPress={handleTermsOfUse}
          />
          <SettingsItem
            icon={ShieldUserIcon}
            title="Privacy Policy"
            onPress={handlePrivacyPolicy}
          />
          <SettingsItem
            icon={AlertSquareIcon}
            title="App Info"
            subtitle={`Version ${Application.nativeApplicationVersion || "1.0.0"}`}
            onPress={() => {}}
            showArrow={false}
          />
        </SettingsSection>

        <SettingsSection title="Account Management">
          {shouldShowSignIn ? (
            <SettingsItem
              icon={Login02Icon}
              title="Sign In"
              subtitle="Save your progress and Premium"
              onPress={() => {
                Haptics.selectionAsync();
                signInSheetRef.current?.present();
              }}
              showArrow={false}
            />
          ) : (
            <SettingsItem
              icon={Logout02Icon}
              title="Sign Out"
              subtitle="Sign out of your account"
              onPress={() => setIsSignoutOPen(true)}
              showArrow={false}
            />
          )}
          <SettingsItem
            icon={Delete02Icon}
            title="Delete all data"
            subtitle="Permanently delete all data"
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

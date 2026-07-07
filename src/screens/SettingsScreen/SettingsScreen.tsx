import React from "react";
import {
  View,
  Animated,
  Modal,
  Share,
  useWindowDimensions,
  Pressable,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
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
  Download02Icon,
  StarIcon,
  Brain01Icon,
} from "@hugeicons/core-free-icons";

import NameEditScreen from "../NameEditScreen/NameEditScreen";
import {
  EraseDataConfirmationModal,
  SignOutConfirmationModal,
} from "@/src/components/modals";
import { PromoCard } from "./components/PromoCard";
import { SettingsSection } from "./components/SettingsSection";
import { SettingsItem } from "./components/SettingsItem";
import { BulkImportModal } from "./components/BulkImportModal";

import { useSettingsModals } from "./hooks/useSettingsModals";
import { useSettingsBulkImport } from "./hooks/useSettingsBulkImport";
import { useSettingsAnimation } from "./hooks/useSettingsAnimation";
import { useRevenueCat } from "@/src/context/RevenueCatProvider";
import { SettingsHeader } from "./components/SettingsHeader";
import OnboardingChecklist from "@/src/components/onboarding/OnboardingChecklist";
import PostTrialDiscountBanner from "@/src/components/premium/PostTrialDiscountBanner";
import SignInBottomSheet from "@/src/components/SignInBottomSheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { PremiumStatusCard } from "./components/PremiumStatusCard";

export default React.memo(function SettingsScreen() {
  const router = useRouter();
  const { height: windowHeight } = useWindowDimensions();
  const signInSheetRef = React.useRef<BottomSheetModal>(null);
  const { customerInfo, hasPro, isLoadingRevenueCat, presentPaywall } =
    useRevenueCat();

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
    handleContactSupport,
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

  const { scrollY, upgradeY, setUpgradeY } = useSettingsAnimation();

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
    <View className="flex-1 bg-offwhite">
      <View className="flex-1 px-0 relative ">
        <Animated.ScrollView
          contentContainerClassName="flex-grow px-4"
          contentContainerStyle={{
            paddingBottom: 48,
            paddingTop: 10,
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
              onPromoPress={presentPaywall}
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

          {/* Onboarding checklist for new users */}
          <OnboardingChecklist />

          <SettingsSection title="Account & Preferences">
            <SettingsItem
              icon={Brain01Icon}
              tone="sage"
              title="Apple Intelligence"
              subtitle="On-device AI · Private & secure"
              onPress={() => {
                Haptics.selectionAsync();
                router.push("/tabs/screens/apple-intelligence");
              }}
            />
            <SettingsItem
              icon={Notification01Icon}
              tone="sage"
              title="Daily Reminders"
              subtitle="Customize multiple reminders"
              onPress={() => {
                Haptics.selectionAsync();
                router.push("/tabs/screens/reminders");
              }}
            />
            <SettingsItem
              icon={ShieldUserIcon}
              tone="sage"
              title="Notification Settings"
              subtitle="Control alerts and quiet hours"
              onPress={() => {
                Haptics.selectionAsync();
                router.push("/tabs/screens/notification-preferences");
              }}
            />
            <SettingsItem
              icon={UserIcon}
              tone="terracotta"
              title="Edit Name"
              onPress={() => handlePress("edit-name")}
            />
            <SettingsItem
              icon={Copy01Icon}
              tone="sage"
              title="Copy User ID"
              onPress={handleCopyUserId}
            />
            <SettingsItem
              icon={MessageOutgoing01Icon}
              tone="sage"
              title="Support Chat"
              subtitle="Chat with our support team"
              onPress={() => {
                Haptics.selectionAsync();
                router.push("/tabs/screens/support-chat" as any);
              }}
            />
            <SettingsItem
              icon={Share01Icon}
              tone="gold"
              title="Share App"
              subtitle="Tell your friends about us"
              onPress={() => {
                Haptics.selectionAsync();
                handleShareApp();
              }}
            />
            <SettingsItem
              icon={StarIcon}
              tone="gold"
              title="Write a Review"
              onPress={handleRateUs}
              isLast={true}
            />
          </SettingsSection>

          <SettingsSection title="Legal & App">
            <SettingsItem
              icon={File01Icon}
              tone="sage"
              title="Terms of Use"
              onPress={handleTermsOfUse}
            />
            <SettingsItem
              icon={ShieldUserIcon}
              tone="sage"
              title="Privacy Policy"
              onPress={handlePrivacyPolicy}
            />
            <SettingsItem
              icon={AlertSquareIcon}
              tone="gold"
              title="App Info"
              subtitle="Version 1.0.0 (Build 1)"
              onPress={() => {}}
              showArrow={false}
            />
            <SettingsItem
              icon={Download02Icon}
              tone="sage"
              title="Bulk Import Journals"
              subtitle="Import sample data"
              onPress={() => {
                Haptics.selectionAsync();
                setShowImportModal(true);
              }}
            />
            <SettingsItem
              icon={Delete02Icon}
              tone="danger"
              title="Erase Personal Data"
              subtitle="Permanently delete all data"
              onPress={() => {
                Haptics.selectionAsync();
                setShowEraseDataModal(true);
              }}
              danger={true}
            />
            {shouldShowSignIn ? (
              <SettingsItem
                icon={Login02Icon}
                tone="sage"
                title="Sign In"
                subtitle="Save your progress and Premium"
                onPress={() => {
                  Haptics.selectionAsync();
                  signInSheetRef.current?.present();
                }}
                isLast={true}
              />
            ) : (
              <SettingsItem
                icon={Logout02Icon}
                tone="danger"
                title="Sign Out"
                subtitle="Sign out of your account"
                onPress={() => setIsSignoutOPen(true)}
                isLast={true}
              />
            )}
          </SettingsSection>

          {/* Developer Section for Testing */}
          <SettingsSection title="Developer">
            <SettingsItem
              icon={AlertSquareIcon}
              tone="gold"
              title="Active AI Model"
              subtitle="Configure local LLM"
              onPress={() => {
                Haptics.selectionAsync();
                router.push("/tabs/screens/active-model" as any);
              }}
            />
            <SettingsItem
              icon={StarIcon}
              tone="gold"
              title="Test Graph Components"
              subtitle="View mock graph and UI components"
              onPress={() => {
                Haptics.selectionAsync();
                router.push("/tabs/screens/test-charts" as any);
              }}
              isLast={true}
            />
          </SettingsSection>
        </Animated.ScrollView>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal.showModal}
      >
        <NameEditScreen
          setShowModal={() => setShowModal({ showModal: false, modalType: "" })}
        />
      </Modal>

      <BulkImportModal
        visible={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleBulkImport}
        importing={importing}
        progress={progress}
        importStartDate={importStartDate}
        importDaysCount={importDaysCount}
        setImportDaysCount={setImportDaysCount}
      />

      <EraseDataConfirmationModal
        visible={showEraseDataModal}
        onClose={() => setShowEraseDataModal(false)}
        onConfirm={handleEraseDataConfirm}
        isDeleting={deleteUserDataMutation.isPending}
      />

      <SignOutConfirmationModal
        isSignoutOPen={isSignoutOPen}
        handleClose={() => {
          if (!isSigningOut) {
            setIsSignoutOPen(false);
          }
        }}
        onConfirm={signOut}
        isLoading={isSigningOut}
      />
      <SignInBottomSheet ref={signInSheetRef} onSuccess={() => {}} />
    </View>
  );
});

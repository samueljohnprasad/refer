import React from "react";
import { View, Animated, Modal } from "react-native";
import { Stack, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import * as Haptics from "expo-haptics";
import {
  AlertSquareIcon,
  Delete02Icon,
  Download02Icon,
  File01Icon,
  Logout02Icon,
  MessageOutgoing01Icon,
  Notification01Icon,
  ShieldUserIcon,
  StarIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";

import NameEditScreen from "../NameEditScreen/NameEditScreen";
import EraseDataConfirmationModal from "@/src/components/modals/EraseDataConfirmationModal";
import SignOutConfirmationModal from "@/src/components/modals/SignOutConfirmationModal";

import { SettingsHeader } from "./components/SettingsHeader";
import { PromoCard } from "./components/PromoCard";
import { SettingsSection } from "./components/SettingsSection";
import { SettingsItem } from "./components/SettingsItem";
import { BulkImportModal } from "./components/BulkImportModal";

import { useSettingsModals } from "./hooks/useSettingsModals";
import { useSettingsBulkImport } from "./hooks/useSettingsBulkImport";
import { useSettingsAnimation } from "./hooks/useSettingsAnimation";

export default React.memo(function SettingsScreen() {
  const router = useRouter();
  const headerHeight = useHeaderHeight();

  const {
    isSignoutOPen,
    setIsSignoutOPen,
    showModal,
    setShowModal,
    showEraseDataModal,
    setShowEraseDataModal,
    deleteUserDataMutation,
    isSigningOut,
    signOut,
    handlePress,
    handleRateUs,
    handleContactSupport,
    handlePrivacyPolicy,
    handleTermsOfUse,
    handleEraseDataConfirm,
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

  return (
    <SafeAreaView className="flex-1 bg-[#F8F8FF]" edges={["bottom"]}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTransparent: true,
          headerBlurEffect: "regular",
          header: () => (
            <SettingsHeader scrollY={scrollY} upgradeY={upgradeY} />
          ),
        }}
      />
      <View className="flex-1 px-0">
        <Animated.ScrollView
          contentContainerClassName="flex-grow px-4"
          contentContainerStyle={{
            paddingTop: headerHeight,
            paddingBottom: 24,
          }}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          nestedScrollEnabled={true}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          contentInsetAdjustmentBehavior="automatic"
        >
          {/* Promo Card */}
          <PromoCard onLayout={(e) => setUpgradeY(e.nativeEvent.layout.y)} />

          <SettingsSection>
            <SettingsItem
              icon={Notification01Icon}
              iconColor="#A855F7"
              iconBgColor="#E9D5FF"
              title="Daily Reminders"
              subtitle="Customize multiple reminders"
              onPress={() => {
                Haptics.selectionAsync();
                router.push("/tabs/screens/reminders" as any);
              }}
            />
            <SettingsItem
              icon={UserIcon}
              iconColor="#EF4444"
              iconBgColor="#FECACA"
              title="Edit Name"
              onPress={() => handlePress("edit-name")}
            />
            <SettingsItem
              icon={MessageOutgoing01Icon}
              iconColor="#06B6D4"
              iconBgColor="#CFFAFE"
              title="Contact Support"
              onPress={handleContactSupport}
            />
            <SettingsItem
              icon={StarIcon}
              iconColor="#16A34A"
              iconBgColor="#DCFCE7"
              title="Rate Us"
              onPress={handleRateUs}
              isLast={true}
            />
          </SettingsSection>

          {/* Settings Group 2 */}
          <SettingsSection className="mt-[14px]">
            <SettingsItem
              icon={File01Icon}
              iconColor="#9333EA"
              iconBgColor="#F3E8FF"
              title="Terms of Use"
              onPress={handleTermsOfUse}
            />
            <SettingsItem
              icon={ShieldUserIcon}
              iconColor="#2563EB"
              iconBgColor="#DBEAFE"
              title="Privacy Policy"
              onPress={handlePrivacyPolicy}
            />
            <SettingsItem
              icon={Delete02Icon}
              iconColor="#DC2626"
              iconBgColor="#FEE2E2"
              title="Erase Personal Data"
              subtitle="Permanently delete all data"
              onPress={() => {
                Haptics.selectionAsync();
                setShowEraseDataModal(true);
              }}
            />
            <SettingsItem
              icon={AlertSquareIcon}
              iconColor="#D97706"
              iconBgColor="#FEF3C7"
              title="App Info"
              subtitle="Version 1.0.0 (Build 1)"
              onPress={() => {}}
              showArrow={false}
            />
            {/* <SettingsItem
              icon={Download02Icon}
              iconColor="#9333EA"
              iconBgColor="#E9D5FF"
              title="Bulk Import Journals"
              subtitle="Import sample data"
              onPress={() => {
                Haptics.selectionAsync();
                setShowImportModal(true);
              }}
            /> */}
            <SettingsItem
              icon={Logout02Icon}
              iconColor="#3B82F6"
              iconBgColor="#BFDBFE"
              title="Sign Out"
              onPress={() => setIsSignoutOPen(true)}
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
    </SafeAreaView>
  );
});

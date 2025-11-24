import { useState } from "react";
import { Alert, Linking } from "react-native";
import * as Haptics from "expo-haptics";
import * as WebBrowser from "expo-web-browser";
import { useAuth } from "@/src/context/AuthContext";
import { useDeleteUser } from "@/hooks/useDeleteUser";
import { useQueryClient } from "@tanstack/react-query";

export const useSettingsModals = () => {
  const [isSignoutOPen, setIsSignoutOPen] = useState(false);
  const { signOut, isSigningOut } = useAuth();
  const queryClient = useQueryClient();

  const [showModal, setShowModal] = useState({
    modalType: "",
    showModal: false,
  });

  const [showEraseDataModal, setShowEraseDataModal] = useState(false);
  const deleteUserDataMutation = useDeleteUser();

  const handlePress = (type: string) => {
    Haptics.selectionAsync();
    setShowModal({ modalType: type, showModal: true });
  };

  const handleRateUs = () => {
    Haptics.selectionAsync();
    Linking.openURL("https://apps.apple.com/app/idYOUR_APP_ID");
  };

  const handleContactSupport = async () => {
    Haptics.selectionAsync();
    const url = "mailto:happy.journals.app@gmail.com";
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert(
          "No Mail App Found",
          "Please email us at happy.journals.app@gmail.com"
        );
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "Unable to open mail app. Please email us at happy.journals.app@gmail.com"
      );
    }
  };

  const handlePrivacyPolicy = async () => {
    Haptics.selectionAsync();
    await WebBrowser.openBrowserAsync(
      "https://happie.lovable.app/privacy-policy"
    );
  };

  const handleTermsOfUse = async () => {
    Haptics.selectionAsync();
    await WebBrowser.openBrowserAsync("https://happie.lovable.app/terms");
  };

  const handleEraseDataConfirm = async (): Promise<void> => {
    try {
      await deleteUserDataMutation.mutateAsync();
      setShowEraseDataModal(false);
      // Sign out after successful deletion
      queryClient.clear();

      await signOut();
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to delete your data. Please try again or contact support."
      );
    }
  };

  return {
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
  };
};

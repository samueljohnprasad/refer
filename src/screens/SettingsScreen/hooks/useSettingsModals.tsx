import { useState } from "react";
import { Alert, Linking } from "react-native";
import * as Haptics from "expo-haptics";
import * as WebBrowser from "expo-web-browser";
import * as Clipboard from "expo-clipboard";
import { useAuth } from "@/src/context/AuthContext";
import { useDeleteUser } from "@/hooks/useDeleteUser";
import { useQueryClient } from "@tanstack/react-query";
import { useToast, Toast, ToastTitle } from "@/components/ui/toast";

export const useSettingsModals = () => {
  const [isSignoutOPen, setIsSignoutOPen] = useState(false);
  const { signOut, isSigningOut, user, isAnonymous } = useAuth();
  const queryClient = useQueryClient();
  const toast = useToast();
  const shouldShowSignIn = !user || isAnonymous;

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
    const itunesItemId = "6755650433";
    Linking.openURL(
      `itms-apps://itunes.apple.com/app/viewContentsUserReviews/id${itunesItemId}?action=write-review`
    );
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

  const handleCopyUserId = async () => {
    Haptics.selectionAsync();
    if (user?.id) {
      await Clipboard.setStringAsync(user.id);
      toast.show({
        placement: "top",
        render: ({ id }) => {
          return (
            <Toast nativeID={id} variant="solid" action="success">
              <ToastTitle>User ID copied to clipboard</ToastTitle>
            </Toast>
          );
        },
      });
    }
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
    shouldShowSignIn,
    signOut,
    handlePress,
    handleRateUs,
    handleContactSupport,
    handlePrivacyPolicy,
    handleTermsOfUse,
    handleEraseDataConfirm,
    handleCopyUserId,
  };
};

import { useState } from "react";
import { Alert, Linking } from "react-native";
import * as Haptics from "expo-haptics";
import { useAuth } from "@/src/context/AuthContext";
import { useDeleteUser } from "@/hooks/useDeleteUser";

export const useSettingsModals = () => {
  const [isSignoutOPen, setIsSignoutOPen] = useState(false);
  const { signOut, isSigningOut } = useAuth();

  const [showModal, setShowModal] = useState({
    modalType: "",
    showModal: false,
  });

  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTermsAndConditions, setShowTermsAndConditions] = useState(false);
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

  const handleEraseDataConfirm = async (): Promise<void> => {
    try {
      await deleteUserDataMutation.mutateAsync();
      setShowEraseDataModal(false);
      // Sign out after successful deletion
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
    showPrivacyPolicy,
    setShowPrivacyPolicy,
    showTermsAndConditions,
    setShowTermsAndConditions,
    showEraseDataModal,
    setShowEraseDataModal,
    deleteUserDataMutation,
    isSigningOut,
    signOut,
    handlePress,
    handleRateUs,
    handleEraseDataConfirm,
  };
};

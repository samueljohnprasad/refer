import React from "react";
import { Modal } from "react-native";
import NameEditScreen from "@/src/screens/NameEditScreen/NameEditScreen";
import {
  EraseDataConfirmationModal,
  SignOutConfirmationModal,
} from "@/src/components/modals";
import { BulkImportModal } from "./BulkImportModal";
import SignInBottomSheet from "@/src/components/SignInBottomSheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

interface SettingsDialogsProps {
  showModal: { showModal: boolean; modalType: string };
  setShowModal: (val: { showModal: boolean; modalType: string }) => void;
  showImportModal: boolean;
  setShowImportModal: (val: boolean) => void;
  handleBulkImport: (config: any) => void;
  importing: boolean;
  progress: number;
  importStartDate: string;
  importDaysCount: number;
  setImportDaysCount: (count: number) => void;
  showEraseDataModal: boolean;
  setShowEraseDataModal: (val: boolean) => void;
  handleEraseDataConfirm: () => void;
  isDeleting: boolean;
  isSignoutOPen: boolean;
  setIsSignoutOPen: (val: boolean) => void;
  signOut: () => void;
  isSigningOut: boolean;
  signInSheetRef: React.RefObject<BottomSheetModal>;
}

export const SettingsDialogs: React.FC<SettingsDialogsProps> = ({
  showModal,
  setShowModal,
  showImportModal,
  setShowImportModal,
  handleBulkImport,
  importing,
  progress,
  importStartDate,
  importDaysCount,
  setImportDaysCount,
  showEraseDataModal,
  setShowEraseDataModal,
  handleEraseDataConfirm,
  isDeleting,
  isSignoutOPen,
  setIsSignoutOPen,
  signOut,
  isSigningOut,
  signInSheetRef,
}) => {
  return (
    <>
      <Modal
        animationType="slide"
        presentationStyle="pageSheet"
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
        isDeleting={isDeleting}
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
    </>
  );
};

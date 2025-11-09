import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { BlurView } from "expo-blur";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

interface EraseDataConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isDeleting?: boolean;
}

const EraseDataConfirmationModal: React.FC<EraseDataConfirmationModalProps> = ({
  visible,
  onClose,
  onConfirm,
  isDeleting = false,
}) => {
  const handleClose = (): void => {
    if (isDeleting) return; // Prevent closing while deleting
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  const handleConfirm = async (): Promise<void> => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    await onConfirm();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <BlurView intensity={90} tint="dark" className="flex-1 justify-center items-center px-5">
        {/* Modal Container */}
        <View className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
          {/* Warning Icon */}
          <View className="items-center pt-8 pb-4">
            <View className="w-20 h-20 rounded-full bg-red-100 items-center justify-center mb-4">
              <MaterialCommunityIcons
                name="alert-circle"
                size={48}
                color="#EF4444"
              />
            </View>
          </View>

          {/* Header */}
          <View className="px-6 pb-4">
            <Text className="text-gray-900 text-2xl font-bold text-center mb-2">
              Erase All Personal Data?
            </Text>
            <Text className="text-gray-600 text-base text-center leading-6">
              This action cannot be undone
            </Text>
          </View>

          {/* Content */}
          <View className="px-6 pb-6">
            <View className="bg-red-50 rounded-2xl p-4 mb-4">
              <Text className="text-red-800 text-sm font-semibold mb-3">
                The following data will be permanently deleted:
              </Text>
              
              <DataItem icon="book" text="All journal entries and transcripts" />
              <DataItem icon="heart" text="Mood tracking history and emotions" />
              <DataItem icon="brain" text="AI-generated insights and analysis" />
              <DataItem icon="chart-line" text="Streaks and engagement statistics" />
              <DataItem icon="account" text="Profile and account information" />
            </View>

            <View className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
              <View className="flex-row items-start">
                <Feather name="alert-triangle" size={18} color="#F59E0B" />
                <Text className="text-amber-800 text-sm ml-2 flex-1 leading-5">
                  You will be immediately logged out after deletion. Your account
                  cannot be recovered.
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="px-6 pb-6 gap-3">
            {/* Cancel Button */}
            <TouchableOpacity
              onPress={handleClose}
              disabled={isDeleting}
              className={`rounded-2xl py-4 items-center justify-center ${
                isDeleting ? "bg-gray-200" : "bg-gray-100 active:bg-gray-200"
              }`}
              activeOpacity={0.8}
            >
              <Text
                className={`text-base font-bold ${
                  isDeleting ? "text-gray-400" : "text-gray-700"
                }`}
              >
                Cancel
              </Text>
            </TouchableOpacity>

            {/* Delete Button */}
            <TouchableOpacity
              onPress={handleConfirm}
              disabled={isDeleting}
              className={`rounded-2xl py-4 items-center justify-center ${
                isDeleting
                  ? "bg-red-300"
                  : "bg-red-600 active:bg-red-700"
              }`}
              activeOpacity={0.8}
            >
              {isDeleting ? (
                <View className="flex-row items-center">
                  <ActivityIndicator size="small" color="#FFF" />
                  <Text className="text-white text-base font-bold ml-2">
                    Deleting...
                  </Text>
                </View>
              ) : (
                <Text className="text-white text-base font-bold">
                  Yes, Erase All Data
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};

// Helper Component for Data Items
interface DataItemProps {
  icon: string;
  text: string;
}

const DataItem: React.FC<DataItemProps> = ({ icon, text }) => {
  return (
    <View className="flex-row items-center mb-2">
      <View className="w-6 h-6 rounded-full bg-red-200 items-center justify-center mr-3">
        <MaterialCommunityIcons
          name={icon as any}
          size={14}
          color="#991B1B"
        />
      </View>
      <Text className="text-red-900 text-sm flex-1">{text}</Text>
    </View>
  );
};

export default EraseDataConfirmationModal;

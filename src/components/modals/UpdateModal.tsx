import React, { useCallback, useEffect, useRef } from "react";
import { View, Text, Pressable, Linking } from "react-native";
import ShortBottomModal from "../ShortBottomModal";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  Download04Icon,
  Cancel01Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import * as Haptics from "expo-haptics";
import VersionCheck from "react-native-version-check";

interface UpdateModalProps {
  /** Whether the modal is visible */
  isVisible: boolean;
  /** Callback when modal is dismissed */
  onDismiss?: () => void;
  /** App Store URL - defaults to Happy AI Journal */
  appStoreUrl?: string;
  /** Optional: Current version string to display */
  currentVersion?: string;
  /** Optional: Latest version string to display */
  latestVersion?: string;
  /** Optional: Custom title */
  title?: string;
  /** Optional: Custom message */
  message?: string;
  /** Optional: Update button text */
  updateButtonText?: string;
  /** Optional: Later button text */
  laterButtonText?: string;
}

export const UpdateModal: React.FC<UpdateModalProps> = ({
  isVisible,
  onDismiss,
  appStoreUrl = "https://apps.apple.com/us/app/happy-ai-journal/id6755650433",
  currentVersion,
  latestVersion,
  title = "Update Available",
  message = "A new version is available! Update now to get the latest features and improvements.",
  updateButtonText = "Update Now",
  laterButtonText = "Later",
}) => {
  const sheetRef = useRef<BottomSheetModal>(null);

  const closeHandler = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onDismiss?.();
    sheetRef.current?.close();
  }, [onDismiss]);

  useEffect(() => {
    if (isVisible) {
      sheetRef.current?.present();
    } else {
      closeHandler();
    }
  }, [isVisible]);

  const handleUpdate = useCallback(async (): Promise<void> => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const canOpen = await Linking.canOpenURL(appStoreUrl);
      const storeUrl = await VersionCheck.getStoreUrl({
        appID: "6755650433",
        packageName: "com.samuelprasad.happy",
      });
      if (canOpen) {
        await Linking.openURL(storeUrl);
      } else {
        console.error("Cannot open App Store URL:", appStoreUrl);
      }

      // Close modal after opening store
      closeHandler();
    } catch (error) {
      console.error("Error opening App Store:", error);
    }
  }, [appStoreUrl]);

  // Build version info message if versions are provided
  const versionMessage = React.useMemo(() => {
    if (currentVersion && latestVersion) {
      return `${message}\n\nCurrent: v${currentVersion} → Latest: v${latestVersion}`;
    }
    return message;
  }, [message, currentVersion, latestVersion]);

  return (
    <ShortBottomModal ref={sheetRef} snapPoints={["40%"]}>
      <VStack
        className="flex-1 px-6 pt-2 items-center justify-between pb-8"
        space="md"
      >
        <View className="items-center w-full">
          {/* Icon Header */}
          <View className="w-14 h-14 rounded-full items-center justify-center mb-5 bg-purple-50">
            <HugeiconsIcon icon={SparklesIcon} size={26} color="#7B61FF" />
          </View>

          <Heading className="text-center text-4xl font-cormorantSemiBold text-[#1f2937] mb-3 leading-10">
            {title}
          </Heading>

          <Text className="text-gray-600 text-center text-lg px-2 leading-7 font-medium">
            {versionMessage}
          </Text>
        </View>

        {/* Buttons */}
        <View className="flex-row gap-3 w-full mt-4">
          <Pressable
            onPress={closeHandler}
            className="flex-1 bg-[#F6F4FF] rounded-full flex-row items-center justify-center py-4 active:opacity-80"
          >
            <Text className="text-gray-900 font-bold text-lg mr-2">
              {laterButtonText}
            </Text>
            <HugeiconsIcon icon={Cancel01Icon} size={20} color="#1f2937" />
          </Pressable>

          <Pressable
            onPress={handleUpdate}
            className="flex-1 bg-[#7B61FF] rounded-full flex-row items-center justify-center py-4 active:opacity-90"
          >
            <Text className="text-white font-bold text-lg mr-2">
              {updateButtonText}
            </Text>
            <HugeiconsIcon icon={Download04Icon} size={20} color="white" />
          </Pressable>
        </View>
      </VStack>
    </ShortBottomModal>
  );
};

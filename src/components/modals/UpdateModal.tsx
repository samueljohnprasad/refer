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
    Haptics.selectionAsync();
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
      
      let targetUrl = appStoreUrl;
      try {
        const storeUrl = await VersionCheck.getStoreUrl({
          appID: "6755650433",
          packageName: "com.samuelprasad.happy",
        });
        if (storeUrl) {
          targetUrl = storeUrl;
        }
      } catch (e) {
        console.warn("Could not fetch dynamic store URL, using fallback", e);
      }

      // Some simulators or devices might return false for canOpenURL if schemes aren't configured,
      // but openURL will still work for standard https:// links.
      await Linking.openURL(targetUrl);

      // Close modal after opening store
      closeHandler();
    } catch (error) {
      console.error("Error opening App Store:", error);
    }
  }, [appStoreUrl, closeHandler]);

  return (
    <ShortBottomModal ref={sheetRef} snapPoints={["45%"]}>
      <VStack
        className="flex-1 px-5 pt-1 items-center justify-between pb-6"
        space="sm"
      >
        <View className="items-center w-full">
          {/* Icon Header */}
          <View className="w-12 h-12 rounded-full items-center justify-center mb-4 bg-purple-50">
            <HugeiconsIcon icon={SparklesIcon} size={26} color="#7B61FF" />
          </View>

          <Heading className="text-center text-3xl font-cormorantSemiBold text-[#1f2937] mb-2 leading-9">
            {title}
          </Heading>

          <Text className="text-gray-600 text-center text-lg px-2 leading-7">
            {message}
          </Text>

          {/* Version info on separate line for better readability */}
          {currentVersion && latestVersion && (
            <Text className="text-gray-700 text-center text-sm mt-3 font-semibold">
              Current: v{currentVersion} → Latest: v{latestVersion}
            </Text>
          )}
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

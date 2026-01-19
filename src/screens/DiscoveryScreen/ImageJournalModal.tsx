import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { extractTextFromImage } from "@/src/network/extractTextFromImage";
import { callMyFunction } from "@/src/network/transcribeAudio";
import { InsightsType } from "@/src/network/genAi";

interface ImageJournalModalProps {
  sheetRef: React.RefObject<BottomSheetModal>;
  onClose: () => void;
  onInsightsReady: (insights: InsightsType, transcript: string) => void;
  selectedDate: Date;
}

type ProcessingStep =
  | "idle"
  | "capturing"
  | "extracting"
  | "analyzing"
  | "done"
  | "error";

const STEP_MESSAGES: Record<ProcessingStep, string> = {
  idle: "Ready to capture",
  capturing: "Opening camera...",
  extracting: "Reading your journal...",
  analyzing: "Generating insights...",
  done: "Complete!",
  error: "Something went wrong",
};

export const ImageJournalModal: React.FC<ImageJournalModalProps> = ({
  sheetRef,
  onClose,
  onInsightsReady,
  selectedDate,
}) => {
  const { bottom } = useSafeAreaInsets();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [step, setStep] = useState<ProcessingStep>("idle");
  const [extractedText, setExtractedText] = useState<string>("");

  const resetState = useCallback((): void => {
    setImageUri(null);
    setStep("idle");
    setExtractedText("");
  }, []);

  const handleClose = useCallback((): void => {
    resetState();
    onClose();
  }, [resetState, onClose]);

  const captureImage = useCallback(async (): Promise<void> => {
    try {
      setStep("capturing");

      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Camera Permission Required",
          "Please allow camera access to scan your journal pages."
        );
        setStep("idle");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        quality: 0.8,
        allowsEditing: true,
        aspect: [3, 4],
      });

      if (result.canceled || !result.assets?.[0]?.uri) {
        setStep("idle");
        return;
      }

      setImageUri(result.assets[0].uri);
      await processImage(result.assets[0].uri);
    } catch (error) {
      console.error("Camera error:", error);
      setStep("error");
      Alert.alert("Error", "Failed to capture image. Please try again.");
    }
  }, []);

  const pickImage = useCallback(async (): Promise<void> => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Gallery Permission Required",
          "Please allow access to your photos to scan journal pages."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 0.8,
        allowsEditing: true,
        aspect: [3, 4],
      });

      if (result.canceled || !result.assets?.[0]?.uri) {
        return;
      }

      setImageUri(result.assets[0].uri);
      await processImage(result.assets[0].uri);
    } catch (error) {
      console.error("Gallery error:", error);
      setStep("error");
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  }, []);

  const processImage = useCallback(
    async (uri: string): Promise<void> => {
      try {
        // Step 1: Extract text from image
        setStep("extracting");
        const text = await extractTextFromImage(uri);
        setExtractedText(text);

        // Step 2: Generate AI insights
        setStep("analyzing");
        const insights = await callMyFunction({
          journal: text,
          isAudio: false,
        });

        setStep("done");

        // Pass insights back to parent
        setTimeout(() => {
          onInsightsReady(insights, text);
          handleClose();
        }, 500);
      } catch (error) {
        console.error("Processing error:", error);
        setStep("error");
        Alert.alert(
          "Processing Failed",
          error instanceof Error
            ? error.message
            : "Failed to process journal image."
        );
      }
    },
    [onInsightsReady, handleClose]
  );

  const handleRetake = useCallback((): void => {
    resetState();
    captureImage();
  }, [resetState, captureImage]);

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={["85%"]}
      onDismiss={handleClose}
      style={{
        marginHorizontal: 8,
        borderRadius: 56,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}
      backgroundStyle={{ backgroundColor: "#F9FAFB" }}
      handleIndicatorStyle={{ backgroundColor: "#D1D5DB" }}
    >
      <BottomSheetView
        style={{ flex: 1, paddingBottom: bottom + 16, paddingHorizontal: 20 }}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-full bg-violet-100 items-center justify-center">
              <Feather name="camera" size={20} color="#7C3AED" />
            </View>
            <Text className="text-xl font-bold text-gray-800 ml-3">
              Scan Journal
            </Text>
          </View>
          <TouchableOpacity onPress={handleClose} className="p-2">
            <Feather name="x" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View className="flex-1">
          {!imageUri ? (
            // Capture prompt
            <View className="flex-1 items-center justify-center">
              <View className="w-32 h-32 rounded-full bg-violet-50 items-center justify-center mb-6">
                <Feather name="camera" size={48} color="#7C3AED" />
              </View>
              <Text className="text-lg font-semibold text-gray-800 text-center mb-2">
                Capture Your Journal Page
              </Text>
              <Text className="text-sm text-gray-500 text-center px-8 mb-8">
                Take a photo of your handwritten or printed journal to extract
                text and get AI insights
              </Text>
              <TouchableOpacity
                onPress={captureImage}
                className="bg-violet-600 px-8 py-4 rounded-full flex-row items-center mb-4"
              >
                <Feather name="camera" size={20} color="white" />
                <Text className="text-white font-semibold text-base ml-2">
                  Open Camera
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={pickImage}
                className="bg-violet-100 px-8 py-4 rounded-full flex-row items-center"
              >
                <Feather name="image" size={20} color="#7C3AED" />
                <Text className="text-violet-700 font-semibold text-base ml-2">
                  Select from Gallery
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            // Image preview and processing
            <View className="flex-1">
              {/* Image Preview */}
              <View className="flex-1 rounded-2xl overflow-hidden bg-gray-100 mb-4">
                <Image
                  source={{ uri: imageUri }}
                  className="w-full h-full"
                  resizeMode="contain"
                />
                {/* Processing overlay */}
                {step !== "idle" && step !== "done" && (
                  <View className="absolute inset-0 bg-black/50 items-center justify-center">
                    <View className="bg-white rounded-2xl p-6 items-center mx-8">
                      <ActivityIndicator size="large" color="#7C3AED" />
                      <Text className="text-gray-800 font-semibold mt-4 text-center">
                        {STEP_MESSAGES[step]}
                      </Text>
                      {step === "extracting" && (
                        <Text className="text-gray-500 text-sm mt-2 text-center">
                          Reading handwritten text...
                        </Text>
                      )}
                      {step === "analyzing" && (
                        <Text className="text-gray-500 text-sm mt-2 text-center">
                          Creating personalized insights...
                        </Text>
                      )}
                    </View>
                  </View>
                )}
              </View>

              {/* Extracted text preview */}
              {extractedText && step === "analyzing" && (
                <View className="bg-white rounded-xl p-4 mb-4 max-h-32">
                  <Text className="text-xs text-gray-400 mb-1">
                    Extracted Text:
                  </Text>
                  <Text className="text-sm text-gray-600" numberOfLines={4}>
                    {extractedText}
                  </Text>
                </View>
              )}

              {/* Action buttons */}
              {step === "error" && (
                <View className="flex-row gap-3">
                  <TouchableOpacity
                    onPress={handleClose}
                    className="flex-1 bg-gray-100 py-4 rounded-full items-center"
                  >
                    <Text className="text-gray-700 font-semibold">Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleRetake}
                    className="flex-1 bg-violet-600 py-4 rounded-full items-center"
                  >
                    <Text className="text-white font-semibold">Try Again</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default ImageJournalModal;

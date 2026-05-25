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
import { BRAND_SURFACE, INK_SOFT, SAGE } from "@/lib/tokens";

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
        borderRadius: 32,
        shadowColor: SAGE[600],
        shadowOffset: {
          width: 0,
          height: -6,
        },
        shadowOpacity: 0.12,
        shadowRadius: 18,
        elevation: 5,
      }}
      backgroundStyle={{
        backgroundColor: BRAND_SURFACE,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
      }}
      handleIndicatorStyle={{ backgroundColor: SAGE[100], width: 48 }}
    >
      <BottomSheetView
        style={{ flex: 1, paddingBottom: bottom + 16, paddingHorizontal: 20 }}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6 pt-1">
          <View className="flex-row items-center">
            <View className="w-12 h-12 rounded-[18px] bg-sage-pill items-center justify-center">
              <Feather name="camera" size={22} color={SAGE[600]} />
            </View>
            <Text className="text-2xl happy-font-body-bold text-ink ml-3">
              Scan Journal
            </Text>
          </View>
          <TouchableOpacity onPress={handleClose} className="p-2">
            <Feather name="x" size={26} color={INK_SOFT} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View className="flex-1">
          {!imageUri ? (
            // Capture prompt
            <View className="flex-1 items-center justify-center">
              <View className="happy-mascot-stage w-40 h-40 rounded-[44px] bg-sage-50 border-0 items-center justify-center mb-7">
                <Feather name="camera" size={54} color={SAGE[600]} />
              </View>
              <Text className="text-[28px] leading-8 happy-font-heading-bold text-ink text-center mb-3">
                Capture Your Journal Page
              </Text>
              <Text className="text-base happy-font-body text-ink-muted text-center px-8 mb-8 leading-6">
                Take a photo of your handwritten or printed journal to extract
                text and get AI insights
              </Text>
              <TouchableOpacity
                onPress={captureImage}
                className="happy-brand-primary-cta px-9 py-4 rounded-full flex-row items-center mb-4"
                activeOpacity={0.88}
              >
                <Feather name="camera" size={20} color={BRAND_SURFACE} />
                <Text className="text-white happy-font-body-bold text-base ml-2">
                  Open Camera
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={pickImage}
                className="bg-sage-pill px-8 py-4 rounded-full flex-row items-center"
                activeOpacity={0.82}
              >
                <Feather name="image" size={20} color={SAGE[600]} />
                <Text className="text-sage-600 happy-font-body-bold text-base ml-2">
                  Select from Gallery
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            // Image preview and processing
            <View className="flex-1">
              {/* Image Preview */}
              <View className="flex-1 rounded-[28px] overflow-hidden bg-sage-50 mb-4 border border-sage-100">
                <Image
                  source={{ uri: imageUri }}
                  className="w-full h-full"
                  resizeMode="contain"
                />
                {/* Processing overlay */}
                {step !== "idle" && step !== "done" && (
                  <View className="absolute inset-0 bg-black/50 items-center justify-center">
                    <View className="bg-white rounded-[28px] p-6 items-center mx-8 border border-sage-100">
                      <ActivityIndicator size="large" color={SAGE[500]} />
                      <Text className="text-ink happy-font-body-bold mt-4 text-center">
                        {STEP_MESSAGES[step]}
                      </Text>
                      {step === "extracting" && (
                        <Text className="text-ink-muted happy-font-body text-sm mt-2 text-center">
                          Reading handwritten text...
                        </Text>
                      )}
                      {step === "analyzing" && (
                        <Text className="text-ink-muted happy-font-body text-sm mt-2 text-center">
                          Creating personalized insights...
                        </Text>
                      )}
                    </View>
                  </View>
                )}
              </View>

              {/* Extracted text preview */}
              {extractedText && step === "analyzing" && (
                <View className="bg-sage-50 rounded-2xl p-4 mb-4 max-h-32 border border-sage-100">
                  <Text className="text-xs text-sage-500 mb-1 happy-font-body-bold uppercase tracking-widest">
                    Extracted Text:
                  </Text>
                  <Text
                    className="text-sm text-ink-soft happy-font-body"
                    numberOfLines={4}
                  >
                    {extractedText}
                  </Text>
                </View>
              )}

              {/* Action buttons */}
              {step === "error" && (
                <View className="flex-row gap-3">
                  <TouchableOpacity
                    onPress={handleClose}
                    className="flex-1 bg-sage-pill py-4 rounded-full items-center"
                  >
                    <Text className="text-sage-600 happy-font-body-bold">
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleRetake}
                    className="flex-1 happy-brand-primary-cta py-4 rounded-full items-center"
                  >
                    <Text className="text-white happy-font-body-bold">
                      Try Again
                    </Text>
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

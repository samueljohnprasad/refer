import React, { useCallback, useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import { Host, BottomSheet, Group, RNHostView } from "@expo/ui/swift-ui";
import {
  presentationDetents,
  presentationDragIndicator,
} from "@expo/ui/swift-ui/modifiers";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { extractTextFromImage } from "@/src/network/extractTextFromImage";
import { callMyFunction } from "@/src/network/transcribeAudio";
import { InsightsType } from "@/src/network/genAi";
import { BRAND_SURFACE, INK_SOFT, SAGE } from "@/lib/tokens";
import { Button } from "@/src/components/ui/Button";
import { Text } from "@/src/components/ui/Text";

interface ImageJournalModalProps {
  visible: boolean;
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
  visible,
  onClose,
  onInsightsReady,
}) => {
  if (!visible) return null;

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [step, setStep] = useState<ProcessingStep>("idle");
  const [extractedText, setExtractedText] = useState<string>("");
  const [extractedInsights, setExtractedInsights] = useState<InsightsType | null>(null);

  const resetState = useCallback((): void => {
    setImageUri(null);
    setStep("idle");
    setExtractedText("");
    setExtractedInsights(null);
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

        setExtractedInsights(insights);
        setStep("done");
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
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Host>
        <BottomSheet
          isPresented={visible}
          onIsPresentedChange={(val: boolean) => {
            if (!val) {
              handleClose();
            }
          }}
        >
          <Group
            modifiers={[
              presentationDetents(imageUri ? [{ fraction: 0.85 }] : [{ fraction: 0.45 }]),
              presentationDragIndicator("visible"),
            ]}
          >
            <RNHostView>
              <View className="flex-1 px-5 pb-6">
                {/* Header */}
                <View className="flex-row items-center justify-between mb-6 pt-5">
                  <Text variant="display">Scan Journal</Text>
                </View>

                {/* Content */}
                <View className="flex-1">
                  {!imageUri ? (
                    <View className="flex-1 justify-center px-4">
                      <Text variant="h1" className="text-center mb-4">
                        Capture Your Journal Page
                      </Text>
                      <Text variant="body" color="muted" className="text-center mb-10">
                        Capture your handwritten or printed pages.
                      </Text>
                      <Button
                        label="Open Camera"
                        variant="primary"
                        onPress={captureImage}
                        leftIcon={<Feather name="camera" size={20} color={BRAND_SURFACE} />}
                        className="mb-4"
                      />

                      <Button
                        label="Select from Gallery"
                        variant="secondary"
                        onPress={pickImage}
                        leftIcon={<Feather name="image" size={20} color={INK_SOFT} />}
                      />
                    </View>
                  ) : (
                    // Image preview and processing
                    <View className="flex-1">
                      {/* Image Preview */}
                      <View className="flex-1 rounded-[28px] overflow-hidden bg-sage-50 mb-4 border border-brand-border">
                        <Image
                          source={{ uri: imageUri }}
                          className="w-full h-full"
                          resizeMode="contain"
                        />
                        {step !== "idle" && (
                          <View className="absolute inset-0 bg-sage-50/85 items-center justify-center">
                            {step === "done" ? (
                              <View className="items-center px-8">
                                <View className="w-16 h-16 rounded-full bg-sage-200 items-center justify-center mb-4">
                                  <Feather name="check" size={32} color={SAGE[600]} />
                                </View>
                                <Text variant="h2" className="text-center mb-2">Ready</Text>
                                <Text variant="body" color="soft" className="text-center mb-8">
                                  Your insights have been successfully generated.
                                </Text>
                                <Button 
                                  label="View Insights" 
                                  variant="primary" 
                                  onPress={() => {
                                    if (extractedInsights) {
                                      onInsightsReady(extractedInsights, extractedText);
                                      handleClose();
                                    }
                                  }} 
                                />
                              </View>
                            ) : (
                              <View className="items-center w-full">
                                <ActivityIndicator size="large" color={SAGE[600]} />
                                <Text variant="body-bold" className="mt-6 text-center">
                                  {STEP_MESSAGES[step]}
                                </Text>
                                {step === "extracting" && (
                                  <Text variant="body" color="soft" className="mt-2 text-center px-8">
                                    Reading handwritten text...
                                  </Text>
                                )}
                                {step === "analyzing" && (
                                  <Text variant="body" color="soft" className="mt-2 text-center px-8">
                                    Creating personalized insights...
                                  </Text>
                                )}
                                <TouchableOpacity onPress={handleClose} className="mt-10 px-6 py-3 rounded-full bg-sage-200/50">
                                  <Text variant="body-bold" color="ink">Cancel Processing</Text>
                                </TouchableOpacity>
                              </View>
                            )}
                          </View>
                        )}
                      </View>



                      {/* Action buttons */}
                      {step === "error" && (
                        <View className="flex-row gap-3">
                          <Button
                            label="Cancel"
                            variant="secondary"
                            onPress={handleClose}
                            className="flex-1"
                          />
                          <Button
                            label="Try Again"
                            variant="primary"
                            onPress={handleRetake}
                            className="flex-1"
                          />
                        </View>
                      )}
                    </View>
                  )}
                </View>
              </View>
            </RNHostView>
          </Group>
        </BottomSheet>
      </Host>
    </Modal>
  );
};

export default ImageJournalModal;

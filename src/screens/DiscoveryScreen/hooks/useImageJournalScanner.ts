import { useCallback, useState } from "react";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { extractTextFromImage } from "@/src/network/extractTextFromImage";
import { callMyFunction } from "@/src/network/transcribeAudio";
import { InsightsType } from "@/src/network/genAi";

export type ProcessingStep =
  | "idle"
  | "capturing"
  | "extracting"
  | "analyzing"
  | "done"
  | "error";

export const STEP_MESSAGES: Record<ProcessingStep, string> = {
  idle: "Ready to capture",
  capturing: "Opening camera...",
  extracting: "Reading your journal...",
  analyzing: "Generating insights...",
  done: "Complete!",
  error: "Something went wrong",
};

interface UseImageJournalScannerOptions {
  onClose: () => void;
  onInsightsReady: (insights: InsightsType, transcript: string) => void;
}

export interface ImageJournalScannerViewModel {
  imageUri: string | null;
  step: ProcessingStep;
  stepMessage: string;
  extractedText: string;
  extractedInsights: InsightsType | null;
  captureImage: () => Promise<void>;
  pickImage: () => Promise<void>;
  handleRetake: () => void;
  handleClose: () => void;
  handleConfirmInsights: () => void;
}

// ponytail: image scanner hook encapsulating camera/gallery permissions, OCR extraction, and AI insights
export function useImageJournalScanner({
  onClose,
  onInsightsReady,
}: UseImageJournalScannerOptions): ImageJournalScannerViewModel {
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

  const processImage = useCallback(
    async (uri: string): Promise<void> => {
      try {
        setStep("extracting");
        const text = await extractTextFromImage(uri);
        setExtractedText(text);

        setStep("analyzing");
        const insights = await callMyFunction({
          journal: text,
          isAudio: false,
        });

        setExtractedInsights(insights);
        setStep("done");
      } catch (error: unknown) {
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
    []
  );

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
    } catch (error: unknown) {
      console.error("Camera error:", error);
      setStep("error");
      Alert.alert("Error", "Failed to capture image. Please try again.");
    }
  }, [processImage]);

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
    } catch (error: unknown) {
      console.error("Gallery error:", error);
      setStep("error");
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  }, [processImage]);

  const handleRetake = useCallback((): void => {
    resetState();
    void captureImage();
  }, [resetState, captureImage]);

  const handleConfirmInsights = useCallback((): void => {
    if (extractedInsights) {
      onInsightsReady(extractedInsights, extractedText);
      handleClose();
    }
  }, [extractedInsights, extractedText, onInsightsReady, handleClose]);

  return {
    imageUri,
    step,
    stepMessage: STEP_MESSAGES[step],
    extractedText,
    extractedInsights,
    captureImage,
    pickImage,
    handleRetake,
    handleClose,
    handleConfirmInsights,
  };
}

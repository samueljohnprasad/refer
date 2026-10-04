import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, DeviceEventEmitter } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { format } from 'date-fns';
import { useCalorieTracker } from '@/hooks/data/useCalorieTracker';
import { CalorieAnalysisResult, MicronutrientEntry } from '@/src/network/calorieAi';
import { MICRONUTRIENTS_CONFIG } from '@/src/config/micronutrients';

// ─── Constants ───────────────────────────────────────────────────────────────

const TRACKED_MICRONUTRIENTS_KEY = 'tracked_micronutrients';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SelectedHealthScore {
  score: number;
  reasoning: string;
}

interface SelectedMicronutrients {
  title: string;
  micronutrients: MicronutrientEntry[];
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useCalorieTrackerScreen = (selectedDate: Date) => {
  const { t } = useTranslation("tracking");
  const formattedDate = format(selectedDate, 'yyyy-MM-dd');

  const { calorieEntries, dailySummary, isLoading, isAnalyzing, analysisError, analyzeAndSaveFood, deleteEntry } =
    useCalorieTracker(formattedDate);

  const micronutrientModalRef = useRef<BottomSheetModal>(null);

  const [analysisResult, setAnalysisResult] = useState<CalorieAnalysisResult | null>(null);
  const [trackedNutrientIds, setTrackedNutrientIds] = useState<Set<string>>(
    new Set(MICRONUTRIENTS_CONFIG.map((n) => n.id)),
  );
  const [selectedHealthScore, setSelectedHealthScore] = useState<SelectedHealthScore | null>(null);
  const [healthScoreModalVisible, setHealthScoreModalVisible] = useState(false);
  const [selectedMicronutrients, setSelectedMicronutrients] = useState<SelectedMicronutrients | null>(null);

  // ─── Load persisted tracked nutrient IDs ────────────────────────────────

  useEffect(() => {
    const load = async (): Promise<void> => {
      try {
        const saved = await AsyncStorage.getItem(TRACKED_MICRONUTRIENTS_KEY);
        if (saved) setTrackedNutrientIds(new Set(JSON.parse(saved)));
      } catch (error) {
        console.error('Failed to load tracked nutrients:', error);
      }
    };
    load();
  }, []);

  // ─── Image picking ────────────────────────────────────────────────────────

  const processImage = async (imageUri: string): Promise<void> => {
    const result = await analyzeAndSaveFood(imageUri);
    if (result) setAnalysisResult(result);
  };

  const takePhoto = useCallback(async (): Promise<void> => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t("permissions.required"), t("permissions.camera"));
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (result.canceled || !result.assets[0]) return;
    await processImage(result.assets[0].uri);
  }, [t]);

  const pickImage = useCallback(async (): Promise<void> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t("permissions.required"), t("permissions.photoLibrary"));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (result.canceled || !result.assets[0]) return;
    await processImage(result.assets[0].uri);
  }, [t]);

  // ─── Listen for external CTA events ──────────────────────────────────────

  useEffect(() => {
    const sub1 = DeviceEventEmitter.addListener('triggerCalorieCamera', () => {
      if (!isAnalyzing) takePhoto();
    });
    const sub2 = DeviceEventEmitter.addListener('triggerCalorieGallery', () => {
      if (!isAnalyzing) pickImage();
    });
    return () => {
      sub1.remove();
      sub2.remove();
    };
  }, [isAnalyzing, takePhoto, pickImage]);

  // ─── Micronutrient filtering ──────────────────────────────────────────────

  const filterTrackedMicronutrients = useCallback(
    (nutrients: MicronutrientEntry[]): MicronutrientEntry[] =>
      nutrients.filter((m) => trackedNutrientIds.has(m.name)),
    [trackedNutrientIds],
  );

  // ─── UI actions ───────────────────────────────────────────────────────────

  const resetCapture = (): void => setAnalysisResult(null);

  const handleDeleteEntry = (entryId: string): void => {
    Alert.alert(t("deleteConfirmation.title"), t("deleteConfirmation.message"), [
      { text: t("deleteConfirmation.cancel"), style: 'cancel' },
      { text: t("deleteConfirmation.delete"), style: 'destructive', onPress: () => deleteEntry(entryId) },
    ]);
  };

  const handleShowHealthScore = (score: number, reasoning: string): void => {
    setSelectedHealthScore({ score, reasoning });
    setHealthScoreModalVisible(true);
  };

  const handleCloseHealthScore = (): void => setHealthScoreModalVisible(false);

  const handleShowMicronutrients = (title: string, micronutrients: MicronutrientEntry[]): void => {
    setSelectedMicronutrients({ title, micronutrients });
    micronutrientModalRef.current?.present();
  };

  return {
    // Data
    calorieEntries,
    dailySummary,
    analysisResult,
    selectedHealthScore,
    selectedMicronutrients,
    // State flags
    isLoading,
    isAnalyzing,
    analysisError,
    healthScoreModalVisible,
    // Refs
    micronutrientModalRef,
    // Actions
    takePhoto,
    pickImage,
    resetCapture,
    handleDeleteEntry,
    handleShowHealthScore,
    handleCloseHealthScore,
    handleShowMicronutrients,
    filterTrackedMicronutrients,
  };
};

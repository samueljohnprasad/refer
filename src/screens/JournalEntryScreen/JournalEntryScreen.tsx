import React, { useState, useCallback } from "react";
import { ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useToast, Toast, ToastTitle } from "@/components/ui/toast";
import { useSaveJournal } from "@/hooks/post/useSaveJournal";
import { useRouter } from "expo-router";

// Types and Constants
import { JournalEntryScreenProps } from "./types";

// Custom Hooks
import {
  useJournalEdit,
  useKeyboardHandler,
  useTags,
  useFormattedDateTime,
} from "./hooks";

// Redesigned Components
import {
  MinimalHeader,
  MoodSelector,
  ActivitySection,
  FeelingsSection,
  TranscriptSection,
  ContinueButton,
} from "./components";

/**
 * JournalEntryScreen - Redesigned with ultra-clean, professional aesthetic
 * Features soft gradients, minimal UI elements, and delightful interactions
 */
const JournalEntryScreen: React.FC<JournalEntryScreenProps> = ({
  insights,
  onClose,
}: JournalEntryScreenProps) => {
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const { saveJournal, saving } = useSaveJournal();
  const router = useRouter();

  // Mood gradient configurations (using light 100 level colors)
  const MOOD_GRADIENTS: { [key: string]: string[] } = {
    terrible: ["#FEE2E2", "#FED7D7"], // red-100 to red-100 lighter
    bad: ["#FED7AA", "#FEF3C7"], // orange-100 to yellow-100
    fine: ["#FEF3C7", "#FEFCE8"], // yellow-100 to yellow-50
    good: ["#DCFCE7", "#F0FDF4"], // green-100 to green-50
    great: ["#DBEAFE", "#EFF6FF"], // blue-100 to blue-50
  };

  // State
  const [selectedMood, setSelectedMood] = useState<string>(
    insights?.mainEmoji || "great"
  );
  const [activities, setActivities] = useState<string[]>(["watching movie"]);
  const [feelings, setFeelings] = useState<string[]>(
    insights?.feelings?.map((f) => f.name) || []
  );

  // Formatted date/time
  const formattedDateTime: string = useFormattedDateTime();

  // Journal editing state
  const {
    isEditing,
    selectedEmoji,
    tags,
    journalText,
    setSelectedEmoji,
    setTags,
    setJournalText,
    handleEdit,
    handleDone,
    handleClose: handleCloseEdit,
  } = useJournalEdit({
    initialEmoji: "great",
    initialTags: insights?.feelings || [],
    initialText: insights?.enrichedTranscript || "no transcript available",
  });

  // Keyboard handling
  const { keyboardHeight } = useKeyboardHandler();

  // Tag operations
  const { removeTag, addTag } = useTags({ setTags });

  // Helper functions for feelings
  const addFeelingString = (feeling: string): void => {
    const newFeeling = {
      name: feeling,
      emoji: "😊",
      colorsGradient: ["#FFD700", "#FFA500"],
      intensity: 5,
    };
    setTags([...tags, newFeeling]);
  };

  const removeFeelingByIndex = (index: number): void => {
    removeTag(index);
  };

  // Convert tags to strings for display
  const feelingStrings: string[] = tags.map((tag) =>
    typeof tag === "string" ? tag : tag.name
  );

  const handleClose = useCallback((): void => {
    handleCloseEdit(onClose);
  }, [handleCloseEdit, onClose]);

  const handleContinue = useCallback(async (): Promise<void> => {
    try {
      await saveJournal({
        title: insights?.title || "Daily Reflections",
        enrichedTranscript: journalText,
        aiInsights: insights?.aiInsights,
        moodScore: insights?.moodScore,
        mainEmoji: selectedMood,
        feelings: tags,
        suggestedTags: insights?.suggestedTags,
        growthAreas: insights?.growthAreas,
        positiveInsights: insights?.positiveInsights,
      });

      toast.show({
        placement: "bottom",
        render: ({ id }) => (
          <Toast nativeID={id} variant="solid" action="success">
            <ToastTitle>Journal saved successfully</ToastTitle>
          </Toast>
        ),
      });
      onClose?.();
    } catch (error) {
      console.error("Failed to save journal:", error);
      toast.show({
        placement: "bottom",
        render: ({ id }) => (
          <Toast nativeID={id} variant="solid" action="error">
            <ToastTitle>Failed to save journal</ToastTitle>
          </Toast>
        ),
      });
    }
  }, [saveJournal, insights, journalText, tags, selectedMood]);

  const currentGradient = MOOD_GRADIENTS[selectedMood] || MOOD_GRADIENTS.great;

  return (
    <LinearGradient
      colors={currentGradient as [string, string, ...string[]]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1"
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        style={{ paddingTop: insets.top }}
      >
        <MinimalHeader
          isEditing={isEditing}
          formattedDateTime={formattedDateTime}
          onClose={handleClose}
          onEdit={handleEdit}
          onDone={handleDone}
        />

        {isEditing && (
          <MoodSelector
            selectedMood={selectedMood}
            onSelectMood={setSelectedMood}
          />
        )}

        <ScrollView
          className="flex-1 px-5"
          showsVerticalScrollIndicator={false}
          bounces={true}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {!isEditing && (
            <MoodSelector
              selectedMood={selectedMood}
              onSelectMood={setSelectedMood}
              viewOnly={true}
              title={insights?.title || "Daily Reflections"}
            />
          )}

          <ActivitySection
            activities={activities}
            isEditing={isEditing}
            onAddActivity={(activity) =>
              setActivities([...activities, activity])
            }
            onRemoveActivity={(index) =>
              setActivities(activities.filter((_, i) => i !== index))
            }
          />

          <FeelingsSection
            feelings={feelingStrings}
            isEditing={isEditing}
            onAddFeeling={addFeelingString}
            onRemoveFeeling={removeFeelingByIndex}
          />

          <TranscriptSection
            text={journalText}
            isEditing={isEditing}
            onTextChange={setJournalText}
          />
        </ScrollView>

        <ContinueButton
          onPress={handleContinue}
          loading={saving}
          isEditing={isEditing}
        />
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default React.memo(JournalEntryScreen);

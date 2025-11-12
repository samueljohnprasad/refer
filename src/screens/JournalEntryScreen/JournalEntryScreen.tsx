import React, { useState, useCallback } from "react";
import { ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useToast, Toast, ToastTitle } from "@/components/ui/toast";
import { useSaveJournal } from "@/hooks/post/useSaveJournal";
import { JournalEntryScreenProps } from "./types";
import { JournalEntry } from "@/hooks/data/types";
import { useJournalEdit, useKeyboardHandler, useTags } from "./hooks";
import {
  MinimalHeader,
  MoodSelector,
  FeelingsSection,
  TranscriptSection,
  ContinueButton,
} from "./components";
import { Enums } from "@/database.types";
import { FeelingsType } from "@/src/network/genAi";

const JournalEntryScreen: React.FC<JournalEntryScreenProps> = ({
  insights,
  onClose,
}: JournalEntryScreenProps) => {
  console.log("insights", insights);
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const { saveJournal, saving } = useSaveJournal();

  const MOOD_GRADIENTS: { [key: string]: string[] } = {
    terrible: ["#FEE2E2", "#FED7D7"], // red-100 to red-100 lighter
    bad: ["#FED7AA", "#FEF3C7"], // orange-100 to yellow-100
    fine: ["#FEF3C7", "#FEFCE8"], // yellow-100 to yellow-50
    good: ["#DCFCE7", "#F0FDF4"], // green-100 to green-50
    great: ["#DBEAFE", "#EFF6FF"], // blue-100 to blue-50
  };

  const [selectedMood, setSelectedMood] = useState<Enums<"mood">>(
    insights?.moods?.main_mood || "great"
  );

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
    initialTags: (insights?.journal_ai_insights?.feelings ||
      []) as FeelingsType[],
    initialText: insights?.transcripts || "no transcript available",
  });

  const { keyboardHeight } = useKeyboardHandler();

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

  const handleClose = useCallback((): void => {
    handleCloseEdit(onClose);
  }, [handleCloseEdit, onClose]);

  const handleContinue = useCallback(async (): Promise<void> => {
    try {
      if (!insights) return;

      // Merge edited data with insights before saving
      const updatedInsights: JournalEntry = {
        ...insights,
        transcripts: journalText,
        moods: insights.moods
          ? {
              ...insights.moods,
              main_mood: selectedMood,
            }
          : { main_mood: selectedMood },
        journal_ai_insights: insights.journal_ai_insights
          ? {
              ...insights.journal_ai_insights,
              feelings: tags,
            }
          : null,
      };

      await saveJournal(updatedInsights);

      toast.show({
        placement: "top",
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
  }, [saveJournal, insights, journalText, selectedMood, tags, toast, onClose]);

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
          date={insights?.selected_date}
          isEditing={isEditing}
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

          <FeelingsSection
            feelings={tags.map((tag: FeelingsType) => tag.name)}
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

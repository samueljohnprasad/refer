import React, { useState, useCallback } from "react";
import { ScrollView, KeyboardAvoidingView, Platform, View, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useToast, Toast, ToastTitle } from "@/components/ui/toast";
import { useSaveJournal } from "@/hooks/post/useSaveJournal";
import { useJournalOperations } from "@/hooks/journals/useJournalOperations";
import { JournalEntryScreenProps } from "./types";
import { JournalEntry } from "@/hooks/data/types";
import { useJournalEdit } from "./hooks";
import {
  MinimalHeader,
  MoodSelector,
  FeelingsSection,
  TranscriptSection,
  ContinueButton,
  AIInsightsSection,
} from "./components";
import { Enums } from "@/database.types";
import { useColorScheme } from "react-native";
import { FeelingsType } from "@/src/network/genAi";
import * as Haptics from "expo-haptics";

const JournalEntryScreen: React.FC<JournalEntryScreenProps> = ({
  insights,
  onClose,
}: JournalEntryScreenProps) => {
  const toast = useToast();
  const { saveJournal, saving } = useSaveJournal();
  const { deleteJournal, toggleBookmark, bookmarking } = useJournalOperations();
  const { top, bottom } = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const MOOD_GRADIENTS: { [key: string]: string[] } = {
    terrible: ["#FEE2E2", "#FED7D7"], // red-100 to red-100 lighter
    bad: ["#FED7AA", "#FEF3C7"], // orange-100 to yellow-100
    fine: ["#FEF3C7", "#FEFCE8"], // yellow-100 to yellow-50
    good: ["#DCFCE7", "#F0FDF4"], // green-100 to green-50
    great: ["#DBEAFE", "#EFF6FF"], // blue-100 to blue-50
  };

  // Handle potential array response from API
  const entry = Array.isArray(insights) ? insights[0] : insights;

  console.log(
    "JournalEntryScreen - entry?.journal_ai_insights:",
    JSON.stringify(entry?.journal_ai_insights, null, 2)
  );

  const [selectedMood, setSelectedMood] = useState<Enums<"mood">>(
    entry?.moods?.main_mood || "great"
  );
  const [isBookmarked, setIsBookmarked] = useState<boolean>(entry?.is_bookmarked ?? false);

  const {
    isEditing,
    tags,
    journalText,
    setTags,
    setJournalText,
    handleEdit,
    handleDone,
    handleClose: handleCloseEdit,
  } = useJournalEdit({
    initialTags: ((entry?.journal_ai_insights?.feelings || []) as any[]).map(
      (f) =>
        typeof f === "string"
          ? {
              name: f,
              emoji: "😊",
              colorsGradient: ["#FFD700", "#FFA500"],
              intensity: 5,
            }
          : f
    ),
    initialText: entry?.transcripts || "",
  });

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
    setTags((prevTags: FeelingsType[]) =>
      prevTags.filter((_: FeelingsType, i: number) => i !== index)
    );
  };

  const handleClose = useCallback((): void => {
    handleCloseEdit(onClose);
  }, [handleCloseEdit, onClose]);

  const handleDeleteEntry = useCallback((): void => {
    if (!entry?.id) return;
    Alert.alert(
      "Delete Reflection",
      "Are you sure you want to delete this journal entry? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async (): Promise<void> => {
            try {
              await deleteJournal({
                journalId: entry.id,
                selectedDate: entry.selected_date ? new Date(entry.selected_date) : new Date(),
              });
              toast.show({
                placement: "top",
                render: ({ id }: { id: string }) => (
                  <Toast nativeID={id} variant="solid" action="success">
                    <ToastTitle>Entry deleted</ToastTitle>
                  </Toast>
                ),
              });
              handleClose();
            } catch (error) {
              console.error("Error deleting entry:", error);
            }
          },
        },
      ]
    );
  }, [entry, deleteJournal, toast, handleClose]);

  const handleContinue = useCallback(async (): Promise<void> => {
    try {
      if (!insights) return;

      // Merge edited data with insights before saving
      const updatedInsights = {
        ...entry,
        transcripts: journalText,
        moods: entry?.moods
          ? {
              ...entry.moods,
              main_mood: selectedMood,
            }
          : { main_mood: selectedMood },
        journal_ai_insights: entry?.journal_ai_insights
          ? {
              ...entry.journal_ai_insights,
              feelings: tags,
            }
          : null,
      } as JournalEntry;

      if (!journalText.trim()) {
        toast.show({
          placement: "top",
          render: ({ id }) => (
            <Toast nativeID={id} variant="solid" action="warning">
              <ToastTitle>Please enter journal text before saving</ToastTitle>
            </Toast>
          ),
        });
        return;
      }

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
    // <SafeAreaView className="flex-1">
    <LinearGradient
      colors={currentGradient as [string, string, ...string[]]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1"
      style={{ flex: 1, paddingTop: top, paddingBottom: bottom }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <MinimalHeader
          date={entry?.selected_date}
          isEditing={isEditing}
          onClose={handleClose}
          onEdit={handleEdit}
          onDone={handleDone}
          onSave={handleContinue}
          saving={saving}
          onDelete={handleDeleteEntry}
          isBookmarked={isBookmarked}
          onBookmark={async () => {
            if (entry?.id) {
              const newStatus = !isBookmarked;
              setIsBookmarked(newStatus);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              
              toast.show({
                placement: "top",
                render: ({ id }) => (
                  <Toast nativeID={id} variant="solid" action="success">
                    <ToastTitle>{newStatus ? "Entry bookmarked" : "Bookmark removed"}</ToastTitle>
                  </Toast>
                ),
              });

              try {
                await toggleBookmark({
                  journalId: entry.id,
                  selectedDate: entry.selected_date ? new Date(entry.selected_date) : new Date(),
                  isBookmarked: !newStatus,
                });
              } catch (e) {
                setIsBookmarked(!newStatus);
              }
            }
          }}
          bookmarking={bookmarking}
        />

        {isEditing && (
          <MoodSelector
            selectedMood={selectedMood}
            onSelectMood={setSelectedMood}
          />
        )}

        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
          bounces={true}
          contentContainerStyle={{ paddingBottom: isEditing ? 120 : 64 }}
        >
          {!isEditing && (
            <MoodSelector
              selectedMood={selectedMood}
              onSelectMood={setSelectedMood}
              viewOnly={true}
              title={entry?.title || "Daily Reflections"}
            />
          )}

          <FeelingsSection
            feelings={tags.map((tag: FeelingsType) => tag.name)}
            isEditing={isEditing}
            onAddFeeling={addFeelingString}
            onRemoveFeeling={removeFeelingByIndex}
          />

          <TranscriptSection
            text={journalText || "no transcript available"}
            isEditing={isEditing}
            onTextChange={setJournalText}
          />
          {!isEditing && entry?.journal_ai_insights && (
            <AIInsightsSection
              aiInsights={entry.journal_ai_insights.aiInsights ?? null}
              colorScheme={colorScheme as any}
              energyLevel={entry.journal_ai_insights.energyLevel}
              stressLevel={entry.journal_ai_insights.stressLevel}
              sleepQuality={entry.journal_ai_insights.sleepQuality}
              achievements={entry.journal_ai_insights.achievements}
              worries={entry.journal_ai_insights.worries}
              goals={entry.journal_ai_insights.goals}
              triggers={entry.journal_ai_insights.triggers}
              copingStrategies={entry.journal_ai_insights.copingStrategies}
              physicalSymptoms={
                (entry.journal_ai_insights as any)["physical-symptoms"] ||
                entry.journal_ai_insights.physicalSymptoms
              }
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
    // </SafeAreaView>
  );
};

export default React.memo(JournalEntryScreen);

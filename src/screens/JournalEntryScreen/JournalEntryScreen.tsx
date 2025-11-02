import React, { useState, useCallback } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useToast, Toast, ToastTitle } from "@/components/ui/toast";
import { useSaveJournal } from "@/hooks/post/useSaveJournal";

// Types and Constants
import { JournalEntryScreenProps } from "./types";
import { DEFAULT_EMOJI } from "./constants";

// Custom Hooks
import {
  useJournalEdit,
  useKeyboardHandler,
  useTags,
  useJournalAnimations,
  useFormattedDateTime,
} from "./hooks";

// Presentational Components
import {
  JournalHeader,
  MoodCard,
  TagsList,
  JournalContent,
  AIInsightsSection,
  SaveButton,
} from "./components";

/**
 * JournalEntryScreen - Container component for journal entry functionality
 * 
 * Refactored Architecture:
 * - Custom hooks manage all business logic (editing, keyboard, tags, animations)
 * - Presentational components handle UI rendering
 * - Clear separation of concerns for maintainability and testing
 * - Scales efficiently for 50,000+ users
 */
const JournalEntryScreen: React.FC<JournalEntryScreenProps> = ({
  insights,
  transcripts,
  onClose,
  selectedDate,
}: JournalEntryScreenProps) => {
  // Core dependencies
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const { saveJournal, saving } = useSaveJournal();
  
  // Footer height state for scroll padding
  const [footerHeight, setFooterHeight] = useState<number>(0);
  
  // Formatted date/time
  const formattedDateTime: string = useFormattedDateTime();
  
  // Journal editing state and actions
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
    initialEmoji: DEFAULT_EMOJI,
    initialTags: insights?.feelings || [],
    initialText: insights?.enrichedTranscript || "",
  });
  
  // Keyboard handling
  const { keyboardHeight } = useKeyboardHandler();
  
  // Tag operations
  const { removeTag, addTag } = useTags({ setTags });
  
  // Animation styles
  const { animatedStyles } = useJournalAnimations({
    isEditing,
    isInsightsOpen: true,
  });
  
  // Handle emoji selection
  const handleSelectEmoji = useCallback((emoji: string): void => {
    setSelectedEmoji(emoji);
  }, [setSelectedEmoji]);
  
  // Handle close with edit cancellation
  const handleClose = useCallback((): void => {
    handleCloseEdit(onClose);
  }, [handleCloseEdit, onClose]);
  
  // Handle save journal
  const handleContinue = useCallback(async (): Promise<void> => {
    try {
      await saveJournal(
        {
          title: insights?.title,
          enrichedTranscript: journalText,
          aiInsights: insights?.aiInsights,
          moodScore: insights?.moodScore,
          mainEmoji: insights?.mainEmoji,
          feelings: tags,
          suggestedTags: insights?.suggestedTags,
          growthAreas: insights?.growthAreas,
          positiveInsights: insights?.positiveInsights,
        },
        selectedDate
      );

      toast.show({
        placement: "bottom right",
        render: ({ id }) => (
          <Toast nativeID={id} variant="solid" action="success">
            <ToastTitle>Journal saved</ToastTitle>
          </Toast>
        ),
      });
    } catch (error) {
      console.error("Failed to save journal:", error);
      toast.show({
        placement: "bottom right",
        render: ({ id }) => (
          <Toast nativeID={id} variant="solid" action="error">
            <ToastTitle>Failed to save journal</ToastTitle>
          </Toast>
        ),
      });
    }
  }, [saveJournal, insights, journalText, tags, selectedDate, toast]);

  return (
    <SafeAreaView
      style={styles.safeArea}
      className="flex-1 bg-background-light dark:bg-background-dark"
      edges={["bottom"]}
    >
      <JournalHeader
        isEditing={isEditing}
        formattedDateTime={formattedDateTime}
        colorScheme={null}
        onClose={handleClose}
        onEdit={handleEdit}
        onDone={handleDone}
        backIconStyle={animatedStyles.backIconStyle}
        closeIconStyle={animatedStyles.closeIconStyle}
      />

      <View style={styles.contentContainer} className="flex-1">
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingBottom: Math.max(footerHeight + 16, 120) },
          ]}
          showsVerticalScrollIndicator={true}
          bounces={true}
          alwaysBounceVertical={true}
          keyboardShouldPersistTaps="handled"
        >
          <MoodCard
            selectedEmoji={selectedEmoji}
            title={insights?.title || ""}
            isEditing={isEditing}
            onSelectEmoji={handleSelectEmoji}
            moodCardStyle={animatedStyles.moodCardStyle}
            singleEmojiStyle={animatedStyles.singleEmojiStyle}
            summaryStyle={animatedStyles.summaryStyle}
            emojiRowStyle={animatedStyles.emojiRowStyle}
          />

          <TagsList
            tags={tags}
            isEditing={isEditing}
            colorScheme={null}
            onRemove={removeTag}
            onAdd={addTag}
          />

          <JournalContent
            isEditing={isEditing}
            journalText={journalText}
            onTextChange={setJournalText}
          />

          <AIInsightsSection
            aiInsights={insights?.aiInsights || ""}
            colorScheme={null}
          />
        </ScrollView>
      </View>

      <SaveButton
        saving={saving}
        keyboardHeight={keyboardHeight}
        bottomInset={insets.bottom}
        onSave={handleContinue}
        onLayout={setFooterHeight}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scroll: {
    padding: 24,
    paddingBottom: 120,
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
  },
});

export default React.memo(JournalEntryScreen);

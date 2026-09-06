import React, { useState, useCallback, useEffect } from "react";
import { ScrollView, KeyboardAvoidingView, Platform, Share } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Stack, Link } from "expo-router";
import { useHeaderHeight } from "expo-router/react-navigation";

import { useAppDispatch } from "@/src/store/hooks";
import { setVisible } from "@/src/store/slices/happyAssistantSlice";
import { JournalEntryScreenProps } from "./types";
import { useJournalEdit, useJournalOperationsHandler } from "./hooks";
import {
  MoodSelector,
  FeelingsSection,
  TranscriptSection,
  ReflectionSection,
} from "./components";
import { Enums } from "@/database.types";
import { FeelingsType } from "@/src/network/genAi";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import {
  MOOD_GRADIENTS,
  getRelativeDayTitle,
  getFormattedTime,
} from "./constants";

const JournalEntryScreen: React.FC<JournalEntryScreenProps> = ({
  insights,
  onClose,
}: JournalEntryScreenProps) => {
  const dispatch = useAppDispatch();
  const { bottom } = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();

  // Handle potential array response from API
  const entry = Array.isArray(insights) ? insights[0] : insights;

  const [selectedMood, setSelectedMood] = useState<Enums<"mood">>(
    entry?.moods?.main_mood || "great"
  );

  const {
    isEditing,
    tags,
    journalText,
    setTags,
    setJournalText,
    handleEdit,
    handleClose: handleCloseEdit,
  } = useJournalEdit({
    initialTags: [],
    initialText: entry?.transcripts || "",
  });

  const handleClose = useCallback((): void => {
    handleCloseEdit(onClose);
  }, [handleCloseEdit, onClose]);

  const {
    isBookmarked,
    handleDeleteEntry,
    handleContinue,
    handleToggleBookmark,
  } = useJournalOperationsHandler({
    entry,
    insights,
    journalText,
    selectedMood,
    onClose: handleClose,
  });

  // ponytail: hide floating panda assistant during journal reading/detail
  useEffect(() => {
    dispatch(setVisible(false));
    return () => {
      dispatch(setVisible(true));
    };
  }, [dispatch]);

  const addFeelingString = (feeling: string): void => {
    const newFeeling: FeelingsType = {
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

  const currentGradient = MOOD_GRADIENTS[selectedMood] || MOOD_GRADIENTS.fine;

  return (
    <>
      {/* Apple Native Title & Navigation Bar */}
      <Stack.Title style={{ color: SEMANTIC_COLORS.text.primary }}>
        {entry?.selected_date
          ? `${getRelativeDayTitle(entry.selected_date)} at ${getFormattedTime(entry.selected_date)}`
          : ""}
      </Stack.Title>
      <Stack.Header
        transparent
        style={{
          backgroundColor: "transparent",
          color: SEMANTIC_COLORS.text.primary,
          shadowColor: "transparent",
        }}
      />
      <Stack.Screen options={{ headerLeft: () => null }} />
      <Stack.Toolbar placement="left" tintColor={SEMANTIC_COLORS.text.primary}>
        <Stack.Toolbar.Button
          icon="chevron.left"
          tintColor={SEMANTIC_COLORS.text.primary}
          onPress={handleClose}
        />
      </Stack.Toolbar>
      {isEditing ? (
        <Stack.Toolbar placement="right" tintColor={SEMANTIC_COLORS.text.primary}>
          <Stack.Toolbar.Button
            icon="checkmark"
            tintColor={SEMANTIC_COLORS.text.primary}
            onPress={handleContinue}
          />
        </Stack.Toolbar>
      ) : (
        <Stack.Toolbar placement="right" tintColor={SEMANTIC_COLORS.text.primary}>
          <Stack.Toolbar.Button
            icon={isBookmarked ? "bookmark.fill" : "bookmark"}
            tintColor={SEMANTIC_COLORS.text.primary}
            onPress={handleToggleBookmark}
          />
          <Stack.Toolbar.Button
            icon="square.and.arrow.up"
            tintColor={SEMANTIC_COLORS.text.primary}
            onPress={() => void Share.share({ message: entry?.transcripts || "" })}
          />
          <Stack.Toolbar.Menu icon="ellipsis.circle" tintColor={SEMANTIC_COLORS.text.primary}>
            <Stack.Toolbar.MenuAction icon="pencil" onPress={handleEdit}>
              Edit Entry
            </Stack.Toolbar.MenuAction>
            <Stack.Toolbar.MenuAction
              icon="trash"
              destructive
              onPress={handleDeleteEntry}
            >
              Delete Entry
            </Stack.Toolbar.MenuAction>
          </Stack.Toolbar.Menu>
        </Stack.Toolbar>
      )}

      <Link.AppleZoomTarget>
        <LinearGradient
          colors={currentGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="flex-1"
          style={{ flex: 1 }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1"
          >
            <ScrollView
              className="flex-1 px-4"
              showsVerticalScrollIndicator={false}
              bounces={true}
              contentContainerStyle={{
                paddingTop: headerHeight + 12,
                paddingBottom: (isEditing ? 120 : 40) + bottom,
              }}
            >
              {isEditing ? (
                <MoodSelector
                  selectedMood={selectedMood}
                  onSelectMood={setSelectedMood}
                />
              ) : (
                <MoodSelector
                  selectedMood={selectedMood}
                  onSelectMood={setSelectedMood}
                  viewOnly={true}
                  title={entry?.title || "Daily Reflections"}
                  date={entry?.selected_date || (entry as any)?.created_at}
                />
              )}

              <FeelingsSection
                feelings={(tags || []).map((tag: any) =>
                  typeof tag === "string" ? tag : tag?.name || ""
                )}
                isEditing={isEditing}
                onAddFeeling={addFeelingString}
                onRemoveFeeling={removeFeelingByIndex}
              />

              <TranscriptSection
                text={journalText || "no transcript available"}
                isEditing={isEditing}
                onTextChange={setJournalText}
              />

              {!isEditing && (
                <ReflectionSection
                  rawReflection={
                    (Array.isArray(entry?.journal_ai)
                      ? entry.journal_ai[0]?.summary
                      : entry?.journal_ai?.summary) ||
                    (entry as any)?.summary ||
                    (entry as any)?.reflection ||
                    (entry as any)?.journal_ai_insights?.aiInsights ||
                    (entry as any)?.aiInsights
                  }
                />
              )}
            </ScrollView>
          </KeyboardAvoidingView>
        </LinearGradient>
      </Link.AppleZoomTarget>
    </>
  );
};

export default React.memo(JournalEntryScreen);

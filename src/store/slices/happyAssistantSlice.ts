import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export enum HappyAssistantCommandEnum {
  OpenSettings = "open_settings",
  OpenSaveProfile = "open_save_profile",
  VoiceJournal = "voice_journal",
  KeyboardJournal = "keyboard_journal",
  MoodCheck = "mood_check",
  AiInsight = "ai_insight",
  ResumeExercise = "resume_exercise",
  TryBreathing = "try_breathing",
  ThoughtCatcher = "thought_catcher",
  ViewExerciseLog = "view_exercise_log",
  ContinueJourney = "continue_journey",
  RestorePurchases = "restore_purchases",
  Support = "support",
}

export type HappyAssistantCommand = `${HappyAssistantCommandEnum}`;

export interface HappyAssistantPosition {
  x: number;
  y: number;
}

export interface HappyAssistantState {
  isSheetOpen: boolean;
  isVisible: boolean;
  activeCommand: HappyAssistantCommand | null;
  position: HappyAssistantPosition | null;
  assistantMessage: string | null;
}

const initialState: HappyAssistantState = {
  isSheetOpen: false,
  isVisible: true,
  activeCommand: null,
  position: null,
  assistantMessage: null,
};

const happyAssistantSlice = createSlice({
  name: "happyAssistant",
  initialState,
  reducers: {
    openSheet: (state) => {
      state.isSheetOpen = true;
    },
    closeSheet: (state) => {
      state.isSheetOpen = false;
    },
    setVisible: (state, action: PayloadAction<boolean>) => {
      state.isVisible = action.payload;
    },
    requestCommand: (
      state,
      action: PayloadAction<HappyAssistantCommand>,
    ) => {
      state.activeCommand = action.payload;
      state.isSheetOpen = false;
    },
    clearCommand: (state) => {
      state.activeCommand = null;
    },
    setPosition: (
      state,
      action: PayloadAction<HappyAssistantPosition>,
    ) => {
      state.position = action.payload;
    },
    setAssistantMessage: (state, action: PayloadAction<string | null>) => {
      state.assistantMessage = action.payload;
    },
  },
});

export const {
  openSheet,
  closeSheet,
  setVisible,
  requestCommand,
  clearCommand,
  setPosition,
  setAssistantMessage,
} = happyAssistantSlice.actions;

export default happyAssistantSlice.reducer;

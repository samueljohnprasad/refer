import { useCallback, useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAtom } from "jotai";
import { useUserProfile } from "@/hooks/data/useUserProfile";
import { useStreak } from "@/src/hooks/useStreak";
import { useJournalEntry } from "@/hooks/useJournalEntry";
import { useJournalLimit } from "@/hooks/useJournalLimit";
import { useRevenueCat } from "@/src/context/RevenueCatProvider";
import { useAppDispatch } from "@/src/store/hooks";
import { setVisible as setAssistantVisible } from "@/src/store/slices/happyAssistantSlice";
import { startRecordingAtom } from "../../DailyNotesScreen/atoms";
import { selectedDateDiscoveryAtom } from "../helpers";
import { useVoiceFeature } from "@/src/hooks/useVoiceFeature";

export interface DiscoveryScreenViewModel {
  currentStreak: number;
  isStreakLoading: boolean;
  selectedDate: Date;
  currentPrompt: string;
  allPrompts: string[];
  isCalendarVisible: boolean;
  isOptionsVisible: boolean;
  isImageJournalVisible: boolean;
  onOpenRecorder: () => void;
  onOpenKeyboard: () => void;
  onScanJournal: () => void;
  onImageInsightsReady: () => void;
  onDateSelect: (selected: Date) => void;
  onTodayPress: () => void;
  onShufflePrompt: () => void;
  onSetPrompt: (prompt: string) => void;
  onOpenCalendar: () => void;
  onCloseCalendar: () => void;
  onOpenOptions: () => void;
  onCloseOptions: () => void;
  onCloseImageJournal: () => void;
}

// ponytail: single hook orchestrating record screen data fetching, navigation, and modal logic
export function useDiscoveryScreenViewModel(): DiscoveryScreenViewModel {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { date } = useLocalSearchParams<{ date: string }>();
  const [selectedDate, setSelectedDate] = useAtom(selectedDateDiscoveryAtom);
  const [, setStartRecording] = useAtom(startRecordingAtom);
  const { presentPaywall } = useRevenueCat();
  const { shouldShowPaywall } = useJournalLimit(selectedDate);
  const { isLoading: isLoadingProfile } = useUserProfile();
  const { currentStreak, isLoading: isStreakLoading } = useStreak();
  const { currentPrompt, shufflePrompt, setPrompt, allPrompts } = useJournalEntry();

  const [isCalendarVisible, setIsCalendarVisible] = useState<boolean>(false);
  const [isOptionsVisible, setIsOptionsVisible] = useState<boolean>(false);
  const [isImageJournalVisible, setIsImageJournalVisible] = useState<boolean>(false);

  useEffect(() => {
    setSelectedDate(date ? new Date(date) : new Date());
  }, [date, setSelectedDate]);

  // ponytail: auto-shuffle prompt every 5 minutes if screen stays idle
  useEffect(() => {
    const interval = setInterval(() => {
      shufflePrompt();
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [shufflePrompt]);

  // ponytail: hide global floating panda helper to eliminate redundant character competition
  useEffect(() => {
    dispatch(setAssistantVisible(false));
    return () => {
      dispatch(setAssistantVisible(true));
    };
  }, [dispatch]);

  const { journalRoute, isVoiceEnabled } = useVoiceFeature();

  const onOpenRecorder = useCallback((): void => {
    if (shouldShowPaywall && isVoiceEnabled) {
      presentPaywall();
      return;
    }
    if (isVoiceEnabled) {
      setStartRecording(true);
    }
    router.push(journalRoute);
  }, [shouldShowPaywall, isVoiceEnabled, presentPaywall, setStartRecording, router, journalRoute]);

  const onOpenKeyboard = useCallback((): void => {
    if (shouldShowPaywall) {
      presentPaywall();
      return;
    }
    router.push("/tabs/screens/keyboard-recorder");
  }, [shouldShowPaywall, presentPaywall, router]);

  const onScanJournal = useCallback((): void => {
    if (shouldShowPaywall) {
      presentPaywall();
      return;
    }
    setIsImageJournalVisible(true);
  }, [shouldShowPaywall, presentPaywall]);

  const onImageInsightsReady = useCallback((): void => {
    setIsImageJournalVisible(false);
  }, []);

  const onDateSelect = useCallback((selected: Date): void => {
    setSelectedDate(selected);
    setIsCalendarVisible(false);
  }, [setSelectedDate]);

  const onTodayPress = useCallback((): void => {
    setSelectedDate(new Date());
    setIsCalendarVisible(false);
  }, [setSelectedDate]);

  const onOpenCalendar = useCallback((): void => {
    setIsCalendarVisible(true);
  }, []);

  const onCloseCalendar = useCallback((): void => {
    setIsCalendarVisible(false);
  }, []);

  const onOpenOptions = useCallback((): void => {
    setIsOptionsVisible(true);
  }, []);

  const onCloseOptions = useCallback((): void => {
    setIsOptionsVisible(false);
  }, []);

  const onCloseImageJournal = useCallback((): void => {
    setIsImageJournalVisible(false);
  }, []);

  return {
    currentStreak,
    isStreakLoading: isLoadingProfile || isStreakLoading,
    selectedDate,
    currentPrompt,
    allPrompts,
    isCalendarVisible,
    isOptionsVisible,
    isImageJournalVisible,
    onOpenRecorder,
    onOpenKeyboard,
    onScanJournal,
    onImageInsightsReady,
    onDateSelect,
    onTodayPress,
    onShufflePrompt: shufflePrompt,
    onSetPrompt: setPrompt,
    onOpenCalendar,
    onCloseCalendar,
    onOpenOptions,
    onCloseOptions,
    onCloseImageJournal,
  };
}

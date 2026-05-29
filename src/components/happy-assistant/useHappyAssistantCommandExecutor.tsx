import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import { router } from "expo-router";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useSetAtom } from "jotai";
import type { CustomerInfo } from "react-native-purchases";

import { Toast, ToastTitle, useToast } from "@/components/ui/toast";
import { useRevenueCat } from "@/src/context/RevenueCatProvider";
import {
  openAIInsightsAtom,
  startRecordingAtom,
} from "@/src/screens/DailyNotesScreen/atoms";
import {
  keyboardJournalOpenAtom,
  recorderOpenAtom,
} from "@/src/screens/DiscoveryScreen/helpers";
import { useCBTHistory } from "@/src/screens/ExercisesScreen/hooks/useCBTHistory";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import {
  HappyAssistantCommandEnum,
  clearCommand,
  type HappyAssistantCommand,
} from "@/src/store/slices/happyAssistantSlice";
import { getLatestIncompleteExercise } from "./assistantHistory";
import {
  buildExerciseFlowRoute,
  HAPPY_ASSISTANT_ROUTES,
} from "./constants";

const ASSISTANT_COMMAND_EXECUTION_DELAY_MS = 450;
const PREMIUM_ENTITLEMENT_ID = "Premium journals";

type AssistantToastAction = "success" | "error" | "info";
type AssistantCommandHandler = () => Promise<void> | void;

interface UseHappyAssistantCommandExecutorResult {
  signInSheetRef: RefObject<BottomSheetModal | null>;
  isMoodSheetVisible: boolean;
  closeMoodSheet: () => void;
}

function hasPremiumEntitlement(info: CustomerInfo | null): boolean {
  return Boolean(info?.entitlements.active[PREMIUM_ENTITLEMENT_ID]);
}

export function useHappyAssistantCommandExecutor(): UseHappyAssistantCommandExecutorResult {
  const activeCommand = useAppSelector(
    (state) => state.happyAssistant.activeCommand,
  );
  const dispatch = useAppDispatch();
  const signInSheetRef = useRef<BottomSheetModal | null>(null);
  const [isMoodSheetVisible, setMoodSheetVisible] = useState(false);
  const setStartRecording = useSetAtom(startRecordingAtom);
  const setRecorderOpen = useSetAtom(recorderOpenAtom);
  const setKeyboardJournalOpen = useSetAtom(keyboardJournalOpenAtom);
  const setOpenAIInsights = useSetAtom(openAIInsightsAtom);
  const { restorePurchases } = useRevenueCat();
  const { data: history = [] } = useCBTHistory();
  const toast = useToast();

  const latestIncompleteExercise = useMemo(
    () => getLatestIncompleteExercise(history),
    [history],
  );

  const showToast = useCallback(
    (
      message: string,
      action: AssistantToastAction = "success",
    ): void => {
      toast.show({
        placement: "bottom right",
        render: ({ id }) => (
          <Toast nativeID={id} variant="solid" action={action}>
            <ToastTitle>{message}</ToastTitle>
          </Toast>
        ),
      });
    },
    [toast],
  );

  const closeMoodSheet = useCallback((): void => {
    setMoodSheetVisible(false);
  }, []);

  const commandHandlers = useMemo<
    Record<HappyAssistantCommand, AssistantCommandHandler>
  >(
    () => ({
      [HappyAssistantCommandEnum.OpenSaveProfile]: () => {
        signInSheetRef.current?.present();
      },
      [HappyAssistantCommandEnum.VoiceJournal]: () => {
        router.push(HAPPY_ASSISTANT_ROUTES.record as never);
        setStartRecording(true);
        setRecorderOpen(true);
      },
      [HappyAssistantCommandEnum.KeyboardJournal]: () => {
        router.push(HAPPY_ASSISTANT_ROUTES.record as never);
        setKeyboardJournalOpen(true);
      },
      [HappyAssistantCommandEnum.MoodCheck]: () => {
        setMoodSheetVisible(true);
      },
      [HappyAssistantCommandEnum.AiInsight]: () => {
        router.push(HAPPY_ASSISTANT_ROUTES.journal as never);
        setOpenAIInsights(true);
      },
      [HappyAssistantCommandEnum.ResumeExercise]: () => {
        if (latestIncompleteExercise?.exerciseType) {
          router.push(
            buildExerciseFlowRoute(latestIncompleteExercise.exerciseType, {
              entryId: latestIncompleteExercise.id,
            }) as never,
          );
          return;
        }

        router.push(HAPPY_ASSISTANT_ROUTES.breathingExercise as never);
      },
      [HappyAssistantCommandEnum.TryBreathing]: () => {
        router.push(HAPPY_ASSISTANT_ROUTES.breathingExercise as never);
      },
      [HappyAssistantCommandEnum.ThoughtCatcher]: () => {
        router.push(HAPPY_ASSISTANT_ROUTES.thoughtCatcherExercise as never);
      },
      [HappyAssistantCommandEnum.ViewExerciseLog]: () => {
        router.push(HAPPY_ASSISTANT_ROUTES.exercisesLog as never);
      },
      [HappyAssistantCommandEnum.ContinueJourney]: () => {
        router.push(HAPPY_ASSISTANT_ROUTES.journeys as never);
      },
      [HappyAssistantCommandEnum.OpenSettings]: () => {
        router.push(HAPPY_ASSISTANT_ROUTES.settings as never);
      },
      [HappyAssistantCommandEnum.RestorePurchases]: async () => {
        const info = await restorePurchases();
        const hasPremium = hasPremiumEntitlement(info);

        showToast(
          hasPremium ? "Premium restored." : "No active Premium found.",
          hasPremium ? "success" : "info",
        );
      },
      [HappyAssistantCommandEnum.Support]: () => {
        router.push(HAPPY_ASSISTANT_ROUTES.support as never);
      },
    }),
    [
      latestIncompleteExercise,
      restorePurchases,
      setKeyboardJournalOpen,
      setOpenAIInsights,
      setRecorderOpen,
      setStartRecording,
      showToast,
    ],
  );

  const executeCommand = useCallback(
    async (command: HappyAssistantCommand): Promise<void> => {
      await commandHandlers[command]();
    },
    [commandHandlers],
  );

  useEffect(() => {
    if (!activeCommand) return;

    const timer = setTimeout(() => {
      void executeCommand(activeCommand)
        .catch(() => {
          showToast("Happy could not complete that action.", "error");
        })
        .finally(() => {
          dispatch(clearCommand());
        });
    }, ASSISTANT_COMMAND_EXECUTION_DELAY_MS);

    return () => clearTimeout(timer);
  }, [activeCommand, dispatch, executeCommand, showToast]);

  return {
    signInSheetRef,
    isMoodSheetVisible,
    closeMoodSheet,
  };
}

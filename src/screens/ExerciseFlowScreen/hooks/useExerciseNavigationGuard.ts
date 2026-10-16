// ponytail: extracted navigation guard for back-handling and exit confirmation in exercise flow
import { useEffect, useRef, MutableRefObject } from "react";
import { BackHandler } from "react-native";
import { useNavigation } from "expo-router";
import { usePreventRemove } from "expo-router/react-navigation";

interface UseExerciseNavigationGuardParams {
  readOnly: boolean;
  currentStepIndex: number;
  isConfirmedExit: boolean;
  isConfirmedExitRef: MutableRefObject<boolean>;
  onClose: () => void;
}

export function useExerciseNavigationGuard({
  readOnly,
  currentStepIndex,
  isConfirmedExit,
  isConfirmedExitRef,
  onClose,
}: UseExerciseNavigationGuardParams): void {
  const navigation = useNavigation();
  const pendingExitActionRef = useRef<Parameters<typeof navigation.dispatch>[0] | null>(null);

  useEffect(() => {
    const action = pendingExitActionRef.current;
    if (!isConfirmedExit || !action) return;

    pendingExitActionRef.current = null;
    navigation.dispatch(action);
  }, [isConfirmedExit, navigation]);

  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      onClose();
      return true;
    });
    return () => sub.remove();
  }, [onClose]);

  usePreventRemove(
    !readOnly && currentStepIndex > 0 && !isConfirmedExit,
    ({ data: { action } }) => {
      if (isConfirmedExitRef.current) {
        pendingExitActionRef.current = action;
        return;
      }
      onClose();
    },
  );
}

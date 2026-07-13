import { useCallback, useEffect, type ReactElement } from "react";
import * as Haptics from "expo-haptics";
import { usePathname } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import {
  closeSheet,
  openSheet,
  requestCommand,
  setPosition,
  setAssistantMessage,
  type HappyAssistantCommand,
} from "@/src/store/slices/happyAssistantSlice";
import { useHappyAssistantActions } from "./useHappyAssistantActions";
import { HappyAssistantCommandExecutor } from "./HappyAssistantCommandExecutor";
import { shouldHideAssistant } from "./constants";
import { AssistantActionModal } from "./AssistantActionModal";
import { AssistantActionSheet } from "./AssistantActionSheet";
import { FloatingAssistantButton } from "./FloatingAssistantButton";

export function FloatingHappyAssistant(): ReactElement {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { title, subtitle, actions } = useHappyAssistantActions();
  const { isSheetOpen, isVisible, position, assistantMessage } = useAppSelector(
    (state) => state.happyAssistant,
  );
  const hidden = !isVisible || shouldHideAssistant(pathname);

  const openAssistant = useCallback((): void => {
    void Haptics.selectionAsync().catch(() => {});
    dispatch(openSheet());
  }, [dispatch]);

  const closeAssistant = useCallback((): void => {
    dispatch(closeSheet());
  }, [dispatch]);

  const handleCommandPress = useCallback(
    (command: HappyAssistantCommand): void => {
      void Haptics.selectionAsync().catch(
        () => {},
      );
      dispatch(requestCommand(command));
    },
    [dispatch],
  );

  const handlePositionChange = useCallback(
    (nextPosition: { x: number; y: number }): void => {
      dispatch(setPosition(nextPosition));
    },
    [dispatch],
  );

  useEffect(() => {
    if (hidden && isSheetOpen) {
      dispatch(closeSheet());
    }
  }, [dispatch, hidden, isSheetOpen]);

  useEffect(() => {
    // Timer removed as per request. The step itself manages unmounting.
  }, [assistantMessage, dispatch]);

  const assistantOverlay = hidden ? null : (
    <>
      <FloatingAssistantButton
        isDimmed={isSheetOpen}
        position={position}
        message={assistantMessage}
        onOpen={openAssistant}
        onPositionChange={handlePositionChange}
      />
      <AssistantActionModal
        visible={isSheetOpen}
        bottomInset={Math.max(insets.bottom, 12) + 12}
        onClose={closeAssistant}
      >
        <AssistantActionSheet
          title={title}
          subtitle={subtitle}
          actions={actions}
          onCommandPress={handleCommandPress}
        />
      </AssistantActionModal>
    </>
  );

  return (
    <>
      <HappyAssistantCommandExecutor />
      {assistantOverlay}
    </>
  );
}

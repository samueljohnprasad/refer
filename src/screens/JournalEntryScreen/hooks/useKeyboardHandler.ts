import { useEffect, useState } from "react";
import { Keyboard, Platform, KeyboardEvent, KeyboardEventName } from "react-native";

interface UseKeyboardHandlerReturn {
  keyboardHeight: number;
}

/**
 * Hook to manage keyboard appearance and height
 * Handles platform-specific keyboard events
 */
export const useKeyboardHandler = (): UseKeyboardHandlerReturn => {
  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);

  useEffect((): (() => void) => {
    const showEvent: KeyboardEventName =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent: KeyboardEventName =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const onShow = (e: KeyboardEvent): void => {
      setKeyboardHeight(e.endCoordinates.height);
    };

    const onHide = (): void => {
      setKeyboardHeight(0);
    };

    const subShow = Keyboard.addListener(showEvent, onShow);
    const subHide = Keyboard.addListener(hideEvent, onHide);

    return (): void => {
      subShow.remove();
      subHide.remove();
    };
  }, []);

  return { keyboardHeight };
};

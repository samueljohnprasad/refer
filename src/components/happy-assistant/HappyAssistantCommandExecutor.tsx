import { type ReactElement } from "react";

import SignInBottomSheet from "@/src/components/SignInBottomSheet";
import { AssistantMoodSheet } from "./AssistantMoodSheet";
import { useHappyAssistantCommandExecutor } from "./useHappyAssistantCommandExecutor";

export function HappyAssistantCommandExecutor(): ReactElement {
  const { signInSheetRef, isMoodSheetVisible, closeMoodSheet } =
    useHappyAssistantCommandExecutor();

  return (
    <>
      <SignInBottomSheet ref={signInSheetRef} />
      <AssistantMoodSheet
        visible={isMoodSheetVisible}
        onClose={closeMoodSheet}
      />
    </>
  );
}

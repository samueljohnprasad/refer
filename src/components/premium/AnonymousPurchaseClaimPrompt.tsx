import React, { useEffect, useRef } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { usePathname } from "expo-router";

import SignInBottomSheet from "@/src/components/SignInBottomSheet";
import { useAuth } from "@/src/context/AuthContext";
import { useRevenueCat } from "@/src/context/RevenueCatProvider";

export default function AnonymousPurchaseClaimPrompt(): React.JSX.Element {
  const sheetRef = useRef<BottomSheetModal>(null);
  const pathname = usePathname();
  const { isAnonymous } = useAuth();
  const {
    shouldPromptAccountClaim,
    dismissAccountClaimPrompt,
  } = useRevenueCat();

  useEffect(() => {
    if (!shouldPromptAccountClaim) return;

    if (pathname.includes("premium-onboarding")) return;

    if (!isAnonymous) {
      dismissAccountClaimPrompt();
      return;
    }

    const timer = setTimeout(() => {
      sheetRef.current?.present();
    }, 350);

    return () => clearTimeout(timer);
  }, [
    dismissAccountClaimPrompt,
    isAnonymous,
    pathname,
    shouldPromptAccountClaim,
  ]);

  return <SignInBottomSheet ref={sheetRef} />;
}

import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import React, { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { View, Text, TouchableOpacity } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { LockIcon, SparklesIcon } from "@hugeicons/core-free-icons";
import ShortBottomModal from "@/src/components/ShortBottomModal";
import SignInBottomSheet from "@/src/components/SignInBottomSheet";
import { CourseExercisePrimaryButton } from "@/src/components/exercise/CourseExerciseShell";
import {
  useGuestSignUpSheetViewModel,
  type GuestSignUpSheetProps,
} from "../hooks/useGuestSignUpSheetViewModel";

export interface GuestSignUpSheetViewProps
  extends ReturnType<typeof useGuestSignUpSheetViewModel> {
  bottomSheetRef: React.ForwardedRef<BottomSheetModal | null>;
}

/**
 * Presentational View component for GuestSignUpSheet.
 * Strictly contains JSX code without internal hooks.
 */
export const GuestSignUpSheetView = React.memo(function GuestSignUpSheetView({
  signInSheetRef,
  handleSaveProgress,
  handleNotNow,
  completedCount,
  guestProgress,
  onDismiss,
  bottomSheetRef,
}: GuestSignUpSheetViewProps): React.JSX.Element {
  const { t } = useTranslation("journeys");
  return (
    <>
      <ShortBottomModal
        ref={bottomSheetRef}
        snapPoints={["48%"]}
        onDismiss={onDismiss}
      >
        <View className="flex-1 px-6 pt-5 pb-8">
          <View className="w-14 h-14 rounded-2xl bg-purple-100 items-center justify-center mb-4">
            <HugeiconsIcon icon={LockIcon} size={28} color="#7B61FF" />
          </View>

          <Text
            className="text-ink mb-1"
            style={{
              fontFamily: APP_FONT_FAMILIES.semiBold,
              fontSize: 26,
              lineHeight: 32,
            }}
          >
            {t("signUpToKeepGoing")}
          </Text>
          <Text className="text-ink-soft text-base leading-6 mb-5">
            {t("guestProgressMessage", {
              count: completedCount,
              unit: t(completedCount === 1 ? "nodeDone" : "nodesDone"),
              points: guestProgress.tempXP,
            })}
          </Text>

          {completedCount > 0 && (
            <View className="flex-row items-center gap-2 bg-purple-50 rounded-2xl px-4 py-3 mb-5">
              <HugeiconsIcon icon={SparklesIcon} size={18} color="#7B61FF" />
              <Text className="text-ink text-sm font-semibold">
                {t("insightPointsSaved", {
                  count: completedCount,
                  points: guestProgress.tempXP,
                })}
              </Text>
            </View>
          )}

          <View className="w-full mb-3">
            <CourseExercisePrimaryButton
              label={t("saveMyProgress")}
              onPress={handleSaveProgress}
              height={56}
              fontSize={16}
            />
          </View>

          <TouchableOpacity
            onPress={handleNotNow}
            activeOpacity={0.7}
            className="w-full h-11 items-center justify-center"
            accessibilityRole="button"
            accessibilityLabel={t("notNow")}
          >
            <Text className="text-ink-muted text-sm font-medium">{t("notNow")}</Text>
          </TouchableOpacity>
        </View>
      </ShortBottomModal>

      <SignInBottomSheet ref={signInSheetRef} />
    </>
  );
});

/**
 * Container component for GuestSignUpSheet.
 */
const GuestSignUpSheet = forwardRef<
  BottomSheetModal | null,
  GuestSignUpSheetProps
>((props, ref) => {
  const viewModel = useGuestSignUpSheetViewModel(props, ref);
  return <GuestSignUpSheetView {...viewModel} bottomSheetRef={ref} />;
});

GuestSignUpSheet.displayName = "GuestSignUpSheet";
export default GuestSignUpSheet;
export type { GuestSignUpSheetProps };

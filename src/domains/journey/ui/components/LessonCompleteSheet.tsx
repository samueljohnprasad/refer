import React, { forwardRef } from "react";
import { View } from "react-native";
import { Text } from "@/src/components/ui/Text";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { PressableScale } from "@/src/components/ui/PressableScale";
import Animated, { FadeInUp, FadeIn, useReducedMotion } from "react-native-reanimated";
import {
  useLessonCompleteSheetViewModel,
  type LessonCompleteSheetProps,
} from "../hooks/useLessonCompleteSheetViewModel";

function ModalBackdrop(props: BottomSheetBackdropProps): React.JSX.Element {
  return (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      pressBehavior="none"
      opacity={0.5}
    />
  );
}

export const LessonCompleteSheetView = React.memo(
  function LessonCompleteSheetView({
    takeaway,
    handleContinue,
    bottomSheetRef,
  }: LessonCompleteSheetProps &
    ReturnType<typeof useLessonCompleteSheetViewModel> & {
      bottomSheetRef: React.ForwardedRef<BottomSheetModal>;
    }): React.JSX.Element {
    const reduceMotion = useReducedMotion();
    
    const titleEntering = reduceMotion ? FadeIn.delay(100).duration(300) : FadeInUp.delay(100).duration(300).springify();
    const boxEntering = reduceMotion ? FadeIn.delay(250).duration(300) : FadeInUp.delay(250).duration(300);
    const btnEntering = reduceMotion ? FadeIn.delay(400).duration(300) : FadeInUp.delay(400).duration(300).springify();

    return (
      <BottomSheetModal
        ref={bottomSheetRef}
        index={0}
        snapPoints={["50%"]}
        enablePanDownToClose={false}
        backdropComponent={ModalBackdrop}
        backgroundStyle={{
          borderRadius: 28,
          backgroundColor: "white",
        }}
        style={{ marginHorizontal: 8 }}
      >
        <BottomSheetView className="flex-1 px-6 pt-2 pb-8 justify-between"  accessibilityViewIsModal={true}>
          <View>
            <Animated.View
              entering={titleEntering}
              className="items-center mb-6"
            >
              <Text className="text-3xl font-extrabold text-ink text-center mb-2" accessibilityRole="header">
                Lesson Complete!
              </Text>
              <Text className="text-6xl mb-4" importantForAccessibility="no">🌟</Text>
            </Animated.View>

            <Animated.View
              entering={boxEntering}
              className="bg-brand-soft p-4 rounded-2xl"
            >
              <Text className="text-base text-ink font-semibold text-center">
                {takeaway}
              </Text>
            </Animated.View>
          </View>

          <Animated.View entering={btnEntering}>
            <PressableScale
              onPress={handleContinue}
              scale={0.95}
              hapticStyle="heavy"
              className="w-full"
              accessibilityRole="button"
              accessibilityLabel="Continue and go back to path"
              style={{
                backgroundColor: "#58CC02",
                paddingVertical: 16,
                borderRadius: 16,
                borderBottomWidth: 4,
                borderBottomColor: "#45A802",
                alignItems: "center",
              }}
            >
              <Text className="text-lg font-extrabold text-white">CONTINUE</Text>
            </PressableScale>
          </Animated.View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

const LessonCompleteSheet = forwardRef<BottomSheetModal, LessonCompleteSheetProps>(
  (props, ref) => {
    const viewModel = useLessonCompleteSheetViewModel(props, ref);
    return <LessonCompleteSheetView {...props} {...viewModel} bottomSheetRef={ref} />;
  },
);

LessonCompleteSheet.displayName = "LessonCompleteSheet";

export default LessonCompleteSheet;
export type { LessonCompleteSheetProps };

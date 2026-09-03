import React, { forwardRef } from "react";
import { View } from "react-native";
import { Text } from "@/src/components/ui/Text";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import Animated, { FadeInUp, FadeIn, useReducedMotion } from "react-native-reanimated";
import { PressableScale } from "@/src/components/ui/PressableScale";
import { ConfettiExplosion } from "@/src/components/animations/ConfettiExplosion";
import {
  useUnitCompleteModalViewModel,
  type UnitCompleteModalProps,
} from "../hooks/useUnitCompleteModalViewModel";

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

export interface UnitCompleteModalViewProps
  extends ReturnType<typeof useUnitCompleteModalViewModel> {
  bottomSheetRef: React.ForwardedRef<BottomSheetModal>;
}

/**
 * Presentational View component for UnitCompleteModal.
 * Strictly contains JSX code without internal hooks.
 */
export const UnitCompleteModalView = React.memo(
  function UnitCompleteModalView({
    snapPoints,
    showConfetti,
    trophyStyle,
    handleConfettiComplete,
    handleContinue,
    unit,
    capabilityStatement,
    bottomSheetRef,
  }: UnitCompleteModalViewProps): React.JSX.Element {
    const reduceMotion = useReducedMotion();
    
    const titleEntering = reduceMotion ? FadeIn.delay(200).duration(300) : FadeInUp.delay(200).duration(300).springify();
    const boxEntering = reduceMotion ? FadeIn.delay(350).duration(300) : FadeInUp.delay(350).duration(300);
    const btnEntering = reduceMotion ? FadeIn.delay(700).duration(300) : FadeInUp.delay(700).duration(300).springify();

    return (
      <BottomSheetModal
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose={false}
        backdropComponent={ModalBackdrop}
        backgroundStyle={{
          borderRadius: 28,
          backgroundColor: "white",
        }}
        style={{ marginHorizontal: 8 }}
      >
        <BottomSheetView className="flex-1 px-6 pt-2 pb-8 justify-between"  accessibilityViewIsModal={true}>
          {unit && (
            <View>
              <ConfettiExplosion
                isVisible={showConfetti}
                count={30}
                duration={1200}
                onAnimationComplete={handleConfettiComplete}
              />

              <View className="items-center mb-4 mt-4">
                <Animated.View
                  style={[
                    trophyStyle,
                    {
                      width: 88,
                      height: 88,
                      borderRadius: 22,
                      backgroundColor: "#FEF3C7",
                      alignItems: "center",
                      justifyContent: "center",
                      borderWidth: 3,
                      borderColor: "#F59E0B",
                    },
                  ]}
                  importantForAccessibility="no"
                >
                  <Text className="text-5xl">🏆</Text>
                </Animated.View>
              </View>

              <Animated.View
                entering={titleEntering}
                className="items-center mb-6"
              >
                <Text className="text-2xl font-extrabold text-ink text-center" accessibilityRole="header">
                  Unit Complete!
                </Text>
              </Animated.View>

              <Animated.View
                entering={boxEntering}
                className="bg-brand-soft p-5 rounded-2xl mb-8"
              >
                <Text className="text-base text-ink font-bold text-center mb-1">
                  You now understand:
                </Text>
                <Text className="text-lg text-brand-strong font-extrabold text-center">
                  {capabilityStatement}
                </Text>
              </Animated.View>
            </View>
          )}

          <Animated.View
            entering={btnEntering}
          >
            <PressableScale
              onPress={handleContinue}
              scale={0.95}
              hapticStyle="heavy"
              className="w-full"
              accessibilityRole="button"
              accessibilityLabel="Continue"
              style={{
                backgroundColor: "#58CC02",
                paddingVertical: 16,
                borderRadius: 16,
                borderBottomWidth: 4,
                borderBottomColor: "#45A802",
                alignItems: "center",
              }}
            >
              <Text className="text-lg font-extrabold text-white">
                CONTINUE
              </Text>
            </PressableScale>
          </Animated.View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

/**
 * Container component for UnitCompleteModal.
 */
const UnitCompleteModal = forwardRef<BottomSheetModal, UnitCompleteModalProps>(
  (props, ref) => {
    const viewModel = useUnitCompleteModalViewModel(props, ref);
    return <UnitCompleteModalView {...viewModel} bottomSheetRef={ref} />;
  },
);

UnitCompleteModal.displayName = "UnitCompleteModal";

export default UnitCompleteModal;
export type { UnitCompleteModalProps };

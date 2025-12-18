import { StyleSheet } from "react-native";
import React, { forwardRef, useEffect, useMemo, useRef } from "react";
import { SharedValue } from "react-native-reanimated";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
// import { BottomSheetBackdrop } from "@/components/ui/bottomsheet";

interface ShortBottomModalProps {
  children: React.ReactNode;
  height?: number;
  snapPoints?:
    | ((string | number)[] & string[])
    | (SharedValue<(string | number)[]> & string[]);
  onDismiss?: () => void;
  marginHorizontal?: number;
  enableContentPanningGesture?: boolean;
}

export function BlurBackdropExpo(props: BottomSheetBackdropProps) {
  // props contains animated indices and style; pass through to BottomSheetBackdrop
  return (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      pressBehavior="close"
      opacity={0.2}
      style={props.style}
    >
      {/* <BlurView intensity={50} tint="light" style={StyleSheet.absoluteFill} /> */}
    </BottomSheetBackdrop>
  );
}

const ShortBottomModal = forwardRef<
  BottomSheetModal | null,
  ShortBottomModalProps
>(
  (
    {
      children,
      onDismiss,
      height,
      snapPoints = ["30%"],
      marginHorizontal = 16,
      enableContentPanningGesture = false,
    },
    ref
  ) => {
    return (
      <BottomSheetModal
        // backgroundComponent={BlurredBackground}
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        detached
        bottomInset={60}
        onDismiss={onDismiss}
        stackBehavior="push"
        backgroundStyle={{
          borderRadius: 28,

          backgroundColor: "white",
          // shadowOpacity: 0.1,
          // shadowRadius: 8,
          // shadowOffset: { width: 0, height: 3 },
          // elevation: 4,
          // shadowColor: "#000",
        }}
        backdropComponent={BlurBackdropExpo}
        enablePanDownToClose={true}
        enableContentPanningGesture={enableContentPanningGesture}
        style={{
          marginHorizontal: marginHorizontal,
          borderRadius: 56,
        }}
      >
        <BottomSheetView
          style={{
            flex: 1,
          }}
          className="flex-1 h-full w-full rounded-sm"
        >
          {children}
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

export default ShortBottomModal;

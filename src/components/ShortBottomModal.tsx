import { StyleSheet } from "react-native";
import React, { useMemo } from "react";
import {
  BottomSheetBackdrop,
  BottomSheetContent,
  BottomSheetPortal,
} from "@/components/ui/bottomsheet";
import { VStack } from "@/components/ui/vstack";
import AnimatedLinearGradient from "./AnimatedLinearGradient";
import { SharedValue } from "react-native-reanimated";

interface ShortBottomModalProps {
  children: React.ReactNode;
  height?: number;
  snapPoints?:
    | ((string | number)[] & string[])
    | (SharedValue<(string | number)[]> & string[]);
}

const ShortBottomModal: React.FC<ShortBottomModalProps> = ({
  children,
  height,
  snapPoints = ["50%"],
}) => {
  return (
    <BottomSheetPortal
      enableDynamicSizing
      snapPoints={snapPoints}
      index={-1}
      android_keyboardInputMode="adjustResize"
      style={{ padding: 0, marginHorizontal: 0 }}
      handleStyle={{ display: "none" }}
      backgroundStyle={{
        borderRadius: 16,
        backgroundColor: "transparent",
        alignItems: "flex-end",
      }}
      bottomInset={0}
      enablePanDownToClose
      backdropComponent={BottomSheetBackdrop}
    >
      <BottomSheetContent
        style={{
          backgroundColor: "transparent",
          borderRadius: 16,
          borderBottomStartRadius: 16,
          borderBottomEndRadius: 16,
          height: height || 370,
          paddingHorizontal: 12,
        }}
      >
        <VStack
          className="flex-1  rounded-2xl h-full px-6 "
          space="4xl"
          style={{
            backgroundColor: "white",
            borderRadius: 24,
            height: "100%",
            paddingTop: 24,
          }}
        >
          <AnimatedLinearGradient
            className="rounded-2xl"
            colors={["#f0efed", "#bdebf8"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            locations={[0, 1]}
            style={[StyleSheet.absoluteFill, { borderRadius: 24 }]}
          />
          {children}
        </VStack>
      </BottomSheetContent>
    </BottomSheetPortal>
  );
};

export default ShortBottomModal;

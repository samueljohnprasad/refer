import { StyleSheet } from "react-native";
import React from "react";
import {
  BottomSheetContent,
  BottomSheetPortal,
} from "@/components/ui/bottomsheet";

interface ShortBottomModalProps {
  children: React.ReactNode;
  height?: number;
}
const ShortBottomModalWithProvider: React.FC<ShortBottomModalProps> = ({
  children,
}) => {
  return (
    <BottomSheetPortal
      enableDynamicSizing
      snapPoints={["40%"]}
      index={-1}
      android_keyboardInputMode="adjustResize"
      style={{ padding: 0, marginHorizontal: 0 }}
      handleStyle={{ display: "none" }}
      backgroundStyle={{
        borderRadius: 16,
        // backgroundColor: "transparent",
        alignItems: "flex-end",
        paddingHorizontal: 12,
        marginHorizontal: 12,
      }}
      bottomInset={0}
      detached
      enablePanDownToClose
    >
      <BottomSheetContent
        style={{
          backgroundColor: "#ddd6fe",
          borderRadius: 16,
          borderBottomStartRadius: 16,
          borderBottomEndRadius: 16,
          height: 270,
          paddingHorizontal: 12,
          marginHorizontal: 12,
        }}
      >
        {children}
      </BottomSheetContent>
    </BottomSheetPortal>
  );
};

export default ShortBottomModalWithProvider;

const styles = StyleSheet.create({});

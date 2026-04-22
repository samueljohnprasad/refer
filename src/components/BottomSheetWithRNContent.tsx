import { useState } from "react";
import { Pressable, Text as RNText, View } from "react-native";
import {
  Host,
  BottomSheet,
  Button,
  RNHostView,
  VStack,
  Group,
} from "@expo/ui/swift-ui";
import {
  presentationDetents,
  presentationDragIndicator,
} from "@expo/ui/swift-ui/modifiers";

export default function BottomSheetWithRNContent({
  children,
  isPresented,
  setIsPresented,
}: {
  children: React.ReactNode;
  isPresented: boolean;
  setIsPresented: (value: boolean) => void;
}) {
  return (
    <Host style={{ flex: 1 }}>
      <BottomSheet
        isPresented={isPresented}
        onIsPresentedChange={setIsPresented}
      >
        <Group
          modifiers={[
            presentationDetents(["medium", "large"]),
            presentationDragIndicator("visible"),
          ]}
        >
          <RNHostView>
            <View style={{ flex: 1, padding: 24 }}>{children}</View>
          </RNHostView>
        </Group>
      </BottomSheet>
    </Host>
  );
}

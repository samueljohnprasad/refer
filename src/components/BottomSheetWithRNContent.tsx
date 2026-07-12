import { View, StyleSheet } from "react-native";
import { BottomSheet, Group, Host, RNHostView } from "@expo/ui/swift-ui";
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
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <Host>
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
              <View className="flex-1">{children}</View>
            </RNHostView>
          </Group>
        </BottomSheet>
      </Host>
    </View>
  );
}

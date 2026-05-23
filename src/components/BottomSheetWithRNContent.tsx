import { View } from "react-native";
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
            <View className="flex-1 happy-brand-screen">{children}</View>
          </RNHostView>
        </Group>
      </BottomSheet>
    </Host>
  );
}

import { Stack } from "expo-router";
import SupportChatScreen, {
  SupportChatHeaderLeft,
  SupportChatHeaderRight,
} from "@/src/screens/SupportChatScreen/SupportChatScreen";
import { GlassView } from "expo-glass-effect";

export default function SupportChat() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Support",
          headerTransparent: true,
          headerBackground: () => <GlassView glassEffectStyle="clear" style={{ flex: 1 }} />,
          headerLeft: () => <SupportChatHeaderLeft />,
          headerRight: () => <SupportChatHeaderRight />,
        }}
      />
      <SupportChatScreen />
    </>
  );
}

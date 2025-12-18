import { Stack } from "expo-router";
import SupportChatScreen, {
  SupportChatHeader,
} from "@/src/screens/SupportChatScreen/SupportChatScreen";

export default function SupportChat() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTransparent: true,
          headerBlurEffect: "regular",
          header: () => <SupportChatHeader />,
        }}
      />
      <SupportChatScreen />
    </>
  );
}

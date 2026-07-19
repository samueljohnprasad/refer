import { Stack, useRouter } from "expo-router";
import SupportChatScreen from "@/src/screens/SupportChatScreen/SupportChatScreen";
import { GlassView } from "expo-glass-effect";
import { Host, Menu, Section, Button as SUIButton, Text as SUIText, VStack, HStack, Image as SUIImage } from "@expo/ui/swift-ui";
import { controlSize, font, foregroundStyle } from "@expo/ui/swift-ui/modifiers";
import { useColorScheme } from "react-native";
import { useSupportMessages } from "@/hooks/data/useSupportMessages";

function SupportHeaderTitleMenu() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const headerFg = isDark ? "#fff" : "#000";
  const headerFgMuted = isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.5)";

  const { deleteAllMessages } = useSupportMessages();

  return (
    <Host
      style={{
        minWidth: 180,
        minHeight: 40,
      }}
    >
      <Menu
        label={
          <VStack spacing={0}>
            <HStack spacing={4} alignment="center">
              <SUIText
                modifiers={[
                  foregroundStyle(headerFg),
                  font({ weight: "semibold", size: 17 }),
                ]}
              >
                Support Chat
              </SUIText>
              <SUIImage systemName="chevron.down" size={10} color={headerFg} />
            </HStack>
            <SUIText
              modifiers={[foregroundStyle(headerFgMuted), font({ size: 12 })]}
            >
              Online
            </SUIText>
          </VStack>
        }
        modifiers={[controlSize("regular")]}
      >
        <Section title="Chat Options">
          <SUIButton
            systemImage="trash"
            label="Clear History"
            role="destructive"
            onPress={async () => {
              try {
                await deleteAllMessages();
              } catch (e) {
                console.error(e);
              }
            }}
          />
        </Section>
      </Menu>
    </Host>
  );
}

export default function SupportChat() {
  const router = useRouter();
  
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "",
          headerTransparent: true,
          headerStyle: {
            backgroundColor: "white",
          },
          // headerBackground: () => <GlassView glassEffectStyle="regular" style={{ flex: 1 }} />,
          headerLeft: () => null,
          headerRight: () => null,
        }}
      />
      <Stack.Screen.Title asChild>
        <SupportHeaderTitleMenu />
      </Stack.Screen.Title>
      <Stack.Toolbar placement="left">
        <Stack.Toolbar.Button icon="chevron.left" onPress={() => router.back()} />
      </Stack.Toolbar>
      <SupportChatScreen />
    </>
  );
}

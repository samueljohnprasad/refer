import React, { useCallback, useMemo, useState } from "react";
import { Alert, Platform, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { useHeaderHeight } from "expo-router/react-navigation";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ArrowLeft02Icon, Delete02Icon } from "@hugeicons/core-free-icons";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Button, Host } from "@expo/ui/swift-ui";
import {
  buttonBorderShape,
  buttonStyle,
  controlSize,
  labelStyle,
} from "@expo/ui/swift-ui/modifiers";
import { useTranslation } from "react-i18next";
import { ChatProvider } from "@/src/components/chat/chat-context";
import { useAuth } from "@/src/context/AuthContext";
import { useSupportMessages } from "@/hooks/data/useSupportMessages";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import SupportChatConversation from "./SupportChatConversation";

interface SupportChatScreenProps {
  onClose?: () => void;
}

const SupportChatScreen: React.FC<SupportChatScreenProps> = ({ onClose: _onClose }) => {
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { messages, isLoading, sendMessage, loadMore, hasMore } = useSupportMessages();
  const { t } = useTranslation("settings");
  const [input, setInput] = useState("");

  const chatContextValue = useMemo(() => ({
    messages: [],
    input,
    setInput,
    isGenerating: isLoading,
    onSend: () => {
      if (!input.trim()) return;
      sendMessage(input.trim());
      setInput("");
    },
    streamingStore: null as any,
  }), [input, isLoading, sendMessage]);

  const onSend = useCallback(async (newMessages: import("react-native-gifted-chat").IMessage[] = []) => {
    if (newMessages.length === 0) return;
    try {
      await sendMessage(newMessages[0].text);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }, [sendMessage]);

  const keyboardVerticalOffset = insets.bottom + 50 + Platform.select({ ios: 44, default: 0 });

  return (
    <View className="flex-1 happy-brand-screen">
      <View style={{ flex: 1, paddingTop: headerHeight }}>
        <ChatProvider value={chatContextValue}>
          <SupportChatConversation
            messages={messages}
            userId={user?.id || "1"}
            userName={user?.user_metadata?.name || t("support.unknownUser")}
            isLoading={isLoading}
            hasMore={hasMore}
            bottomInset={insets.bottom}
            keyboardVerticalOffset={keyboardVerticalOffset}
            onSend={onSend}
            loadMore={loadMore}
          />
        </ChatProvider>
      </View>
    </View>
  );
};

export const SupportChatHeaderLeft: React.FC = () => {
  const router = useRouter();
  const isLiquidGlass = isLiquidGlassAvailable();
  const { t } = useTranslation("settings");

  if (isLiquidGlass) {
    return (
      <Host matchContents>
        <Button
          label={t("support.back")}
          onPress={() => router.back()}
          modifiers={[
            labelStyle("iconOnly"),
            buttonBorderShape("circle"),
            buttonStyle("bordered"),
            controlSize("regular"),
          ]}
          systemImage="chevron.left"
        />
      </Host>
    );
  }

  return (
    <TouchableOpacity
      onPress={() => router.back()}
      className="h-11 w-11 items-center justify-center rounded-full bg-sage-pill ml-4"
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={t("support.back")}
    >
      <HugeiconsIcon icon={ArrowLeft02Icon} size={21} color={SEMANTIC_COLORS.brand.pressed} />
    </TouchableOpacity>
  );
};

export const SupportChatHeaderRight: React.FC = () => {
  const isLiquidGlass = isLiquidGlassAvailable();
  const { deleteAllMessages } = useSupportMessages();
  const { t } = useTranslation("settings");

  const handleDeleteChat = (): void => {
    Alert.alert(t("support.deleteChatTitle"), t("support.deleteChatMessage"), [
      { text: t("support.cancel"), style: "cancel" },
      {
        text: t("support.delete"),
        style: "destructive",
        onPress: async () => {
          try {
            await deleteAllMessages();
          } catch (error) {
            console.error("Error deleting messages:", error);
            Alert.alert(t("support.errorTitle"), t("support.deleteError"));
          }
        },
      },
    ]);
  };

  if (isLiquidGlass) {
    return (
      <Host matchContents>
        <Button
          label={t("support.delete")}
          onPress={handleDeleteChat}
          modifiers={[
            labelStyle("iconOnly"),
            buttonBorderShape("circle"),
            buttonStyle("bordered"),
            controlSize("regular"),
          ]}
          systemImage="trash"
        />
      </Host>
    );
  }

  return (
    <TouchableOpacity
      onPress={handleDeleteChat}
      className="h-11 w-11 items-center justify-center rounded-full bg-sage-pill mr-4"
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={t("support.delete")}
    >
      <HugeiconsIcon icon={Delete02Icon} size={20} color={SEMANTIC_COLORS.brand.pressed} />
    </TouchableOpacity>
  );
};

export default React.memo(SupportChatScreen);

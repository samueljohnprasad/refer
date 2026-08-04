import React, { useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  GiftedChat,
  IMessage,
  Bubble,
  InputToolbar,
  Composer,
  Send,
  Day,
  Time,
  MessageText,
} from "react-native-gifted-chat";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { useHeaderHeight } from "expo-router/react-navigation";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  ArrowLeft02Icon,
  Sent02Icon,
  Delete02Icon,
} from "@hugeicons/core-free-icons";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Button, Host } from "@expo/ui/swift-ui";
import {
  buttonStyle,
  controlSize,
  labelStyle,
  tint,
  foregroundStyle,
  buttonBorderShape,
} from "@expo/ui/swift-ui/modifiers";

import { useState, useMemo } from "react";
import { ChatProvider } from "@/src/components/chat/chat-context";
import { PromptInputBody, PromptInputTextarea, PromptInputSubmit } from "@/src/components/chat/prompt-input";
import { GlassContainer } from "expo-glass-effect";

import { useAuth } from "@/src/context/AuthContext";
import { useSupportMessages } from "@/hooks/data/useSupportMessages";
import {
  BRAND_SURFACE,
  BRAND_CANVAS,
  INK,
  INK_MUTED,
  SAGE,
  DANGER,
} from "@/lib/tokens";

interface SupportChatScreenProps {
  onClose?: () => void;
}

const SupportChatScreen: React.FC<SupportChatScreenProps> = ({ onClose }) => {
  const headerHeight = useHeaderHeight();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  const { messages, isLoading, sendMessage, loadMore, hasMore } =
    useSupportMessages();

  
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

  const onSend = useCallback(
    async (newMessages: IMessage[] = []) => {
      if (newMessages.length === 0) return;

      const userMessage = newMessages[0];

      try {
        await sendMessage(userMessage.text);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    },
    [sendMessage],
  );

  const renderAvatar = (props: any) => {
    const userName = props.currentMessage?.user?.name || "U";
    const isSupport = (props.currentMessage as any)?.is_support ?? false;
    const firstLetter = userName.charAt(0).toUpperCase();

    return (
      <View style={{ alignItems: "center", marginRight: 8 }}>
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: isSupport ? SAGE[500] : SAGE.pill,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 4,
          }}
        >
          <Text
            style={{
              color: isSupport ? BRAND_SURFACE : INK_MUTED,
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            {firstLetter}
          </Text>
        </View>
        {isSupport && (
          <Text
            style={{
              fontSize: 10,
              color: INK_MUTED,
              fontWeight: "500",
            }}
          >
            Support
          </Text>
        )}
      </View>
    );
  };

  // Custom bubble styling
  const renderBubble = (props: any) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: SAGE[600],
          borderRadius: 20,
          paddingHorizontal: 4,
          paddingVertical: 2,
        },
        left: {
          backgroundColor: BRAND_CANVAS,
          borderRadius: 20,
          paddingHorizontal: 4,
          paddingVertical: 2,
        },
      }}
    />
  );

  const renderMessageText = (props: any) => (
    <MessageText
      {...props}
      textStyle={{
        left: {
          fontFamily: "GeistRegular",
          color: INK,
          fontSize: 16,
          lineHeight: 24,
        },
        right: {
          fontFamily: "GeistRegular",
          color: BRAND_SURFACE,
          fontSize: 16,
          lineHeight: 24,
        },
      }}
    />
  );

  const renderDay = (props: any) => (
    <Day
      {...props}
      wrapperStyle={{
        backgroundColor: INK_MUTED,
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 6,
        alignSelf: "center",
        marginTop: 16,
        marginBottom: 8,
      }}
      textStyle={{
        color: BRAND_SURFACE,
        fontFamily: "GeistMedium",
        fontSize: 12,
        fontWeight: "600",
      }}
    />
  );

  const renderTime = (props: any) => (
    <Time
      {...props}
      timeTextStyle={{
        left: {
          color: INK_MUTED,
          fontFamily: "GeistRegular",
          fontSize: 11,
        },
        right: {
          color: BRAND_SURFACE,
          opacity: 0.8,
          fontFamily: "GeistRegular",
          fontSize: 11,
        },
      }}
    />
  );

  
  const renderInputToolbar = (props: any) => (
    <View
      style={{
        paddingHorizontal: 12,
        paddingTop: 8,
        paddingBottom: Math.max(insets.bottom, 12),
        backgroundColor: BRAND_SURFACE,
      }}
    >
      <GlassContainer
        style={{
          flexDirection: "row",
          gap: 10,
          alignItems: "flex-end",
        }}
        spacing={8}
      >
        <PromptInputBody>
          <PromptInputTextarea placeholder="Type a message..." />
          <PromptInputSubmit />
        </PromptInputBody>
      </GlassContainer>
    </View>
  );

  // If you have a tab bar, include its height
  const tabbarHeight = 50;
  const keyboardTopToolbarHeight = Platform.select({ ios: 44, default: 0 });
  const keyboardVerticalOffset =
    insets.bottom + tabbarHeight + keyboardTopToolbarHeight;
  return (
    <View className="flex-1 happy-brand-screen">
      <View
        style={{
          flex: 1,
          paddingTop: headerHeight,
        }}
      >
        <ChatProvider value={chatContextValue}>
          <GiftedChat
          messages={messages}
          onSend={(messages) => onSend(messages)}
          loadEarlierMessagesProps={{
            isInfiniteScrollEnabled: true,
            isAvailable: hasMore,
            isLoading: isLoading,
            onPress: () => loadMore(),
          }}
          user={{
            _id: user?.id || "1",
            name: user?.user_metadata?.name || "User",
          }}
          renderAvatar={renderAvatar}
          renderBubble={renderBubble}
          renderMessageText={renderMessageText}
          renderDay={renderDay}
          renderTime={renderTime}
          renderInputToolbar={renderInputToolbar}
          quickReplyStyle={{
            backgroundColor: SAGE.pill,
            borderColor: SAGE[500],
            borderWidth: 1,
            borderRadius: 16,
            paddingHorizontal: 12,
            paddingVertical: 8,
            marginTop: 8,
            marginRight: 8,
            marginBottom: 8,
          }}
          quickReplyTextStyle={{
            color: SAGE[800],
            fontFamily: "GeistMedium",
            fontSize: 14,
          }}
          
          
          listProps={{
            onEndReached: () => loadMore(),
            onEndReachedThreshold: 0.5,
          }}
          messagesContainerStyle={{
            backgroundColor: BRAND_SURFACE,
          }}
          keyboardAvoidingViewProps={{ keyboardVerticalOffset }}
        />
        </ChatProvider>
      </View>
    </View>
  );
};

// Header Left component for the route file
export const SupportChatHeaderLeft: React.FC = () => {
  const router = useRouter();
  const isLiquidGlass = isLiquidGlassAvailable();

  if (isLiquidGlass) {
    return (
      <Host matchContents>
        <Button
          label="Back"
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
    >
      <HugeiconsIcon icon={ArrowLeft02Icon} size={21} color={SAGE[600]} />
    </TouchableOpacity>
  );
};

// Header Right component for the route file
export const SupportChatHeaderRight: React.FC = () => {
  const isLiquidGlass = isLiquidGlassAvailable();
  const { deleteAllMessages } = useSupportMessages();

  const handleDeleteChat = () => {
    Alert.alert(
      "Delete Chat",
      "Are you sure you want to delete all messages? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAllMessages();
            } catch (error) {
              console.error("Error deleting messages:", error);
              Alert.alert(
                "Error",
                "Failed to delete messages. Please try again.",
              );
            }
          },
        },
      ],
    );
  };

  if (isLiquidGlass) {
    return (
      <Host matchContents>
        <Button
          label="Delete"
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
    >
      <HugeiconsIcon icon={Delete02Icon} size={20} color={SAGE[600]} />
    </TouchableOpacity>
  );
};

export default SupportChatScreen;

import React, { useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  GiftedChat,
  IMessage,
  Bubble,
  InputToolbar,
  Composer,
  Send,
} from "react-native-gifted-chat";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { useHeaderHeight } from "@react-navigation/elements";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ArrowLeft02Icon, Sent02Icon } from "@hugeicons/core-free-icons";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Button, Host } from "@expo/ui/swift-ui";
import { useAuth } from "@/src/context/AuthContext";
import { useSupportMessages } from "@/hooks/data/useSupportMessages";

interface SupportChatScreenProps {
  onClose?: () => void;
}

const SupportChatScreen: React.FC<SupportChatScreenProps> = ({ onClose }) => {
  const headerHeight = useHeaderHeight();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  const { messages, loading, sendMessage } = useSupportMessages();

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
    [sendMessage]
  );

  // Custom bubble styling
  const renderBubble = (props: any) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: "#7C5CFF",
          borderRadius: 16,
          paddingHorizontal: 4,
          paddingVertical: 2,
        },
        left: {
          backgroundColor: "#F3F4F6",
          borderRadius: 16,
          paddingHorizontal: 4,
          paddingVertical: 2,
        },
      }}
      textStyle={{
        right: {
          color: "#FFFFFF",
        },
        left: {
          color: "#1F2937",
        },
      }}
    />
  );

  // Custom input toolbar
  const renderInputToolbar = (props: any) => (
    <InputToolbar
      {...props}
      containerStyle={{
        backgroundColor: "white",
        borderTopWidth: 1,
        borderTopColor: "#E5E7EB",
        paddingHorizontal: 8,
        paddingTop: 4,
        paddingBottom: Math.max(insets.bottom, 4),
      }}
    />
  );

  // Custom composer
  const renderComposer = (props: any) => (
    <Composer
      {...props}
      textInputStyle={{
        backgroundColor: "#F9FAFB",
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 10,
        marginRight: 8,
        fontSize: 16,
        lineHeight: 20,
      }}
      placeholder="Type your message..."
      placeholderTextColor="#9CA3AF"
    />
  );

  // Custom send button
  const renderSend = (props: any) => (
    <Send
      {...props}
      containerStyle={{
        justifyContent: "center",
        alignItems: "center",
        marginRight: 8,
        marginBottom: 4,
      }}
    >
      <View className="w-10 h-10 rounded-full bg-purple-600 items-center justify-center">
        <HugeiconsIcon icon={Sent02Icon} size={20} color="white" />
      </View>
    </Send>
  );

  // If you have a tab bar, include its height
  const tabbarHeight = 50;
  const keyboardTopToolbarHeight = Platform.select({ ios: 44, default: 0 });
  const keyboardVerticalOffset =
    insets.bottom + tabbarHeight + keyboardTopToolbarHeight;
  return (
    <View className="flex-1 bg-[#F6F4FF]">
      <View
        style={{
          flex: 1,
          paddingTop: headerHeight,
        }}
      >
        <GiftedChat
          messages={messages}
          onSend={(messages) => onSend(messages)}
          user={{
            _id: user?.id || "1",
            name: user?.user_metadata?.name || "User",
          }}
          renderBubble={renderBubble}
          renderInputToolbar={renderInputToolbar}
          renderComposer={renderComposer}
          renderSend={renderSend}
          messagesContainerStyle={{
            backgroundColor: "#F6F4FF",
          }}
          keyboardAvoidingViewProps={{ keyboardVerticalOffset }}
        />
      </View>
    </View>
  );
};

// Header component for the route file
export const SupportChatHeader: React.FC = () => {
  const router = useRouter();
  const { height } = useWindowDimensions();
  const isLiquidGlass = isLiquidGlassAvailable();

  return (
    <BlurView
      intensity={50}
      tint="light"
      className="flex-row items-end justify-between"
      style={{
        height: height * 0.14,
        paddingHorizontal: 16,
        paddingBottom: 16,
      }}
    >
      {!isLiquidGlass && (
        <TouchableOpacity
          className="w-10 h-10 rounded-full justify-center items-center bg-[#7C5CFF]"
          activeOpacity={0.7}
          onPress={() => router.back()}
        >
          <HugeiconsIcon icon={ArrowLeft02Icon} size={20} color="#FFF" />
        </TouchableOpacity>
      )}
      {isLiquidGlass && (
        <Host matchContents>
          <Button
            onPress={() => router.back()}
            color="#7B61FF"
            variant="glassProminent"
            controlSize="regular"
            systemImage="chevron.left"
          />
        </Host>
      )}

      <View className="items-center">
        <Text className="text-[28px] font-extrabold text-[#0F172A] font-cormorantBold">
          Support
        </Text>
      </View>

      <View style={{ width: 40 }} />
    </BlurView>
  );
};

export default SupportChatScreen;

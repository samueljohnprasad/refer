import React, { useState, useCallback, useEffect } from "react";
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
import {
  ArrowLeft02Icon,
  Sent02Icon,
  CustomerService01Icon,
} from "@hugeicons/core-free-icons";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Button, Host } from "@expo/ui/swift-ui";
import { useAuth } from "@/src/context/AuthContext";

interface SupportChatScreenProps {
  onClose?: () => void;
}

// Predefined automated responses for common queries
const AUTO_RESPONSES: Record<string, string> = {
  default:
    "Thank you for reaching out! Our support team typically responds within 24 hours. Is there anything specific I can help you with?",
  hello: "Hello! 👋 Welcome to our support. How can I assist you today?",
  hi: "Hi there! 👋 How can I help you today?",
  help: "I'm here to help! You can ask me about:\n• Account issues\n• App features\n• Subscription & billing\n• Technical problems\n• Feature requests",
  bug: "I'm sorry to hear you're experiencing an issue! 🐛 Could you please describe what's happening in detail? Include:\n1. What you were trying to do\n2. What happened instead\n3. Any error messages",
  subscription:
    "For subscription-related queries:\n• You can manage your subscription in Settings\n• Refunds are handled through the App Store\n• Contact support for billing issues",
  thanks: "You're welcome! 😊 Is there anything else I can help you with?",
  bye: "Goodbye! Feel free to reach out anytime. Have a great day! 👋",
};

const SupportChatScreen: React.FC<SupportChatScreenProps> = ({ onClose }) => {
  const router = useRouter();
  const headerHeight = useHeaderHeight();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  const [messages, setMessages] = useState<IMessage[]>([]);

  // Initialize with welcome message
  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: "Hello! 👋 Welcome to support. I'm here to help you with any questions about the app. How can I assist you today?",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "Support",
          avatar:
            "https://ui-avatars.com/api/?name=Support&background=7C5CFF&color=fff",
        },
      },
    ]);
  }, []);

  const getAutoResponse = (text: string): string => {
    const lowerText = text.toLowerCase().trim();

    // Check for keyword matches
    for (const [keyword, response] of Object.entries(AUTO_RESPONSES)) {
      if (lowerText.includes(keyword)) {
        return response;
      }
    }

    return AUTO_RESPONSES.default;
  };

  const onSend = useCallback((newMessages: IMessage[] = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );

    // Simulate auto-response after a short delay
    if (newMessages.length > 0) {
      const userMessage = newMessages[0].text;

      setTimeout(() => {
        const autoResponse: IMessage = {
          _id: Math.random().toString(36).substring(7),
          text: getAutoResponse(userMessage),
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "Support",
            avatar:
              "https://ui-avatars.com/api/?name=Support&background=7C5CFF&color=fff",
          },
        };

        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, [autoResponse])
        );
      }, 1000 + Math.random() * 1000);
    }
  }, []);

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
        <View className="flex-row items-center mt-1">
          <View className="w-2 h-2 rounded-full bg-green-500 mr-2" />
          <Text className="text-sm text-gray-500">Online</Text>
        </View>
      </View>

      <View style={{ width: 40 }} />
    </BlurView>
  );
};

export default SupportChatScreen;

import React from "react";
import { Text, View } from "react-native";
import {
  Bubble,
  Day,
  GiftedChat,
  IMessage,
  MessageText,
  Time,
} from "react-native-gifted-chat";
import { useTranslation } from "react-i18next";
import { GlassContainer } from "expo-glass-effect";
import {
  PromptInputBody,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/src/components/chat/prompt-input";
import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import { SEMANTIC_COLORS } from "@/src/theme/colors";

interface SupportChatConversationProps {
  messages: IMessage[];
  userId: string;
  userName: string;
  isLoading: boolean;
  hasMore: boolean;
  bottomInset: number;
  keyboardVerticalOffset: number;
  onSend: (messages: IMessage[]) => Promise<void>;
  loadMore: () => void;
}

const SupportChatConversation: React.FC<SupportChatConversationProps> = ({
  messages,
  userId,
  userName,
  isLoading,
  hasMore,
  bottomInset,
  keyboardVerticalOffset,
  onSend,
  loadMore,
}) => {
  const { t } = useTranslation("settings");

  const renderAvatar = (props: any): React.JSX.Element => {
    const isSupport = (props.currentMessage as any)?.is_support ?? false;
    const displayName = props.currentMessage?.user?.name ||
      t(isSupport ? "support.sender" : "support.unknownUser");
    const firstLetter = displayName.charAt(0).toUpperCase();

    return (
      <View style={{ alignItems: "center", marginRight: 8 }}>
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: isSupport ? SEMANTIC_COLORS.brand.primary : SEMANTIC_COLORS.selection.surface,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 4,
          }}
        >
          <Text
            style={{
              color: isSupport ? SEMANTIC_COLORS.surface.primary : SEMANTIC_COLORS.text.tertiary,
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            {firstLetter}
          </Text>
        </View>
        {isSupport && (
          <Text style={{ fontSize: 10, color: SEMANTIC_COLORS.text.tertiary, fontWeight: "500" }}>
            {t("support.sender")}
          </Text>
        )}
      </View>
    );
  };

  const renderBubble = (props: any): React.JSX.Element => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: SEMANTIC_COLORS.brand.pressed,
          borderRadius: 20,
          paddingHorizontal: 4,
          paddingVertical: 2,
        },
        left: {
          backgroundColor: SEMANTIC_COLORS.surface.canvas,
          borderRadius: 20,
          paddingHorizontal: 4,
          paddingVertical: 2,
        },
      }}
    />
  );

  const renderMessageText = (props: any): React.JSX.Element => (
    <MessageText
      {...props}
      textStyle={{
        left: { fontFamily: APP_FONT_FAMILIES.regular, color: SEMANTIC_COLORS.text.primary, fontSize: 16, lineHeight: 24 },
        right: { fontFamily: APP_FONT_FAMILIES.regular, color: SEMANTIC_COLORS.surface.primary, fontSize: 16, lineHeight: 24 },
      }}
    />
  );

  const renderDay = (props: any): React.JSX.Element => (
    <Day
      {...props}
      wrapperStyle={{
        backgroundColor: SEMANTIC_COLORS.text.tertiary,
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 6,
        alignSelf: "center",
        marginTop: 16,
        marginBottom: 8,
      }}
      textStyle={{
        color: SEMANTIC_COLORS.surface.primary,
        fontFamily: APP_FONT_FAMILIES.semiBold,
        fontSize: 12,
        fontWeight: "600",
      }}
    />
  );

  const renderTime = (props: any): React.JSX.Element => (
    <Time
      {...props}
      timeTextStyle={{
        left: { color: SEMANTIC_COLORS.text.tertiary, fontFamily: APP_FONT_FAMILIES.regular, fontSize: 11 },
        right: { color: SEMANTIC_COLORS.surface.primary, opacity: 0.8, fontFamily: APP_FONT_FAMILIES.regular, fontSize: 11 },
      }}
    />
  );

  const renderInputToolbar = (): React.JSX.Element => (
    <View
      style={{
        paddingHorizontal: 12,
        paddingTop: 8,
        paddingBottom: Math.max(bottomInset, 12),
        backgroundColor: SEMANTIC_COLORS.surface.primary,
      }}
    >
      <GlassContainer style={{ flexDirection: "row", gap: 10, alignItems: "flex-end" }} spacing={8}>
        <PromptInputBody>
          <PromptInputTextarea placeholder={t("support.typeMessage")} />
          <PromptInputSubmit />
        </PromptInputBody>
      </GlassContainer>
    </View>
  );

  return (
    <GiftedChat
      messages={messages}
      onSend={onSend}
      loadEarlierMessagesProps={{
        isInfiniteScrollEnabled: true,
        isAvailable: hasMore,
        isLoading,
        onPress: loadMore,
      }}
      user={{ _id: userId, name: userName }}
      renderAvatar={renderAvatar}
      renderBubble={renderBubble}
      renderMessageText={renderMessageText}
      renderDay={renderDay}
      renderTime={renderTime}
      renderInputToolbar={renderInputToolbar}
      quickReplyStyle={{
        backgroundColor: SEMANTIC_COLORS.selection.surface,
        borderColor: SEMANTIC_COLORS.brand.primary,
        borderWidth: 1,
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginTop: 8,
        marginRight: 8,
        marginBottom: 8,
      }}
      quickReplyTextStyle={{
        color: SEMANTIC_COLORS.brand.onSoft,
        fontFamily: APP_FONT_FAMILIES.semiBold,
        fontSize: 14,
      }}
      listProps={{ onEndReached: loadMore, onEndReachedThreshold: 0.5 }}
      messagesContainerStyle={{ backgroundColor: SEMANTIC_COLORS.surface.primary }}
      keyboardAvoidingViewProps={{ keyboardVerticalOffset }}
    />
  );
};

export default React.memo(SupportChatConversation);

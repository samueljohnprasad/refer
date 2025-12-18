import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/src/network/auth/supabase";
import { useAuth } from "@/src/context/AuthContext";
import { IMessage } from "react-native-gifted-chat";
import { useUserProfile } from "./useUserProfile";

interface SupportMessage {
  id: string;
  user_id: string;
  message: string;
  is_support: boolean | null;
  created_at: string;
  updated_at: string;
}

export const useSupportMessages = () => {
  const { user } = useAuth();
  const { data: userProfile } = useUserProfile();

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const PAGE_SIZE: number = 20;

  const convertToGiftedChatMessage = (msg: SupportMessage): IMessage => {
    const isSupportMessage = msg.is_support ?? false;
    const userName = userProfile?.displayName || "User";

    return {
      _id: msg.id,
      text: msg.message,
      createdAt: new Date(msg.created_at),
      user: isSupportMessage
        ? {
            _id: 900043,
            name: "Support",
          }
        : {
            _id: msg.user_id,
            name: userName,
          },
      is_support: isSupportMessage,
    } as IMessage;
  };

  const fetchMessages = useCallback(async (): Promise<void> => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      setHasMore(true);

      const { data, error: fetchError } = await supabase
        .from("support_messages")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(PAGE_SIZE);

      if (fetchError) throw fetchError;

      const giftedMessages = (data || []).map(convertToGiftedChatMessage);

      if (!data || data.length < PAGE_SIZE) {
        setHasMore(false);
      }

      // Add welcome message if no messages exist
      if (giftedMessages.length === 0) {
        const welcomeMessage: IMessage = {
          _id: "welcome-" + Date.now(),
          text: "Hello! 👋 Welcome to support. I'm here to help you with any questions about the app. How can I assist you today?",
          createdAt: new Date(),
          user: {
            _id: 900043,
            name: "Support",
          },
          is_support: true,
        } as IMessage;
        setHasMore(false);
        return setMessages([welcomeMessage]);
      }
      setMessages(giftedMessages);
    } catch (err) {
      setError(err as Error);
      console.error("Error fetching support messages:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, userProfile?.displayName]);

  const loadMore = useCallback(async (): Promise<void> => {
    if (!user?.id || !hasMore || isLoading) return;

    try {
      setIsLoading(true);

      if (messages.length === 0) {
        setHasMore(false);
        return;
      }

      const oldestMessage = messages[messages.length - 1];
      const oldestDate = new Date(oldestMessage.createdAt);

      const { data, error: fetchError } = await supabase
        .from("support_messages")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .lt("created_at", oldestDate.toISOString())
        .limit(PAGE_SIZE);

      if (fetchError) throw fetchError;

      if (!data || data.length === 0) {
        setHasMore(false);
        return;
      }

      const giftedMessages = (data || []).map(convertToGiftedChatMessage);

      if (data.length < PAGE_SIZE) {
        setHasMore(false);
      }

      if (giftedMessages.length > 0) {
        return setMessages((prevMessages) => [
          ...prevMessages,
          ...giftedMessages,
        ]);
      }
      setHasMore(false);
    } catch (err) {
      console.error("Error loading more support messages:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, messages, hasMore, isLoading, userProfile?.displayName]);

  // Send a new message
  const sendMessage = async (text: string): Promise<void> => {
    if (!user?.id || !text.trim()) return;

    try {
      const { error: insertError } = await supabase
        .from("support_messages")
        .insert({
          user_id: user.id,
          message: text.trim(),
          is_support: false,
        });

      if (insertError) throw insertError;
    } catch (err) {
      console.error("Error sending support message:", err);
      throw err;
    }
  };

  useEffect(() => {
    if (!user?.id) return;

    fetchMessages();

    const channel = supabase
      .channel("support_messages_channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "support_messages",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const newMessage = payload.new as SupportMessage;
          const giftedMessage = convertToGiftedChatMessage(newMessage);

          setMessages((prevMessages) => {
            const exists = prevMessages.some(
              (msg) => msg._id === giftedMessage._id
            );
            if (exists) return prevMessages;

            return [giftedMessage, ...prevMessages];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, fetchMessages]);

  return {
    messages,
    isLoading,
    error,
    hasMore,
    sendMessage,
    loadMore,
    refetch: fetchMessages,
  };
};

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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

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
      // Add custom metadata to identify support messages
      is_support: isSupportMessage,
    } as IMessage;
  };

  const fetchMessages = useCallback(async (): Promise<void> => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from("support_messages")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      const giftedMessages = (data || []).map(convertToGiftedChatMessage);

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
        return setMessages([welcomeMessage]);
      }
      setMessages(giftedMessages);
    } catch (err) {
      setError(err as Error);
      console.error("Error fetching support messages:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

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
    loading,
    error,
    sendMessage,
    refetch: fetchMessages,
  };
};

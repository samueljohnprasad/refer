import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/src/network/auth/supabase";
import { useAuth } from "@/src/context/AuthContext";
import { IMessage } from "react-native-gifted-chat";
import { useUserProfile } from "./useUserProfile";
import { atom, useAtom } from "jotai";

interface SupportMessage {
  id: string;
  user_id: string;
  message: string;
  is_support: boolean | null;
  created_at: string;
  updated_at: string;
}

// Global state atoms to ensure synchronization between Header and ChatScreen
const messagesAtom = atom<IMessage[]>([]);
const isLoadingAtom = atom<boolean>(true);
const hasMoreAtom = atom<boolean>(true);

const createDailySupportPrompt = (): IMessage => {
  const today = new Date();
  return {
    _id: "daily-prompt-" + today.toDateString(),
    text: `Hello! 👋 We're here to assist you.

How can we help improve your experience today?

❓ GENERAL QUERIES
Questions about features or how things work?

✨ FEATURE REQUESTS
Have a great idea for the app? We'd love to hear it!

🐞 BUG REPORTS
Found an issue? Please tell us what happened.

🔐 ACCOUNT & DATA
Need help with your profile, subscription, or privacy?

❤️ FEEDBACK
Any other thoughts or suggestions?

Drop us a message below!`,
    createdAt: today,
    user: {
      _id: 900043,
      name: "Support",
    },
    is_support: true,
  } as IMessage;
};

export const useSupportMessages = () => {
  const { user } = useAuth();
  const { data: userProfile } = useUserProfile();

  const [messages, setMessages] = useAtom(messagesAtom);
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom);
  const [hasMore, setHasMore] = useAtom(hasMoreAtom);
  const [error, setError] = useState<Error | null>(null);

  const PAGE_SIZE: number = 20;

  const convertToGiftedChatMessage = useCallback(
    (msg: SupportMessage): IMessage => {
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
    },
    [userProfile?.displayName]
  );

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

      // Check if the last message was from today
      const today = new Date();
      const lastMessageDate =
        giftedMessages.length > 0 ? giftedMessages[0].createdAt : null;
      const isLastMessageToday =
        lastMessageDate &&
        (lastMessageDate instanceof Date
          ? lastMessageDate
          : new Date(lastMessageDate)
        ).toDateString() === today.toDateString();

      // If no messages from today, add the daily prompt
      if (!isLastMessageToday) {
        return setMessages([createDailySupportPrompt(), ...giftedMessages]);
      }

      setMessages(giftedMessages);
    } catch (err) {
      setError(err as Error);
      console.error("Error fetching support messages:", err);
    } finally {
      setIsLoading(false);
    }
  }, [
    user?.id,
    convertToGiftedChatMessage,
    setMessages,
    setIsLoading,
    setHasMore,
  ]);

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
  }, [
    user?.id,
    messages,
    hasMore,
    isLoading,
    convertToGiftedChatMessage,
    setMessages,
    setIsLoading,
    setHasMore,
  ]);

  // Send a new message
  const sendMessage = async (text: string): Promise<void> => {
    if (!user?.id || !text.trim()) return;

    try {
      const { data, error: insertError } = await supabase
        .from("support_messages")
        .insert({
          user_id: user.id,
          message: text.trim(),
          is_support: false,
        })
        .select("*")
        .single();

      if (insertError) throw insertError;

      if (data) {
        const newMessage = convertToGiftedChatMessage(data);
        setMessages((prevMessages) => [newMessage, ...prevMessages]);
      }
    } catch (err) {
      console.error("Error sending support message:", err);
      throw err;
    }
  };

  const deleteAllMessages = async (): Promise<void> => {
    if (!user?.id) return;

    try {
      const { error: deleteError, count } = await supabase
        .from("support_messages")
        .delete({ count: "exact" })
        .eq("user_id", user.id);

      if (deleteError) throw deleteError;

      setMessages([createDailySupportPrompt()]);

      setHasMore(false);
    } catch (err) {
      console.error("Error deleting support messages:", err);
      throw err;
    }
  };

  useEffect(() => {
    if (!user?.id) return;
    supabase.getChannels().forEach((ch) => {
      supabase.removeChannel(ch);
    });
    // Initial fetch (only if empty to avoid double fetch? No, re-fresh on mount is safer for now)
    fetchMessages();

    const channel = supabase
      .channel(`support_chat_v2:${user.id}`)
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
          if (!newMessage) return;

          const giftedMessage = convertToGiftedChatMessage(newMessage);
          setMessages((prev) => {
            if (prev.some((msg) => msg._id === giftedMessage._id)) return prev;
            return [giftedMessage, ...prev];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, fetchMessages, convertToGiftedChatMessage, setMessages]);

  return {
    messages,
    isLoading,
    error,
    hasMore,
    sendMessage,
    loadMore,
    deleteAllMessages,
    refetch: fetchMessages,
  };
};

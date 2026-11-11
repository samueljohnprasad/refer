// ponytail: chat message list and typing indicator state
import { useState, useCallback, useRef } from 'react';
import { MessageSender } from '../../../domain/enums';
import type { ChatMessage } from '../../../domain/types';

export interface UseChatMessagesReturn {
  messages: ChatMessage[];
  isTyping: boolean;
  setIsTyping: (isTyping: boolean) => void;
  pushMessage: (sender: MessageSender, text: string, extra?: Partial<ChatMessage>) => ChatMessage;
}

export function useChatMessages(): UseChatMessagesReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const idGen = useRef<number>(0);

  const pushMessage = useCallback(
    (sender: MessageSender, text: string, extra?: Partial<ChatMessage>): ChatMessage => {
      idGen.current += 1;
      const msg: ChatMessage = {
        id: `msg_${idGen.current}`,
        sender,
        text,
        timestamp: Date.now(),
        ...extra,
      };
      setMessages((prev) => [...prev, msg]);
      return msg;
    },
    []
  );

  return { messages, isTyping, setIsTyping, pushMessage };
}

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Channel } from "phoenix";

export interface ChatMessage {
  author: string;
  content: string;
}

interface Chat {
  messages: ChatMessage[];
  sendMessage: (content: string) => void;
}

const ChatContext = createContext<Chat | null>(null);

export function ChatProvider({
  channel,
  children,
}: {
  channel: Channel | null;
  children: ReactNode | null;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (channel) {
      channel.on("shout", (message: ChatMessage) => {
        setMessages((messages) => [...messages, message]);
      });

      return () => channel.off("shout");
    }
  }, [channel]);

  const sendMessage = useCallback(
    (content: string) => {
      if (channel) channel.push("shout", { content });
    },
    [channel],
  );

  return (
    <ChatContext.Provider value={{ messages, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => {
  const chat = useContext(ChatContext);
  if (!chat) throw Error("useChat called outside of ChatContext");
  return chat;
};

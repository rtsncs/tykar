import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { t } from "i18next";
import { GameHook } from "../@types/tykar";

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
  gameHook,
  children,
}: {
  gameHook: GameHook;
  children: ReactNode | null;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const { game, channel, presence } = gameHook();

  useEffect(() => {
    channel.on("shout", (message: ChatMessage) => {
      setMessages((messages) => [...messages, message]);
    });
    channel.on("system", (message: { event: string; payload: unknown }) => {
      switch (message.event) {
        case "win": {
          const chatMessage: ChatMessage = {
            author: "",
            content: t("user_won", {
              username: game.players[message.payload as number].username,
            }),
          };
          setMessages((messages) => [...messages, chatMessage]);
        }
      }
    });

    presence.onJoin((username) => {
      if (username) {
        const chatMessage: ChatMessage = {
          author: "",
          content: t("joined", { username }),
        };
        setMessages((messages) => [...messages, chatMessage]);
      }
    });
    presence.onLeave((username) => {
      if (username) {
        const chatMessage: ChatMessage = {
          author: "",
          content: t("left", { username }),
        };
        setMessages((messages) => [...messages, chatMessage]);
      }
    });

    return () => {
      channel.off("shout");
      channel.off("system");
    };
  }, [channel, presence, game.players]);

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

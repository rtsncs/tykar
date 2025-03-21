import { Button, Flex, Input, VStack } from "@chakra-ui/react";
import ChatMessage, { ChatMessageProps } from "./ChatMessage";
import { ChangeEvent, FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";

function Chat({
  messages,
  onSend,
}: {
  messages: ChatMessageProps[];
  onSend: (content: string) => void;
}) {
  const { t } = useTranslation();
  const [message, setMessage] = useState("");
  const handleMessageChange = (e: ChangeEvent<HTMLInputElement>) =>
    setMessage(e.target.value);

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    onSend(message);
    setMessage("");
  };

  return (
    <VStack>
      <VStack h="200px" overflow="scroll">
        {messages.map((message, i) => (
          <ChatMessage key={i} {...message} />
        ))}
      </VStack>
      <form onSubmit={handleSend}>
        <Flex>
          <Input
            maxLength={100}
            value={message}
            onChange={handleMessageChange}
          />
          <Button onClick={handleSend}>{t("send")}</Button>
        </Flex>
      </form>
    </VStack>
  );
}

export default Chat;

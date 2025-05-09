import { chakra, Button, Group, Input, VStack } from "@chakra-ui/react";
import ChatMessage from "./ChatMessage";
import { ChangeEvent, FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useChat } from "../../../hooks/ChatProvider";

function Chat() {
  const { t } = useTranslation();
  const [message, setMessage] = useState("");
  const handleMessageChange = (e: ChangeEvent<HTMLInputElement>) =>
    setMessage(e.target.value);

  const { messages, sendMessage } = useChat();
  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(message);
    setMessage("");
  };

  return (
    <VStack>
      <VStack
        borderTop="none"
        borderWidth="1px"
        borderBottomRadius="sm"
        w="100%"
        h="200px"
        overflow="scroll"
        px="1"
      >
        {messages.map((message, i) => (
          <ChatMessage key={i} {...message} />
        ))}
      </VStack>
      <chakra.form w="100%" onSubmit={handleSend}>
        <Group w="100%" attached>
          <Input
            maxLength={100}
            value={message}
            onChange={handleMessageChange}
            width="100%"
          />
          <Button onClick={handleSend}>{t("send")}</Button>
        </Group>
      </chakra.form>
    </VStack>
  );
}

export default Chat;

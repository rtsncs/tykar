import { Box } from "@chakra-ui/react";
import type { ChatMessage } from "../../../hooks/ChatProvider";

function ChatMessage({ author, content }: ChatMessage) {
  return (
    <Box w="100%" wordBreak={"break-word"}>
      <b>{author}:</b> {content}
    </Box>
  );
}

export default ChatMessage;

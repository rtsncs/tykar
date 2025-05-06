import { Box } from "@chakra-ui/react";

export interface ChatMessageProps {
  author: string;
  content: string;
}

function ChatMessage({ author, content }: ChatMessageProps) {
  return (
    <Box w="100%" wordBreak={"break-word"}>
      <b>{author}:</b> {content}
    </Box>
  );
}

export default ChatMessage;

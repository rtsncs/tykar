import { Box, Flex } from "@chakra-ui/react";

function MakaoGameFinishedModal({ loser }: { loser: string }) {
  return (
    <Flex
      bg="blackAlpha.600"
      w="100%"
      h="100%"
      position="absolute"
      top="0"
      left="0"
      flexDirection="column"
    >
      <Box
        bg="red"
        color="white"
        m="auto"
        py="1em"
        w="75%"
        px="2em"
        textAlign="center"
      >
        <b>{loser}</b> lost
      </Box>
    </Flex>
  );
}

export default MakaoGameFinishedModal;

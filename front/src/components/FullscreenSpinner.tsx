import { AbsoluteCenter, Box, Spinner } from "@chakra-ui/react";

function FullscreenSpinner() {
  return (
    <Box w="100vw" h="100vh">
      <AbsoluteCenter>
        <Spinner size="lg" />
      </AbsoluteCenter>
    </Box>
  );
}

export default FullscreenSpinner;

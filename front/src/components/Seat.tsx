import { Box, Button, VStack } from "@chakra-ui/react";

function Seat({
  player,
  seat,
  onClick,
}: {
  player?: string;
  seat: number;
  onClick: (seat: number) => void;
}) {
  return (
    <VStack w="100%" gap="0">
      <Box w="100%" bg="black" color="white">
        #{seat}
      </Box>
      {player ? (
        <Box>{player}</Box>
      ) : (
        <Button onClick={() => onClick(seat)} w="100%">
          Seat
        </Button>
      )}
    </VStack>
  );
}

export default Seat;

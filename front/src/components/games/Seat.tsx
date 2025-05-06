import { Box, Button, VStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

function Seat({
  player,
  seat,
  onClick,
}: {
  player?: string;
  seat: number;
  onClick: (seat: number) => void;
}) {
  const { t } = useTranslation();
  return (
    <VStack w="100%" gap="0">
      <Box w="100%" bg="black" color="white">
        #{seat}
      </Box>
      {player ? (
        <Box>{player}</Box>
      ) : (
        <Button onClick={() => onClick(seat)} w="100%">
          {t("seat_down")}
        </Button>
      )}
    </VStack>
  );
}

export default Seat;

import { Center, Button, Group, Box } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { Player } from "@/types/tykar";
import { LuCheck, LuTrophy, LuX } from "react-icons/lu";

function Seat({
  player,
  seat,
  onClick,
}: {
  player: Player;
  seat: number;
  onClick: () => void;
}) {
  const { t } = useTranslation();
  return (
    <Group orientation="vertical" w="100%" attached>
      <Box px="1" borderWidth="1px" borderRadius="sm" w="100%" bg="bg.panel">
        #{seat + 1}
      </Box>
      {player.username ? (
        <Center borderWidth="1px" borderRadius="sm" w="100%" h="10">
          {player.username}
        </Center>
      ) : (
        <Button onClick={onClick} w="100%">
          {t("sit_down")}
        </Button>
      )}
      <Group
        px="1"
        borderWidth="1px"
        borderRadius="sm"
        w="100%"
        bg="bg.panel"
        justifyContent="space-between"
      >
        <Group>
          <LuTrophy />
          <Box>{player.score}</Box>
        </Group>
        {player.is_ready ? <LuCheck /> : <LuX />}
      </Group>
    </Group>
  );
}

export default Seat;

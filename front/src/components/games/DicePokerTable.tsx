import { Box, Button, Center, Grid, Group, Spinner } from "@chakra-ui/react";
import { useDicePoker } from "../../hooks/DicePokerProvider";
import { useSession } from "../../hooks/AuthProvider";
import Die from "./Die";
import { t } from "i18next";

export default function DicePokerTable() {
  const { game, dispatch } = useDicePoker();
  const { session } = useSession();

  const userSeatIdx = (() => {
    if (session) {
      const index = game?.players.findIndex(
        (p) => p.username === session.username,
      );
      if (index !== -1) {
        return index;
      }
    }
    return null;
  })();

  const keepHandler = (index: number) => {
    if (game?.turn === userSeatIdx) {
      dispatch({ type: "keep", index, value: !game?.keep[index] });
    }
  };

  if (!game) {
    return (
      <Center bg="green" w="75vw" h="100vh">
        <Spinner size="xl" color="white" />
      </Center>
    );
  }

  return (
    <Box bg="green" w="75vw" h="100vh">
      <Grid
        templateAreas={`"tl hand2 tr"
                        "hand1 played hand3"
                        "ml hand0 mr"
                        "bl bm br"`}
        templateRows={"1fr 1fr 1fr 0fr"}
        templateColumns={"1fr 1fr 1fr"}
        h="100%"
        w="100%"
        alignItems="center"
        justifyItems="center"
        pb="16px"
      >
        <Group gridArea="hand2">
          {game.thrown[((userSeatIdx ?? 0) + 1) % 2].map((number, index) => (
            <Die number={number} key={index} rotate />
          ))}
        </Group>
        <Group gridArea="hand0">
          {game.thrown[userSeatIdx ?? 0].map((number, index) => (
            <Die
              number={number}
              key={index}
              onClick={() => keepHandler(index)}
              selected={game.keep[index]}
              rotate
            />
          ))}
        </Group>
        <Group gridArea="bm">
          <Button
            disabled={game.players[game.turn]?.username !== session?.username}
            onClick={() => dispatch({ type: "roll" })}
          >
            {t("roll")}
          </Button>
          <Button
            disabled={
              game.players[game.turn]?.username !== session?.username ||
              game.roll == 0
            }
            onClick={() => dispatch({ type: "pass" })}
          >
            {t("pass")}
          </Button>
        </Group>
      </Grid>
    </Box>
  );
}

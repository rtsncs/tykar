import { Box, Button, Card, Grid, Group } from "@chakra-ui/react";
import { useDicePoker } from "../hook";
import { useSession } from "@/hooks/AuthProvider";
import Die from "@/components/games/Die";
import { t } from "i18next";
import PlayerHand from "@/components/games/PlayerHand";

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

  const keepHandler =
    game?.turn === userSeatIdx && game.roll !== 0
      ? (index: number) => {
          dispatch({ type: "keep", index, value: !game?.keep[index] });
        }
      : null;

  const topHandSeat = ((userSeatIdx ?? 0) + 1) % 2;
  const bottomHandSeat = userSeatIdx ?? 0;

  const displayHand = (index: number) => {
    if (game.thrown[index][0] == 0) {
      return false;
    }
    // show result of previous round
    if (game.turn == game.starting_player && game.roll == 0) {
      return true;
    }
    if (game.starting_player == index) {
      return game.turn != index || game.roll != 0;
    }
    return game.turn == index && game.roll != 0;
  };

  const canRoll =
    game.players[game.turn]?.username === session?.username &&
    game.keep.some((k) => k == false);
  const canPass =
    game.players[game.turn]?.username === session?.username && game.roll != 0;

  return (
    <Grid
      templateAreas={`"tl hand2 tr"
                      "hand1 played hand3"
                      "ml hand0 mr"
                      "bl bm br"`}
      templateRows={"1fr 1fr 1fr 0fr"}
      templateColumns={"1fr 1fr 1fr"}
      h="100vh"
      w="75vw"
      alignItems="center"
      justifyItems="center"
      pb="16px"
      bg="green"
      color="white"
    >
      <Box p="3" w="100%" h="100%" gridArea="tl">
        {t("roll_number", { roll: game.roll + 1 })}
      </Box>
      {game.winner && game.turn == game.starting_player && game.roll == 0 && (
        <Card.Root gridArea="played">
          <Card.Body>
            <Card.Title px="10">
              {t("user_won", { username: game.winner })}
            </Card.Title>
          </Card.Body>
        </Card.Root>
      )}
      <Box gridArea="hand2">
        <PlayerHand
          position="top"
          player={game.players[topHandSeat]}
          turn={game.turn === topHandSeat}
        >
          {displayHand(topHandSeat) &&
            game.thrown[topHandSeat].map((number, index) => (
              <Die number={number} key={index} rotate />
            ))}
        </PlayerHand>
      </Box>
      <Box gridArea="hand0">
        <PlayerHand
          position="bottom"
          player={game.players[bottomHandSeat]}
          turn={game.turn === bottomHandSeat}
        >
          {displayHand(bottomHandSeat) &&
            game.thrown[bottomHandSeat].map((number, index) => (
              <Die
                number={number}
                key={index}
                onClick={keepHandler ? () => keepHandler(index) : undefined}
                selected={game.keep[index]}
                rotate
              />
            ))}
        </PlayerHand>
      </Box>
      <Group gridArea="bm">
        <Button disabled={!canRoll} onClick={() => dispatch({ type: "roll" })}>
          {t("roll")}
        </Button>
        <Button disabled={!canPass} onClick={() => dispatch({ type: "pass" })}>
          {t("pass")}
        </Button>
      </Group>
    </Grid>
  );
}

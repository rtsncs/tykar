import { Box, Button, Grid, GridItem } from "@chakra-ui/react";
import CardHand from "./CardHand";
import { MakaoGame } from "../routes/MakaoRoom";
import { PlayingCardProps } from "./PlayingCard";
import { useSession } from "../AuthProvider";
import PlayerHand from "./PlayerHand";

function MakaoTable({
  game,
  onPlayCard,
  onDrawCard,
}: {
  game: MakaoGame;
  onPlayCard: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    card: PlayingCardProps,
  ) => void;
  onDrawCard: () => void;
}) {
  const { session } = useSession();

  const mySeat = Math.max(
    game.players.findIndex((p) => p && p.name === session?.username),
    0,
  );

  return (
    <Box bg="green" w="100%" h="100vh">
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
        <GridItem area="played">
          <CardHand cards={game.played} />
        </GridItem>
        <GridItem area="hand0">
          <PlayerHand
            turn={game.turn === (0 + mySeat) % 4}
            player={game.players[(0 + mySeat) % 4]}
            onClick={mySeat != -1 ? onPlayCard : undefined}
            position="bottom"
          />
        </GridItem>
        <GridItem area="hand1">
          <PlayerHand
            turn={game.turn === (1 + mySeat) % 4}
            player={game.players[(1 + mySeat) % 4]}
            position="left"
          />
        </GridItem>
        <GridItem area="hand2">
          <PlayerHand
            turn={game.turn === (2 + mySeat) % 4}
            player={game.players[(2 + mySeat) % 4]}
            position="top"
          />
        </GridItem>
        <GridItem area="hand3">
          <PlayerHand
            turn={game.turn === (3 + mySeat) % 4}
            player={game.players[(3 + mySeat) % 4]}
            position="right"
          />
        </GridItem>
        <GridItem area="bm">
          <Button onClick={onDrawCard}>Draw</Button>
        </GridItem>
      </Grid>
    </Box>
  );
}

export default MakaoTable;

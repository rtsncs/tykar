import {
  Box,
  Button,
  ButtonGroup,
  Grid,
  GridItem,
  useDisclosure,
} from "@chakra-ui/react";
import CardHand from "../CardHand";
import { MakaoGame } from "../../../routes/MakaoRoom";
import { PlayingCardProps } from "../PlayingCard";
import { useSession } from "../../../AuthProvider";
import PlayerHand from "../PlayerHand";
import MakaoDemandModal from "./MakaoDemandModal";
import MakaoGameFinishedModal from "./MakaoGameFinishedModal";
import { useTranslation } from "react-i18next";

function MakaoTable({
  game,
  onPlayCard,
  onDrawCard,
  onDemand,
  onPass,
}: {
  game: MakaoGame;
  onPlayCard: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    card: PlayingCardProps,
  ) => void;
  onDrawCard: () => void;
  onDemand: (demand: string) => void;
  onPass: () => void;
}) {
  const { session } = useSession();
  const { t } = useTranslation();

  const { open, onOpen, onClose } = useDisclosure();

  const mySeat = game.players.findIndex(
    (p) => p && p.name === session?.username,
  );
  const seatOffset = mySeat === -1 ? 0 : mySeat;

  return (
    <Box bg="green" w="100%" h="100vh" position="relative">
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
          <CardHand cards={game.played.slice(0, 5)} />
        </GridItem>
        <GridItem area="tl" color="white">
          {game.toDraw > 0 && (
            <Box>{t("to_draw", { count: game.toDraw })} </Box>
          )}
          {game.toBlock > 0 && (
            <Box>{t("to_draw", { count: game.toDraw })} </Box>
          )}
          {game.demand && (
            <Box>{t("current_demand", { demand: game.demand })}</Box>
          )}
        </GridItem>
        <GridItem area="hand0">
          <PlayerHand
            turn={game.turn === (0 + seatOffset) % 4}
            player={game.players[(0 + seatOffset) % 4]}
            onClick={seatOffset != -1 ? onPlayCard : undefined}
            position="bottom"
          />
        </GridItem>
        <GridItem area="hand1">
          <PlayerHand
            turn={game.turn === (1 + seatOffset) % 4}
            player={game.players[(1 + seatOffset) % 4]}
            position="left"
          />
        </GridItem>
        <GridItem area="hand2">
          <PlayerHand
            turn={game.turn === (2 + seatOffset) % 4}
            player={game.players[(2 + seatOffset) % 4]}
            position="top"
          />
        </GridItem>
        <GridItem area="hand3">
          <PlayerHand
            turn={game.turn === (3 + seatOffset) % 4}
            player={game.players[(3 + seatOffset) % 4]}
            position="right"
          />
        </GridItem>
        {mySeat !== -1 && (
          <GridItem area="bm">
            <ButtonGroup>
              <Button
                onClick={onPass}
                disabled={
                  game.turn !== mySeat ||
                  (game.turn !== game.lastTurn && game.toBlock === 0 && false)
                }
              >
                {t("pass")}
              </Button>
              <Button
                onClick={onDrawCard}
                disabled={
                  game.turn !== mySeat || (game.turn === game.lastTurn && false)
                }
              >
                {t("draw_card")}
              </Button>
              <Button
                onClick={onOpen}
                disabled={
                  game.turn !== mySeat || (game.turn === game.lastTurn && false)
                }
              >
                {t("make_demand")}
              </Button>
            </ButtonGroup>
          </GridItem>
        )}
      </Grid>
      {open && game.lastTurn == game.turn && game.played[0].rank === "A" && (
        <MakaoDemandModal
          isOpen={open}
          type={"suit"}
          onClose={onClose}
          onSelect={onDemand}
        />
      )}
      {open && game.lastTurn == game.turn && game.played[0].rank === "J" && (
        <MakaoDemandModal
          isOpen={open}
          type={"rank"}
          onClose={onClose}
          onSelect={onDemand}
        />
      )}
      {game.status === "finished" && (
        <MakaoGameFinishedModal
          loser={game.players.find((player) => player?.hand)?.name ?? "unknown"}
        />
      )}
    </Box>
  );
}

export default MakaoTable;

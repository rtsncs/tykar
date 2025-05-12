import {
  Box,
  Button,
  ButtonGroup,
  Card,
  Grid,
  GridItem,
  useDisclosure,
} from "@chakra-ui/react";
import CardHand from "../CardHand";
import { useSession } from "../../../hooks/AuthProvider";
import PlayerHand from "../PlayerHand";
import MakaoDemandModal from "./MakaoDemandModal";
import { useTranslation } from "react-i18next";
import { useMakao } from "../../../hooks/MakaoProvider";
import { PlayingCardProps } from "../PlayingCard";

function MakaoTable() {
  const { game, dispatch } = useMakao();
  const { session } = useSession();
  const { t } = useTranslation();

  const { open, onOpen, onClose } = useDisclosure();

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

  const playHandler =
    game?.turn === userSeatIdx
      ? (card: PlayingCardProps) => {
          dispatch({
            type: "play",
            card,
          });
        }
      : undefined;

  const playerPositions: {
    seat: number;
    position: "bottom" | "top" | "left" | "right";
    direction: "row" | "column";
  }[] = [
    { seat: userSeatIdx ?? 0, position: "bottom", direction: "row" },
    {
      seat: ((userSeatIdx ?? 0) + 1) % game.players.length,
      position: "top",
      direction: "row",
    },
    {
      seat: ((userSeatIdx ?? 0) + 2) % game.players.length,
      position: "left",
      direction: "column",
    },
    {
      seat: ((userSeatIdx ?? 0) + 3) % game.players.length,
      position: "right",
      direction: "column",
    },
  ];

  const canPass =
    game.turn === userSeatIdx &&
    ((game.lastTurn === game.turn && (game.toDraw === 0 || !game.drawn)) ||
      game.toBlock ||
      game.players[userSeatIdx].data.blocked);
  const canDraw =
    game.turn === userSeatIdx &&
    (game.lastTurn !== userSeatIdx || (game.toDraw && game.drawn)) &&
    !game.players[userSeatIdx].data.blocked;
  const canDemand =
    game.turn === userSeatIdx &&
    game.lastTurn === game.turn &&
    (game.played[0].rank === "A" || game.played[0].rank === "J");

  return (
    <Box bg="green" w="100%" h="100vh" position="relative">
      <Grid
        templateAreas={`"tl top tr"
                        "left played right"
                        "ml bottom mr"
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
        {playerPositions.slice(0, game.players.length).map((pos) => (
          <GridItem area={pos.position}>
            <PlayerHand
              turn={game.turn === pos.seat}
              player={game.players[pos.seat]}
              position={pos.position}
              playerInfo={game.players[pos.seat].data.blocked}
            >
              <CardHand
                cards={game.players[pos.seat].data.hand}
                direction={pos.direction}
                onClick={pos.seat === userSeatIdx ? playHandler : undefined}
              />
            </PlayerHand>
          </GridItem>
        ))}
        <ButtonGroup gridArea="bm">
          <Button
            onClick={() => dispatch({ type: "pass" })}
            disabled={!canPass}
          >
            {t("pass")}
          </Button>
          <Button
            onClick={() => dispatch({ type: "draw" })}
            disabled={!canDraw}
          >
            {t("draw_card")}
          </Button>
          <Button onClick={onOpen} disabled={!canDemand}>
            {t("make_demand")}
          </Button>
        </ButtonGroup>
        {game.status === "finished" && (
          <Card.Root gridArea="played">
            <Card.Body>
              <Card.Title px="10">
                {t("user_lost", {
                  username: game.players.find((player) => player.data.hand)
                    ?.username,
                })}
              </Card.Title>
            </Card.Body>
          </Card.Root>
        )}
      </Grid>
      {open && game.lastTurn == game.turn && game.played[0].rank === "A" && (
        <MakaoDemandModal
          isOpen={open}
          type={"suit"}
          onClose={onClose}
          onSelect={(demand) => dispatch({ type: "demand", demand })}
        />
      )}
      {open && game.lastTurn == game.turn && game.played[0].rank === "J" && (
        <MakaoDemandModal
          isOpen={open}
          type={"rank"}
          onClose={onClose}
          onSelect={(demand) => dispatch({ type: "demand", demand })}
        />
      )}
    </Box>
  );
}

export default MakaoTable;

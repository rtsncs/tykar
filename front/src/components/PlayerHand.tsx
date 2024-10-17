import { Flex } from "@chakra-ui/react";
import { PlayingCardProps } from "./PlayingCard";
import { MakaoPlayer } from "../routes/MakaoRoom";
import CardHand from "./CardHand";

function PlayerHand({
  player,
  direction,
  onClick,
  turn,
}: {
  player?: MakaoPlayer;
  direction?: "column" | "row";
  onClick?: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    card: PlayingCardProps,
  ) => void;
  turn: boolean;
}) {
  if (!player) return;
  const flippedDirection = direction === "column" ? "row" : "column";
  return (
    <Flex
      direction={flippedDirection}
      alignItems="center"
      justifyContent="center"
      color="white"
    >
      {turn ? `<${player.name}>` : player.name}
      <CardHand cards={player.hand} direction={direction} onClick={onClick} />
    </Flex>
  );
}

export default PlayerHand;

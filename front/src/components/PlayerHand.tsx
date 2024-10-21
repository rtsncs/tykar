import { Box, Flex } from "@chakra-ui/react";
import { PlayingCardProps } from "./PlayingCard";
import { MakaoPlayer } from "../routes/MakaoRoom";
import CardHand from "./CardHand";

function PlayerHand({
  player,
  position,
  onClick,
  turn,
  lastCard,
}: {
  player?: MakaoPlayer;
  position: "top" | "bottom" | "left" | "right";

  onClick?: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    card: PlayingCardProps,
  ) => void;
  turn: boolean;
  lastCard?: PlayingCardProps;
}) {
  if (!player) return;
  let flexDirection: "column" | "column-reverse" | "row" | "row-reverse";
  let cardsDirection: "column" | "row";
  let writingMode: "horizontal-tb" | "sideways-lr" | "sideways-rl";
  switch (position) {
    case "top":
      flexDirection = "column-reverse";
      cardsDirection = "row";
      writingMode = "horizontal-tb";
      break;
    case "left":
      flexDirection = "row-reverse";
      cardsDirection = "column";
      writingMode = "sideways-rl";
      break;
    case "right":
      flexDirection = "row";
      cardsDirection = "column";
      writingMode = "sideways-lr";
      break;
    case "bottom":
    default:
      flexDirection = "column";
      cardsDirection = "row";
      writingMode = "horizontal-tb";
      break;
  }

  let isDisabled;

  if (lastCard && player.hand instanceof Array) {
    isDisabled = player.hand.map((card) => {
      if (lastCard.rank == card.rank || lastCard.suit == card.suit)
        return false;
      return true;
    });
  }

  return (
    <Flex
      direction={flexDirection}
      alignItems="center"
      justifyContent="center"
      color="white"
    >
      <Box style={{ writingMode }}>
        {turn ? <b>{`>${player.name}<`}</b> : player.name}
        {player.blocked !== 0 && ` [${player.blocked}]`}
      </Box>
      <CardHand
        cards={player.hand}
        direction={cardsDirection}
        onClick={onClick}
        isDisabled={isDisabled}
      />
    </Flex>
  );
}

export default PlayerHand;

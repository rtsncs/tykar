import { Box, Flex } from "@chakra-ui/react";
import { PlayingCardProps } from "./PlayingCard";
import { MakaoPlayer } from "../routes/MakaoRoom";
import CardHand from "./CardHand";

function PlayerHand({
  player,
  position,
  onClick,
  turn,
}: {
  player?: MakaoPlayer;
  position: "top" | "bottom" | "left" | "right";

  onClick?: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    card: PlayingCardProps,
  ) => void;
  turn: boolean;
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
      />
    </Flex>
  );
}

export default PlayerHand;

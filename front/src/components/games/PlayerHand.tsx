import { Box, Flex } from "@chakra-ui/react";
import { Player } from "../../@types/tykar";
import { ReactNode } from "react";

function PlayerHand({
  player,
  position,
  turn,
  playerInfo,
  children,
}: {
  player: Player;
  position: "top" | "bottom" | "left" | "right";
  turn: boolean;
  playerInfo?: string | number;
  children: ReactNode;
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

  let playerString = "";
  if (player?.username) {
    playerString = player.username;
  }
  if (turn) {
    playerString = `>${playerString}<`;
  }
  if (playerInfo) {
    playerString = `${playerString} [${playerInfo}]`;
  }

  return (
    <Flex
      direction={flexDirection}
      alignItems="center"
      justifyContent="center"
      color="white"
      gap="3"
    >
      <Box style={{ writingMode }} fontWeight={turn ? "bold" : ""}>
        {playerString}
      </Box>
      <Flex direction={cardsDirection} gap="3">
        {children}
      </Flex>
    </Flex>
  );
}

export default PlayerHand;

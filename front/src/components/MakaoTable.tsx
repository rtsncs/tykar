import { Box } from "@chakra-ui/react";
import CardHand from "./CardHand";

function MakaoTable() {
  return (
    <Box bg="green" w="100%" h="100vh">
      <CardHand cards={6} />
      <CardHand
        cards={[
          { rank: "A", suit: "Spades" },
          { rank: "J", suit: "Hearts" },
          { rank: "10", suit: "Diamonds" },
          { rank: "4", suit: "Clubs" },
          { rank: "A", suit: "Spades" },
          { rank: "J", suit: "Hearts" },
          { rank: "10", suit: "Diamonds" },
          { rank: "4", suit: "Clubs" },
          { rank: "A", suit: "Spades" },
          { rank: "J", suit: "Hearts" },
          { rank: "10", suit: "Diamonds" },
          { rank: "4", suit: "Clubs" },
        ]}
      />
    </Box>
  );
}

export default MakaoTable;

import "../../styles/PlayingCard.css";
import { Box, Stack } from "@chakra-ui/react";

export type Rank =
  | "A"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "J"
  | "Q"
  | "K";
export type Suit = "Hearts" | "Diamonds" | "Clubs" | "Spades";

export interface PlayingCardProps {
  rank: Rank;
  suit: Suit;
  disabled?: boolean;
}

function suit_to_char(suit: Suit) {
  if (suit === "Spades") return "♠️";
  if (suit === "Hearts") return "♥️";
  if (suit === "Diamonds") return "♦️";
  if (suit === "Clubs") return "♣️";
}

function suit_to_color(suit: Suit) {
  if (suit === "Spades" || suit === "Clubs") return "black";
  if (suit === "Hearts" || suit === "Diamonds") return "red.800";
}

function PlayingCard({
  card,
  onClick,
  direction,
}: {
  card?: PlayingCardProps;
  onClick?: (card: PlayingCardProps) => void;
  direction?: "column" | "row";
}) {
  const handleClick = onClick
    ? () => {
        if (!card?.disabled) onClick(card!);
      }
    : undefined;
  const wrapper_props =
    direction == "column" ? { minHeight: "30px" } : { minWidth: "30px" };
  const stack_direction = direction == "column" ? "row" : "column";
  const cursor = onClick ? "pointer" : "default";
  return (
    <Box {...wrapper_props} position="relative">
      <Stack
        className={direction == "column" ? "card card-vertical" : "card"}
        onClick={handleClick}
        p="8px"
        direction={stack_direction}
        cursor={cursor}
      >
        {card ? (
          <>
            <Box color={suit_to_color(card.suit)} mr="auto" textAlign="center">
              <p className="rank">{card.rank}</p>
              {suit_to_char(card.suit)}
            </Box>
            <Box color={suit_to_color(card.suit)} m="auto" fontSize="5xl">
              {suit_to_char(card.suit)}
            </Box>
            <Box
              color={suit_to_color(card.suit)}
              ml="auto"
              mb="0"
              textAlign="center"
            >
              {suit_to_char(card.suit)}
              <p className="rank">{card.rank}</p>
            </Box>
          </>
        ) : (
          <Box bg="red" width="100%" height="100%" />
        )}
      </Stack>
      {card?.disabled && <Box className="card-disabled"></Box>}
    </Box>
  );
}

export default PlayingCard;

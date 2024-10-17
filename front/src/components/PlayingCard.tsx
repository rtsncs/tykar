import "../styles/PlayingCard.css";
import { Box, HStack, Stack, VStack } from "@chakra-ui/react";
import React from "react";

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
  onClick?: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    card: PlayingCardProps,
  ) => void;
  direction?: "column" | "row";
}) {
  const wrapper_props =
    direction == "column" ? { minHeight: "30px" } : { minWidth: "30px" };
  const stack_direction = direction == "column" ? "row" : "column";
  return (
    <Box {...wrapper_props}>
      <Stack
        className={direction == "column" ? "card-vertical" : "card"}
        onClick={(event) => {
          if (onClick) onClick(event, card!);
        }}
        p="8px"
        direction={stack_direction}
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
    </Box>
  );
}

export default PlayingCard;

import { Stack } from "@chakra-ui/react";
import PlayingCard, { PlayingCardProps } from "./PlayingCard";

function CardHand({
  cards,
  isDisabled,
  direction,
  onClick,
}: {
  cards: PlayingCardProps[] | number;
  isDisabled?: boolean[];
  direction?: "column" | "row";
  onClick?: (card: PlayingCardProps) => void;
}) {
  const cardElements = [];
  const isArray = cards instanceof Array;
  const cardCount = isArray ? cards.length : cards;

  const offset = Math.min(-(148 - Math.max(400 / cardCount, 30)) / 2, 0);
  const transform = `translate${direction === "column" ? "Y" : "X"}(${offset}px)`;

  for (let i = 0; i < cardCount; i++) {
    const props = {
      card: isArray ? cards[cardCount - i - 1] : undefined,
      onClick: isArray ? onClick : undefined,
      direction: direction ?? "row",
      isDisabled: isDisabled?.at(cardCount - i - 1),
    };
    const card = <PlayingCard key={i} {...props} />;
    cardElements.push(card);
  }

  const stackProps =
    direction === "column"
      ? { maxHeight: "400px", gap: "0", m: "auto" }
      : { maxWidth: "400px", gap: "0", m: "auto" };

  return (
    <Stack transform={transform} direction={direction ?? "row"} {...stackProps}>
      {cardElements}
    </Stack>
  );
}

export default CardHand;

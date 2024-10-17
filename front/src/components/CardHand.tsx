import { Stack } from "@chakra-ui/react";
import PlayingCard, { PlayingCardProps } from "./PlayingCard";

function CardHand({
  cards,
  direction,
  onClick,
}: {
  cards: PlayingCardProps[] | number;
  direction?: "column" | "row";
  onClick?: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    card: PlayingCardProps,
  ) => void;
}) {
  const cardElements = [];
  const isArray = cards instanceof Array;
  const cardCount = isArray ? cards.length : cards;

  for (let i = 0; i < cardCount; i++) {
    const props = {
      card: isArray ? cards[cardCount - i - 1] : undefined,
      onClick: isArray ? onClick : undefined,
      direction: direction ?? "row",
    };
    const card = <PlayingCard key={i} {...props} />;
    cardElements.push(card);
  }

  const stackProps =
    direction === "column"
      ? { maxHeight: "400px", gap: "0", m: "auto" }
      : { maxWidth: "400px", gap: "0", m: "auto" };

  return (
    <Stack direction={direction ?? "row"} {...stackProps}>
      {cardElements}
    </Stack>
  );
}

export default CardHand;

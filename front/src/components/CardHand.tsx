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
  if (cards instanceof Array) {
    for (let i = 0; i < cards.length; i++) {
      cardElements.push(
        <PlayingCard key={i} card={cards[i]} onClick={onClick} />,
      );
    }
  } else {
    for (let i = 0; i < cards; i++) {
      cardElements.push(<PlayingCard key={i} />);
    }
  }
  return (
    <Stack maxWidth="400px" gap="0" direction={direction ?? "row"}>
      {cardElements}
    </Stack>
  );
}

export default CardHand;

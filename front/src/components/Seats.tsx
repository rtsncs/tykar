import { SimpleGrid } from "@chakra-ui/react";
import Seat from "./Seat";

function Seats({
  players,
  onClick,
}: {
  players: [string, string, string, string];
  onClick: (seat: number) => void;
}) {
  return (
    <SimpleGrid columns={2} gap="8px">
      {players.map((player, i) => (
        <Seat player={player} seat={i} onClick={onClick} key={i} />
      ))}
    </SimpleGrid>
  );
}

export default Seats;

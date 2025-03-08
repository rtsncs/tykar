import { VStack } from "@chakra-ui/react";
import { Link } from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";

function RoomList({ rooms }: { rooms: string[] }) {
  return (
    <VStack w="100%">
      {rooms.map((room) => (
        <Link asChild key={room}>
          <ReactRouterLink to={room}>{room}</ReactRouterLink>
        </Link>
      ))}
    </VStack>
  );
}

export default RoomList;

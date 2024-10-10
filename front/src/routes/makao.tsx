import { Channel, Presence, Socket } from "phoenix";
import { useSession } from "../AuthProvider";
import { useEffect, useRef, useState } from "react";
import { Box, Card, Heading, VStack } from "@chakra-ui/react";

function Makao() {
  const { session } = useSession();

  const socketRef = useRef<Socket | null>(null);
  const channelRef = useRef<Channel | null>(null);
  const presenceRef = useRef<Presence | null>(null);

  const [users, setUsers] = useState<string[]>([]);

  useEffect(() => {
    if (session) {
      socketRef.current = new Socket("/socket", {
        params: { token: session?.token },
      });
      channelRef.current = socketRef.current.channel("makao_room:lobby");
      presenceRef.current = new Presence(channelRef.current);

      socketRef.current.connect();

      presenceRef.current.onSync(() => {
        const new_users: string[] = [];
        presenceRef.current?.list((username) => {
          new_users.push(username);
        });
        new_users.sort();
        setUsers(new_users);
      });

      channelRef.current.join();
    }
  }, [session]);

  const rooms = [
    {
      id: "2j3o1",
      players: ["foo", "bar"],
    },
    {
      id: "3jk3o",
      players: ["baz", "abc"],
    },
  ];

  return (
    <>
      <VStack w="100%">
        {rooms.map((room) => (
          <Card
            key={room.id}
            w="100%"
            justifyContent="space-around"
            variant="outline"
          >
            <Heading as="h5" size="sm">
              {room.id}
            </Heading>
            <Box>{room.players.join(", ")}</Box>
          </Card>
        ))}
      </VStack>
      <VStack w="100%">
        {users.map((username) => (
          <Card
            key={username}
            w="100%"
            justifyContent="space-around"
            variant="outline"
          >
            <Heading as="h5" size="sm">
              {username}
            </Heading>
          </Card>
        ))}
      </VStack>
    </>
  );
}

export default Makao;

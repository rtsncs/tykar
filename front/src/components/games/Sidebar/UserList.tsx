import { Box, VStack } from "@chakra-ui/react";
import { GameHook } from "../../../@types/tykar";
import { useEffect, useState } from "react";

function UserList({ gameHook }: { gameHook: GameHook }) {
  const { presence } = gameHook();
  const [users, setUsers] = useState<string[]>([]);

  useEffect(() => {
    const updateUsers = () => {
      const new_users: string[] = [];
      presence.list((username) => {
        new_users.push(username);
      });
      new_users.sort();
      setUsers(new_users);
    };

    updateUsers();
    presence.onSync(updateUsers);

    return () => {
      setUsers([]);
    };
  }, [presence]);

  return (
    <VStack
      borderTop="none"
      borderWidth="1px"
      borderBottomRadius="sm"
      w="100%"
      h="200px"
      overflow="scroll"
      px="1"
    >
      {users.map((username) => (
        <Box w="100%" key={username}>
          {username}
        </Box>
      ))}
    </VStack>
  );
}

export default UserList;

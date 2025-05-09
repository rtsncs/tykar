import { Box, VStack } from "@chakra-ui/react";

function UserList({ users }: { users: string[] }) {
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

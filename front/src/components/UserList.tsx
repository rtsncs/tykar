import { Card, Heading, VStack } from "@chakra-ui/react";

function UserList({ users }: { users: string[] }) {
  return (
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
  );
}

export default UserList;

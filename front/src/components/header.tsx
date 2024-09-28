import {
  Box,
  Button,
  chakra,
  Flex,
  Heading,
  Spacer,
  useDisclosure,
} from "@chakra-ui/react";
import Login from "./login";
import { useSession } from "../AuthProvider";

function Header() {
  const {
    isOpen: isLoginOpen,
    onOpen: onLoginOpen,
    onClose: onLoginClose,
  } = useDisclosure();

  const { session } = useSession();

  return (
    <>
      <chakra.header borderBottom="thin solid gray" boxShadow="md">
        <Flex p={8}>
          <Heading>Tykar</Heading>
          <Spacer />
          {session ? (
            <Box>{session}</Box>
          ) : (
            <Button onClick={onLoginOpen}>Login</Button>
          )}
        </Flex>
        <Login isOpen={isLoginOpen} onClose={onLoginClose} />
      </chakra.header>
    </>
  );
}

export default Header;

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
import Register from "./register";

function Header() {
  const {
    isOpen: isLoginOpen,
    onOpen: onLoginOpen,
    onClose: onLoginClose,
  } = useDisclosure();

  const {
    isOpen: isRegisterOpen,
    onOpen: onRegisterOpen,
    onClose: onRegisterClose,
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
            <>
              <Button onClick={onLoginOpen}>Login</Button>
              <Button onClick={onRegisterOpen}>Register</Button>
            </>
          )}
        </Flex>
        <Login isOpen={isLoginOpen} onClose={onLoginClose} />
        <Register isOpen={isRegisterOpen} onClose={onRegisterClose} />
      </chakra.header>
    </>
  );
}

export default Header;

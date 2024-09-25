import {
  Button,
  chakra,
  Flex,
  Heading,
  Spacer,
  useDisclosure,
} from "@chakra-ui/react";
import Login from "./login";

function Header() {
  const {
    isOpen: isLoginOpen,
    onOpen: onLoginOpen,
    onClose: onLoginClose,
  } = useDisclosure();

  return (
    <>
      <chakra.header borderBottom="thin solid gray" boxShadow="md">
        <Flex p={8}>
          <Heading>Tykar</Heading>
          <Spacer />
          <Button onClick={onLoginOpen}>Login</Button>
        </Flex>
        <Login isOpen={isLoginOpen} onClose={onLoginClose}></Login>
      </chakra.header>
    </>
  );
}

export default Header;

import {
  Button,
  chakra,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  useDisclosure,
} from "@chakra-ui/react";
import Login from "./login";
import { useSession } from "../AuthProvider";
import Register from "./register";
import { ChevronDownIcon } from "@chakra-ui/icons";

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

  const { session, logout } = useSession();

  return (
    <>
      <chakra.header borderBottom="thin solid gray" boxShadow="md">
        <Flex
          w={{ base: "98vw", "2xl": "8xl" }}
          py={8}
          gap={2}
          alignItems="center"
          mx="auto"
        >
          <Heading>Tykar</Heading>
          <Spacer />
          {session ? (
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                {session.username}
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => void logout()}>Logout</MenuItem>
              </MenuList>
            </Menu>
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

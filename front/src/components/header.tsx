import {
  Button,
  chakra,
  Flex,
  Heading,
  Spacer,
  useDisclosure,
} from "@chakra-ui/react";
import Login from "./login";
import { Link } from "react-router-dom";
import { useSession } from "../AuthProvider";
import Register from "./register";
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from "./ui/menu";

function Header() {
  const {
    open: isLoginOpen,
    onOpen: onLoginOpen,
    onClose: onLoginClose,
  } = useDisclosure();

  const {
    open: isRegisterOpen,
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
            <MenuRoot>
              <MenuTrigger as={Button}>{session.username}</MenuTrigger>
              <MenuContent>
                <MenuItem value="settings" asChild>
                  <Link to="settings">Settings</Link>
                </MenuItem>
                <MenuItem value="logout" onClick={() => void logout()}>
                  Logout
                </MenuItem>
              </MenuContent>
            </MenuRoot>
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

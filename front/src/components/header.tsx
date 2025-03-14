import { Button, chakra, Flex, Heading, Spacer } from "@chakra-ui/react";
import Login from "./login";
import { Link } from "react-router-dom";
import { useSession } from "../AuthProvider";
import Register from "./register";
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from "./ui/menu";

function Header() {
  const { session, logout } = useSession();

  return (
    <>
      <chakra.header borderBottom="thin solid gray" boxShadow="md">
        <Flex
          w={{ base: "98vw", "2xl": "8xl" }}
          p={4}
          gap={2}
          alignItems="center"
          mx="auto"
        >
          <Heading size="3xl" asChild>
            <Link to="/">Tykar</Link>
          </Heading>
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
              <Login />
              <Register />
            </>
          )}
        </Flex>
      </chakra.header>
    </>
  );
}

export default Header;

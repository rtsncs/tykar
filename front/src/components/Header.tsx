import { Button, chakra, Flex, Heading, Spacer } from "@chakra-ui/react";
import Login from "./Login";
import { Link } from "react-router";
import { useSession } from "@/hooks/AuthProvider";
import Register from "./Register";
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from "./ui/menu";
import { useTranslation } from "react-i18next";
import { LuChevronDown, LuLogOut, LuSettings } from "react-icons/lu";

function Header() {
  const { session, logout } = useSession();
  const { t } = useTranslation();

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
              <MenuTrigger asChild>
                <Button variant="outline">
                  {session.username} <LuChevronDown />
                </Button>
              </MenuTrigger>
              <MenuContent>
                <MenuItem
                  _hover={{ cursor: "button" }}
                  value="settings"
                  asChild
                >
                  <Link to="settings">
                    <LuSettings /> {t("settings")}
                  </Link>
                </MenuItem>
                <MenuItem
                  _hover={{ cursor: "button" }}
                  value="logout"
                  onClick={() => void logout()}
                >
                  <LuLogOut /> {t("logout")}
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

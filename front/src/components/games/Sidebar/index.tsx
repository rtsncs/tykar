import { Tabs, VStack } from "@chakra-ui/react";
import Seats from "./Seats";
import Chat from "./Chat";
import UserList from "./UserList";
import { ChatProvider } from "../../../hooks/ChatProvider";
import { GameHook } from "../../../@types/tykar";
import { LuMessageSquareText, LuUser } from "react-icons/lu";
import { t } from "i18next";

export default function Sidebar({ gameHook }: { gameHook: GameHook }) {
  return (
    <VStack
      p="3"
      alignItems="stretch"
      width="25vw"
      height="100vh"
      justifyContent="space-between"
    >
      <Seats gameHook={gameHook} />
      <Tabs.Root defaultValue="chat">
        <Tabs.List>
          <Tabs.Trigger value="chat">
            <LuMessageSquareText /> {t("chat")}
          </Tabs.Trigger>
          <Tabs.Trigger value="users">
            <LuUser /> {t("users")}
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content pt="0" value="chat">
          <ChatProvider gameHook={gameHook}>
            <Chat />
          </ChatProvider>
        </Tabs.Content>
        <Tabs.Content pt="0" value="users">
          <UserList gameHook={gameHook} />
        </Tabs.Content>
      </Tabs.Root>
    </VStack>
  );
}

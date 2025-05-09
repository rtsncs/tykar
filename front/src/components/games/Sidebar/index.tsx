import { Tabs, VStack } from "@chakra-ui/react";
import Seats from "./Seats";
import Chat from "./Chat";
import UserList from "./UserList";
import { ChatProvider } from "../../../hooks/ChatProvider";
import { Channel } from "phoenix";
import { Game, GameAction } from "../../../@types/tykar";
import { ActionDispatch } from "react";
import { LuMessageSquareText, LuUser } from "react-icons/lu";
import { t } from "i18next";

export default function Sidebar({
  users,
  channel,
  gameHook,
}: {
  users: string[];
  channel: Channel;
  gameHook: () => {
    game: Game | null;
    dispatch: ActionDispatch<[action: GameAction]>;
  };
}) {
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
          <ChatProvider channel={channel}>
            <Chat />
          </ChatProvider>
        </Tabs.Content>
        <Tabs.Content pt="0" value="users">
          <UserList users={users} />
        </Tabs.Content>
      </Tabs.Root>
    </VStack>
  );
}

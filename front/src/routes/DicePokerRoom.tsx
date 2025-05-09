import { Channel, Presence } from "phoenix";
import { useEffect, useRef, useState } from "react";
import { useSocket } from "../hooks/SocketProvider";
import { useNavigate, useParams } from "react-router";
import { HStack } from "@chakra-ui/react";
import { DicePokerProvider, useDicePoker } from "../hooks/DicePokerProvider";
import DicePokerTable from "../components/games/DicePokerTable";
import FullscreenSpinner from "../components/FullsreenSpinner";
import Sidebar from "../components/games/Sidebar/";

function DicePokerRoom() {
  const { roomId } = useParams();
  const socket = useSocket();
  const navigate = useNavigate();

  const [channel, setChannel] = useState<Channel | null>(null);
  const presenceRef = useRef<Presence | null>(null);

  const [users, setUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!socket) return;
    const newChannel = socket.channel(`dice_poker:${roomId}`);
    setChannel(newChannel);
    presenceRef.current = new Presence(newChannel);

    presenceRef.current.onSync(() => {
      const new_users: string[] = [];
      presenceRef.current?.list((username) => {
        new_users.push(username);
      });
      new_users.sort();
      setUsers(new_users);
    });

    newChannel.join().receive("error", () => {
      void navigate("..", { relative: "path" });
    });

    return () => {
      newChannel.leave();
      setChannel(null);
      presenceRef.current = null;
    };
  }, [socket, roomId, navigate]);

  if (!channel) {
    return <FullscreenSpinner />;
  }

  return (
    <DicePokerProvider channel={channel}>
      <HStack gap="0">
        <DicePokerTable />
        <Sidebar users={users} channel={channel} gameHook={useDicePoker} />
      </HStack>
    </DicePokerProvider>
  );
}

export default DicePokerRoom;

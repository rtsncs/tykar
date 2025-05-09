import { Channel, Presence } from "phoenix";
import { useEffect, useRef, useState } from "react";
import { Button } from "@chakra-ui/react";
import { useSocket } from "../hooks/SocketProvider";
import { useNavigate } from "react-router";
import RoomList from "../components/RoomList";
import { useTranslation } from "react-i18next";

function DicePokerLobby() {
  const socket = useSocket();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const channelRef = useRef<Channel | null>(null);
  const presenceRef = useRef<Presence | null>(null);

  const [rooms, setRooms] = useState<string[]>([]);

  useEffect(() => {
    if (!socket) return;
    channelRef.current = socket.channel("dice_poker:lobby");
    presenceRef.current = new Presence(channelRef.current);

    presenceRef.current.onSync(() => {
      const new_rooms: string[] = [];
      presenceRef.current?.list((username) => {
        new_rooms.push(username);
      });
      new_rooms.sort();
      setRooms(new_rooms);
    });

    channelRef.current.join();

    return () => {
      channelRef.current?.leave();
      channelRef.current = null;
      presenceRef.current = null;
    };
  }, [socket]);

  const onNewRoom = () => {
    channelRef.current
      ?.push("new_room", {})
      .receive("ok", ({ id }) => navigate(`${id}`));
  };

  return (
    <>
      <Button onClick={onNewRoom}>{t("new_room")}</Button>
      <RoomList rooms={rooms} />
    </>
  );
}

export default DicePokerLobby;

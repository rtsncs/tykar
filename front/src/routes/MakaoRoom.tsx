import { Channel, Presence } from "phoenix";
import { useEffect, useRef, useState } from "react";
import { useSocket } from "../SocketProvider";
import { useNavigate, useParams } from "react-router-dom";
import UserList from "../components/UserList";
import MakaoTable from "../components/MakaoTable";
import { Box, Button, HStack } from "@chakra-ui/react";
import Chat from "../components/Chat";
import { ChatMessageProps } from "../components/ChatMessage";
import Seats from "../components/Seats";
import FullscreenSpinner from "../components/FullsreenSpinner";
import { PlayingCardProps } from "../components/PlayingCard";

export interface MakaoGame {
  players: [MakaoPlayer?, MakaoPlayer?, MakaoPlayer?, MakaoPlayer?];
  status: "setup" | "in_progress" | "finished";
  turn: number;
  lastTurn: number;
  played: PlayingCardProps[];
  toDraw: number;
  toBlock: number;
  drawn?: PlayingCardProps;
  demand: string;
  winners: [string];
}

export interface MakaoPlayer {
  name: string;
  hand: PlayingCardProps[] | number;
  blocked: number;
}

function MakaoRoom() {
  const { roomId } = useParams();
  const socket = useSocket();
  const navigate = useNavigate();

  const channelRef = useRef<Channel | null>(null);
  const presenceRef = useRef<Presence | null>(null);

  const [users, setUsers] = useState<string[]>([]);
  const [messages, setMessages] = useState<ChatMessageProps[]>([]);

  const [game, setGame] = useState<MakaoGame | null>(null);

  const onSendMessage = (content: string) => {
    channelRef.current?.push("shout", { content });
  };

  const onTakeSeat = (seat: number) => {
    channelRef.current?.push("take_seat", { seat });
  };

  const onStart = () => {
    channelRef.current?.push("start", {});
  };

  const onPlayCard = (e: unknown, card: PlayingCardProps) => {
    void e;
    channelRef.current?.push("play", card);
  };

  const onDrawCard = () => {
    channelRef.current?.push("draw", {});
  };

  const onDemand = (demand: string) => {
    channelRef.current?.push("demand", { demand });
  };

  const onPass = () => {
    channelRef.current?.push("pass", {});
  };

  useEffect(() => {
    if (!socket) return;
    channelRef.current = socket.channel(`makao:${roomId}`);
    presenceRef.current = new Presence(channelRef.current);

    presenceRef.current.onSync(() => {
      const new_users: string[] = [];
      presenceRef.current?.list((username) => {
        new_users.push(username);
      });
      new_users.sort();
      setUsers(new_users);
    });

    channelRef.current.on("shout", (message: ChatMessageProps) =>
      setMessages((messages) => [...messages, message]),
    );

    channelRef.current.on("game", (game: MakaoGame) => setGame(game));

    channelRef.current.join().receive("error", () => {
      void navigate("..", { relative: "path" });
    });

    return () => {
      channelRef.current?.leave();
      channelRef.current = null;
      presenceRef.current = null;
    };
  }, [socket, roomId, navigate]);

  if (!game) {
    return <FullscreenSpinner />;
  }

  return (
    <>
      <HStack>
        <MakaoTable
          game={game}
          onDrawCard={onDrawCard}
          onPlayCard={onPlayCard}
          onDemand={onDemand}
          onPass={onPass}
        />
        <Box width="25vw">
          {roomId}
          <Seats players={game.players} onClick={onTakeSeat} />
          <Button onClick={onStart}>Start</Button>
          <UserList users={users} />
          <Chat messages={messages} onSend={onSendMessage} />
        </Box>
      </HStack>
    </>
  );
}

export default MakaoRoom;

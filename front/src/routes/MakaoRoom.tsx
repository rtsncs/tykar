import { Channel, Presence } from "phoenix";
import { useCallback, useEffect, useState } from "react";
import { useSocket } from "../hooks/SocketProvider";
import { useNavigate, useParams } from "react-router";
import MakaoTable from "../components/games/Makao/MakaoTable";
import { HStack } from "@chakra-ui/react";
import FullscreenSpinner from "../components/FullsreenSpinner";
import {
  MakaoAction,
  MakaoContext,
  MakaoGame,
  useMakao,
} from "../hooks/MakaoProvider";
import Sidebar from "../components/games/Sidebar";

function MakaoRoom() {
  const { roomId } = useParams();
  const socket = useSocket();
  const navigate = useNavigate();

  const [channel, setChannel] = useState<Channel | null>(null);
  const [presence, setPresence] = useState<Presence | null>(null);

  const dispatch = useCallback(
    (action: MakaoAction) => {
      if (!channel) return;
      switch (action.type) {
        case "play": {
          channel.push("play", { card: action.card });
          break;
        }
        case "demand": {
          channel.push("demand", { demand: action.demand });
          break;
        }
        case "draw": {
          channel.push("draw", {});
          break;
        }
        case "pass": {
          channel.push("pass", {});
          break;
        }
        case "sit_down": {
          channel.push("sit_down", { seat: action.seat });
          break;
        }
        case "stand_up": {
          channel.push("stand_up", {});
          break;
        }
        case "ready": {
          channel.push("ready", {});
          break;
        }
        case "unready": {
          channel.push("unready", {});
          break;
        }
        default:
          throw Error("unknown action");
      }
    },
    [channel],
  );

  const [game, setGame] = useState<MakaoGame | null>(null);

  useEffect(() => {
    if (!socket) return;
    const newChannel = socket.channel(`makao:${roomId}`);
    setChannel(newChannel);
    const newPresence = new Presence(newChannel);
    setPresence(newPresence);

    newChannel.join().receive("error", () => {
      void navigate("..", { relative: "path" });
    });
    newChannel.on("game", (game: MakaoGame) => {
      setGame(game);
    });

    return () => {
      newChannel.leave();
      setChannel(null);
      setPresence(null);
    };
  }, [socket, roomId, navigate]);

  if (!channel || !game || !presence) {
    return <FullscreenSpinner />;
  }

  return (
    <MakaoContext.Provider value={{ game, dispatch, channel, presence }}>
      <HStack gap="0">
        <MakaoTable />
        <Sidebar gameHook={useMakao} />
      </HStack>
    </MakaoContext.Provider>
  );
}

export default MakaoRoom;

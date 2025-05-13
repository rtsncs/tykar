import { Channel, Presence } from "phoenix";
import { useCallback, useEffect, useState } from "react";
import { useSocket } from "@/hooks/SocketProvider";
import { useNavigate, useParams } from "react-router";
import { HStack } from "@chakra-ui/react";
import { DicePokerContext, useDicePoker } from "./hook";
import DicePokerTable from "@/pages/dice_poker/components/DicePokerTable";
import FullscreenSpinner from "@/components/FullscreenSpinner";
import Sidebar from "@/components/games/Sidebar";
import { DicePokerAction, DicePokerGame } from "./types";

function DicePokerRoom() {
  const { roomId } = useParams();
  const socket = useSocket();
  const navigate = useNavigate();

  const [channel, setChannel] = useState<Channel | null>(null);
  const [presence, setPresence] = useState<Presence | null>(null);

  const dispatch = useCallback(
    (action: DicePokerAction) => {
      if (!channel) return;
      switch (action.type) {
        case "roll": {
          channel.push("roll", {});
          break;
        }
        case "pass": {
          channel.push("pass", {});
          break;
        }
        case "keep": {
          channel.push("keep", { index: action.index, value: action.value });
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

  const [game, setGame] = useState<DicePokerGame | null>(null);

  useEffect(() => {
    if (!socket) return;
    const newChannel = socket.channel(`dice_poker:${roomId}`);
    setChannel(newChannel);
    const newPresence = new Presence(newChannel);
    setPresence(newPresence);

    newChannel.join().receive("error", () => {
      void navigate("..", { relative: "path" });
    });
    newChannel.on("game", (game: DicePokerGame) => {
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
    <DicePokerContext.Provider value={{ game, dispatch, channel, presence }}>
      <HStack gap="0">
        <DicePokerTable />
        <Sidebar gameHook={useDicePoker} />
      </HStack>
    </DicePokerContext.Provider>
  );
}

export default DicePokerRoom;

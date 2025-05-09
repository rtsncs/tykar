import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Channel } from "phoenix";
import { Game, GameAction, Player } from "../@types/tykar";

interface DicePokerGame extends Game {
  players: [Player, Player];
  turn: number;
  roll: number;
  starting_player: number;
  thrown: [
    [number, number, number, number, number],
    [number, number, number, number, number],
  ];
  keep: [boolean, boolean, boolean, boolean, boolean];
}

type DicePokerAction =
  | GameAction
  | { type: "roll" }
  | { type: "pass" }
  | { type: "keep"; index: number; value: boolean };

const DicePokerContext = createContext<{
  game: DicePokerGame | null;
  dispatch: (action: DicePokerAction) => void;
} | null>(null);

export function DicePokerProvider({
  channel,
  children,
}: {
  channel: Channel | null;
  children: ReactNode | null;
}) {
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
    if (channel) {
      channel.on("game", (game: DicePokerGame) => {
        setGame(game);
      });

      return () => channel.off("game");
    }
  }, [channel]);

  return (
    <DicePokerContext.Provider value={{ game, dispatch }}>
      {children}
    </DicePokerContext.Provider>
  );
}

export const useDicePoker = () => {
  const game = useContext(DicePokerContext);
  if (!game) throw Error("useDicePoker called outside of DicePokerContext");
  return game;
};

import { createContext, useContext } from "react";
import { Channel, Presence } from "phoenix";
import { DicePokerAction, DicePokerGame } from "./types";

export const DicePokerContext = createContext<{
  game: DicePokerGame;
  dispatch: (action: DicePokerAction) => void;
  channel: Channel;
  presence: Presence;
} | null>(null);

export const useDicePoker = () => {
  const game = useContext(DicePokerContext);
  if (!game) throw Error("useDicePoker called outside of DicePokerContext");
  return game;
};

import { createContext, useContext } from "react";
import { Game, GameAction, Player } from "../@types/tykar";
import { Channel, Presence } from "phoenix";

export interface DicePokerGame extends Game {
  players: [Player, Player];
  turn: number;
  roll: number;
  starting_player: number;
  thrown: [
    [number, number, number, number, number],
    [number, number, number, number, number],
  ];
  keep: [boolean, boolean, boolean, boolean, boolean];
  winner: string | null;
}

export type DicePokerAction =
  | GameAction
  | { type: "roll" }
  | { type: "pass" }
  | { type: "keep"; index: number; value: boolean };

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

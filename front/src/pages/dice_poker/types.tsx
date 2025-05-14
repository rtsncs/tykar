import { Game, GameAction, Player } from "@/types/tykar";

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

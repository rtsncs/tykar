import { createContext, useContext } from "react";
import { Game, GameAction, Player } from "../@types/tykar";
import { Channel, Presence } from "phoenix";
import { PlayingCardProps } from "../components/games/PlayingCard";

export interface MakaoPlayer extends Player {
  data: {
    hand: PlayingCardProps[] | number;
    blocked: number;
  };
}

export interface MakaoGame extends Game {
  players: [MakaoPlayer, MakaoPlayer, ...MakaoPlayer[]];
  turn: number;
  lastTurn: number;
  played: PlayingCardProps[];
  toDraw: number;
  toBlock: number;
  drawn?: PlayingCardProps;
  demand: string;
  winners: [string];
}

export type MakaoAction =
  | GameAction
  | { type: "play"; card: PlayingCardProps }
  | { type: "demand"; demand: string }
  | { type: "draw" }
  | { type: "pass" };

export const MakaoContext = createContext<{
  game: MakaoGame;
  dispatch: (action: MakaoAction) => void;
  channel: Channel;
  presence: Presence;
} | null>(null);

export const useMakao = () => {
  const game = useContext(MakaoContext);
  if (!game) throw Error("useMakao called outside of MakaoContext");
  return game;
};

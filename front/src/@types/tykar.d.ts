import { Channel, Presence } from "phoenix";

export interface Player {
  username: string | null;
  score: number;
  is_ready: boolean;
}

export interface Game {
  players: [Player, ...Player[]];
  status: "setup" | "in_progress" | "finished";
}

type GameAction =
  | { type: "sit_down"; seat: number }
  | { type: "stand_up" }
  | { type: "ready" }
  | { type: "unready" };

type GameHook = () => {
  game: Game;
  dispatch: ActionDispatch<[action: GameAction]>;
  channel: Channel;
  presence: Presence;
};

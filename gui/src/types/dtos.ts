import { GameState } from "./armies";
export enum ActionType {
  death = "death",
  attack = "attack",
  arrow = "arrow",
  clone = "clone",
  heal = "heal",
  move = "move",
  win = "win",
}

export type Action = {
  type: ActionType;
  object: string;
  subject: string;
  value: number;
};

export type NextStepDTO = {
  actions: Action[];
  game_state: GameState;
};

import { GameState } from "./armies";
export enum ActionType {
  death = "death",
  attack = "attack",
  arrow = "arrow",
  clone = "clone",
  heal = "heal",
  move = "move",
}

export type Action = {
  type: ActionType;
  object: number;
  subject: number;
  value: number;
};

export type NextStepDTO = {
  actions: Action[];
  game_state: GameState;
};

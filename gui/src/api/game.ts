import { AxiosResponse } from "axios";
import { GameState, Strategy } from "../types";
import { api } from "./api";

export async function startGame(
  alliance: string[],
  horde: string[]
): Promise<AxiosResponse<GameState>> {
  return api.post<GameState>("/game/start", { alliance, horde });
}

export async function nextStep() {
  return api.get<GameState>("/game/next_step");
}

export async function undo() {
  return api.get<GameState>("/game/undo");
}

export async function redo() {
  return api.get<GameState>("/game/redo");
}

export async function changeStrategy(strategy: Strategy) {
  return api.get<GameState>("/game/change_strategy", {
    params: { strategy },
  });
}

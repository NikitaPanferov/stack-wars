import { AxiosResponse } from "axios";
import { GameState } from "../types";
import { api } from "./api";

export async function startGame(
  alliance: string[],
  horde: string[]
): Promise<AxiosResponse<GameState>> {
  return api.post<GameState>("/game/start", { alliance, horde });
}

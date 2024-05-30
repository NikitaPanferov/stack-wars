import { AxiosResponse } from "axios";
import { GameState, NextStepDTO, Strategy } from "../types";
import { api } from "./api";

export async function startGame(
  alliance: string[],
  horde: string[]
): Promise<AxiosResponse<GameState>> {
  return api.post<GameState>("/game/start", { alliance, horde });
}

export async function nextStep(): Promise<AxiosResponse<NextStepDTO>> {
  return api.get<NextStepDTO>("/game/next_step");
}

export async function undo(): Promise<AxiosResponse<NextStepDTO>> {
  return api.get<NextStepDTO>("/game/undo");
}

export async function redo(): Promise<AxiosResponse<NextStepDTO>> {
  return api.get<NextStepDTO>("/game/redo");
}

export async function changeStrategy(
  strategy: Strategy
): Promise<AxiosResponse<NextStepDTO>> {
  return api.get<NextStepDTO>("/game/change_strategy", {
    params: { strategy },
  });
}

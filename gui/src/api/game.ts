import { api } from "./api";

export async function startGame(
  alliance: string[],
  horde: string[]
): Promise<void> {
  await api.post("/game/start", { alliance, horde });
}

export type UnitType =
  | "archer"
  | "heavy_swordsman"
  | "light_swordsman"
  | "paladin"
  | "wizard"
  | "walk_town";
export type ArmyType = "alliance" | "horde";
export type Strategy = "one_line" | "multi_line" | "wall_to_wall";

export type Unit = {
  id: string;
  type: UnitType;
  hp: number;
  damage: number;
  defence: number;
  dodge: number;
  cost: number;
  range?: number;
  heal_percent?: number;
};

export type Army = Unit[][];

export type GameState = {
  alliance: Army;
  horde: Army;
};

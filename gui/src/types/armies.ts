export type Unit = {
    type: string
    hp: number;
    damage: number;
    defence: number;
    dodge: number;
    cost: number;
    range?: number;
    heal_percent?: number;
}

export type Army = Unit[]
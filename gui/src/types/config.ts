export type UnitConfig = {
    hp: number;
    damage: number;
    defence: number;
    dodge: number;
    cost: number;
    range?: number;
    heal_percent?: number;
};

export type ForcesConfig = {
    alliance: {
        archer: UnitConfig;
        heavy_swordsman: UnitConfig;
        light_swordsman: UnitConfig;
        paladin: UnitConfig;
        wizard: UnitConfig;
    };
    horde: {
        archer: UnitConfig;
        heavy_swordsman: UnitConfig;
        light_swordsman: UnitConfig;
        paladin: UnitConfig;
        wizard: UnitConfig;
    };
};

export type Config = {
    forces: ForcesConfig
    capital: number
    line_count: number
}
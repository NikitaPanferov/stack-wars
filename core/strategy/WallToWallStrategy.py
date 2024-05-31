from core.army.army import Army
from core.strategy import AbcStrategy


class WallToWallStrategy(AbcStrategy):
    def handle_death(self, dead_i: int, dead_j: int, army: Army) -> (int, int):
        army.units.pop(dead_i)
        return dead_i, dead_j

    def handle_undo(self, from_i: int, from_j: int, to_i: int, to_j: int, army: Army):
        army.units.insert(from_i, [])

    def rebuild_armies(self, alliance: Army, horde: Army):
        alliance.units = [[unit] for unit in self.move_units_to_first_row(alliance).units[0]]
        horde.units = [[unit] for unit in self.move_units_to_first_row(horde).units[0]]

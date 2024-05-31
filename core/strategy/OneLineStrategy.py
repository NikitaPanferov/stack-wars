from core.army.army import Army
from core.strategy.AbcStrategy import AbcStrategy


class OneLineStrategy(AbcStrategy):
    def handle_death(self, dead_i: int, dead_j: int, army: Army) -> (int, int):
        pass

    def handle_undo(self, from_i: int, from_j:int, to_i: int, to_j: int, army: Army):
        pass

    def rebuild_armies(self, alliance: Army, horde: Army):
        self.move_units_to_first_row(alliance)
        self.move_units_to_first_row(horde)

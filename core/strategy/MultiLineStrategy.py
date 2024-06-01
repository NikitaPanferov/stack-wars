from core.army.army import Army
from core.strategy import AbcStrategy


class MultiLineStrategy(AbcStrategy):
    def handle_death(self, dead_i: int, dead_j: int, army: Army) -> (int, int):
        for i in range(1, len(army.units)):
            if len(army.units[dead_i - i]) > 1:
                unit = army.units[dead_i - i].pop(len(army.units[dead_i - i]) - 1)
                if len(army.units[dead_i]) == 0:
                    army.units[dead_i].append(unit)
                else:
                    army.units[dead_i][dead_j] = army.units[dead_i - i].pop(len(army.units[dead_i - i]) - 1)
                return dead_i - i, len(army.units[dead_i - i])

        army.units.pop(dead_i)
        return -1, -1

    def handle_undo(self, from_i: int, from_j:int, to_i: int, to_j: int, army: Army):
        if to_j == -1:
            army.units.insert(from_i, [])
        else:
            army.units[to_i][to_j] = army.units[from_i].pop(from_j)

    def rebuild_armies(self, alliance: Army, horde: Army):
        self.move_units_to_first_row(alliance)
        self.move_units_to_first_row(horde)

        alliance.units = [alliance.units[0][i::3] for i in range(3)]
        horde.units = [horde.units[0][i::3] for i in range(3)]

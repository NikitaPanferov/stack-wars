from core.army.army import Army
from core.strategy.AbcStrategy import AbcStrategy
from schemas.unitDTO import UnitDTO


class OneLineStrategy(AbcStrategy):
    def handle_death(self, dead: UnitDTO, army: Army):
        for row in army.units:
            for unit in row:
                if dead.id == unit.id:
                    row.remove(unit)

    def rebuild_armies(self, alliance: Army, horde: Army):
        self.move_units_to_first_row(alliance)
        self.move_units_to_first_row(horde)

    def move_units_to_first_row(self, army: Army) -> None:
        all_units = [unit for row in army.units for unit in row]

        army.units[0] = all_units
        for i in range(1, len(army.units)):
            army.units[i] = []

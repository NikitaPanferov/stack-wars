from __future__ import annotations
import random
from typing import List, Tuple


from core.army.army_builder import ArmyBuilder
from core.units.interfaces import Unit
from schemas.unitDTO import UnitType


class Army:
    def __init__(self, army_builder: ArmyBuilder):
        self.units: List[List[Unit]] = []
        self.army_builder = army_builder

    def init(self, units: List[UnitType]):
        for unit_name in units:
            match unit_name:
                case "archer":
                    self.army_builder.add_archer()
                case "heavy_swordsman":
                    self.army_builder.add_heavy_swordsman()
                case "light_swordsman":
                    self.army_builder.add_ligth_swordsman()
                case "paladin":
                    self.army_builder.add_paladin()
                case "wizard":
                    self.army_builder.add_wizard()

        self.units = self.army_builder.build()

    def delete_unit(self, unit_in: Unit) -> Tuple[int, int]:
        for i, first_list in enumerate(self.units):
            for j, unit in enumerate(first_list):
                if unit.id == unit_in.id:
                    self.units[i].pop(j)
                    return i, j
        raise ValueError("user not found")

    def add_unit(self, unit, i, j) -> None:
        self.units[i].insert(j, unit)

    def get_target_in_range(self, i: int, j: int, range: int) -> Unit:
        upper_a = min(range, len(self.units) - i)
        lower_a = -min(range, i)
        a = random.randint(lower_a, upper_a)

        upper_b = min(range - abs(a), len(self.units[i]) - j)
        lower_b = -min(range - abs(a), j)
        b = random.randint(lower_b, upper_b)

        return self.units[i + a][j + b]

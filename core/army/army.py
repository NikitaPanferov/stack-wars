from __future__ import annotations
from typing import Dict, List


from core.army.army_builder import ArmyBuilder
from core.units.interfaces import Unit
from schemas.unitDTO import UnitType


class Army:
    def __init__(self, army_builder: ArmyBuilder, units: List[UnitType]):
        for unit_name in units:
            match unit_name:
                case "archer":
                    army_builder.add_archer()
                case "heavy_swordsman":
                    army_builder.add_heavy_swordsman()
                case "light_swordsman":
                    army_builder.add_ligth_swordsman()
                case "paladin":
                    army_builder.add_paladin()
                case "wizard":
                    army_builder.add_wizard()

        self.units = army_builder.build()

    def delete_unit(self, unit_in: Unit) -> (int, int):
        for i, first_list in enumerate(self.units):
            for j, unit in enumerate(first_list):
                if unit.id == unit_in.id:
                    self.units[i].pop(j)
                    return i, j
        raise ValueError("user not found")

    def add_unit(self, unit, i, j) -> None:
        self.units[i].insert(j, unit)

from __future__ import annotations
from typing import Dict, List


from core.army.army_builder import ArmyBuilder
from core.units.interfaces import Unit
from schemas import InitArmiesDTO


class Army:
    def __init__(self, army_builder: ArmyBuilder, units: Dict):
        for unit_name, count in units.items():
            for i in range(count):
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


    def __len__(self):
        return len(self.units)

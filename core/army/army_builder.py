from __future__ import annotations

from typing import List
from core.army.army_factory import ArmyFactory
from core.units.interfaces.unit import Unit


class ArmyBuilder:
    def __init__(self, factory: ArmyFactory):
        self.units: List[Unit] = []
        self.factory = factory

    def __len__(self):
        return len(self.units)

    def add_archer(self) -> ArmyBuilder:
        self.units.append(self.factory.archer())
        return self

    def add_ligth_swordsman(self) -> ArmyBuilder:
        self.units.append(self.factory.light_swordsman())
        return self

    def add_heavy_swordsman(self) -> ArmyBuilder:
        self.units.append(self.factory.heavy_swordsman())
        return self

    def add_paladin(self) -> ArmyBuilder:
        self.units.append(self.factory.paladin())
        return self

    def add_wizard(self) -> ArmyBuilder:
        self.units.append(self.factory.wizard())
        return self

    def build(self) -> List[List[Unit]]:
        units = [*self.units]
        self.units = []
        return [units]

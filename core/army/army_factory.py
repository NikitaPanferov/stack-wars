from __future__ import annotations

from conf.config import Army, Settings
from core.units import Archer, HeavySwordsman, LightSwordsman, Paladin, Wizard


class ArmyFactory:
    def __init__(self, settings: Army):
        self._archer = Archer(**settings.archer.dict())
        self._heavy_swordsman = HeavySwordsman(**settings.heavy_swordsman.dict())
        self._light_swordsman = LightSwordsman(**settings.light_swordsman.dict())
        self._paladin = Paladin(**settings.paladin.dict())
        self._wizard = Wizard(**settings.wizard.dict())

    def archer(self) -> Archer:
        return Archer(self._archer)

    def heavy_swordsman(self) -> HeavySwordsman:
        return HeavySwordsman(self._heavy_swordsman)

    def light_swordsman(self) -> LightSwordsman:
        return LightSwordsman(self._light_swordsman)

    def paladin(self) -> Paladin:
        return Paladin(self._paladin)

    def wizard(self) -> Wizard:
        return Wizard(self._wizard)

    @classmethod
    def factory(cls, army_type: str) -> ArmyFactory:
        match army_type:
            case 'horde':
                return cls(Settings().forces.horde)
            case 'alliance':
                return cls(Settings().forces.alliance)
            case _:
                raise AttributeError()

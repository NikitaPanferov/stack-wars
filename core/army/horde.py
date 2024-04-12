from core.army.army_factory import ArmyFactory
from core.units import Archer, HeavySwordsman, LightSwordsman, Paladin, Wizard


class Horde(ArmyFactory):

    def archer(self) -> Archer:
        return Archer(10, 5, 50, 5, 5, 40, 10)

    def heavy_swordsman(self) -> HeavySwordsman:
        return HeavySwordsman(10, 50, 5, 5, 40, 10)

    def light_swordsman(self) -> LightSwordsman:
        return LightSwordsman(10, 50, 5, 5, 40, 10)

    def paladin(self) -> Paladin:
        return Paladin(10, 5, 50, 5, 5, 40, 10)

    def wizard(self) -> Wizard:
        return Wizard(10, 5, 50, 5, 5, 40, 10)
